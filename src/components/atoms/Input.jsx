import { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = forwardRef(({
  label,
  error,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}, ref) => {
  const hasError = !!error
  
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-surface-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <ApperIcon 
            name={icon} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" 
          />
        )}
        
        <input
          ref={ref}
          className={`
            block w-full px-3 py-2 border rounded-lg text-sm placeholder-surface-400
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            transition-colors duration-200
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${hasError 
              ? 'border-red-300 focus:ring-red-500' 
              : 'border-surface-300 focus:ring-primary'
            }
          `}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <ApperIcon 
            name={icon} 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" 
          />
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input