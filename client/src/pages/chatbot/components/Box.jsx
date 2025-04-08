import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AnswerCard from './AnswerCard';
import TextInput from './TextInput';
import Groq from 'groq-sdk';
import OpenAI from "openai";
import newChat from '../assets/New_Chat.png';

const openaiConfig = {
  baseURL: import.meta.env.VITE_OPENAI_BASE_URL,
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
};

const groq = new Groq({ 
  apiKey: import.meta.env.VITE_GROQ_API_KEY, 
  dangerouslyAllowBrowser: true 
});

const Box = () => {
  const [divs, setDivs] = useState([]);
  const [question, setQuestion] = useState("");
  const divContainerRef = useRef(null);
  const [copiedStates, setCopiedStates] = useState({});
  const [likeStates, setLikeStates] = useState({});
  const [dislikeStates, setDislikeStates] = useState({});
  const [model, setModel] = useState("SharpTalk");
  const [generatedTitle, setGeneratedTitle] = useState("");

  useEffect(() => {
    if (divContainerRef.current) {
      divContainerRef.current.scrollTop = divContainerRef.current.scrollHeight;
    }
  }, [divs]);

  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId') || `session-${Date.now()}`;
    localStorage.setItem('sessionId', sessionId);

    async function fetchChatHistory() {
      try {
        const response = await axios.get(`http://localhost:5000/api/chat/${sessionId}`);
        const chatHistory = response.data;
        setDivs(chatHistory.map((chat, index) => ({
          id: index,
          question: chat.user_question,
          answer: chat.bot_response,
          isLoading: false
        })));
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    }

    fetchChatHistory();
  }, []);

  async function generateAnswer(questionText = question) {
    const newDivId = divs.length;
    addDiv(questionText, "", true);

    const casualPhrases = ["hi", "hello", "hey", "how are you?", "what's up?"];
    const isCasual = casualPhrases.includes(questionText.trim().toLowerCase());

    try {
      const sessionId = localStorage.getItem('sessionId') || 'unique-session-id';
      const responseHistory = await axios.get(`http://localhost:5000/api/chat/${sessionId}`);
      let generatedAnswer;
      let apiUrl = '';

      const context = responseHistory.data.map(chat => `Q: ${chat.user_question}\nA: ${chat.bot_response}`).join('\n');
      
      if (model === 'fast') {
        console.log("Using OpenAI");
        generatedAnswer = await getOpenAIChatCompletion(questionText, context);
        if (!isCasual) {
          const title_text = `Generate a single one and only concise title of up to four words that captures the essence of this conversation: ${questionText} ${generatedAnswer}. NOTE: Title must be a maximum of 4 words, not more than that.Response should conatin only title and nothing else ,not even any opening statement and title should not be in quotes.`;
          const generatedTitle = await getOpenAIChatCompletion(title_text, context);
          setGeneratedTitle(generatedTitle);
        } else {
          setGeneratedTitle("");
        }
      }
      else if (model === 'pro') {
        console.log("Using Groq Model");
        generatedAnswer = await getGroqChatCompletion(questionText, context);

        if (!isCasual) {
          const title_text = `Generate a single one and only concise title of up to four words that captures the essence of this conversation: ${questionText} ${generatedAnswer}. NOTE: Title must be a maximum of 4 words, not more than that.Response should conatin only title and nothing else ,not even any opening statement and title should not be in quotes.`;
          const generatedTitle = await getGroqChatCompletion(title_text, context);
          setGeneratedTitle(generatedTitle);
        } else {
          setGeneratedTitle("");
        }
      } else {
        apiUrl = model === "smart"
          ? "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBp_yvialQ8RszA6LB4cene7X74y1sP4Q0"
          : "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=AIzaSyA1uc2ju-sLgJ0tiW2yEIIFqqtZemWn2vg";
        
        const response = await axios.post(apiUrl, {
          "contents": [{ "parts": [{ "text": `${context}\nQ: ${questionText}` }] }]
        });

        generatedAnswer = response.data.candidates[0].content.parts[0].text;
        
        if (!isCasual) {
          const titleResponse = await axios.post(apiUrl, {
            "contents": [{ "parts": [{ "text": `Generate a single one and only concise title of up to four words that captures the essence of this conversation: ${questionText}${generatedAnswer}
                                            NOTE: Title must be a maximum of 4 words, not more than that.Response should conatin only title and nothing else ,not even any opening statement and title should not be in quotes` }] }]
          });
          const generatedTitle = titleResponse.data.candidates[0].content.parts[0].text;
          setGeneratedTitle(generatedTitle);
        } else {
          setGeneratedTitle("");
        }
      }

      await axios.post('http://localhost:5000/api/chat', {
        sessionId,
        question: questionText,
        answer: generatedAnswer
      });

      setTimeout(() => {
        updateDiv(newDivId, `${generatedAnswer}`, false);
      }, 200);
    } catch (error) {
      console.error('Error fetching answer:', error);
      setTimeout(() => {
        updateDiv(newDivId, "Error fetching answer", false);
      }, 2000);
    }
  }

  async function getGroqChatCompletion(questionText, context) {
    try {
      const response = await groq.chat.completions.create({
        messages: [
          { role: 'user', content: `Q: ${questionText}` },
        ],
        model: 'llama3-8b-8192',
      });
      return response.choices[0]?.message?.content || 'No content returned';
    } catch (error) {
      console.error('Error fetching Groq completion:', error);
      return 'An error occurred';
    }
  }

  async function getOpenAIChatCompletion(questionText, context) {
    try {
      console.log("OpenAI API call");
      const openai = new OpenAI({
        baseURL: openaiConfig.baseURL,
        apiKey: openaiConfig.apiKey,
        dangerouslyAllowBrowser: true,
      });

      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: `${context}\nQ: ${questionText}` }
        ],
        temperature: 1.0,
        top_p: 1.0,
        max_tokens: 1000,
        model: "gpt-4o"
      });

      return completion.choices[0]?.message?.content || 'No content returned';
    } catch (error) {
      console.error('Error fetching OpenAI completion:', error);
      return 'An error occurred';
    }
  }

  const addDiv = (questionText, answerText, isLoading) => {
    setDivs([...divs, { id: divs.length, question: questionText, answer: answerText, isLoading }]);
  };

  const updateDiv = (divId, answerText, isLoading) => {
    setDivs((prevDivs) =>
      prevDivs.map((div) =>
        div.id === divId ? { ...div, answer: answerText, isLoading } : div
      )
    );
  };

  const handleClick = () => {
    if (question.trim() !== "") {
      generateAnswer();
      setQuestion("");
    }
  };

  const handleNewChat = () => {
    const newSessionId = `session-${Date.now()}`;
    localStorage.setItem('sessionId', newSessionId);
    setDivs([]);
    setGeneratedTitle("");
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStates((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [id]: false }));
      }, 2000);
    });
  };

  const retryQuestion = (questionText) => {
    generateAnswer(questionText);
  };

  const handleLike = (id) => {
    setLikeStates((prev) => ({ ...prev, [id]: !prev[id] }));
    setDislikeStates((prev) => ({ ...prev, [id]: false }));
  };

  const handleDislike = (id) => {
    setDislikeStates((prev) => ({ ...prev, [id]: !prev[id] }));
    setLikeStates((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <div className='chat-box'>
      <div className="chatsvg-container" onClick={handleNewChat}>
        <svg className="bbb" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path d="M12.7479 3.625C8.09338 3.63346 5.65496 3.74825 4.09742 5.30458C2.41663 6.98779 2.41663 9.69325 2.41663 15.1042C2.41663 20.5151 2.41663 23.2205 4.09742 24.9025C5.77942 26.5833 8.48367 26.5833 13.897 26.5833C19.3079 26.5833 22.0134 26.5833 23.6942 24.9025C25.2529 23.3438 25.3665 20.9066 25.375 16.2509" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.3593 15.7083C12.4844 4.6714 20.3024 1.54182 26.5591 2.61482C26.8116 6.27244 25.0209 7.64149 21.6134 8.27465C22.2719 8.9634 23.4344 9.82857 23.3087 10.9088C23.2193 11.6797 22.6973 12.0567 21.6509 12.8132C19.3599 14.4686 16.7064 15.5126 13.3593 15.7083Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.875 20.5417C13.2917 13.8958 15.66 11.6435 18.125 9.66666" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div className="tooltip">New chat</div>
      </div>

      <div className="dropdown">
        <button className="dropbtn">{model.charAt(0).toUpperCase() + model.slice(1)}</button>
        <div className="dropdown-content">
          <div className="dropdown-item">
            <a href="#" onClick={() => setModel("SharpTalk")}>
              <div className="model-info">
                <span className="model-name">SharpTalk</span>
                <span className="description">For everyday tasks</span>
              </div>
            </a>
          </div>
          <div className="dropdown-item">
            <a href="#" onClick={() => setModel("DeepThink")}>
              <div className="model-info">
                <span className="model-name">DeepThink</span>
                <span className="description">For deep analysis</span>
              </div>
            </a>
          </div>
          <div className="dropdown-item">
            <a href="#" onClick={() => setModel("ProLogic")}>
              <div className="model-info">
                <span className="model-name">ProLogic</span>
                <span className="description">For professional use</span>
              </div>
            </a>
          </div>
          <div className="dropdown-item">
            <a href="#" onClick={() => setModel("SwiftLaw")}>
              <div className="model-info">
                <span className="model-name">SwiftLaw</span>
                <span className="description">For fast legal tasks</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div className='generated-title'>
        <h3>{generatedTitle}</h3>
      </div>

      <div className="div1" ref={divContainerRef}>
        {divs.map((div) => (
          <AnswerCard
            key={div.id}
            div={div}
            copiedState={copiedStates[div.id] || false}
            copyToClipboard={(text, id) => {
              navigator.clipboard.writeText(text).then(() => {
                setCopiedStates((prev) => ({ ...prev, [id]: true }));
                setTimeout(() => {
                  setCopiedStates((prev) => ({ ...prev, [id]: false }));
                }, 2000);
              });
            }}
            retryQuestion={retryQuestion}
            likeState={likeStates[div.id]}
            dislikeState={dislikeStates[div.id]}
            handleLike={handleLike}
            handleDislike={handleDislike}
          />
        ))}
      </div>
      <TextInput question={question} setQuestion={setQuestion} handleClick={handleClick} />
      <div className='warning'>NyaAI legal bot can make mistakes. Consult a lawyer for legal advice.</div>
    </div>
  );
};

export default Box;