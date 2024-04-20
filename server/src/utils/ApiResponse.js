class ApiResponse {
  constructor(statusCode, data, accessToken, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.accessToken = accessToken;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };