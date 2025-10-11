// Authentication service for managing user auth state and operations
class AuthService {
  constructor() {
    this.TOKEN_KEY = 'auth_token';
    this.USER_KEY = 'user_data';
  }

  // Store auth data in localStorage
  setAuthData(token, user) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    
    // Dispatch custom event to notify about auth state change
    window.dispatchEvent(new CustomEvent('authStateChanged', { detail: user }));
  }

  // Get stored token
  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Get stored user data
  getUser() {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }

  // Check if user is admin
  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  }

  // Clear auth data (logout)
  clearAuthData() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    
    // Dispatch custom event to notify about auth state change
    window.dispatchEvent(new CustomEvent('authStateChanged', { detail: null }));
  }

  // Get authorization header
  getAuthHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

// Create a singleton instance
const authService = new AuthService();
export default authService;
