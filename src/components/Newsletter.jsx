import { useState, useEffect } from 'react';
import api from '../api/client';

function Newsletter() {
  const [view, setView] = useState('all'); // 'all' | 'subscribed'
  const [posts, setPosts] = useState([]);
  const [subscribedCategories, setSubscribedCategories] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadFeed = async (targetView) => {
  await Promise.resolve();

  setIsLoading(true);
  setLoadError('');
  try {
      const endpoint = targetView === 'subscribed' ? '/newsletter/subscribed' : '/newsletter/feed';
      const response = await api.get(endpoint);
      setPosts(response.data.posts);
    } catch {
  setLoadError('Could not load updates. Please try again.');
    }finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
  let cancelled = false;

  const fetchFeed = async () => {
    setIsLoading(true);
    setLoadError('');

    try {
      const endpoint =
        view === 'subscribed' ? '/newsletter/subscribed' : '/newsletter/feed';

      const response = await api.get(endpoint);

      if (!cancelled) {
        setPosts(response.data.posts);
      }
    } catch {
      if (!cancelled) {
        setLoadError('Could not load updates. Please try again.');
      }
    } finally {
      if (!cancelled) {
        setIsLoading(false);
      }
    }
  };

  fetchFeed();

  return () => {
    cancelled = true;
  };
}, [view]);

  const handleToggleSubscription = async (category) => {
    // Optimistic update
    setSubscribedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );

    try {
      const response = await api.post('/newsletter/subscribe', { category });
      setSubscribedCategories(response.data.subscribed_categories);
      // If we're viewing "subscribed" and just unsubscribed, refresh the feed
      if (view === 'subscribed') {
        loadFeed('subscribed');
      }
    } catch (err) {
      console.error('Failed to update subscription:', err);
    }
  };

  return (
    <div className="newsletter">
      <div className="newsletter-header">
        <p className="newsletter-header__eyebrow">BIS Daily Newsletter</p>
        <h2 className="newsletter-header__heading">Standard updates, digested</h2>

        <div className="newsletter-tabs">
          <button
            type="button"
            className={`newsletter-tabs__tab${view === 'all' ? ' newsletter-tabs__tab--active' : ''}`}
            onClick={() => setView('all')}
          >
            All updates
          </button>
          <button
            type="button"
            className={`newsletter-tabs__tab${view === 'subscribed' ? ' newsletter-tabs__tab--active' : ''}`}
            onClick={() => setView('subscribed')}
          >
            My subscriptions
          </button>
        </div>
      </div>

      <div className="newsletter-feed">
        {loadError && <p className="newsletter-feed__error">{loadError}</p>}

        {!loadError && !isLoading && posts.length === 0 && (
          <p className="newsletter-feed__empty">
            {view === 'subscribed'
              ? "You haven't subscribed to any categories yet. Switch to \"All updates\" to find some."
              : 'No updates yet.'}
          </p>
        )}

        <ul className="newsletter-feed__list">
          {posts.map((post) => {
            const isSubscribed = subscribedCategories.includes(post.category);
            return (
              <li key={post.id} className="newsletter-card">
                <div className="newsletter-card__header">
                  <span className="newsletter-card__category">{post.category}</span>
                  <button
                    type="button"
                    className={`newsletter-card__subscribe${isSubscribed ? ' newsletter-card__subscribe--active' : ''}`}
                    onClick={() => handleToggleSubscription(post.category)}
                  >
                    {isSubscribed ? 'Subscribed' : 'Subscribe'}
                  </button>
                </div>
                <h3 className="newsletter-card__title">{post.title}</h3>
                <p className="newsletter-card__summary">{post.summary}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Newsletter;