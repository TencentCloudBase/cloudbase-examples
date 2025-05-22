import cloudbase from '@cloudbase/js-sdk';

// 云开发环境ID，使用时请替换为您的环境ID
const ENV_ID = 'your-env-id';

/**
 * 初始化云开发实例
 * @param {Object} config - 初始化配置
 * @param {string} config.env - 环境ID，默认使用ENV_ID
 * @param {number} config.timeout - 超时时间，默认15000ms
 * @returns {Object} 云开发实例
 */
export const init = (config = {}) => {
  const appConfig = {
    env: config.env || ENV_ID,
    timeout: config.timeout || 15000,
  };
  
  return cloudbase.init(appConfig);
};

/**
 * 默认的云开发实例
 */
export const app = init();

/**
 * 登录方法，默认使用匿名登录
 * @param {Object} options - 登录选项
 * @returns {Promise} 登录状态
 */
export const login = async (options = {}) => {
  const auth = app.auth();
  
  try {
    // 如果环境ID未设置，提示用户
    if (ENV_ID === 'your-env-id') {
      console.warn('请设置有效的环境ID后再使用此功能');
      return { signedIn: false, message: '未配置环境ID' };
    }
    
    // 默认使用匿名登录
    await auth.signInAnonymously();
    
    // 获取登录状态
    const loginState = await auth.getLoginState();
    
    // 获取登录范围（用于确认是否为匿名登录）
    const loginScope = await auth.loginScope();
    console.log('当前登录范围:', loginScope);
    
    return loginState;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
};

// 默认导出
export default {
  init,
  app,
  login
}; 