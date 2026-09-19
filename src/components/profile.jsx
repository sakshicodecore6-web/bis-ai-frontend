import { useEffect, useState } from 'react';
import api from '../api/client';
import './Profile.css';

export default function Profile() {
  const [profile, setProfile] = useState({
    company_name: '',
    manufacturer_type: '',
    factory_location: '',
    business_type: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get('/profile');
        setProfile({
          company_name: response.data.company_name || '',
          manufacturer_type: response.data.manufacturer_type || '',
          factory_location: response.data.factory_location || '',
          business_type: response.data.business_type || '',
        });
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    setProfile({
      ...profile,
      [event.target.name]: event.target.value,
    });
    setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await api.put('/profile', profile);
      setMessage('Profile saved successfully.');
    } catch (error) {
      console.error('Failed to save profile:', error);
      setMessage('Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <section className="profile-page">
      <div className="profile-page__header">
        <h2>Your BISync Profile</h2>
        <p>
          This information will help BISync personalize your compliance
          journey and other BIS services.
        </p>
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        <label>
          Company Name
          <input
            type="text"
            name="company_name"
            value={profile.company_name}
            onChange={handleChange}
            placeholder="Enter company name"
          />
        </label>

        <label>
          Manufacturer Type
          <select
            name="manufacturer_type"
            value={profile.manufacturer_type}
            onChange={handleChange}
          >
            <option value="">Select manufacturer type</option>
            <option value="Indian Manufacturer">Indian Manufacturer</option>
            <option value="Foreign Manufacturer">Foreign Manufacturer</option>
          </select>
        </label>

        <label>
          Factory Location
          <input
            type="text"
            name="factory_location"
            value={profile.factory_location}
            onChange={handleChange}
            placeholder="City, State"
          />
        </label>

        <label>
          Business Type
          <input
            type="text"
            name="business_type"
            value={profile.business_type}
            onChange={handleChange}
            placeholder="e.g. Electronics Manufacturing"
          />
        </label>

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>

        {message && <p>{message}</p>}
      </form>
    </section>
  );
}