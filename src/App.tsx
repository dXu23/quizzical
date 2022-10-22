import React, { useState, useEffect, useRef, MouseEvent, ReactNode } from 'react';
import { nanoid } from 'nanoid';
import { decode } from 'he';

import BlobUpper from './assets/blob-upper.svg';
import BlobLower from './assets/blob-lower.svg';

import Question from './Question';
import Answer from './Answer';

import './App.css';

enum status { NotStarted, InProgress, Finished };

interface IAnswer {
    id: string;
    content: string;
    isCorrect: boolean;
    isSelected: boolean;
}

interface IQuestion {
    id: string;
    content: string;
    answers: IAnswer[];
}

interface QuestionData {
    question: string;
    incorrect_answers: string[];
    correct_answer: string;
}

function App() {
  let [ questionList, setQuestionList ] = useState<IQuestion[]>([]);

  let [ quizStatus, setQuizStatus ] = useState(status.NotStarted);
  let prevQuizStatus = useRef(status.NotStarted);

  let [ numCorrect, setNumCorrect ] = useState(0);

  useEffect(() => {
    if (prevQuizStatus.current !== quizStatus && quizStatus === status.InProgress) {
      fetch('https://opentdb.com/api.php?amount=5&type=multiple')
        .then(res => res.json())
        .then(data => {
          setQuestionList(data.results.map((questionObj: QuestionData) => { 
            let answersArr = questionObj.incorrect_answers.map(ans => ({ id: nanoid(), content: decode(ans), isSelected: false, isCorrect: false }));
            const ndx = Math.floor(4 * Math.random());
            answersArr.splice(ndx, 0, { id: nanoid(), content: decode(questionObj.correct_answer), isSelected: false, isCorrect: true });

            return { id: nanoid(), content: decode(questionObj.question), answers: answersArr };
          }));
        })
        .catch(err => {
          console.log(err);
        });
    }

    prevQuizStatus.current = quizStatus;
  }, [ quizStatus ]);

  useEffect(() => {
    setNumCorrect(questionList.reduce((acc, questionObj) => acc + (questionObj.answers.find(ans => ans.isSelected)?.isCorrect ? 1 : 0), 0));
  }, [questionList]);

  function handleAnswerClick(evt: MouseEvent, questionId: string, answerId: string) {
    setQuestionList(prevQuestionList =>
      prevQuestionList.map(questionObj => questionObj.id === questionId ? 
        { ...questionObj, answers: questionObj.answers.map(ans => {
          if (ans.isSelected && ans.id !== answerId) {
              return { ...ans, isSelected: false };
          } else if (ans.id === answerId) {
              return { ...ans, isSelected: true };
          } else {
              return ans;
          }
        }) } : questionObj
      )
    );
  }

  function handleStart() {
    setQuizStatus(status.InProgress);
  }

  function handleCheck() {
    setQuizStatus(status.Finished);
  }

  let questionElems: ReactNode[] = questionList.map((questionObj: IQuestion) =>
    <Question key={questionObj.id} content={questionObj.content}>
      {questionObj.answers.map(ans => 
        <Answer key={ans.id}
                content={ans.content} 
                quizDone={quizStatus === status.Finished} 
                isSelected={ans.isSelected} 
                isCorrect={ans.isCorrect}
                handleClick={(evt) => handleAnswerClick(evt, questionObj.id, ans.id)}
         />
       )
      }
    </Question>
  );

  let startPage = (
    <section className="start-page">
      <h1>Quizzical</h1>
      <h2>Some description if needed</h2>
      <button className="start-button" onClick={handleStart}>Start quiz</button>
    </section>
  );

  let quizPage = (
    <section className="quiz-page">
      {questionElems}
      <div className="quiz-bottom">
        {quizStatus === status.Finished && <div className="score">You scored {numCorrect}/{questionList.length} answers</div>}
        {quizStatus === status.Finished ? 
          <button onClick={handleStart}>Try again</button> :
          <button onClick={handleCheck}>Check answers</button>
        }
      </div>
    </section>
  );

  return (
    <main>
      <img id="blob-upper" src={BlobUpper} alt="Decoration blog in upper right corner" />
      <img id="blob-lower"  src={BlobLower} alt="Decoration blog in lower left corner" />
      {quizStatus === status.NotStarted ?
        startPage :
        quizPage
      }
    </main>
  );
}

export default App;

