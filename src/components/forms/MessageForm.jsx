import { messageAPI } from '@/services/apiService';
import { useState } from 'react';

export default function MessageForm({ receiverId, propertyId, onSuccess }) {
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await messageAPI.sendMessage({
        receiver_id: receiverId,
        property_id: propertyId,
        ...formData,
      });
      setFormData({ subject: '', message: '' });
      if (onSuccess) onSuccess();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  // console.log(formData);

  return (
    <form className={StyleSheet.form} onSubmit={handleSubmit}>
      {error && <div className='error-message'>{error}</div>}

      <div className='form-group'>
        <label htmlFor='subject' className='form-label'>
          Subject
        </label>
        <input
          type='text'
          className='form-input'
          name='subject'
          id='subject'
          value={formData.subject}
          onChange={handleChange}
          required
          placeholder='Enter Subject'
        />
      </div>
      <div className='form-group'>
        <label htmlFor='message' className='form-label'>
          Message
        </label>
        <textarea
          name='message'
          id='message'
          placeholder='Enter Message'
          value={formData.message}
          onChange={handleChange}
          className='form-textarea'
          required
        />
      </div>
      <button type='submit' className='btn btn-primary' disabled={loading}>
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
