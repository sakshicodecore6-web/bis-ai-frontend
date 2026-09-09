import heroImage from '../assets/bis-hero.png';

function Hero() {
  return (
    <div className="hero">
      <img
        src={heroImage}
        alt="A black hardcover book embossed with the BIS — Bureau of Indian Standards logo in gold, resting on a stone surface under dappled natural light"
        className="hero__image"
      />

      <div className="hero__branding">
        <div className="hero__brand-name">BIS–AI</div>
        <div className="hero__brand-subtitle">
          INTELLIGENT STANDARD<br />
          ASSISTANT
        </div>
      </div>

      <p className="hero__credit">Bureau of Indian Standards</p>
    </div>
  );
}

export default Hero;