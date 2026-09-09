import { useState, useEffect } from 'react';
import api from '../api/client';

function ChangeImpact() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ product_name: '', category: '', standard_code: '' });
  const [addError, setAddError] = useState('');

  const [changes, setChanges] = useState([]);
  const [loadError, setLoadError] = useState('');

  const [results, setResults] = useState({});

  

  const loadProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.products);
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  };

    

  const loadAndCheckChanges = async () => {
    try {
      const response = await api.get('/impact/recent');
      const events = response.data.events;
      setChanges(events);

      // Automatically check impact for every change at once
      const checks = await Promise.all(
        events.map((change) =>
          api
            .post('/impact/check', {
              standard_code: change.standard_code,
              change_type: change.change_type,
              description: change.description,
              recommended_action: change.recommended_action,
            })
            .then((res) => [change.id, res.data])
            .catch(() => [change.id, { error: true }])
        )
      );

      setResults(Object.fromEntries(checks));
    }  catch {
  setLoadError('Could not load recent standard changes.');
}
  };
  useEffect(() => {
  const timer = setTimeout(() => {
    loadProducts();
    loadAndCheckChanges();
  }, 0);

  return () => clearTimeout(timer);
}, []);
  const handleAddProduct = async (event) => {
    event.preventDefault();
    setAddError('');

    if (!newProduct.product_name || !newProduct.category || !newProduct.standard_code) return;

    try {
      await api.post('/products', newProduct);
      setNewProduct({ product_name: '', category: '', standard_code: '' });
      loadProducts();
    } catch {
  setAddError('Could not add product. Please try again.');
}
  };

  return (
    <div className="impact">
      <div className="impact-panel">
        <p className="impact-panel__eyebrow">BIS Change Impact Analyzer</p>
        <h2 className="impact-panel__heading">Your tracked products</h2>

        {products.length > 0 ? (
          <ul className="impact-product-list">
            {products.map((p) => (
              <li key={p.id} className="impact-product-list__item">
                <span className="impact-product-list__name">{p.product_name}</span>
                <span className="impact-product-list__code">{p.standard_code}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="impact-panel__empty">No tracked products yet. Add one below.</p>
        )}

        <form className="impact-panel__form" onSubmit={handleAddProduct}>
          <label htmlFor="product-name">Product name</label>
          <input
            id="product-name"
            type="text"
            placeholder="e.g. Water Purifier"
            value={newProduct.product_name}
            onChange={(e) => setNewProduct((prev) => ({ ...prev, product_name: e.target.value }))}
          />

          <label htmlFor="product-category">Category</label>
          <input
            id="product-category"
            type="text"
            placeholder="e.g. Electronics"
            value={newProduct.category}
            onChange={(e) => setNewProduct((prev) => ({ ...prev, category: e.target.value }))}
          />

          <label htmlFor="product-standard">Standard code</label>
          <input
            id="product-standard"
            type="text"
            placeholder="e.g. IS 10500"
            value={newProduct.standard_code}
            onChange={(e) => setNewProduct((prev) => ({ ...prev, standard_code: e.target.value }))}
          />

          {addError && <p className="impact-panel__error">{addError}</p>}

          <button type="submit" className="impact-panel__submit">Add product</button>
        </form>
      </div>

      <div className="impact-results">
        <h2 className="impact-results__heading">Recent standard changes</h2>

        {loadError && <p className="impact-results__error">{loadError}</p>}

        {changes.length === 0 && !loadError && (
          <p className="impact-panel__empty">No recent changes to show.</p>
        )}

        <ul className="impact-feed">
          {changes.map((change) => {
            const result = results[change.id];

            return (
              <li key={change.id} className="impact-feed-item">
                <div className="impact-feed-item__header">
                  <span className="impact-feed-item__code">{change.standard_code}</span>
                  <span className={`impact-feed-item__badge impact-feed-item__badge--${change.change_type}`}>
                    {change.change_type}
                  </span>
                </div>

                <p className="impact-feed-item__description">{change.description}</p>
                <p className="impact-feed-item__action">
                  <strong>Recommended action:</strong> {change.recommended_action}
                </p>

                
                {result && result.error && (
                  <p className="impact-results__error">Could not check impact. Please try again.</p>
                )}

                {result && !result.error && result.affected_products.length > 0 && (
                  <ul className="impact-outcome__list">
                    {result.affected_products.map((p, i) => (
                      <li key={i} className="impact-outcome__item">
                        <span className="impact-outcome__item-name">{p.product_name}</span>
                        <span className="impact-outcome__item-meta">{p.category} · {p.standard_code}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {result && !result.error && result.affected_products.length === 0 && (
                  <p className="impact-outcome__none">None of your tracked products are affected by this change.</p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default ChangeImpact;