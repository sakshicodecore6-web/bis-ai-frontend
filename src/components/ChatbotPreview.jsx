import { useState, useRef, useEffect } from 'react';
import api from '../api/client';

function ChatbotPreview({ onLockedClick, isLoggedIn = false, messages, setMessages }) {
  const [message, setMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef(null);
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isThinking]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isLoggedIn) {
      onLockedClick(event);
      return;
    }

    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    setMessages((prev) => [...prev, { type: 'user', text: trimmedMessage }]);
    setMessage('');
    setIsThinking(true);

    try {
      const response = await api.post('/copilot/explain', {
        requirement_text: trimmedMessage,
      });

      setMessages((prev) => [
        ...prev,
        { type: 'bot-copilot', result: response.data },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text: "Sorry, I couldn't process that just now. Please try again.",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleFocus = (event) => {
    if (!isLoggedIn) {
      onLockedClick(event); 
    }
  };

  return (
    <section className="chat-preview" aria-label="BIS-AI Assistant chat preview">
      <div className="chat-preview__window">
                <div className="chat-preview__bubble chat-preview__bubble--bot">
          Hi, I'm the BISync Assistant. Ask me which Indian Standard applies
          to your product, and I'll point you to the right one.
        </div>

        {messages.map((item, index) => {
          if (item.type === 'bot-copilot') {
            return <CopilotResultCard key={index} result={item.result} />;
          }

          return (
            <div
              key={index}
              className={`chat-preview__bubble ${
                item.type === 'user'
                  ? 'chat-preview__bubble--user'
                  : 'chat-preview__bubble--bot'
              }`}
            >
              {item.text}
            </div>
          );
        })}

        {isThinking && (
          <div className="chat-preview__bubble chat-preview__bubble--bot chat-preview__scanning">
            <span className="chat-preview__scanning-dot" />
            Thinking...
          </div>
        )}
      </div>

      <form className="chat-preview__input-row" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ask about a standard, product, or certificate..."
          className="chat-preview__input"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onFocus={handleFocus}
        />

        <button type="submit" className="chat-preview__send">
          Send
        </button>
      </form>
      <div ref={chatEndRef} />
    </section>
  );
}

function CopilotResultCard({ result }) {
  return (
    <div className="chat-preview__bubble chat-preview__bubble--bot chat-preview__copilot-card">
      <p className="copilot-card__value">{result.answer}</p>
    </div>
  );
}

export default ChatbotPreview;