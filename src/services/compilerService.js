import api from './api';

class CompilerService {
  /**
   * Execute code using the compiler API
   * @param {Object} params - Execution parameters
   * @param {string} params.source_code - The source code to execute
   * @param {number} params.language_id - The language ID for the code
   * @param {string} params.stdin - Input for the program
   * @returns {Promise<Object>} Response with compiler token
   */
  async executeCode({ source_code, language_id, stdin }) {
    try {
      const response = await api.post('/compiler/execute-code', {
        source_code,
        language_id,
        stdin
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get execution result using compiler token
   * @param {string} compilerToken - Token from execute code response
   * @returns {Promise<Object>} Execution result
   */
  async getExecutionResult(compilerToken) {
    try {
      const response = await api.get(`/compiler/get-result/${compilerToken}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Analyze code using AI
   * @param {Object} params - Analysis parameters
   * @param {string} params.source_code - The source code to analyze
   * @param {string} params.language - The programming language name
   * @param {number} params.language_id - The language ID
   * @returns {Promise<Object>} Analysis result
   */
  async analyzeCode({ source_code, language, language_id }) {
    try {
      const response = await api.post('/compiler/analyze-code', {
        source_code,
        language,
        language_id
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new CompilerService();