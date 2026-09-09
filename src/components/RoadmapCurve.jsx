  import RoadmapStep from './RoadmapStep';

  function RoadmapCurve({ steps, checkedSteps, onToggleStep }) {
    const hasSteps = steps.length > 0;
    const completedCount = checkedSteps.size;

    return (
      <div className="roadmap">
        <div className="roadmap__header">
          <h2 className="roadmap__heading">Your compliance roadmap</h2>
          {hasSteps && (
            <div className="roadmap__progress" role="status">
              <span className="roadmap__progress-text">
                {completedCount} of {steps.length} steps complete
              </span>
              <div className="roadmap__progress-track">
                <div
                  className="roadmap__progress-fill"
                  style={{ width: `${(completedCount / steps.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="roadmap__scroll">
          {hasSteps ? (
            <ul className="roadmap__list">
              {steps.map((step, index) => (
                <RoadmapStep
    key={step.id}
    step={step}
    index={index}
    isChecked={checkedSteps.has(step.id)}
    onToggle={onToggleStep}
    isLast={index === steps.length - 1}
  />
              ))}
            </ul>
          ) : (
            <ul className="roadmap__list roadmap__list--ghost" aria-hidden="true">
              {[1, 2, 3].map((placeholder) => (
                <li key={placeholder} className="roadmap-step roadmap-step--ghost">
                  <span className="roadmap-step__marker roadmap-step__marker--ghost" />
                  <div className="roadmap-step__content">
                    <div className="roadmap-step__ghost-line roadmap-step__ghost-line--title" />
                    <div className="roadmap-step__ghost-line roadmap-step__ghost-line--body" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  export default RoadmapCurve;