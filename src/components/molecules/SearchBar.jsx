import { useState } from 'react'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'

export default function SearchBar({ 
  onSearch, 
  placeholder = "Search...",
  className = '' 
}) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch?.(searchTerm)
  }

  return (
    <form onSubmit={handleSubmit} className={`flex space-x-2 ${className}`}>
      <div className="flex-1">
        <Input
          icon="Search"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Button type="submit" icon="Search" className="px-3">
        <span className="sr-only">Search</span>
      </Button>
    </form>
  )
}