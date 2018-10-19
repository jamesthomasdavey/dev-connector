const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(requestBody) {
  let errors = {};

  // if empty, convert to empty string
  requestBody.name = !isEmpty(requestBody.name) ? requestBody.name : '';
  requestBody.email = !isEmpty(requestBody.email) ? requestBody.email : '';
  requestBody.password = !isEmpty(requestBody.password) ? requestBody.password : '';
  requestBody.password2 = !isEmpty(requestBody.password2) ? requestBody.password2 : '';

  // name validation
  if (!Validator.isLength(requestBody.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }
  if (Validator.isEmpty(requestBody.name)) {
    errors.name = 'Name field is required';
  }

  // email validation
  if (!Validator.isEmail(requestBody.email)) {
    errors.email = 'Email is invalid';
  }
  if (Validator.isEmpty(requestBody.email)) {
    errors.email = 'Email field is required';
  }

  // password validation
  if (Validator.isEmpty(requestBody.password)) {
    errors.password = 'Password field is required';
  }
  if (!Validator.isLength(requestBody.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  // password confirmation
  if (!Validator.equals(requestBody.password, requestBody.password2)) {
    errors.password2 = 'Passwords must match';
  }
  if (Validator.isEmpty(requestBody.password2)) {
    errors.password2 = 'Confirm Password field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
