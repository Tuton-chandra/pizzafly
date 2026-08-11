import { useState } from "react";
import "./Footer.css";

function Footer() {
  const [showSupport, setShowSupport] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    orderId: "",
    type: "General Query",
    message: "",
  });

  const currentYear = new Date().getFullYear();

  // =========================================================
  // SUPPORT MESSAGE STORAGE
  // Later this function can be replaced with Firebase,
  // Supabase, REST API or WebSocket implementation.
  // =========================================================

  const saveSupportMessage = (message) => {
    try {
      const existingMessages = JSON.parse(
        localStorage.getItem("pizzafly_support_messages") || "[]"
      );

      const newMessage = {
        id: `SUP-${Date.now()}`,
        ...message,
        status: "New",
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(
        "pizzafly_support_messages",
        JSON.stringify([newMessage, ...existingMessages])
      );

      return newMessage;
    } catch (error) {
      console.error("Support message save failed:", error);
      return null;
    }
  };

  // =========================================================
  // FORM HANDLER
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // SUBMIT SUPPORT QUERY
  // =========================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!formData.phone.trim()) {
      alert("Please enter your phone number.");
      return;
    }

    if (!formData.message.trim()) {
      alert("Please enter your message.");
      return;
    }

    const savedMessage = saveSupportMessage(formData);

    if (!savedMessage) {
      alert("Unable to send your message. Please try again.");
      return;
    }

    alert(
      "Your message has been sent successfully. Our support team will contact you soon."
    );

    setFormData({
      name: "",
      phone: "",
      email: "",
      orderId: "",
      type: "General Query",
      message: "",
    });

    setShowSupport(false);

    // Future:
    // Firebase / Supabase / WebSocket event can be triggered here.
  };

  // =========================================================
  // SOCIAL LINKS
  // Replace these URLs with your actual business pages.
  // =========================================================

  const socialLinks = {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    messenger: "https://m.me/",
    whatsapp: "https://wa.me/8801600000000",
  };

  return (
    <>
      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="pizzafly-footer">
        <div className="footer-container">

          {/* =================================================
              BRAND
          ================================================= */}

          <div className="footer-brand">

            <a href="/" className="footer-logo">
              <span className="footer-logo-icon">🍕</span>

              <span>
                Pizza<span>Fly</span>
              </span>
            </a>

            <p className="footer-description">
              Freshly made pizzas, delicious meals and fast delivery.
              Order your favorite food and enjoy it at your doorstep.
            </p>

            {/* Social Media */}

            <div className="footer-socials">

              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link facebook"
                aria-label="Facebook"
                title="Facebook"
              >
                f
              </a>

              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link instagram"
                aria-label="Instagram"
                title="Instagram"
              >
                ◎
              </a>

              <a
                href={socialLinks.messenger}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link messenger"
                aria-label="Messenger"
                title="Messenger"
              >
                ⚡
              </a>

              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link whatsapp"
                aria-label="WhatsApp"
                title="WhatsApp"
              >
                ☎
              </a>

            </div>

          </div>

          {/* =================================================
              QUICK LINKS
          ================================================= */}

          <div className="footer-column">

            <h3>Quick Links</h3>

            <ul>

              <li>
                <a href="/">Home</a>
              </li>

              <li>
                <a href="/menu">Our Menu</a>
              </li>

              <li>
                <a href="/orders">Track Order</a>
              </li>

              <li>
                <a href="/about">About Us</a>
              </li>

              <li>
                <a href="/contact">Contact Us</a>
              </li>

            </ul>

          </div>

          {/* =================================================
              CUSTOMER SUPPORT
          ================================================= */}

          <div className="footer-column">

            <h3>Customer Support</h3>

            <ul>

              <li>
                <button
                  type="button"
                  className="footer-action-link"
                  onClick={() => setShowSupport(true)}
                >
                  💬 Need Help?
                </button>
              </li>

              <li>
                <a href="tel:+8801600000000">
                  📞 Call Support
                </a>
              </li>

              <li>
                <a
                  href={socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🟢 WhatsApp Support
                </a>
              </li>

              <li>
                <a
                  href={socialLinks.messenger}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🔵 Messenger
                </a>
              </li>

              <li>
                <a href="mailto:support@pizzafly.com">
                  ✉️ Email Support
                </a>
              </li>

            </ul>

          </div>

          {/* =================================================
              CONTACT
          ================================================= */}

          <div className="footer-column footer-contact">

            <h3>Contact Us</h3>

            <div className="contact-item">

              <span className="contact-icon">
                📍
              </span>

              <div>
                <strong>Restaurant</strong>

                <p>
                  Dhaka, Bangladesh
                </p>
              </div>

            </div>

            <div className="contact-item">

              <span className="contact-icon">
                📞
              </span>

              <div>
                <strong>Phone</strong>

                <a href="tel:+8801600000000">
                  +880 1600-000000
                </a>
              </div>

            </div>

            <div className="contact-item">

              <span className="contact-icon">
                ✉️
              </span>

              <div>
                <strong>Email</strong>

                <a href="mailto:support@pizzafly.com">
                  support@pizzafly.com
                </a>
              </div>

            </div>

          </div>

        </div>

        {/* ===================================================
            BUSINESS INFO
        =================================================== */}

        <div className="footer-business-bar">

          <div className="business-info">

            <span>🕐</span>

            <div>
              <strong>Opening Hours</strong>
              <small>
                Everyday · 10:00 AM – 11:00 PM
              </small>
            </div>

          </div>

          <div className="business-info">

            <span>🚚</span>

            <div>
              <strong>Fast Delivery</strong>
              <small>
                Fresh food delivered to your door
              </small>
            </div>

          </div>

          <div className="business-info">

            <span>💳</span>

            <div>
              <strong>Secure Payment</strong>
              <small>
                Cash & online payment available
              </small>
            </div>

          </div>

        </div>

        {/* ===================================================
            BOTTOM FOOTER
        =================================================== */}

        <div className="footer-bottom">

          <div>
            © {currentYear} <strong>PizzaFly</strong>.
            All rights reserved.
          </div>

          <div className="footer-legal">

            <a href="/privacy">
              Privacy Policy
            </a>

            <span>•</span>

            <a href="/terms">
              Terms & Conditions
            </a>

            <span>•</span>

            <a href="/refund">
              Refund Policy
            </a>

          </div>

          <div className="footer-made">
            Made with ❤️ for food lovers
          </div>

        </div>

      </footer>

      {/* =====================================================
          SUPPORT MODAL
      ===================================================== */}

      {showSupport && (

        <div
          className="support-modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget
            ) {
              setShowSupport(false);
            }
          }}
        >

          <div className="support-modal">

            <div className="support-modal-header">

              <div>

                <span className="support-eyebrow">
                  CUSTOMER SUPPORT
                </span>

                <h2>
                  How can we help?
                </h2>

                <p>
                  Send us your question and our
                  support team will get back to you.
                </p>

              </div>

              <button
                type="button"
                className="support-close"
                onClick={() => setShowSupport(false)}
                aria-label="Close"
              >
                ×
              </button>

            </div>

            <form
              className="support-form"
              onSubmit={handleSubmit}
            >

              <div className="support-form-grid">

                <div className="support-field">

                  <label>
                    Your Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    autoComplete="name"
                  />

                </div>

                <div className="support-field">

                  <label>
                    Phone Number *
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    autoComplete="tel"
                  />

                </div>

                <div className="support-field">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    autoComplete="email"
                  />

                </div>

                <div className="support-field">

                  <label>
                    Order ID
                  </label>

                  <input
                    type="text"
                    name="orderId"
                    value={formData.orderId}
                    onChange={handleChange}
                    placeholder="e.g. PF-10025"
                  />

                </div>

              </div>

              <div className="support-field">

                <label>
                  Query Type
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >

                  <option>
                    General Query
                  </option>

                  <option>
                    Order Problem
                  </option>

                  <option>
                    Payment Problem
                  </option>

                  <option>
                    Delivery Problem
                  </option>

                  <option>
                    Food / Item Problem
                  </option>

                  <option>
                    Refund Request
                  </option>

                  <option>
                    Other
                  </option>

                </select>

              </div>

              <div className="support-field">

                <label>
                  Message *
                </label>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help..."
                  rows="5"
                />

              </div>

              <div className="support-form-actions">

                <button
                  type="button"
                  className="support-cancel"
                  onClick={() => setShowSupport(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="support-submit"
                >
                  Send Message →
                </button>

              </div>

            </form>

            <div className="support-direct">

              <span>
                Need immediate help?
              </span>

              <a href="tel:+8801610318765">
                📞 Call
              </a>

              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                🟢 WhatsApp
              </a>

              <a
                href={socialLinks.messenger}
                target="_blank"
                rel="noopener noreferrer"
              >
                🔵 Messenger
              </a>

            </div>

          </div>

        </div>

      )}

    </>
  );
}

export default Footer;