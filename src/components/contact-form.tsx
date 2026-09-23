"use client";
import { useState } from "react";

type Fields = {
  name: string;
  email: string;
  topic: string;
  message: string;
  website: string;
};
const initial: Fields = {
  name: "",
  email: "",
  topic: "",
  message: "",
  website: "",
};

export function ContactForm() {
  const [values, setValues] = useState<Fields>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">(
    "idle",
  );
  const [feedback, setFeedback] = useState("");
  function update(key: keyof Fields, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (values.name.trim().length < 2)
      next.name = "Enter your name (at least 2 characters).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      next.email = "Enter a valid email address.";
    if (!values.topic) next.topic = "Choose a topic.";
    if (values.message.trim().length < 10)
      next.message = "Share at least 10 characters of context.";
    if (Object.keys(next).length) {
      setErrors(next);
      setFeedback("Please correct the marked fields.");
      setStatus("failed");
      return;
    }
    setStatus("sending");
    setFeedback("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result: { message?: string; errors?: Record<string, string> } =
        await response.json();
      if (!response.ok) {
        setErrors(result.errors || {});
        throw new Error(
          result.message ||
            "Inquiry could not be sent. Please try email instead.",
        );
      }
      setStatus("sent");
      setFeedback(
        "Your inquiry was received. Thank you — I’ll reply by email.",
      );
      setValues(initial);
      setErrors({});
    } catch (error) {
      setStatus("failed");
      setFeedback(
        error instanceof Error
          ? error.message
          : "Inquiry could not be sent. Please try email instead.",
      );
    }
  }
  return (
    <form
      className="contact-form"
      onSubmit={submit}
      noValidate
      aria-label="Contact inquiry"
    >
      <p className="eyebrow">SEND AN INQUIRY</p>
      <p className="form-note">
        All fields except the spam check are required. This form needs the
        inquiry service to be available.
      </p>
      <div className="form-row">
        <div className="field">
          <label htmlFor="contact-name">Name</label>
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            value={values.name}
            maxLength={120}
            required
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            onChange={(e) => update("name", e.target.value)}
          />
          {errors.name && (
            <p className="field-error" id="name-error">
              {errors.name}
            </p>
          )}
        </div>
        <div className="field">
          <label htmlFor="contact-email">Email</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            maxLength={254}
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            onChange={(e) => update("email", e.target.value)}
          />
          {errors.email && (
            <p className="field-error" id="email-error">
              {errors.email}
            </p>
          )}
        </div>
      </div>
      <div className="field">
        <label htmlFor="contact-topic">Topic</label>
        <select
          id="contact-topic"
          name="topic"
          value={values.topic}
          required
          aria-invalid={!!errors.topic}
          aria-describedby={errors.topic ? "topic-error" : undefined}
          onChange={(e) => update("topic", e.target.value)}
        >
          <option value="">Select a topic</option>
          <option value="project">Project or collaboration</option>
          <option value="role">Role or opportunity</option>
          <option value="question">Question about the work</option>
        </select>
        {errors.topic && (
          <p className="field-error" id="topic-error">
            {errors.topic}
          </p>
        )}
      </div>
      <div className="field">
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          name="message"
          value={values.message}
          maxLength={4000}
          required
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          onChange={(e) => update("message", e.target.value)}
        />
        {errors.message && (
          <p className="field-error" id="message-error">
            {errors.message}
          </p>
        )}
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="contact-website">Leave this blank</label>
        <input
          id="contact-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => update("website", e.target.value)}
        />
      </div>
      {feedback && (
        <p
          className="form-status"
          role={status === "failed" ? "alert" : "status"}
        >
          {feedback}
        </p>
      )}
      <button
        className="button button-primary"
        type="submit"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending…" : "Send inquiry"}{" "}
        <span aria-hidden="true">↗</span>
      </button>
      <p className="form-note" style={{ marginTop: 18 }}>
        By sending, you agree to the handling described in the{" "}
        <a href="/privacy" style={{ textDecoration: "underline" }}>
          privacy notice
        </a>
        .
      </p>
    </form>
  );
}
