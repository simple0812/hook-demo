import React from 'react';
import { Upload, Icon, message } from 'antd';
import _ from 'lodash';
import axios from 'axios';

export default class PictureWall extends React.Component {
  state = {
    loading: false
  };

  static getDerivedStateFromProps(props, state) {
    if (props.value !== state.value && props.value !== undefined) {
      state.value = props.value;
      return state;
    } else {
      return null;
    }
  }

  componentDidMount() {
    axios
      .get('https://xres.bnq.com.cn/file/upload/getQiniuTokenWithParams')
      .then((res) => {
        if (res.status !== 200) {
          return;
        }
        let xres = res.data || {};

        if (xres.response && xres.response.code == 0 && xres.response.data) {
          this.setState({
            qiniuToken: xres.response.data.upToken
          });
        }
      });
  }

  handleChange = ({ fileList }) => {
    const { onChange } = this.props;
    if (fileList && fileList[0].status === 'done') {
      fileList.forEach((file) => {
        file.url = `https://res1.bnq.com.cn/${
          file.response.key
        }?t=${new Date().getTime()}&width=${file.response.w}&height=${
          file.response.h
        }`;
      });

      console.log('xxx');
    }

    if (onChange) {
      onChange(fileList);
    } else {
      this.setState({ value: fileList });
    }
  };

  renderImage = () => {
    const { maxCount = 8 } = this.props;
    const { value } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return value?.length >= maxCount ? null : uploadButton;
  };

  render() {
    const { value } = this.state;
    console.log('value', value);
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
        onChange={this.handleChange}
        fileList={value}
      >
        {this.renderImage()}
      </Upload>
    );
  }
}
