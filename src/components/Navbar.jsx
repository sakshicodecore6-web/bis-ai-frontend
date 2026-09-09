function Navbar({ onLogin, isLoggedIn }) {
  return (
    <header className="navbar">
      <div className="navbar__brand">BIS-AI</div>

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
  <button
    className="navbar__profile"
    type="button"
    aria-label="Open user profile"
  >
    <span className="navbar__profile-avatar">U</span>
    <span className="navbar__profile-name">User</span>
  </button>
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