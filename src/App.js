import React, { Component } from 'react';
import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate
} from 'react-router-dom';
import { Provider } from 'mobx-react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import store from '@/stores';

import 'moment/locale/zh-cn';
import Help from '@/containers/Help';
import Foo from '@/containers/Foo';
import Bar from '@/containers/Bar';
import Exception404 from '@/containers/Exception/404';
import Exception403 from '@/containers/Exception/403';
import Exception500 from '@/containers/Exception/500';

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
            <Routes>
              <Route path="/home" element={<Help />} />
              <Route path="/foo" element={<Foo />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/403" element={<Exception403 />} />
              <Route path="/404" element={<Exception404 />} />
              <Route path="/500" element={<Exception500 />} />
              <Route
                path="*"
                element={<Navigate to="/home" replace={false} />}
              />
            </Routes>
          </ConfigProvider>
        </Router>
      </Provider>
    );
  }
}

export default App;