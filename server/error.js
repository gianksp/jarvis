'use strict';

module.exports = class HttpError {
  constructor(status, code, message) {
    var error = new Error();
    error.status = status;
    error.code = code;
    error.message = message;
    return error;
  }
};