import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Card from '@/components/atoms/Card'
import DataTable from '@/components/molecules/DataTable'
import SearchBar from '@/components/molecules/SearchBar'
import Modal from '@/components/molecules/Modal'
import KanbanBoard from '@/components/organisms/KanbanBoard'
import DealForm from '@/components/organisms/DealForm'
import ApperIcon from '@/components/ApperIcon'
import { dealService, contactService, companyService } from '@/services'

export default function Deals() {
  const [deals, setDeals] = useState([])
  const [contacts, setContacts] = useState([])
  const [companies, setCompanies] = useState([])
  const [filteredDeals, setFilteredDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingDeal, setEditingDeal] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [stageFilter, setStageFilter] = useState('all')
  const [viewMode, setViewMode] = useState('kanban') // 'kanban' or 'table'

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterDeals()
  }, [deals, searchTerm, stageFilter])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const [dealsData, contactsData, companiesData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll(),
        companyService.getAll()
      ])
      
      setDeals(dealsData)
      setContacts(contactsData)
      setCompanies(companiesData)
    } catch (err) {
      setError(err.message || 'Failed to load deals')
      toast.error('Failed to load deals')
    } finally {
      setLoading(false)
    }
  }

  const filterDeals = () => {
    let filtered = [...deals]
    
    if (searchTerm) {
      filtered = filtered.filter(deal =>
        deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.ownerId?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (stageFilter !== 'all') {
      filtered = filtered.filter(deal => deal.stage === stageFilter)
    }
    
    setFilteredDeals(filtered)
  }

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId)
    return contact ? `${contact.firstName} ${contact.lastName}` : 'No Contact'
  }

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.Id === companyId)
    return company ? company.name : 'No Company'
  }

  const getStageColor = (stage) => {
    const stageColors = {
      'Lead': 'lead',
      'Qualified': 'qualified',
      'Proposal': 'proposal',
      'Negotiation': 'negotiation',
      'Closed Won': 'won',
      'Closed Lost': 'lost'
    }
    return stageColors[stage] || 'default'
  }

  const handleCreate = () => {
    setEditingDeal(null)
    setShowModal(true)
  }

  const handleEdit = (deal) => {
    setEditingDeal(deal)
    setShowModal(true)
  }

  const handleDelete = async (deal) => {
    if (!window.confirm(`Are you sure you want to delete ${deal.name}?`)) {
      return
    }
    
    try {
      await dealService.delete(deal.Id)
      toast.success('Deal deleted successfully')
      loadData()
    } catch (error) {
      toast.error('Failed to delete deal')
    }
  }

  const handleSave = () => {
    setShowModal(false)
    setEditingDeal(null)
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
      key: 'name',
      label: 'Deal Name',
      render: (name, deal) => (
        <div>
          <div className="font-medium text-surface-900">{name}</div>
          <div className="text-sm text-surface-500">
            {getContactName(deal.contactId)} • {getCompanyName(deal.companyId)}
          </div>
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (amount) => (
        <span className="font-semibold text-primary">
          {formatCurrency(amount)}
        </span>
      )
    },
    {
      key: 'stage',
      label: 'Stage',
      render: (stage) => (
        <Badge variant={getStageColor(stage)}>
          {stage}
        </Badge>
      )
    },
    {
      key: 'closeDate',
      label: 'Close Date',
      render: (closeDate) => new Date(closeDate).toLocaleDateString()
    },
    {
      key: 'ownerId',
      label: 'Owner',
      render: (ownerId) => ownerId?.replace('sales-rep-', 'Sales Rep ') || '-'
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
        {viewMode === 'kanban' ? (
          <div className="flex space-x-6 overflow-x-auto">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-80 bg-surface-100 rounded-lg p-4">
                <div className="animate-pulse">
                  <div className="h-6 bg-surface-200 rounded mb-4"></div>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-24 bg-white rounded border"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <DataTable loading={true} />
        )}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 mb-2">Error Loading Deals</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <Button onClick={loadData} icon="RefreshCw">
            Try Again
          </Button>
        </Card>
      </div>
    )
  }

  if (deals.length === 0) {
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
            <ApperIcon name="Handshake" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-surface-900">No deals yet</h3>
          <p className="mt-2 text-surface-500">Get started by creating your first deal</p>
          <Button className="mt-4" onClick={handleCreate} icon="Plus">
            Create Deal
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
          <h1 className="text-2xl font-bold text-surface-900">Deals</h1>
          <p className="text-surface-600">Track your sales pipeline and close more deals</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <div className="flex items-center bg-surface-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'kanban' ? 'primary' : 'ghost'}
              size="sm"
              icon="Columns"
              onClick={() => setViewMode('kanban')}
              className="px-3"
            >
              Kanban
            </Button>
            <Button
              variant={viewMode === 'table' ? 'primary' : 'ghost'}
              size="sm"
              icon="List"
              onClick={() => setViewMode('table')}
              className="px-3"
            >
              Table
            </Button>
          </div>
          <Button onClick={handleCreate} icon="Plus">
            Create Deal
          </Button>
        </div>
      </motion.div>

      {viewMode === 'table' && (
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <SearchBar
              onSearch={setSearchTerm}
              placeholder="Search deals..."
              className="flex-1"
            />
            
            <div className="flex items-center space-x-4">
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="px-3 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Stages</option>
                <option value="Lead">Lead</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal">Proposal</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Closed Won">Closed Won</option>
                <option value="Closed Lost">Closed Lost</option>
              </select>
            </div>
          </div>

          <DataTable
            data={filteredDeals}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Card>
      )}

      {viewMode === 'kanban' && (
        <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
          <KanbanBoard
            deals={deals}
            contacts={contacts}
            companies={companies}
            onUpdate={loadData}
          />
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingDeal ? 'Edit Deal' : 'Create Deal'}
        size="lg"
      >
        <DealForm
          deal={editingDeal}
          onSave={handleSave}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  )
}