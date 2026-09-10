import { useState, useRef, useEffect } from 'react';

function Navbar({ onLogin, onAddAccount, isLoggedIn, userEmail, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const initial = userEmail ? userEmail.charAt(0).toUpperCase() : 'U';

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="navbar">
      <div className="navbar__brand">
  <img
    src="/bisync-brand-icon.svg"
    alt="BISync"
    className="navbar__brand-icon"
  />
  <span>BISync</span>
</div>

      <div className="navbar__actions">
        <select
          className="navbar__lang"
          defaultValue="en"
          aria-label="Select language"
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
        </select>

        {isLoggedIn ? (
          <div className="navbar__profile-wrap" ref={menuRef}>
            <button
              className="navbar__profile"
              type="button"
              aria-label="Open user profile"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <span className="navbar__profile-avatar">{initial}</span>
            </button>

            {menuOpen && (
              <div className="navbar__profile-menu">
                <p className="navbar__profile-menu-id">{userEmail}</p>
                <button
  className="navbar__profile-menu-item"
  type="button"
  onClick={() => {
  setMenuOpen(false);
  onAddAccount();
}}
>
  Add account
</button>
                <button
                  className="navbar__profile-menu-item navbar__profile-menu-item--danger"
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onLogout();
                  }}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="navbar__login"
            type="button"
            onClick={onLogin}
          >
            Log in
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;