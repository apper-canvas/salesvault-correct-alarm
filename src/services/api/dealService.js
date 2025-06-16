import dealsData from '../mockData/deals.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let deals = [...dealsData];

const dealService = {
  async getAll() {
    await delay(300);
    return [...deals];
  },

  async getById(id) {
    await delay(200);
    const deal = deals.find(d => d.Id === parseInt(id, 10));
    if (!deal) {
      throw new Error('Deal not found');
    }
    return { ...deal };
  },

  async create(dealData) {
    await delay(300);
    const maxId = Math.max(...deals.map(d => d.Id), 0);
    const newDeal = {
      ...dealData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    deals.push(newDeal);
    return { ...newDeal };
  },

  async update(id, updateData) {
    await delay(300);
    const index = deals.findIndex(d => d.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Deal not found');
    }
    
    const updatedDeal = {
      ...deals[index],
      ...updateData,
      Id: deals[index].Id, // Prevent Id modification
      updatedAt: new Date().toISOString()
    };
    
    deals[index] = updatedDeal;
    return { ...updatedDeal };
  },

  async delete(id) {
    await delay(200);
    const index = deals.findIndex(d => d.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Deal not found');
    }
    
    deals.splice(index, 1);
    return { success: true };
  }
};

export default dealService;