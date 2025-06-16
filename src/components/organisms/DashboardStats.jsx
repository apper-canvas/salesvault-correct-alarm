import { motion } from 'framer-motion'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'

export default function DashboardStats({ deals = [], contacts = [], companies = [] }) {
  const totalRevenue = deals
    .filter(deal => deal.stage === 'Closed Won')
    .reduce((sum, deal) => sum + deal.amount, 0)

  const pipelineValue = deals
    .filter(deal => !['Closed Won', 'Closed Lost'].includes(deal.stage))
    .reduce((sum, deal) => sum + deal.amount, 0)

  const winRate = deals.length > 0 
    ? (deals.filter(deal => deal.stage === 'Closed Won').length / deals.length) * 100
    : 0

  const stats = [
    {
      label: 'Total Revenue',
      value: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      }).format(totalRevenue),
      icon: 'DollarSign',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Pipeline Value',
      value: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      }).format(pipelineValue),
      icon: 'TrendingUp',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Active Deals',
      value: deals.filter(deal => !['Closed Won', 'Closed Lost'].includes(deal.stage)).length,
      icon: 'Handshake',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Win Rate',
      value: `${winRate.toFixed(1)}%`,
      icon: 'Target',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      label: 'Total Contacts',
      value: contacts.length,
      icon: 'Users',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      label: 'Total Companies',
      value: companies.length,
      icon: 'Building2',
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card hover className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <ApperIcon name={stat.icon} className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-surface-600">{stat.label}</p>
                <p className="text-2xl font-bold text-surface-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}