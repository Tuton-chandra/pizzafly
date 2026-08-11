import { useState } from "react";
import {
  addSupportMessage,
} from "../utils/supportStorage";

import "./NeedHelp.css";

function NeedHelp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [sending, setSending] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");


  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    if (
      !form.name.trim() ||
      !form.message.trim()
    ) {
      setError(
        "Please enter your name and message."
      );

      return;
    }

    setSending(true);

    try {
      addSupportMessage({
        ...form,
        channel: "Website",
      });

      setSuccess(
        "Your message has been sent successfully. Our support team will contact you soon."
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error(err);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setSending(false);
    }
  };


  return (
    <section className="need-help-section">

      <div className="need-help-container">

        <div className="need-help-header">

          <span className="need-help-label">
            CUSTOMER SUPPORT
          </span>

          <h2>
            Need Help?
          </h2>

          <p>
            Have a question about your
            order, delivery or anything
            else? Send us a message.
          </p>

        </div>


        <div className="need-help-grid">

          {/* LEFT */}

          <div className="support-contact-card">

            <h3>
              We're here to help
            </h3>

            <p>
              Contact PizzaFly support
              through your preferred
              channel.
            </p>


            <a
              href="tel:+8801XXXXXXXXX"
              className="support-contact-item"
            >
              <span>📞</span>

              <div>
                <strong>
                  Call Support
                </strong>

                <small>
                  +880 1XXXXXXXXX
                </small>
              </div>
            </a>


            <a
              href="https://wa.me/8801XXXXXXXXX"
              target="_blank"
              rel="noreferrer"
              className="support-contact-item whatsapp"
            >
              <span>💬</span>

              <div>
                <strong>
                  WhatsApp
                </strong>

                <small>
                  Chat with our support team
                </small>
              </div>
            </a>


            <a
              href="mailto:support@pizzafly.com"
              className="support-contact-item"
            >
              <span>✉️</span>

              <div>
                <strong>
                  Email Support
                </strong>

                <small>
                  support@pizzafly.com
                </small>
              </div>
            </a>

          </div>


          {/* FORM */}

          <form
            className="need-help-form"
            onSubmit={handleSubmit}
          >

            <div className="support-form-row">

              <div>
                <label>
                  Your Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>


              <div>
                <label>
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="01XXXXXXXXX"
                />
              </div>

            </div>


            <div className="support-form-row">

              <div>
                <label>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
              </div>


              <div>
                <label>
                  Subject
                </label>

                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                >

                  <option value="">
                    Select a topic
                  </option>

                  <option value="Order Issue">
                    Order Issue
                  </option>

                  <option value="Delivery">
                    Delivery
                  </option>

                  <option value="Payment">
                    Payment
                  </option>

                  <option value="Food Quality">
                    Food Quality
                  </option>

                  <option value="General Inquiry">
                    General Inquiry
                  </option>

                </select>

              </div>

            </div>


            <div className="support-form-field">

              <label>
                Message
              </label>

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="How can we help you?"
                rows="5"
                required
              />

            </div>


            {error && (
              <div className="support-error">
                {error}
              </div>
            )}


            {success && (
              <div className="support-success">
                {success}
              </div>
            )}


            <button
              type="submit"
              disabled={sending}
            >
              {sending
                ? "Sending..."
                : "Send Message →"}
            </button>

          </form>

        </div>

      </div>

    </section>
  );
}

export default NeedHelp;