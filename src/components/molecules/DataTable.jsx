import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

export default function DataTable({
  data = [],
  columns = [],
  onEdit,
  onDelete,
  loading = false,
  className = ''
}) {
  const [sortColumn, setSortColumn] = useState(null)
  const [sortDirection, setSortDirection] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState(new Set())
  
  const itemsPerPage = 20
  
  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }
  
  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0
    
    const aVal = a[sortColumn]
    const bVal = b[sortColumn]
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
    return 0
  })
  
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage)
  
  const toggleRowSelection = (id) => {
    const newSelection = new Set(selectedRows)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedRows(newSelection)
  }
  
  const toggleAllRows = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(paginatedData.map(item => item.Id)))
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-surface-100 border-b"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-surface-50 border-b"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-surface-200 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-surface-200">
          <thead className="bg-surface-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                  onChange={toggleAllRows}
                  className="w-4 h-4 text-primary border-surface-300 rounded focus:ring-primary"
                />
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider cursor-pointer hover:bg-surface-100"
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {sortColumn === column.key && (
                      <ApperIcon
                        name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'}
                        className="w-4 h-4"
                      />
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-surface-200">
            {paginatedData.map((item, index) => (
              <motion.tr
                key={item.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-surface-50 transition-colors duration-150"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(item.Id)}
                    onChange={() => toggleRowSelection(item.Id)}
                    className="w-4 h-4 text-primary border-surface-300 rounded focus:ring-primary"
                  />
                </td>
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                    {column.render ? column.render(item[column.key], item) : item[column.key]}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Edit"
                      onClick={() => onEdit?.(item)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Trash2"
                      onClick={() => onDelete?.(item)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    />
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="px-6 py-3 bg-surface-50 border-t border-surface-200 flex items-center justify-between">
          <div className="text-sm text-surface-700">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              icon="ChevronLeft"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            />
            <span className="text-sm text-surface-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              icon="ChevronRight"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            />
          </div>
        </div>
      )}
    </div>
  )
}