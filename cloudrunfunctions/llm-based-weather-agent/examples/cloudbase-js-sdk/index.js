const cloudbase = require("@cloudbase/js-sdk");
const adapter = require("@cloudbase/adapter-node");

const { sessionStorage } = adapter.genAdapter();

cloudbase.useAdapters(adapter);

const app = cloudbase.init({
  env: "your-env-id", // 填入云开发环境 id
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

const main = async () => {
  await auth.signInAnonymously();

  const ai = await app.ai();

  const botId = "your-agent-id"; // 填入 Agent id

  const sendMessageResult = await ai.bot.sendMessage({
    botId,
    history: [],
    msg: "你好",
  });
  for await (let x of sendMessageResult.dataStream) {
    console.log(x);
  }

  const recommendQuestionsResult = await ai.bot.getRecommendQuestions({
    botId,
    agentSetting: "",
    history: [],
    introduction: "",
    msg: "",
    name: "",
  });
  for await (let x of recommendQuestionsResult.dataStream) {
    console.log(x);
  }

  console.log(
    await ai.bot.getFeedback({
      botId,
    })
  );
  console.log(
    await ai.bot.sendFeedback({
      userFeedback: {
        botId,
      },
    })
  );
  console.log(
    await ai.bot.getChatRecords({
      botId,
    })
  );
};

main().catch((e) => console.log(e));
