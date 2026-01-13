// API client wrapper using fetch
import { API_BASE_URL } from '../config/env';
import { ERROR_MESSAGES } from '../utils/constants';

/**
 * API Client for making HTTP requests to the backend
 */
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.authToken = null;
  }

  /**
   * Set the authentication token for subsequent requests
   * @param {string|null} token
   */
  setAuthToken(token) {
    this.authToken = token;
  }

  /**
   * Get default headers for requests
   * @returns {Object}
   */
  getHeaders(isFormData = false) {
    const headers = {};

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  /**
   * Handle API response
   * @param {Response} response
   * @returns {Promise<any>}
   */
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const error = new Error(data.message || data.detail || ERROR_MESSAGES.GENERIC_ERROR);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  /**
   * Make a GET request
   * @param {string} endpoint
   * @param {Object} params - Query parameters
   * @returns {Promise<any>}
   */
  async get(endpoint, params = {}) {
    const url = new URL(`${this.baseURL}${endpoint}`);
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  /**
   * Make a POST request
   * @param {string} endpoint
   * @param {Object} body
   * @returns {Promise<any>}
   */
  async post(endpoint, body = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    return this.handleResponse(response);
  }

  /**
   * Make a PUT request
   * @param {string} endpoint
   * @param {Object} body
   * @returns {Promise<any>}
   */
  async put(endpoint, body = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    return this.handleResponse(response);
  }

  /**
   * Make a PATCH request
   * @param {string} endpoint
   * @param {Object} body
   * @returns {Promise<any>}
   */
  async patch(endpoint, body = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    return this.handleResponse(response);
  }

  /**
   * Make a DELETE request
   * @param {string} endpoint
   * @returns {Promise<any>}
   */
  async delete(endpoint) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  /**
   * Upload a file using multipart/form-data
   * @param {string} endpoint
   * @param {FormData} formData
   * @returns {Promise<any>}
   */
  async uploadFile(endpoint, formData) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: formData,
    });

    return this.handleResponse(response);
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient(API_BASE_URL);

export default apiClient;
