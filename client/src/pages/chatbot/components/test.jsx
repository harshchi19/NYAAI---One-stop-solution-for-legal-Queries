import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AnswerCard from './AnswerCard';
import TextInput from './TextInput';
import Header from './Header';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY, dangerouslyAllowBrowser: true });

const Box = () => {
  const [divs, setDivs] = useState([]);
  const [question, setQuestion] = useState("");
  const divContainerRef = useRef(null);
  const [copiedStates, setCopiedStates] = useState({});
  const [likeStates, setLikeStates] = useState({});
  const [dislikeStates, setDislikeStates] = useState({});
  const [model, setModel] = useState("smart");
  const [generatedTitle, setGeneratedTitle] = useState("");

  // Scroll to bottom whenever new divs are added
  useEffect(() => {
    if (divContainerRef.current) {
      divContainerRef.current.scrollTop = divContainerRef.current.scrollHeight;
    }
  }, [divs]);

  // Initialize session ID and fetch previous chat history
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

  // Generate answer and save to backend
  async function generateAnswer(questionText = question) {
    const newDivId = divs.length;
    addDiv(questionText, "", true); // Add the question first with an empty answer and set loading to true

    // List of casual phrases to skip title generation
    const casualPhrases = ["hi", "hello", "hey", "how are you?", "what's up?"];

    // Check if the question is considered casual
    const isCasual = casualPhrases.includes(questionText.trim().toLowerCase());

    try {
      const sessionId = localStorage.getItem('sessionId') || 'unique-session-id'; // Use stored session ID or fallback
      const responseHistory = await axios.get(`http://localhost:5000/api/chat/${sessionId}`);
      let generatedAnswer;
      let apiUrl = '';

      const context = responseHistory.data.map(chat => `Q: ${chat.user_question}\nA: ${chat.bot_response}`).join('\n');

      if (model === 'pro') {
        console.log("Using Groq Model");
        generatedAnswer = await getGroqChatCompletion(questionText, context);

        if (!isCasual) {

          const title_text  = `Generate a single one and only concise title of up to four words that captures the essence of this conversation: ${questionText} ${generatedAnswer}. NOTE: Title must be a maximum of 4 words, not more than that.Response should conatin only title and nothing else ,not even any opening statement and title should not be in quotes.`;
          // Generate title based on the generated answer if the conversation is not casual
          const generatedTitle = await getGroqChatCompletion(title_text, context);
  
          console.log(generatedTitle);
  
          // Update the title state
          setGeneratedTitle(generatedTitle);
        } else {
          // Clear the title if the conversation is casual
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
          // Generate title based on the generated answer if the conversation is not casual
          const titleResponse = await axios.post(apiUrl, {
            "contents": [{ "parts": [{ "text": `Generate a single one and only concise title of up to four words that captures the essence of this conversation: ${questionText}${generatedAnswer}
                                              NOTE: Title must be a maximum of 4 words, not more than that.Response should conatin only title and nothing else ,not even any opening statement and title should not be in quotes` }] }]
          });
  
          const generatedTitle = titleResponse.data.candidates[0].content.parts[0].text;
          console.log(generatedTitle);
  
          // Update the title state
          setGeneratedTitle(generatedTitle);
        } else {
          // Clear the title if the conversation is casual
          setGeneratedTitle("");
        }
      }

      console.log(generatedAnswer);

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

  // Groq chat completion function
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
    <div>
      <Header model={model} setModel={setModel} title1={generatedTitle} />
      <div className="div1" ref={divContainerRef}>
        {divs.map((div) => (
          <AnswerCard
            key={div.id}
            div={div}
            copiedState={copiedStates[div.id]}
            copyToClipboard={(text) => navigator.clipboard.writeText(text)}
            likeState={likeStates[div.id]}
            dislikeState={dislikeStates[div.id]}
            handleLike={handleLike}
            handleDislike={handleDislike}
          />
        ))}
      </div>
      <TextInput question={question} setQuestion={setQuestion} handleClick={handleClick} />
      <button onClick={handleNewChat}>New Chat</button>
    </div>
  );
};

export default Box;
