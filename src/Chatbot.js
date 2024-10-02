import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css';

const geminiApiKey = 'AIzaSyB_Bj1T5xlEEXJXi5Wl4frtXOcISY08iXQ'; //Your Api Key

const geminiClient = axios.create({
  headers: {
    'x-goog-api-key': geminiApiKey,
    'Content-Type': 'application/json',
  },
});

const geminiEndpoint = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null); 

  const handleUserMessage = async (text) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: text },
    ]);

    try {
      const response = await geminiClient.post(geminiEndpoint, {
        contents: [
          {
            role: 'user',
            parts: [{ text }],
          },
        ],
      });

      const responseText = response.data.candidates[0].content.parts[0].text;

      const isCodeBlock = responseText.startsWith('```') && responseText.endsWith('```');
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'assistant',
          content: responseText,
          isCodeBlock, 
        },
      ]);
    } catch (error) {
      console.error('Error handling user message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: 'Sorry, something went wrong.' },
      ]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      handleUserMessage(input);
      setInput('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chatbot-container">
      <h1 className="chatbot-title">Chatbot</h1>
      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div key={index} className={`chatbot-message ${message.role}`}>
            <strong>{message.role === 'user' ? 'You' : 'Bot'}:</strong>
            {message.isCodeBlock ? (
              <pre className="code-block">
                <code>{message.content.slice(3, -3)}</code>
              </pre>
            ) : (
              <span>{message.content}</span>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="chatbot-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="chatbot-input"
          placeholder="Type your message..."
        />
        <button type="submit" className="chatbot-button">Send</button>
      </form>
    </div>
  );
};

export default Chatbot;