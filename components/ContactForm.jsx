"use client";

import { useState } from "react";
import "./styles/ContactForm.css";

// TODO: Paste your Web3Forms Access Key here between the quotes
const ACCESS_KEY = "a87b88c6-ad28-48f6-8100-b13aea6bc9ad";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (ACCESS_KEY === "YOUR_ACCESS_KEY_HERE") {
      setStatus("Please configure your Web3Forms Access Key first.");
      setTimeout(() => setStatus(""), 5000);
      return;
    }

    setIsSubmitting(true);
    setStatus("");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          name: formData.name,
          email: formData.email,
          message: formData.message
        })
      });

      const result = await response.json();
      if (result.success) {
        setStatus("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus(result.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      setStatus("Network error. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatus(""), 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form glass-card contact-form-container">
      <div className="contact-form-grid">
        <label className="contact-label">
          <span>Name</span>
          <input
            required
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            className="input-glass text-sm outline-none"
          />
        </label>
        <label className="contact-label">
          <span>Email</span>
          <input
            required
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="input-glass text-sm outline-none"
          />
        </label>
      </div>
      <label className="contact-label">
        <span>Message</span>
        <textarea
          required
          rows="5"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Let's collaborate on something special..."
          className="input-glass text-sm outline-none"
        />
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-solid-pill inline-flex items-center justify-center text-xs font-bold uppercase tracking-widest disabled:pointer-events-none disabled:opacity-50"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
      {status && <p className="contact-status-text">{status}</p>}
    </form>
  );
}
