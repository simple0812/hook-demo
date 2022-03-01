import React, { Component } from 'react';
import {
  Routes,
  BrowserRouter as Router,
  Route,
  Navigate
} from 'react-router-dom';
import { Provider } from 'mobx-react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import 'antd/dist/antd.css';
// import 'antd/lib/style/themes/default.less';

import store from '@/stores';

import 'moment/locale/zh-cn';
import { renderRouter } from './router';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Provider {...store}>
        <Router>
          <ConfigProvider locale={zhCN}>
            <Routes>{renderRouter()}</Routes>
          </ConfigProvider>
        </Router>
      </Provider>
    );
  }
}

export default App;
