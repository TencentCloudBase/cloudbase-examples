export const checkConfig = (chatMode,agentConfig,modelConfig) => {
  const {  botId } = agentConfig||{}
  const {  modelProvider,quickResponseModel,deepReasoningModel } = modelConfig||{}
  // 检测AI能力，不存在提示用户
  if(!wx.cloud.extend||!wx.cloud.extend.AI){
    return [false,'使用AI能力需基础库为3.7.7及以上，请升级基础库版本或微信客户端']
  }
  if (!['bot', 'model'].includes(chatMode)) {
    return [false, 'chatMode 不正确，值应为“bot”或“model”']
  }
  if (chatMode === 'bot' && !botId) {
    return [false, '当前chatMode值为bot，请配置botId']
  }
  if (chatMode === 'model' && (!modelProvider || !quickResponseModel)) {
    return [false, '当前chatMode值为model，请配置modelProvider和quickResponseModel']
  }
  return [true, '']
}
// 随机选取三个问题
export function randomSelectInitquestion(question=[],num=3){
  if(question.length<=num){
    return [...question]
  }
  const set=new Set();
  while(set.size<num){
    const randomIndex=Math.floor(Math.random()*question.length)
    set.add(question[randomIndex])
  }
  return Array.from(set)
}
function Throttle(){
  let timer=null
  return function(fn){
    if(!timer){
      timer=setTimeout(()=>{
        fn()
        timer=null
      },50)
    }
  }
}
// 频繁渲染会阻塞UI线程，这里节流一下
 export const ThrottleFn= Throttle()