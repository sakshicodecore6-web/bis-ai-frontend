function FeatureCard({ id, title, description, comingSoon, isLoggedIn, onLockedClick, onFeatureClick }) {
  const handleClick = (event) => {
    if (comingSoon) return; // nothing to open yet

    if (!isLoggedIn) {
      onLockedClick(event);
      return;
    }

    onFeatureClick(id);
  };

  return (
    <button
      className={`feature-card${comingSoon ? ' feature-card--soon' : ''}`}
      onClick={handleClick}
      type="button"
    >
      {comingSoon && <span className="feature-card__badge">Soon</span>}
      <h3 className="feature-card__title">{title}</h3>
      <p className="feature-card__description">{description}</p>
    </button>
  );
}

export default FeatureCard;