function ChatHistorySidebar({ messages, onClear }) {
  const exchanges = [];
  for (let i = 0; i < messages.length; i++) {
    if (messages[i].type === 'user') {
      const next = messages[i + 1];
      exchanges.push({
        question: messages[i].text,
        answered: next && next.type !== 'user',
      });
    }
  }

  return (
    <aside className="chat-history-sidebar">
      <div className="chat-history-sidebar__header">
        <span className="chat-history-sidebar__heading">Chat History</span>
        {exchanges.length > 0 && (
          <button
            type="button"
            className="chat-history-sidebar__clear"
            onClick={onClear}
          >
            Clear
          </button>
        )}
      </div>

      <div className="chat-history-sidebar__list">
        {exchanges.length === 0 ? (
          <p className="chat-history-sidebar__empty">
            Your questions from this session will appear here.
          </p>
        ) : (
          exchanges.map((item, index) => (
            <div key={index} className="chat-history-sidebar__item">
              <p className="chat-history-sidebar__question">{item.question}</p>
              {!item.answered && (
                <span className="chat-history-sidebar__pending">Pending...</span>
              )}
            </div>
          ))
        )}
      </div>

      <button className="chat-history-sidebar__faq" type="button">
        📖 FAQ
      </button>
    </aside>
  );
}

export default ChatHistorySidebar;