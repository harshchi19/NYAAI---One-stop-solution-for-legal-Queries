// AnswerCard.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import Loader from './Loader';
import dislike from '../assets/iconamoon_dislike-light.svg'
import like from '../assets/iconamoon_like-light.svg'
import tick from '../assets/tick.png'
import copy from '../assets/radix-icons_copy.svg'
import retry from '../assets/pajamas_retry.svg'

const AnswerCard = ({ div, copiedState, copyToClipboard, retryQuestion, likeState, dislikeState, handleLike, handleDislike }) => {
  if (!div) return null; // Check if div is null or undefined

  const hasAnswer = div.answer.trim() !== "";

  return (
    <div>
      <div className="overlap-3">
        <div className="overlap-group-wrapper">
          <div className="div-wrapper">
            <div className="text-wrapper-4"> N</div>
          </div>
        </div>
        <p className="p">
          {div.question.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < div.question.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      </div>
      <div className={`answer-box ${!hasAnswer && 'default-height'}`}>
        {div.isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="answer-rectangle" />
            <div className="label">
              <ReactMarkdown>{div.answer}</ReactMarkdown>
            </div>
          </>
        )}
      </div>
      <div className="frame">
        <div className="group" onClick={() => copyToClipboard(div.answer, div.id)}>
          <img
            className="radix-icons-copy"
            alt="Radix icons copy"
            src={
              copiedState
                ? tick
                : copy
            }
          />
          <div className="text-wrapper">
            {copiedState ? "Copied!" : "Copy"}
          </div>
        </div>
        <div className="group-wrapper" onClick={() => retryQuestion(div.question)}>
          <div className="div">
            <img className="pajamas-retry" alt="Pajamas retry" src={retry} />
            <div className="text-wrapper-2">Retry</div>
          </div>
        </div>
        <img
          className={`img ${likeState ? 'active' : ''}`}
          alt="Iconamoon like light"
          src={like}
          onClick={() => handleLike(div.id)}
        />
        <img
          className={`img ${dislikeState ? 'active' : ''}`}
          alt="Iconamoon dislike"
          src={dislike}
          onClick={() => handleDislike(div.id)}
        />
      </div>
    </div>
  );
};

export default AnswerCard;