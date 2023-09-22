import * as qna from "@tensorflow-models/qna";
import "@tensorflow/tfjs-backend-webgl";

export type Model = qna.QuestionAndAnswer;

export async function load_model() {
  // Load the model.
  try {
    const model = await qna.load();
    return model;
  } catch (err) {
    console.log(err);
    return null;
  }
}
