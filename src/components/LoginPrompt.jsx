import { useEffect, useRef } from 'react';

function LoginPrompt({ x, y, onDismiss, onLogin }) {
  const popoverRef = useRef(null);

  // Dismiss on click outside, or on Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onDismiss();
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') onDismiss();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onDismiss]);

  return (
    <div
      ref={popoverRef}
      className="login-prompt"
      style={{ left: x, top: y }}
      role="status"
    >
      <p className="login-prompt__text">Log in to continue</p>
      <button
  className="login-prompt__button"
  type="button"
  onClick={onLogin}
>
  Log in
</button>
    </div>
  );
}

export default LoginPrompt;