import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = ''
}) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className={`bg-white rounded-lg shadow-xl w-full ${sizes[size]} ${className}`}>
              <div className="flex items-center justify-between p-6 border-b border-surface-200">
                <h3 className="text-lg font-semibold text-surface-900">{title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="X"
                  onClick={onClose}
                  className="text-surface-400 hover:text-surface-600"
                />
              </div>
              <div className="p-6">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}