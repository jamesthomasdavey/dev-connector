const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = reqBody => {
  let errors = {};

  reqBody.email = !isEmpty(reqBody.email) ? reqBody.email : '';
  reqBody.password = !isEmpty(reqBody.password) ? reqBody.password : '';

  if (!Validator.isEmail(reqBody.email)) {
    errors.email = 'Please enter a valid email';
  }

  if (Validator.isEmpty(reqBody.email)) {
    errors.email = 'Email field is required';
  }

  if (Validator.isEmpty(reqBody.email)) {
    errors.password = 'Password field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
