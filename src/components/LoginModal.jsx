import { useState } from 'react';

function LoginModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('login'); // 'login' | 'create'

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <>
      <div className="overlay overlay--visible" onClick={onClose} aria-hidden="true"></div>

      <div className="modal modal--auth" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label="Close login">
          ✕
        </button>

        <h3 className="modal__title">{mode === 'login' ? 'Welcome back' : 'Create account'}</h3>
        <p className="modal__subtitle">
          {mode === 'login' ? 'Log in to track your orders.' : 'Join PizzaFly in seconds.'}
        </p>

        <form className="checkout-form" onSubmit={handleSubmit}>
          <label>
            Email / Phone
            <input type="text" required placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input type="password" required placeholder="••••••••" />
          </label>

          <button type="submit" className="btn btn-primary btn-block">
            {mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>

        <p className="modal__switch">
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <button onClick={() => setMode('create')}>Create Account</button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={() => setMode('login')}>Login</button>
            </>
          )}
        </p>
      </div>
    </>
  );
}

export default LoginModal;
