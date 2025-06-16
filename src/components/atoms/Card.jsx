import { motion } from 'framer-motion'

export default function Card({ 
  children, 
  className = '',
  hover = false,
  ...props 
}) {
  return (
    <motion.div
      className={`
        bg-white rounded-lg shadow-sm border border-surface-200
        ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''}
        ${className}
      `}
      whileHover={hover ? { y: -2 } : {}}
      {...props}
    >
      {children}
    </motion.div>
  )
}