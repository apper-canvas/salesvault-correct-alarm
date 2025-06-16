import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import DataTable from '@/components/molecules/DataTable'
import SearchBar from '@/components/molecules/SearchBar'
import Modal from '@/components/molecules/Modal'
import CompanyForm from '@/components/organisms/CompanyForm'
import ApperIcon from '@/components/ApperIcon'
import { companyService, contactService } from '@/services'

export default function Companies() {
  const [companies, setCompanies] = useState([])
  const [contacts, setContacts] = useState([])
  const [filteredCompanies, setFilteredCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingCompany, setEditingCompany] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [industryFilter, setIndustryFilter] = useState('all')

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterCompanies()
  }, [companies, searchTerm, industryFilter])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [companiesData, contactsData] = await Promise.all([
        companyService.getAll(),
        contactService.getAll()
      ])
      
      setCompanies(companiesData)
      setContacts(contactsData)
    } catch (err) {
      setError(err.message || 'Failed to load companies')
      toast.error('Failed to load companies')
    } finally {
      setLoading(false)
    }
  }

  const filterCompanies = () => {
    let filtered = [...companies]
    
if (searchTerm) {
      filtered = filtered.filter(company =>
        company.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.website?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (industryFilter !== 'all') {
      filtered = filtered.filter(company => company.industry === industryFilter)
    }
    
    setFilteredCompanies(filtered)
  }

const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId)
    return contact ? `${contact.first_name} ${contact.last_name}` : '-'
  }

  const getUniqueIndustries = () => {
    const industries = companies.map(c => c.industry).filter(Boolean)
    return [...new Set(industries)].sort()
  }

  const handleCreate = () => {
    setEditingCompany(null)
    setShowModal(true)
  }

  const handleEdit = (company) => {
    setEditingCompany(company)
    setShowModal(true)
  }

const handleDelete = async (company) => {
    if (!window.confirm(`Are you sure you want to delete ${company.Name}?`)) {
      return
    }
    
    try {
      await companyService.delete(company.Id)
      toast.success('Company deleted successfully')
      loadData()
    } catch (error) {
      toast.error('Failed to delete company')
    }
  }

  const handleSave = () => {
    setShowModal(false)
    setEditingCompany(null)
    loadData()
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

const columns = [
    {
      key: 'Name',
      label: 'Company',
      render: (Name, company) => (
        <div>
          <div className="font-medium text-surface-900">{Name}</div>
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              {company.website.replace(/^https?:\/\//, '')}
            </a>
          )}
        </div>
      )
    },
    {
      key: 'industry',
      label: 'Industry',
      render: (industry) => industry || '-'
    },
    {
      key: 'revenue',
      label: 'Revenue',
      render: (revenue) => revenue ? formatCurrency(revenue) : '-'
    },
{
      key: 'primary_contact_id',
      label: 'Primary Contact',
      render: (primary_contact_id) => getContactName(primary_contact_id)
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (phone) => phone || '-'
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
          <h3 className="text-lg font-semibold text-surface-900 mb-2">Error Loading Companies</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <Button onClick={loadData} icon="RefreshCw">
            Try Again
          </Button>
        </Card>
      </div>
    )
  }

  if (companies.length === 0) {
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
            <ApperIcon name="Building2" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-surface-900">No companies yet</h3>
          <p className="mt-2 text-surface-500">Get started by adding your first company</p>
          <Button className="mt-4" onClick={handleCreate} icon="Plus">
            Add Company
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
          <h1 className="text-2xl font-bold text-surface-900">Companies</h1>
          <p className="text-surface-600">Manage your business relationships</p>
        </div>
        <Button onClick={handleCreate} icon="Plus" className="mt-4 sm:mt-0">
          Add Company
        </Button>
      </motion.div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <SearchBar
            onSearch={setSearchTerm}
            placeholder="Search companies..."
            className="flex-1"
          />
          
          <div className="flex items-center space-x-4">
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="px-3 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Industries</option>
              {getUniqueIndustries().map(industry => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>
        </div>

        <DataTable
          data={filteredCompanies}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCompany ? 'Edit Company' : 'Create Company'}
        size="lg"
      >
        <CompanyForm
          company={editingCompany}
          onSave={handleSave}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  )
}