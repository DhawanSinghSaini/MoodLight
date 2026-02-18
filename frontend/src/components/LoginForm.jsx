import H1 from './H1';
import H3 from './H3';
import Button from './Button';
import '../styles/login-form.css';
import { useState } from 'react';

export default function LoginForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Map username input to email for backend
    const formData = {
      email: e.target.username.value.trim(),
      password: e.target.password.value,
    };

    // ✅ Client-side validation
    if (!formData.email || !formData.password) {
      setError("Username (Email) and Password are required.");
      return;
    }

    try {
      const response = await fetch("https://moodlight-3gm2.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("✅ Login successful! Redirecting...");
        console.log("Login success:", data);

        // Store JWT token
        localStorage.setItem("token", data.token);

        // Redirect to /app after 3 seconds
        setTimeout(() => {
          window.location.href = "/app";
        }, 3000);
      } else {
        setError(data.error || "Login failed.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      {/* App title at the top */}
      <H3 className="login-title">MoodLight</H3>

      {/* Section heading */}
      <H1>Log In</H1>

      <label htmlFor="username" className="login-label">User Name</label>
      <input type="text" id="username" name="username" className="login-input" required />

      <label htmlFor="password" className="login-label">Password</label>
      <input type="password" id="password" name="password" className="login-input" required />

      <Button type="submit">Submit</Button>

      <p className="login-footer">
        Don’t have an account? <a href="https://moodlights.onrender.com/signup">Sign up</a> here!
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </form>
  );
}

