import { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { routeArray } from '@/config/routes'

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-60 bg-white border-r border-surface-200 z-40">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-surface-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-header rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" className="w-5 h-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-surface-900">SalesVault</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {routeArray.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-surface-700 hover:bg-surface-100 hover:text-surface-900'
                  }`
                }
              >
                <ApperIcon name={route.icon} className="w-5 h-5 mr-3" />
                {route.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 left-0 w-64 bg-white border-r border-surface-200 z-50 lg:hidden"
          >
            <div className="flex items-center h-16 px-6 border-b border-surface-200">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-header rounded-lg flex items-center justify-center">
                  <ApperIcon name="Zap" className="w-5 h-5 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-surface-900">SalesVault</span>
              </div>
            </div>

            <nav className="px-4 py-6 space-y-2">
              {routeArray.map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-surface-700 hover:bg-surface-100 hover:text-surface-900'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} className="w-5 h-5 mr-3" />
                  {route.label}
                </NavLink>
              ))}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 z-30">
          <div className="flex items-center justify-between h-full px-4 lg:px-6">
            <div className="flex items-center">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-md"
              >
                <ApperIcon name="Menu" className="w-5 h-5" />
              </button>

              <div className="ml-4 lg:ml-0">
                <h1 className="text-lg font-semibold text-surface-900 capitalize">
                  {location.pathname.slice(1) || 'Dashboard'}
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="w-8 h-8 bg-gradient-header rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-surface-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}