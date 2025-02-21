import React, { lazy, Suspense, useState,useRef } from 'react'
import './app.less'
// @ts-ignore
import {AgentUi} from 'block';

import * as wedaClient from "@cloudbase/weda-client";


/**
 * ATTENTION：如果您需要使用更多的云开发或微搭服务，请参考如下文档，如果仅使用 Agent 则只需要配置 envId 即可
 * https://docs.cloudbase.net/lowcode/practices/weda-client#2-%E6%8E%A5%E5%85%A5%E5%BE%AE%E6%90%AD%E7%9A%84%E6%9C%8D%E5%8A%A1
*/
wedaClient.app.init({
  /** 当前是否处于正式发布模式 */
  isProd: true,
  /** 低码应用ID */
  /** 云开发环境ID */
  envId: "YOUR_ENV_ID",
});


function App() {
  const myComponentRef = useRef();

  return (
    /** ATTENTION: 微搭的组件需要包裹在 ID:wd-page-root 的元素下使用*/
    <div id='wd-page-root'>
      <AgentUi ref={myComponentRef} llmConfig={{provider:'deepseek',model:'deepseek-v3',reasonModel:'deepseek-r1'}}></AgentUi>
    </div>
  )
}
export default App