import React, { Component } from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { getLayoutData } from './router';
import 'moment/locale/zh-cn';
// import '@ant-design/compatible/assets/index.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const routers = getLayoutData();

    console.log('zzzz', routers);
    return (
      <Provider>
        <Router>
          <ConfigProvider locale={zhCN}>
            <Routes>
              {routers.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  component={route.render}
                />
              ))}
            </Routes>
          </ConfigProvider>
        </Router>
      </Provider>
    );
  }
}

export default App;
