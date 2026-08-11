
import { useState } from "react";
import "./AdminLogin.css";

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Demo login
    if (
      email === "admin@pizzafly.com" &&
      password === "123456"
    ) {
      setError("");
      onLogin();
    } else {
      setError(
        "Invalid email or password. Please try again."
      );
    }
  };

  return (
    <div className="admin-login-page">

      <div className="login-background"></div>

      <div className="admin-login-card">

        <div className="login-logo">
          <div className="login-logo-icon">🍕</div>

          <h1>
            Pizza<span>Fly</span>
          </h1>
        </div>

        <div className="login-heading">
          <h2>Welcome Back</h2>
          <p>
            Sign in to access your PizzaFly Admin Panel.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Email Address</label>

            <div className="login-input">
              <span>✉️</span>

              <input
                type="email"
                placeholder="admin@pizzafly.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>
          </div>


          <div className="input-group">
            <label>Password</label>

            <div className="login-input">
              <span>🔒</span>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

              <button
                type="button"
                className="show-password"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>


          <div className="login-options">

            <label>
              <input type="checkbox" />
              Remember me
            </label>

            <button
              type="button"
              className="forgot-password"
            >
              Forgot Password?
            </button>

          </div>


          {error && (
            <div className="login-error">
              ⚠️ {error}
            </div>
          )}


          <button
            type="submit"
            className="admin-login-button"
          >
            Sign In to Dashboard
            <span>→</span>
          </button>

        </form>


        <div className="demo-login">
          <span>Demo Login</span>

          <p>
            Email:
            <strong> admin@pizzafly.com</strong>
          </p>

          <p>
            Password:
            <strong> 123456</strong>
          </p>
        </div>


        <div className="back-home">
          <button
            onClick={() =>
              (window.location.href = "/")
            }
          >
            ← Back to PizzaFly
          </button>
        </div>

      </div>


      <div className="login-footer">
        © 2026 PizzaFly · Admin Portal
      </div>

    </div>
  );
}

export default AdminLogin;
