import { api } from './api';

/**
 * ClientOnboardingService - MongoDB-compatible service for handling client onboarding forms
 * Replaces the Supabase-based service with MongoDB backend calls
 */
export const ClientOnboardingService = {
  /**
   * Save complete onboarding data to MongoDB (Public - no auth required)
   * @param {Object} formData - Complete form data to save
   * @returns {Promise<Object>} Saved record with ID
   */
  saveOnboardingData: async (formData) => {
    try {
      // Prepare data for the new Client model structure
      const clientData = {
        name: formData.clientName,
        businessType: formData.businessType || 'individual',
        industry: formData.industry || 'healthcare',
        email: formData.primaryEmail,
        phone: formData.phoneNumber,
        address: formData.businessAddress,
        website: formData.websiteUrl,
        gstNumber: formData.indianBusinessDetails?.gstin || '',
        panNumber: formData.indianBusinessDetails?.panNumber || '',
        state: formData.indianBusinessDetails?.state || '',
        city: formData.indianBusinessDetails?.city || '',
        pincode: formData.indianBusinessDetails?.pincode || '',
        businessRegistration: formData.indianBusinessDetails?.businessRegistrationType || '',
        status: 'pending' // All public submissions are pending by default
      };

      const response = await api.submitClientOnboarding(clientData);

      if (!response || !response.client) {
        throw new Error('Failed to save onboarding data - no record returned');
      }

      return {
        id: response.client.id,
        ...response.client,
        message: response.message
      };
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      throw new Error(error.message || 'Failed to save client onboarding data');
    }
  },

  /**
   * Save draft version of onboarding form to MongoDB
   * @param {Object} formData - Draft form data
   * @returns {Promise<Object>} Saved draft record
   */
  saveDraft: async (formData) => {
    try {
      const response = await api.saveDraft({
        ...formData,
        status: 'draft',
        lastSaved: new Date().toISOString(),
        completionPercentage: calculateCompletionPercentage(formData)
      });

      return {
        id: response._id || response.id,
        ...response
      };
    } catch (error) {
      console.error('Error saving draft:', error);
      throw new Error(error.message || 'Failed to save draft');
    }
  },

  /**
   * Upload files associated with onboarding
   * @param {string} recordId - MongoDB record ID
   * @param {FileList} files - Files to upload
   * @param {string} fileType - Type of files (logo, seo_report, etc.)
   * @returns {Promise<Object>} Upload response with file URLs
   */
  saveOnboardingFiles: async (recordId, files, fileType) => {
    try {
      if (!files || files.length === 0) {
        return { success: true, files: [] };
      }

      const formData = new FormData();
      formData.append('recordId', recordId);
      formData.append('fileType', fileType);

      // Add all files to FormData
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      // Make raw fetch call for file upload (multipart/form-data)
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/onboarding/upload`,
        {
          method: 'POST',
          headers: {
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error(`File upload failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading files:', error);
      throw new Error(error.message || 'Failed to upload files');
    }
  },

  /**
   * Fetch existing onboarding record by client name or ID
   * @param {string} clientId - Client ID or name
   * @returns {Promise<Object>} Onboarding record
   */
  getOnboardingData: async (clientId) => {
    try {
      const response = await api.getClientOnboarding(clientId);
      return response;
    } catch (error) {
      console.error('Error fetching onboarding data:', error);
      throw new Error(error.message || 'Failed to fetch onboarding data');
    }
  },

  /**
   * Update existing onboarding record
   * @param {string} recordId - MongoDB record ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated record
   */
  updateOnboardingData: async (recordId, updates) => {
    try {
      const response = await api.updateClientOnboarding(recordId, updates);
      return response;
    } catch (error) {
      console.error('Error updating onboarding data:', error);
      throw new Error(error.message || 'Failed to update onboarding data');
    }
  },

  /**
   * Get all client onboarding records (for admin/dashboard)
   * @param {Object} filters - Query filters
   * @returns {Promise<Array>} List of onboarding records
   */
  getAllOnboardingData: async (filters = {}) => {
    try {
      const response = await api.getAllClientOnboardings(filters);
      return response;
    } catch (error) {
      console.error('Error fetching all onboarding data:', error);
      throw new Error(error.message || 'Failed to fetch onboarding records');
    }
  }
};

/**
 * Calculate completion percentage based on required fields
 * @param {Object} formData - Form data object
 * @returns {number} Completion percentage (0-100)
 */
function calculateCompletionPercentage(formData) {
  const requiredFields = [
    'clientName',
    'primaryEmail',
    'phoneNumber',
    'industry',
    'businessType',
    'targetAudience',
    'idealCustomerProfile'
  ];

  let completedFields = 0;

  requiredFields.forEach(field => {
    const value = formData[field];
    if (value) {
      if (typeof value === 'object') {
        // For nested objects, check if at least one field is filled
        const hasContent = Object.values(value).some(v => v && v !== '');
        if (hasContent) completedFields++;
      } else if (typeof value === 'string' && value.trim()) {
        completedFields++;
      } else if (Array.isArray(value) && value.length > 0) {
        completedFields++;
      } else if (typeof value === 'boolean' && value) {
        completedFields++;
      } else if (typeof value === 'number' && value !== 0) {
        completedFields++;
      }
    }
  });

  return Math.round((completedFields / requiredFields.length) * 100);
}
