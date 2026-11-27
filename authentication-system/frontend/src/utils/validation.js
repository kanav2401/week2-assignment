
// ========================================
// USERNAME VALIDATION
// ========================================

export const validateUsername = (username) => {
  const value = String(username || "").trim();

  if (!value) {
    return "Username is required.";
  }

  if (value.length < 3) {
    return "Username must contain at least 3 characters.";
  }

  if (value.length > 30) {
    return "Username cannot exceed 30 characters.";
  }

  if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    return "Username can only contain letters, numbers and underscores.";
  }

  return "";
};

// ========================================
// EMAIL VALIDATION
// ========================================

export const validateEmail = (email) => {
  const value = String(email || "").trim();

  if (!value) {
    return "Email address is required.";
  }

  if (value.length > 254) {
    return "Email address is too long.";
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(value)) {
    return "Please enter a valid email address.";
  }

  return "";
};

// ========================================
// PASSWORD BYTE LENGTH
// ========================================

export const getPasswordByteLength = (
  password = ""
) => {
  return new TextEncoder().encode(password).length;
};

// ========================================
// PASSWORD REQUIREMENTS
// ========================================

export const getPasswordRequirements = (
  password = ""
) => {
  return {
    minLength: password.length >= 8,

    uppercase: /[A-Z]/.test(password),

    lowercase: /[a-z]/.test(password),

    number: /[0-9]/.test(password),

    specialCharacter:
      /[^A-Za-z0-9\s]/.test(password),

    validByteLength:
      getPasswordByteLength(password) <= 72,
  };
};

// ========================================
// PASSWORD VALIDATION
// ========================================

export const validatePassword = (password) => {
  if (!password || !password.trim()) {
    return "Password is required.";
  }

  const requirements =
    getPasswordRequirements(password);

  if (!requirements.minLength) {
    return "Password must contain at least 8 characters.";
  }

  if (!requirements.validByteLength) {
    return "Password cannot exceed 72 bytes.";
  }

  if (!requirements.uppercase) {
    return "Password must contain at least one uppercase letter.";
  }

  if (!requirements.lowercase) {
    return "Password must contain at least one lowercase letter.";
  }

  if (!requirements.number) {
    return "Password must contain at least one number.";
  }

  if (!requirements.specialCharacter) {
    return "Password must contain at least one special character.";
  }

  return "";
};

// ========================================
// CONFIRM PASSWORD VALIDATION
// ========================================

export const validateConfirmPassword = (
  password,
  confirmPassword
) => {
  if (!confirmPassword) {
    return "Please confirm your password.";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  return "";
};

// ========================================
// PASSWORD STRENGTH CALCULATION
// ========================================

export const calculatePasswordStrength = (
  password = ""
) => {
  const requirements =
    getPasswordRequirements(password);

  if (!password) {
    return {
      score: 0,
      percentage: 0,
      label: "",
      color: "#E2E8F0",
      requirements,
    };
  }

  const checks = [
    requirements.minLength,
    requirements.uppercase,
    requirements.lowercase,
    requirements.number,
    requirements.specialCharacter,
  ];

  const score = checks.filter(Boolean).length;

  const percentage = (score / 5) * 100;

  let label;
  let color;

  if (!requirements.validByteLength) {
    label = "Invalid";
    color = "#DC2626";

    return {
      score: 0,
      percentage: 0,
      label,
      color,
      requirements,
    };
  }

  if (score <= 1) {
    label = "Very Weak";
    color = "#DC2626";
  } else if (score === 2) {
    label = "Weak";
    color = "#F97316";
  } else if (score === 3) {
    label = "Fair";
    color = "#EAB308";
  } else if (score === 4) {
    label = "Good";
    color = "#84CC16";
  } else {
    label = "Strong";
    color = "#16A34A";
  }

  return {
    score,
    percentage,
    label,
    color,
    requirements,
  };
};

// ========================================
// REGISTRATION FORM VALIDATION
// ========================================

export const validateRegisterForm = (
  formData
) => {
  const errors = {};

  const usernameError = validateUsername(
    formData.username
  );

  const emailError = validateEmail(
    formData.email
  );

  const passwordError = validatePassword(
    formData.password
  );

  const confirmPasswordError =
    validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );

  if (usernameError) {
    errors.username = usernameError;
  }

  if (emailError) {
    errors.email = emailError;
  }

  if (passwordError) {
    errors.password = passwordError;
  }

  if (confirmPasswordError) {
    errors.confirmPassword =
      confirmPasswordError;
  }

  return errors;
};

// ========================================
// LOGIN FORM VALIDATION
// ========================================

export const validateLoginForm = (
  formData
) => {
  const errors = {};

  const emailError = validateEmail(
    formData.email
  );

  if (emailError) {
    errors.email = emailError;
  }

  if (
    !formData.password ||
    !formData.password.trim()
  ) {
    errors.password = "Password is required.";
  } else if (
    getPasswordByteLength(formData.password) > 72
  ) {
    errors.password = "Invalid password.";
  }

  return errors;
};

// ========================================
// FORMAT DATE
// ========================================

export const formatDate = (date) => {
  if (!date) {
    return "Not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

// ========================================
// FORMAT DATE AND TIME
// ========================================

export const formatDateTime = (date) => {
  if (!date) {
    return "Not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(parsedDate);
};

// ========================================
// FORMAT SESSION DURATION
// ========================================

export const formatDuration = (
  milliseconds
) => {
  const value = Number(milliseconds);

  if (!Number.isFinite(value)) {
    return "Not available";
  }

  if (value <= 0) {
    return "Expired";
  }

  const totalSeconds = Math.floor(
    value / 1000
  );

  const days = Math.floor(
    totalSeconds / 86400
  );

  const hours = Math.floor(
    (totalSeconds % 86400) / 3600
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  if (seconds === 0) {
    return "Less than 1s";
  }

  return `${seconds}s`;
};

// ========================================
// GET USER INITIALS
// ========================================

export const getUserInitials = (
  username = ""
) => {
  const value = String(username || "").trim();

  if (!value) {
    return "U";
  }

  const parts = value
    .split(/[\s_-]+/)
    .filter(Boolean);

  if (parts.length >= 2) {
    return (
      parts[0][0] + parts[1][0]
    ).toUpperCase();
  }

  return value.slice(0, 2).toUpperCase();
};

// ========================================
// CHECK FORM ERRORS
// ========================================

export const hasErrors = (errors = {}) => {
  return Object.values(errors).some(Boolean);
};
