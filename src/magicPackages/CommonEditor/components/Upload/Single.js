import React from 'react';
import { Upload, message, Modal } from 'antd';
import Icon from '@/components/Icon/AntIcon';
import _ from 'lodash';
import FileSize from './FileSize';
import OSS from 'ali-oss';
import { v4 as uuidv4 } from 'uuid';
import ReactPlayer from 'react-player';
import globalService from '@/service/global';
import './index.less';

export default class UploadEditor extends React.Component {
  state = {
    loading: false
  };

  static getDerivedStateFromProps(props, state) {
    if (props.value !== state.value && props.value !== undefined) {
      state.value = props.value;
      return state;
    }

    return null;
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

    let res = await globalService.getOssTempAccount();

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

  handleChange = (info) => {
    const { onChange } = this.props;

    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }

    if (info.file.status === 'done' && info.file.response) {
      let vData = info.file.response;
      this.setState(
        {
          loading: false
        },
        () => {
          let file = vData;
          if (_.isFunction(onChange)) {
            onChange(file);
          } else {
            this.setState({
              value: file
            });
          }
        }
      );
    }
  };

  handlePreview = (xVal) => {
    const { isVideo } = this.props;

    if (isVideo) {
      Modal.confirm({
        className: 'preview-modal',
        title: '视频预览',
        content: <ReactPlayer controls url={xVal.split('?')[0]} />
      });
      return;
    }
    Modal.confirm({
      className: 'preview-modal',
      title: '图片预览',
      content: (
        <img
          src={xVal}
          alt=""
          style={{ maxWidth: '600px', maxHeight: '400px' }}
        />
      )
    });
  };

  renderImage = () => {
    const { isVideo, onChange } = this.props;
    const { value } = this.state;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    let xVal = value;
    if (xVal && isVideo) {
      xVal =
        xVal.split('?')[0] +
        '?x-oss-process=video/snapshot,t_7000,f_jpg,w_800,h_600,m_fast';
    }

    return value ? (
      <div className="bnq-upload-box">
        <img src={xVal} alt="avatar" style={{ width: '100%' }} />
        <div
          onClick={(evt) => {
            evt.preventDefault();
            evt.stopPropagation();
          }}
          className="bnq-upload-mask"
        >
          <Icon
            onClick={this.handlePreview.bind(this, xVal)}
            type="eye"
            style={{ color: 'white', fontSize: 16 }}
          />
          <Icon
            type="delete"
            style={{ color: 'white', fontSize: 16 }}
            onClick={() => {
              onChange && onChange('');
              this.setState({
                value: undefined
              });
            }}
          />
        </div>
      </div>
    ) : (
      uploadButton
    );
  };

  handleBefore = (file) => {
    const { maxSize, accept } = this.props;

    if (!file) {
      return false;
    }

    if (maxSize) {
      let xSize = new FileSize(maxSize);
      console.log('file.size', file.size, xSize.toNumber());
      if (file.size > xSize.toNumber()) {
        message.warning(`文件不能超过${maxSize}`);

        return false;
      }
    }

    let type = file.type.toLocaleLowerCase();

    if (accept) {
      let xList = accept.split(',');
      if (
        !xList.find(
          (item) => type.indexOf(item.slice(1).toLocaleLowerCase()) >= 0
        )
      ) {
        message.warning(`文件格式不正确`);
        return false;
      }
    }

    return true;
  };

  handleCustomRequest = async ({
    file,
    filename,
    onError,
    onProgress,
    onSuccess
  }) => {
    let xres = await this.getSTS();

    if (!xres) {
      return onError(new Error('获取临时认证失败'));
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

    let xName = file.name;
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
          onSuccess(`https://dhstatic.bthome.com/${result.name}`);
        } else {
          throw new Error('上传失败');
        }
      })
      .catch(function (err) {
        window.localStorage.setItem('sts_access_id', '');
        window.localStorage.setItem('sts_access_secret', '');
        window.localStorage.setItem('sts_access_token', '');
        window.localStorage.setItem('sts_token_time', '');
        onError(err);
      });
  };

  render() {
    const { value: val, onChange, children, ...restProps } = this.props;

    return (
      <Upload
        name="file"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="https://up.qiniup.com"
        data={{
          token: this.state.qiniuToken
        }}
        beforeUpload={this.handleBefore}
        onChange={this.handleChange}
        customRequest={this.handleCustomRequest}
        {...restProps}
      >
        {children || this.renderImage()}
      </Upload>
    );
  }
}
