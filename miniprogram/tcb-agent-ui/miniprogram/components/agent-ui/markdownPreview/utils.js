const towxml = require('./towxml/index');
export const markdownToWxml = (markdown) => {
  let wxml = towxml(markdown, 'markdown', {
    base: '',				// 相对资源的base路径
    theme: 'light',					// 主题，默认`light`
    events: {					// 为元素绑定的事件方法
      tap: (e) => {
        // console.log('tap', e);
      }
    }
  });
  return wxml
}
