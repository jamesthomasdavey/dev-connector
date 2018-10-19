const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = requestBody => {
  let errors = {};

  requestBody.email = !isEmpty(requestBody.email) ? requestBody.email : '';
  requestBody.password = !isEmpty(requestBody.password) ? requestBody.password : '';

  if (!Validator.isEmail(requestBody.email)) {
    errors.email = 'Please enter a valid email';
  }

  if (Validator.isEmpty(requestBody.email)) {
    errors.email = 'Email field is required';
  }

  if (Validator.isEmpty(requestBody.email)) {
    errors.password = 'Password field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
