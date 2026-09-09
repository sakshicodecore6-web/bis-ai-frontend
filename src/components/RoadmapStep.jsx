function RoadmapStep({ step, index, isChecked, onToggle, isLast }) {
  const isEven = index % 2 === 0;

  return (
    <li className={`roadmap-step${isChecked ? ' roadmap-step--done' : ''}`}>
      <div className="roadmap-step__rail">
        <button
          type="button"
          className={`roadmap-step__marker${isEven ? ' roadmap-step__marker--left' : ' roadmap-step__marker--right'}`}
          onClick={() => onToggle(step.id)}
          aria-pressed={isChecked}
          aria-label={`Mark "${step.title}" as ${isChecked ? 'not done' : 'done'}`}
        >
          {isChecked ? '✓' : index + 1}
        </button>

        {!isLast && (
          <svg
  className={`roadmap-step__connector${isEven ? '' : ' roadmap-step__connector--flip'}`}
  viewBox="0 0 80 100"
  preserveAspectRatio="none"
  aria-hidden="true"
>
  <path d="M40,0 C75,30 5,70 40,100" />
</svg>
        )}
      </div>

      <div className="roadmap-step__content">
        <h3 className="roadmap-step__title">{step.title}</h3>
        <p className="roadmap-step__description">{step.description}</p>
      </div>
    </li>
  );
}

export default RoadmapStep;