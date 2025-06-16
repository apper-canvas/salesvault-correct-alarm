const contactService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'first_name', 'last_name', 'email', 'phone', 'job_title', 'status', 'notes', 'company_id']
      };
      
      const response = await apperClient.fetchRecords('contact', params);
      
      if (!response || !response.data || response.data.length === 0) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching contacts:", error);
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
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'first_name', 'last_name', 'email', 'phone', 'job_title', 'status', 'notes', 'company_id']
      };
      
      const response = await apperClient.getRecordById('contact', parseInt(id, 10), params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching contact with ID ${id}:`, error);
      throw error;
    }
  },

  async create(contactData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields in create operation
      const updateableData = {
        Name: `${contactData.firstName || contactData.first_name} ${contactData.lastName || contactData.last_name}`,
        Tags: contactData.Tags || '',
        Owner: contactData.Owner,
        first_name: contactData.firstName || contactData.first_name,
        last_name: contactData.lastName || contactData.last_name,
        email: contactData.email,
        phone: contactData.phone,
        job_title: contactData.jobTitle || contactData.job_title,
        status: contactData.status,
        notes: contactData.notes,
        company_id: contactData.companyId ? parseInt(contactData.companyId, 10) : null
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.createRecord('contact', params);
      
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
      console.error("Error creating contact:", error);
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
        Name: `${updateData.firstName || updateData.first_name} ${updateData.lastName || updateData.last_name}`,
        Tags: updateData.Tags || '',
        Owner: updateData.Owner,
        first_name: updateData.firstName || updateData.first_name,
        last_name: updateData.lastName || updateData.last_name,
        email: updateData.email,
        phone: updateData.phone,
        job_title: updateData.jobTitle || updateData.job_title,
        status: updateData.status,
        notes: updateData.notes,
        company_id: updateData.companyId ? parseInt(updateData.companyId, 10) : null
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.updateRecord('contact', params);
      
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
      console.error("Error updating contact:", error);
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
      
      const response = await apperClient.deleteRecord('contact', params);
      
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
      console.error("Error deleting contact:", error);
      throw error;
    }
  }
};

export default contactService;