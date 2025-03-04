import * as cloudbase from "@cloudbase/node-sdk";
import { CHAT_RECORD_DATA_MODEL } from "./const";

let model: null | ReturnType<typeof cloudbase.init>["models"][string] = null;

export const getChatRecordDataModel = (envId: string) => {
  if (model) {
    return model;
  }
  const app = cloudbase.init({ env: envId });
  const models = app.models;

  model = models[CHAT_RECORD_DATA_MODEL];

  return model;
};
