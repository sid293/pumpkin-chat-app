import { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem('userData', JSON.stringify(formData));
    window.location.href = '/chat';
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1 className="auth-logo">📱chat</h1>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
            style={{ backgroundColor: '#ffffff', color: '#000000' }}
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            style={{ backgroundColor: '#ffffff', color: '#000000' }}
          />
          <button type="submit" className="auth-button">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;