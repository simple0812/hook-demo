import React, { Component } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { v4 as uuidv4 } from 'uuid';
import OSS from 'ali-oss';
import globalService from '@/service/global';

// TinyMCE so the global var exists
// eslint-disable-next-line no-unused-vars
import tinymce from 'tinymce/tinymce';

// Theme
import 'tinymce/themes/silver';
// Toolbar icons
import 'tinymce/icons/default';
// Editor styles
import 'tinymce/skins/ui/oxide/skin.min.css';

// importing the plugin js.
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/hr';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/spellchecker';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/media';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/table';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/template';
import 'tinymce/plugins/help';
import 'tinymce/plugins/code';
import 'tinymce/plugins/preview';
import './plugins/article';
import { message } from 'antd';

// Content styles, including inline UI like fake cursors
/* eslint import/no-webpack-loader-syntax: off */
// import contentCss from 'tinymce/skins/content/default/content.min.css';
// import contentUiCss from 'tinymce/skins/ui/oxide/content.min.css';

class TinyEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
    this.editorRef = React.createRef();
  }

  componentDidMount() {}
  getSTS = async () => {
    let accessKeyId = window.localStorage.getItem('sts_access_id');
    let accessKeySecret = window.localStorage.getItem('sts_access_secret');
    let securityToken = window.localStorage.getItem('sts_access_token');
    let stsTokenTime = window.localStorage.getItem('sts_token_time');
    let now = Date.now();

    if (
      accessKeyId &&
      accessKeySecret &&
      securityToken &&
      stsTokenTime &&
      now - stsTokenTime < 1000 * 60 * 30
    ) {
      return {
        accessKeyId,
        accessKeySecret,
        securityToken
      };
    }

    // let res = await globalService.getOssTempAccount()
    let res = { code: -1 };

    if (res?.code == 0 && res?.data?.accessKeyId) {
      let obj = {
        accessKeyId: res.data.accessKeyId,
        accessKeySecret: res.data.accessKeySecret,
        securityToken: res.data.securityToken
      };

      window.localStorage.setItem('sts_access_id', obj.accessKeyId);
      window.localStorage.setItem('sts_access_secret', obj.accessKeySecret);
      window.localStorage.setItem('sts_access_token', obj.securityToken);
      window.localStorage.setItem('sts_token_time', now);
      return obj;
    }

    return null;
  };

  handleUpload = async (blobInfo, success, error, progress) => {
    let file = blobInfo.blob();

    let xres = await this.getSTS();

    if (!xres) {
      return error('获取临时认证失败');
    }

    let params = {
      accessKeyId: xres.accessKeyId,
      accessKeySecret: xres.accessKeySecret,
      stsToken: xres.securityToken,
      // region表示您申请OSS服务所在的地域，例如oss-cn-hangzhou。
      region: 'oss-cn-hangzhou',
      bucket: 'decorationhome'
    };

    // 本地开发开启代理
    if (
      window.location.hostname.indexOf('localhost') >= 0 ||
      window.location.hostname.indexOf('192.168') >= 0 ||
      window.location.hostname.indexOf('127.0.0.1') >= 0 ||
      window.location.hostname.indexOf('0.0.0.0') >= 0
    ) {
      params = {
        ...params,
        cname: true,
        endpoint: `http://${window.location.host}/`
      };
    }

    let client = new OSS(params);

    let xName = file.name || '';
    if (xName.indexOf('.') > 0) {
      let ext = xName.split('.').pop();
      xName = `${uuidv4()}.${ext}`;
    } else {
      xName = uuidv4();
    }

    client
      .put(`/oss/${xName}`, file)
      .then(function (result) {
        if (result?.res?.status == 200) {
          success(`https://dhstatic.bthome.com/${result.name}`);
        } else {
          throw new Error('上传失败');
        }
      })
      .catch(function (err) {
        window.localStorage.setItem('sts_access_id', '');
        window.localStorage.setItem('sts_access_secret', '');
        window.localStorage.setItem('sts_access_token', '');
        window.localStorage.setItem('sts_token_time', '');
        err(err);
      });
  };

  handleChange = (content, editor) => {
    if (this.props.onChange) {
      this.props.onChange(content);
    } else {
      this.setState({
        value: content
      });
    }
  };

  getContent = () => {
    return this.editorRef.getContent();
  };

  render() {
    return (
      <Editor
        onInit={(evt, editor) => {
          this.editorRef = editor;
          editor.setContent(this.props.value || '');
        }}
        apiKey="igyvqui3kog2wmpvov4gfqw8drqeyzyefzu2a19en99ridmt"
        value={this.props.value || ''}
        onEditorChange={this.handleChange}
        init={{
          height: 500,
          menubar: false,
          language: 'zh_CN',
          language_url:
            'https://dhstatic.bthome.com/seo/assets/tinymce/zh_CN.js',
          images_upload_handler: this.handleUpload,

          plugins: [
            'advlist autolink lists link image charmap preview anchor',
            'searchreplace code fullscreen',
            'insertdatetime media table paste help wordcount article'
          ],
          toolbar:
            'code | undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | fontsizeselect | ' +
            'removeformat | image | help | preview | article',
          content_style:
            'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />
    );
  }
}

export default TinyEditor;
