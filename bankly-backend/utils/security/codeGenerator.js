'use strict';

/**
 * Generates a random security code (OTP).
 * @param {Object} options
 * @param {number} options.length
 * @param {string} options.charType - 'numeric', 'alphabetic', or 'alphanumeric'
 */
exports.generateSecurityCode = ({ length = 6, charType = 'numeric' }) => {
  const charsets = {
    numeric: "0123456789",
    alphabetic: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  };

  const charset = charsets[charType] || charsets.numeric;

  let code = "";
  for (let i = 0; i < length; i++) {
    code += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return code;
};
