import React, { MouseEvent } from 'react';

interface AnswerProps {
  content: string;
  isCorrect: boolean;
  isSelected: boolean;
  quizDone: boolean;
  handleClick: (e: MouseEvent) => void;
}

export default function Answer(props: AnswerProps) {
    const styles = {
      backgroundColor: 'white',
      border: '0.78px solid #4d5b9e',
      opacity: 1
    };

    if (props.isSelected) {
        styles.border = 'none';

        if (!props.quizDone) {
            styles.backgroundColor = '#d6dbf5';
        }
    }

    if (props.quizDone) { 
      if (props.isCorrect) {
        styles.border = 'none';
        styles.backgroundColor = '#94d7a2';
      } else {
        styles.opacity = 0.5;

        if (props.isSelected) {
          styles.backgroundColor = '#f8bcbc';
        }
      }
    }


    return <div className="answer" style={styles} onClick={props.handleClick}>{props.content}</div>;
}
