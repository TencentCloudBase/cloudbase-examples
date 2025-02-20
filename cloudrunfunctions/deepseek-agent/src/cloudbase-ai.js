const cloudbase = require("@cloudbase/js-sdk");
const adapter = require("@cloudbase/adapter-node");

/**
 *
 * @param {string} envId
 * @returns {Promise<import("@cloudbase/js-sdk/ai").AI>}
 */
async function getCloudbaseAi(envId) {
  let ai = null;
  if (!ai) {
    const { sessionStorage } = adapter.genAdapter();
    cloudbase.useAdapters(adapter);

    const app = cloudbase.init({
      env: envId,
    });

    /**
     * auth 初始化的时候要传入storage 和 captchaOptions.openURIWithCallback
     * 否则会用默认的，依赖于平台，在 nodejs 环境报错
     */
    const auth = app.auth({
      storage: sessionStorage,
      captchaOptions: {
        openURIWithCallback: (...props) =>
          console.log("open uri with callback", ...props),
      },
    });

    await auth.signInAnonymously();

    ai = await app.ai();
  }

  return ai;
}

module.exports = { getCloudbaseAi };
