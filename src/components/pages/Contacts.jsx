import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Card from '@/components/atoms/Card'
import DataTable from '@/components/molecules/DataTable'
import SearchBar from '@/components/molecules/SearchBar'
import Modal from '@/components/molecules/Modal'
import ContactForm from '@/components/organisms/ContactForm'
import ApperIcon from '@/components/ApperIcon'
import { contactService, companyService } from '@/services'

export default function Contacts() {
  const [contacts, setContacts] = useState([])
  const [companies, setCompanies] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterContacts()
  }, [contacts, searchTerm, statusFilter])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [contactsData, companiesData] = await Promise.all([
        contactService.getAll(),
        companyService.getAll()
      ])
      
      setContacts(contactsData)
      setCompanies(companiesData)
    } catch (err) {
      setError(err.message || 'Failed to load contacts')
      toast.error('Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }

  const filterContacts = () => {
    let filtered = [...contacts]
    
    if (searchTerm) {
      filtered = filtered.filter(contact =>
        `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(contact => contact.status === statusFilter)
    }
    
    setFilteredContacts(filtered)
  }

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.Id === companyId)
    return company ? company.name : 'No Company'
  }

  const handleCreate = () => {
    setEditingContact(null)
    setShowModal(true)
  }

  const handleEdit = (contact) => {
    setEditingContact(contact)
    setShowModal(true)
  }

  const handleDelete = async (contact) => {
    if (!window.confirm(`Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`)) {
      return
    }
    
    try {
      await contactService.delete(contact.Id)
      toast.success('Contact deleted successfully')
      loadData()
    } catch (error) {
      toast.error('Failed to delete contact')
    }
  }

  const handleSave = () => {
    setShowModal(false)
    setEditingContact(null)
    loadData()
  }

  const columns = [
    {
      key: 'firstName',
      label: 'Name',
      render: (_, contact) => (
        <div>
          <div className="font-medium text-surface-900">
            {contact.firstName} {contact.lastName}
          </div>
          <div className="text-sm text-surface-500">{contact.email}</div>
        </div>
      )
    },
    {
      key: 'jobTitle',
      label: 'Job Title',
      render: (jobTitle) => jobTitle || '-'
    },
    {
      key: 'companyId',
      label: 'Company',
      render: (companyId) => getCompanyName(companyId)
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (phone) => phone || '-'
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <Badge variant={status === 'Active' ? 'success' : status === 'Lead' ? 'lead' : 'default'}>
          {status}
        </Badge>
      )
    }
  ]

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="animate-pulse">
            <div className="h-8 bg-surface-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-surface-200 rounded w-64"></div>
          </div>
        </div>
        <DataTable loading={true} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 mb-2">Error Loading Contacts</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <Button onClick={loadData} icon="RefreshCw">
            Try Again
          </Button>
        </Card>
      </div>
    )
  }

  if (contacts.length === 0) {
    return (
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Users" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-surface-900">No contacts yet</h3>
          <p className="mt-2 text-surface-500">Get started by adding your first contact</p>
          <Button className="mt-4" onClick={handleCreate} icon="Plus">
            Add Contact
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Contacts</h1>
          <p className="text-surface-600">Manage your customer relationships</p>
        </div>
        <Button onClick={handleCreate} icon="Plus" className="mt-4 sm:mt-0">
          Add Contact
        </Button>
      </motion.div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <SearchBar
            onSearch={setSearchTerm}
            placeholder="Search contacts..."
            className="flex-1"
          />
          
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Lead">Lead</option>
              <option value="Prospect">Prospect</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <DataTable
          data={filteredContacts}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingContact ? 'Edit Contact' : 'Create Contact'}
        size="lg"
      >
        <ContactForm
          contact={editingContact}
          onSave={handleSave}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  )
}