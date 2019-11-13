import React from 'react';
import { Database } from './database';
import './App.css';

const ticketUrl =
  'https://service-2rliije5-1252710547.ap-shanghai.apigateway.myqcloud.com/release/';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      app: {},
      loginMsg: '',
      userId: 'tcb00',
      errmsg: '',
      base64: '',
      base64Encoding: '',
      execTime: 0,
      queryResult: '',
      queryTime: 0
    };
  }

  componentDidMount() {
    const app = window.tcb.init({
      env: 'scf-920ksf'
    });

    app.auth();

    this.setState({
      userId: `user${Math.random()}`.replace('0.', ''),
      app
    });
  }

  handleInputUserId(e) {
    this.setState({ userId: e.target.value });
  }

  handleInputBase64(e) {
    this.setState({ base64: e.target.value });
  }

  setErrorMsg(msg) {
    this.setState({
      errmsg: msg
    });
  }

  // 自定义登录
  customLogin() {
    const { userId } = this.state;

    if (!userId) {
      this.setState({
        userId: `user${Math.random()}`.replace('0.', '')
      });
    }

    fetch(`${ticketUrl}?userId=${userId || 'tcb00'}`)
      .then(async res => {
        if (res.status === 400) {
          throw new Error(
            `${res.status}: ${res.statusText} 获取 Ticket 失败，用户 Id 不符合规则`
          );
        }

        if (res.status === 429) {
          throw new Error(
            `${res.status}: ${res.statusText} API rate limit exceeded`
          );
        }
        const data = await res.json();

        const auth = this.state.app.auth();

        auth.signInWithTicket(data.ticket).then(res => {
          if (res && res.credential && res.credential.refreshToken) {
            this.setState({
              loginMsg: '登录成功！'
            });
          }
        });
      })
      .catch(err => {
        this.setState({
          errmsg: err.message
        });
      });
  }

  // 执行函数测试
  getBase64Encoding() {
    const { base64 } = this.state;
    if (!base64) {
      this.setState({
        errmsg: 'Base64 字符串不能为空！'
      });
      return;
    }

    const start = Date.now();
    this.state.app
      .callFunction({
        name: 'base64',
        data: {
          str: base64
        }
      })
      .then(res => {
        const end = Date.now();
        this.setState({
          execTime: end - start,
          base64Encoding: res.result.data
        });
      })
      .catch(err => {
        this.setState({
          errmsg: err.message
        });
      });
  }

  logout() {
    this.state.app
      .auth()
      .signOut()
      .then(res => {
        this.setState({
          loginMsg: '注销登录成功！'
        });
      });
  }

  renderFunction() {
    const { base64Encoding, execTime } = this.state;

    return (
      <div>
        <h4>Base64 编码</h4>
        <div>
          <label htmlFor="userId">字符串：</label>
          <input
            type="text"
            id="userId"
            value={this.state.base64}
            onChange={e => this.handleInputBase64(e)}
          />
          <button
            style={{ marginLeft: '10px' }}
            onClick={() => this.getBase64Encoding()}
          >
            计算
          </button>
        </div>
        <div style={{ marginTop: '10px' }}>结果： {base64Encoding}</div>
        <div style={{ marginTop: '10px' }}>耗时： {execTime} ms</div>
      </div>
    );
  }

  renderCustomLogin() {
    return (
      <div>
        <h4>自定义登录</h4>
        <div>
          <label htmlFor="userId">用户 Id（字母和数字的组合，4-32 位）：</label>
          <input
            type="text"
            id="userId"
            value={this.state.userId}
            onChange={e => this.handleInputUserId(e)}
          />
          <button
            style={{ marginLeft: '10px' }}
            onClick={() => this.customLogin()}
          >
            登录
          </button>
          <button style={{ marginLeft: '10px' }} onClick={() => this.logout()}>
            注销登录
          </button>
        </div>
        <div style={{ marginTop: '10px' }}>{this.state.loginMsg}</div>
      </div>
    );
  }

  render() {
    const { errmsg, app } = this.state;

    return (
      <div className="app">
        <h3>本地开发，请通过代理访问域名：tcb.dev</h3>
        <div className="err" style={{ color: 'red' }}>
          {errmsg}
        </div>
        <div className="categories">
          <div className="group">
            <div className="group-title text-lg text-bold">函数</div>
            <div className="group-content">{this.renderFunction()}</div>
          </div>
          <div className="group">
            <div className="group-title text-lg text-bold">数据库</div>
            <div className="group-content">
              <Database setErrorMsg={msg => this.setErrorMsg(msg)} app={app} />
            </div>
          </div>
          <div className="group">
            <div className="group-title text-lg text-bold">存储</div>
            <div className="group-content"></div>
          </div>
          <div className="group">
            <div className="group-title text-lg text-bold">授权</div>
            <div className="group-content">{this.renderCustomLogin()}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
