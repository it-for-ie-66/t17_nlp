import React, { useEffect, useState } from "react";
import { load_model, type Model } from "./model";
import { infoInit as info } from "./utils";
import Highlighter from "react-highlight-words";

interface Prediction {
  endIndex: number;
  score: number;
  startIndex: number;
  text: string;
}

function App() {
  const [model, setModel] = useState<Model | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");
  const [prediction, setPrediction] = useState<Prediction[] | null>(null);

  useEffect(() => {
    load_model()
      .then((model) => {
        setModel(model);
        setReady(true);
      })
      .catch((err) => {
        console.log(err);
        setReady(false);
      });
  }, []);

  function handleClickAnswer() {
    if (!model || !question) return;
    model.findAnswers(question, info).then((answers: Prediction[]) => {
      console.log(answers);
      setPrediction(answers);
    });
  }

  function handleQuestionChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuestion(e.target.value);
  }

  const disabled = !question || !ready;

  if (!ready) return <>Loading....</>;
  return (
    <>
      <h1>Answering from Text</h1>
      <h2>Information</h2>
      {/* Displaying Information */}
      <div>
        <Highlighter
          textToHighlight={info}
          searchWords={prediction?.map((p) => p.text) || []}
          highlightStyle={{ backgroundColor: "yellow" }}
        />
      </div>
      {/* Input and Answers */}
      <div>
        <h2>Question</h2>
        {/* Input */}
        <div>
          <label htmlFor="question">Ask me anything: </label>
          <input
            id="question"
            type="text"
            onChange={handleQuestionChange}
            style={{ width: "90vw" }}
          />
          <button onClick={handleClickAnswer} disabled={disabled}>
            Answer
          </button>
        </div>
        {/* Answer */}
        {prediction && (
          <ul>
            {prediction.length !== 0 ? (
              prediction.map((p, i) => (
                <li key={i}>
                  {p.text} (มั่นใจ {p.score.toFixed(2)})
                </li>
              ))
            ) : (
              <li>Sorry, I don't know the answer.</li>
            )}
          </ul>
        )}
      </div>
    </>
  );
}

export default App;
