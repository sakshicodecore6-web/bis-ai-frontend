const categories = ['Food & Beverage', 'Electronics', 'Textiles', 'Toys', 'Chemicals', 'Other'];
const stages = ['Idea', 'Prototype ready', 'Already selling'];
const markets = ['Domestic only', 'Export'];

function PlannerInputPanel({
  inputs,
  onChange,
  onSubmit,
  onEdit,
  isReadOnly,
  allFieldsFilled,
  showEditButton,
}) {
  return (
    <div className="planner-panel">
      <p className="planner-panel__eyebrow">Compliance Journey Planner</p>
      <h2 className="planner-panel__heading">Tell us about your product</h2>

      <form className="planner-panel__form" onSubmit={onSubmit}>
        <label htmlFor="productName">Product / service name</label>
        <input
          id="productName"
          type="text"
          placeholder="e.g. Packaged drinking water"
          value={inputs.productName}
          onChange={(e) => onChange('productName', e.target.value)}
          disabled={isReadOnly}
          required
        />

        <label htmlFor="category">Product category</label>
        <select
          id="category"
          value={inputs.category}
          onChange={(e) => onChange('category', e.target.value)}
          disabled={isReadOnly}
          required
        >
          <option value="" disabled>Select a category</option>
          {categories.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <label htmlFor="stage">Business stage</label>
        <select
          id="stage"
          value={inputs.stage}
          onChange={(e) => onChange('stage', e.target.value)}
          disabled={isReadOnly}
          required
        >
          <option value="" disabled>Select a stage</option>
          {stages.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <label htmlFor="market">Target market</label>
        <select
          id="market"
          value={inputs.market}
          onChange={(e) => onChange('market', e.target.value)}
          disabled={isReadOnly}
          required
        >
          <option value="" disabled>Select a market</option>
          {markets.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        {showEditButton ? (
          <button type="button" className="planner-panel__edit" onClick={onEdit}>
            Edit details
          </button>
        ) : (
          <button
            type="submit"
            className="planner-panel__submit"
            disabled={!allFieldsFilled}
          >
            {isReadOnly ? 'Update roadmap' : 'Generate Roadmap'}
          </button>
        )}
      </form>
    </div>
  );
}

export default PlannerInputPanel;