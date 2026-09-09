import { useState } from 'react';
import api from '../api/client';

const categories = ['Food & Beverage', 'Electronics', 'Textiles', 'Toys', 'Chemicals', 'Other'];

function LabMatcher() {
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!category) return;

    setError('');
    setIsLoading(true);

    try {
      const payload = { category };
      if (location.trim()) payload.location = location.trim();

      const response = await api.post('/labs/match', payload);
      setResults(response.data.results);
    } catch (err) {
      setError('Could not fetch labs right now. Please try again.');
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lab-matcher">
      <div className="lab-panel">
        <p className="lab-panel__eyebrow">Smart Laboratory Matcher</p>
        <h2 className="lab-panel__heading">Find a lab for your product</h2>

        <form className="lab-panel__form" onSubmit={handleSubmit}>
          <label htmlFor="lab-category">Product category</label>
          <select
            id="lab-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>Select a category</option>
            {categories.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <label htmlFor="lab-location">Location (optional)</label>
          <input
            id="lab-location"
            type="text"
            placeholder="e.g. Mumbai"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <button type="submit" className="lab-panel__submit" disabled={!category || isLoading}>
            {isLoading ? 'Searching…' : 'Find labs'}
          </button>
        </form>
      </div>

      <div className="lab-results">
        {error && <p className="lab-results__error">{error}</p>}

        {results === null && !error && (
          <p className="lab-results__empty">
            Choose a category and search to see matching labs.
          </p>
        )}

        {results !== null && results.length === 0 && (
          <p className="lab-results__empty">
            No labs found for that category{location ? ` in ${location}` : ''}. Try removing the location filter.
          </p>
        )}

        {results !== null && results.length > 0 && (
          <ul className="lab-results__list">
            {results.map((lab) => (
              <li key={lab.id} className="lab-card">
                <h3 className="lab-card__name">{lab.name}</h3>
                <p className="lab-card__meta">{lab.category} · {lab.location}</p>
                <p className="lab-card__capability">{lab.capability}</p>
                <div className="lab-card__contact">
                  {lab.contact_email && <span>{lab.contact_email}</span>}
                  {lab.contact_phone && <span>{lab.contact_phone}</span>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default LabMatcher;