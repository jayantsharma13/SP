import apiService from './apiService.js';

class AIService {
  /**
   * Generate AI summary for a company
   * @param {string} companyName - Name of the company
   * @returns {Promise} - Company summary data
   */
  async getCompanySummary(companyName) {
    try {
      const response = await apiService.request(`/ai/company/${encodeURIComponent(companyName)}/summary`);
      return response.data;
    } catch (error) {
      console.error('Error fetching company summary:', error);
      throw error;
    }
  }

  /**
   * Get detailed company insights
   * @param {string} companyName - Name of the company
   * @returns {Promise} - Company insights data
   */
  async getCompanyInsights(companyName) {
    try {
      const response = await apiService.request(`/ai/company/${encodeURIComponent(companyName)}/insights`);
      return response.data;
    } catch (error) {
      console.error('Error fetching company insights:', error);
      throw error;
    }
  }

  /**
   * Generate preparation tips for a specific role at a company
   * @param {string} companyName - Name of the company
   * @param {string} jobRole - Job role/position
   * @returns {Promise} - Preparation tips data
   */
  async getPreparationTips(companyName, jobRole) {
    try {
      const response = await apiService.request(
        `/ai/company/${encodeURIComponent(companyName)}/role/${encodeURIComponent(jobRole)}/tips`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching preparation tips:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const aiService = new AIService();
export default aiService;