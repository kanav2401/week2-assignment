
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".nav");

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navigation.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      });
    });

    document.addEventListener("click", (event) => {
      if (
        !navigation.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        navigation.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      }
    });
  }

  document.querySelectorAll(".current-year").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  const contactForm = document.querySelector("#contact-form");

  if (!contactForm) return;

  const fields = {
    name: document.querySelector("#name"),
    email: document.querySelector("#email"),
    subject: document.querySelector("#subject"),
    message: document.querySelector("#message"),
    consent: document.querySelector("#consent")
  };

  const errors = {
    name: document.querySelector("#name-error"),
    email: document.querySelector("#email-error"),
    subject: document.querySelector("#subject-error"),
    message: document.querySelector("#message-error"),
    consent: document.querySelector("#consent-error")
  };

  const status = document.querySelector("#form-status");

  function showError(fieldName, message) {
    const field = fields[fieldName];
    const error = errors[fieldName];

    if (error) error.textContent = message;

    if (field && fieldName !== "consent") {
      field.classList.toggle("invalid", Boolean(message));
      field.setAttribute("aria-invalid", String(Boolean(message)));
    }
  }

  function validateForm() {
    let isValid = true;

    Object.keys(errors).forEach((key) => showError(key, ""));

    const name = fields.name.value.trim();
    const email = fields.email.value.trim();
    const subject = fields.subject.value;
    const message = fields.message.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name.length < 2) {
      showError("name", "Please enter at least 2 characters.");
      isValid = false;
    }

    if (!emailPattern.test(email)) {
      showError("email", "Please enter a valid email address.");
      isValid = false;
    }

    if (!subject) {
      showError("subject", "Please select a topic.");
      isValid = false;
    }

    if (message.length < 10) {
      showError("message", "Please enter at least 10 characters.");
      isValid = false;
    }

    if (!fields.consent.checked) {
      showError("consent", "Please agree before submitting.");
      isValid = false;
    }

    return isValid;
  }

  Object.entries(fields).forEach(([key, field]) => {
    const eventName = key === "consent" || key === "subject" ? "change" : "input";

    field.addEventListener(eventName, () => {
      showError(key, "");

      if (status) {
        status.textContent = "";
        status.className = "form-status";
      }
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateForm()) {
      status.textContent = "Please correct the highlighted fields.";
      status.className = "form-status error";

      const firstInvalidField = contactForm.querySelector(
        ".invalid, input[type='checkbox']:invalid"
      );

      if (firstInvalidField) firstInvalidField.focus();

      return;
    }

    status.textContent =
      "Your details passed validation. This demo form does not send messages.";
    status.className = "form-status success";

    contactForm.reset();

    Object.keys(errors).forEach((key) => showError(key, ""));
  });
});
