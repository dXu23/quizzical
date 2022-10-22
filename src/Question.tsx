import React, { ReactNode } from 'react';

interface QuestionProps {
  content: string;
  children: ReactNode[];
}

export default function Question(props: QuestionProps) {
    return (
      <article className="question">
        <h3>{props.content}</h3>
        <div className="answers">
          {props.children}
        </div>
        <hr />
      </article>
    );
}
