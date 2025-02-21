import React, { lazy, Suspense, useState,useRef } from 'react'
import './app.less'
// @ts-ignore
import {AgentUi} from 'block';

import * as wedaClient from "@cloudbase/weda-client";

wedaClient.app.init({
  /** 当前是否处于正式发布模式 */
  isProd: true,
  /** 低码应用ID */
  /** 云开发环境ID */
  envId: "____",
});


function App() {
  const myComponentRef = useRef();

  return (
    <div id='wd-page-root'>
      <AgentUi ref={myComponentRef} llmConfig={{provider:'deepseek',model:'deepseek-v3',reasonModel:'deepseek-r1'}}></AgentUi>
    </div>
  )
}
export default App