import contactsData from '../mockData/contacts.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let contacts = [...contactsData];

const contactService = {
  async getAll() {
    await delay(300);
    return [...contacts];
  },

  async getById(id) {
    await delay(200);
    const contact = contacts.find(c => c.Id === parseInt(id, 10));
    if (!contact) {
      throw new Error('Contact not found');
    }
    return { ...contact };
  },

  async create(contactData) {
    await delay(300);
    const maxId = Math.max(...contacts.map(c => c.Id), 0);
    const newContact = {
      ...contactData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    contacts.push(newContact);
    return { ...newContact };
  },

  async update(id, updateData) {
    await delay(300);
    const index = contacts.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Contact not found');
    }
    
    const updatedContact = {
      ...contacts[index],
      ...updateData,
      Id: contacts[index].Id, // Prevent Id modification
      updatedAt: new Date().toISOString()
    };
    
    contacts[index] = updatedContact;
    return { ...updatedContact };
  },

  async delete(id) {
    await delay(200);
    const index = contacts.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Contact not found');
    }
    
    contacts.splice(index, 1);
    return { success: true };
  }
};

export default contactService;