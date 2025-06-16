const dealService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'amount', 'stage', 'close_date', 'contact_id', 'company_id', 'owner_id', 'notes']
      };
      
      const response = await apperClient.fetchRecords('deal', params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching deals:", error);
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
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'amount', 'stage', 'close_date', 'contact_id', 'company_id', 'owner_id', 'notes']
      };
      
      const response = await apperClient.getRecordById('deal', parseInt(id, 10), params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching deal with ID ${id}:`, error);
      throw error;
    }
  },

  async create(dealData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields in create operation
      const updateableData = {
        Name: dealData.name || dealData.Name,
        Tags: dealData.Tags || '',
        Owner: dealData.Owner,
        amount: dealData.amount ? parseFloat(dealData.amount) : 0,
        stage: dealData.stage,
        close_date: dealData.closeDate || dealData.close_date,
        contact_id: dealData.contactId ? parseInt(dealData.contactId, 10) : null,
        company_id: dealData.companyId ? parseInt(dealData.companyId, 10) : null,
        owner_id: dealData.ownerId || dealData.owner_id,
        notes: dealData.notes
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.createRecord('deal', params);
      
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
      console.error("Error creating deal:", error);
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
        amount: updateData.amount ? parseFloat(updateData.amount) : 0,
        stage: updateData.stage,
        close_date: updateData.closeDate || updateData.close_date,
        contact_id: updateData.contactId ? parseInt(updateData.contactId, 10) : null,
        company_id: updateData.companyId ? parseInt(updateData.companyId, 10) : null,
        owner_id: updateData.ownerId || updateData.owner_id,
        notes: updateData.notes
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.updateRecord('deal', params);
      
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
      console.error("Error updating deal:", error);
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
      
      const response = await apperClient.deleteRecord('deal', params);
      
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
      console.error("Error deleting deal:", error);
      throw error;
    }
  }
};

export default dealService;