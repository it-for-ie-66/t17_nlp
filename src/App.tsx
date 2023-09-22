import React, { useEffect, useState } from "react";
import { load_model, type Model } from "./model";
import { infoInit } from "./utils";
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
  const [isEdit, setIsEdit] = useState(false);
  const [info, setInfo] = useState<string>(infoInit);

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
  if (!ready) return <>Loading....</>;

  function predict() {
    if (!model || !question) return;
    model.findAnswers(question, info).then((answers: Prediction[]) => {
      console.log(answers);
      setPrediction(answers);
    });
  }

  function handleEnterAnswer(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") predict();
  }

  function handleClickAnswer() {
    predict();
  }

  function handleQuestionChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuestion(e.target.value);
  }

  function handleEdit() {
    setIsEdit(true);
  }

  function handleChangeInfo(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInfo(e.target.value);
  }

  function handleSave() {
    setIsEdit(false);
  }

  const disabled = !question || !ready;

  return (
    <>
      <h1>Answering from Text</h1>
      <h2>Information</h2>
      {/* Buttons */}
      <div>
        {!isEdit ? (
          <button onClick={handleEdit}>Edit</button>
        ) : (
          <button onClick={handleSave}>Save</button>
        )}
      </div>
      {/* Editing Information */}
      {isEdit && (
        <textarea
          value={info}
          style={{ width: "90vw" }}
          rows={10}
          onChange={handleChangeInfo}
        />
      )}
      {/* Displaying Information */}
      {!isEdit && (
        <div>
          <Highlighter
            textToHighlight={info}
            searchWords={prediction?.map((p) => p.text) || []}
            highlightStyle={{ backgroundColor: "yellow" }}
          />
        </div>
      )}
      {/* Displaying Answers */}
      {!isEdit && (
        <div>
          <h2>Question</h2>
          <div>
            <label htmlFor="question">Ask me anything: </label>
            <input
              id="question"
              type="text"
              onChange={handleQuestionChange}
              style={{ width: "90vw" }}
              onKeyDown={handleEnterAnswer}
            />
            <button onClick={handleClickAnswer} disabled={disabled}>
              Answer
            </button>
          </div>
          <ul>
            {prediction?.map((p, i) => (
              <li key={i}>
                {p.text} (มั่นใจ {p.score.toFixed(2)})
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default App;
