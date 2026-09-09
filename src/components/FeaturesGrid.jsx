import { features } from '../data/features';
import FeatureCard from './FeatureCard';

function FeaturesGrid({ isLoggedIn, onLockedClick, onFeatureClick }) {
  return (
    <section className="features" aria-label="Available features">
      <div className="features__grid">
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            id={feature.id}
            title={feature.title}
            description={feature.description}
            comingSoon={feature.comingSoon}
            isLoggedIn={isLoggedIn}
            onLockedClick={onLockedClick}
            onFeatureClick={onFeatureClick}
          />
        ))}
      </div>
    </section>
  );
}

export default FeaturesGrid;