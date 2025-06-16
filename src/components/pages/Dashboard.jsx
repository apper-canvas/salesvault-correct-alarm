import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import DashboardStats from '@/components/organisms/DashboardStats'
import PipelineChart from '@/components/organisms/PipelineChart'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'
import { dealService, contactService, companyService } from '@/services'

export default function Dashboard() {
  const [deals, setDeals] = useState([])
  const [contacts, setContacts] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
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
      setError(err.message || 'Failed to load dashboard data')
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getRecentActivities = () => {
    const activities = [
      ...deals.slice(0, 3).map(deal => ({
        id: `deal-${deal.Id}`,
        type: 'deal',
        title: `${deal.name} - ${deal.stage}`,
        subtitle: `$${deal.amount.toLocaleString()}`,
        time: new Date(deal.updatedAt).toLocaleDateString(),
        icon: 'Handshake'
      })),
      ...contacts.slice(0, 2).map(contact => ({
        id: `contact-${contact.Id}`,
        type: 'contact',
        title: `${contact.firstName} ${contact.lastName}`,
        subtitle: contact.jobTitle || 'New Contact',
        time: new Date(contact.updatedAt).toLocaleDateString(),
        icon: 'User'
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5)
    
    return activities
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
              <div className="animate-pulse flex items-center">
                <div className="w-12 h-12 bg-surface-200 rounded-lg"></div>
                <div className="ml-4 space-y-2">
                  <div className="h-4 bg-surface-200 rounded w-20"></div>
                  <div className="h-6 bg-surface-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-surface-200 rounded w-32 mb-4"></div>
              <div className="h-64 bg-surface-200 rounded"></div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-surface-200 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-surface-200 rounded-full"></div>
                    <div className="space-y-1">
                      <div className="h-4 bg-surface-200 rounded w-32"></div>
                      <div className="h-3 bg-surface-200 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Dashboard</h1>
          <p className="text-surface-600">Welcome back! Here's what's happening with your sales.</p>
        </div>
      </motion.div>

      <DashboardStats deals={deals} contacts={contacts} companies={companies} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PipelineChart deals={deals} />
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-surface-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {getRecentActivities().map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-surface-50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${
                  activity.type === 'deal' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  <ApperIcon 
                    name={activity.icon} 
                    className={`w-4 h-4 ${
                      activity.type === 'deal' ? 'text-blue-600' : 'text-green-600'
                    }`} 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-900 truncate">
                    {activity.title}
                  </p>
                  <p className="text-sm text-surface-500 truncate">
                    {activity.subtitle}
                  </p>
                </div>
                <span className="text-xs text-surface-400">
                  {activity.time}
                </span>
              </motion.div>
            ))}
            
            {getRecentActivities().length === 0 && (
              <div className="text-center py-8">
                <ApperIcon name="Activity" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
                <p className="text-surface-500">No recent activity</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}