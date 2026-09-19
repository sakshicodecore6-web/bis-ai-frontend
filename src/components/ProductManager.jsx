import { useEffect, useState } from "react";
import api from "../api/client";
import "./ProductManager.css";

function ProductManager() {
  const [products, setProducts] = useState([]);
  
  // Discovery State
  const [searchQuery, setSearchQuery] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const loadProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data.products);
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDiscover = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      showMessage("Please enter an IS number to search.", "error");
      return;
    }

    try {
      setLoading(true);
      setCandidates([]);
      setSelectedCandidate(null);
      showMessage("");

      const response = await api.get(`/products/discover?query=${encodeURIComponent(searchQuery)}`);
      
      if (response.data.candidates.length === 0) {
        showMessage("No active standards found for this query in BIS LIMS.", "error");
      } else {
        setCandidates(response.data.candidates);
      }
    } catch (error) {
      showMessage(
        error.response?.data?.detail || "Could not connect to official BIS registry.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async () => {
    if (!selectedCandidate) return;

    try {
      setLoading(true);
      showMessage("");

      const response = await api.post("/products", {
        product_name: selectedCandidate.product,
        category: selectedCandidate.category || "General",
        standard_code: selectedCandidate.indian_standard,
      });

      await api.post(`/products/${response.data.id}/verify-bis`);

      showMessage(`✓ ${selectedCandidate.indian_standard} added to your registry.`, "success");
      setSearchQuery("");
      setCandidates([]);
      setSelectedCandidate(null);
      await loadProducts();
    } catch (error) {
      showMessage(
        error.response?.data?.detail || "Failed to save product to registry.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to remove this product from your registry?")) return;

    try {
      await api.delete(`/products/${productId}`);
      showMessage("Product removed successfully.", "success");
      await loadProducts();
    } catch (error) {
      showMessage("Failed to delete product.", "error");
    }
  };

  const showMessage = (msg, type = "info") => {
    setMessage(msg);
    setMessageType(type);
  };

   return (
    <div className="product-manager">
      <div className="product-manager__header">
        <p className="product-manager__eyebrow">BISync Central Registry</p>
        <h2 className="product-manager__title">My Products</h2>
        <p className="product-manager__description">
          Discover your applicable Indian Standard from official BIS records and add it to your compliance registry.
        </p>
      </div>

      <div className="product-manager__form-card">
        <form className="product-manager__form" onSubmit={handleDiscover}>
          <div className="product-manager__field">
            <label htmlFor="search-query">What product do you manufacture?</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                id="search-query"
                type="text"
                style={{ flex: 1 }}
                placeholder="e.g., LED Bulb, Appliances, or Battery"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="product-manager__submit"
                type="submit"
                disabled={loading}
                style={{ width: 'auto', padding: '0 20px' }}
              >
                {loading && candidates.length === 0 ? "Searching..." : "Discover Standards"}
              </button>
            </div>
          </div>
        </form>

        {candidates.length > 0 && (
          <div className="product-manager__candidates" style={{ marginTop: '20px' }}>
            <h4 style={{ marginBottom: '10px', fontSize: '0.9rem', color: '#555' }}>
              Select the applicable standard from BIS LIMS:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {candidates.map((candidate, index) => (
                <label 
                  key={index} 
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', 
                    border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer',
                    background: selectedCandidate === candidate ? '#f0f7ff' : '#fff',
                    borderColor: selectedCandidate === candidate ? '#0066cc' : '#ddd'
                  }}
                >
                  <input 
                    type="radio" 
                    name="candidate_standard" 
                    checked={selectedCandidate === candidate}
                    onChange={() => setSelectedCandidate(candidate)}
                    style={{ marginTop: '4px' }}
                  />
                  <div>
                    <div style={{ fontWeight: '600', color: '#111' }}>{candidate.indian_standard}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '2px' }}>{candidate.product}</div>
                  </div>
                </label>
              ))}
            </div>
            
            <button
              className="product-manager__submit"
              onClick={handleSaveProduct}
              disabled={loading || !selectedCandidate}
              style={{ marginTop: '20px', backgroundColor: '#0066cc' }}
            >
              {loading && selectedCandidate ? "Adding to Registry..." : "Add Selected Product"}
            </button>
          </div>
        )}

        {message && (
          <p className="product-manager__message" style={{ 
            color: messageType === 'error' ? '#d32f2f' : messageType === 'success' ? '#2e7d32' : '#555' 
          }}>
            {message}
          </p>
        )}
      </div>

      <section className="product-manager__list">
        <h3 className="product-manager__list-title">Saved Products</h3>

        {products.length === 0 ? (
          <div className="product-manager__empty">
            Your registry is empty. Discover and add a product above.
          </div>
        ) : (
          <div className="product-manager__products">
            {products.map((product) => (
              <div className="product-manager__product" key={product.id} style={{ position: 'relative' }}>
                <button 
                  onClick={() => handleDelete(product.id)}
                  style={{
                    position: 'absolute', top: '12px', right: '12px',
                    background: 'none', border: 'none', color: '#d32f2f',
                    cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500'
                  }}
                >
                  Delete
                </button>
                
                <h4 className="product-manager__product-name">
                  {product.is_title || product.product_name}
                </h4>

                <p className="product-manager__product-category" style={{ marginBottom: '4px' }}>
                  {product.indian_standard || product.standard_code}
                </p>

                {product.last_verified && (
                  <div style={{ fontSize: '0.75rem', color: '#2e7d32', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '1rem' }}>✓</span> Verified with official BIS data
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ProductManager;