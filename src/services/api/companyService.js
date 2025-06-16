const companyService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'industry', 'website', 'phone', 'address', 'revenue', 'notes', 'primary_contact_id']
      };
      
      const response = await apperClient.fetchRecords('company', params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching companies:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'industry', 'website', 'phone', 'address', 'revenue', 'notes', 'primary_contact_id']
      };
      
      const response = await apperClient.getRecordById('company', parseInt(id, 10), params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching company with ID ${id}:`, error);
      throw error;
    }
  },

  async create(companyData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields in create operation
      const updateableData = {
        Name: companyData.name || companyData.Name,
        Tags: companyData.Tags || '',
        Owner: companyData.Owner,
        industry: companyData.industry,
        website: companyData.website,
        phone: companyData.phone,
        address: companyData.address,
        revenue: companyData.revenue ? parseFloat(companyData.revenue) : 0,
        notes: companyData.notes,
        primary_contact_id: companyData.primaryContactId ? parseInt(companyData.primaryContactId, 10) : null
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.createRecord('company', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Some records failed to create');
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      console.error("Error creating company:", error);
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields in update operation
      const updateableData = {
        Id: parseInt(id, 10),
        Name: updateData.name || updateData.Name,
        Tags: updateData.Tags || '',
        Owner: updateData.Owner,
        industry: updateData.industry,
        website: updateData.website,
        phone: updateData.phone,
        address: updateData.address,
        revenue: updateData.revenue ? parseFloat(updateData.revenue) : 0,
        notes: updateData.notes,
        primary_contact_id: updateData.primaryContactId ? parseInt(updateData.primaryContactId, 10) : null
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.updateRecord('company', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error('Some records failed to update');
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      console.error("Error updating company:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id, 10)]
      };
      
      const response = await apperClient.deleteRecord('company', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error('Some records failed to delete');
        }
        
        return { success: true };
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      throw error;
    }
  }
};

export default companyService;