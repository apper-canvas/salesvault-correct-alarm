import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import { companyService, contactService } from '@/services'

export default function CompanyForm({ company, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    website: '',
    phone: '',
    address: '',
    revenue: '',
    primaryContactId: '',
    notes: ''
  })
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

useEffect(() => {
    if (company) {
      setFormData({
        name: company.Name || '',
        industry: company.industry || '',
        website: company.website || '',
        phone: company.phone || '',
        address: company.address || '',
        revenue: company.revenue?.toString() || '',
        primaryContactId: company.primary_contact_id?.toString() || '',
        notes: company.notes || ''
      })
    }
  }, [company])

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    try {
      const contactsData = await contactService.getAll()
      setContacts(contactsData)
    } catch (error) {
      toast.error('Failed to load contacts')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required'
    }
    
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Website must be a valid URL'
    }
    
    if (formData.revenue && isNaN(Number(formData.revenue))) {
      newErrors.revenue = 'Revenue must be a number'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
try {
      const dataToSave = {
        name: formData.name,
        industry: formData.industry,
        website: formData.website,
        phone: formData.phone,
        address: formData.address,
        revenue: formData.revenue ? Number(formData.revenue) : 0,
        primaryContactId: formData.primaryContactId ? parseInt(formData.primaryContactId, 10) : null,
        notes: formData.notes
      }
      if (company) {
        await companyService.update(company.Id, dataToSave)
        toast.success('Company updated successfully')
      } else {
        await companyService.create(dataToSave)
        toast.success('Company created successfully')
      }
      
      onSave?.()
    } catch (error) {
      toast.error(company ? 'Failed to update company' : 'Failed to create company')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Company Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Industry"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
        />
        
        <FormField
          label="Website"
          name="website"
          type="url"
          value={formData.website}
          onChange={handleChange}
          error={errors.website}
          placeholder="https://example.com"
        />
      </div>

      <FormField
        label="Phone"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
      />

      <FormField
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
      />

      <FormField
        label="Annual Revenue"
        name="revenue"
        type="number"
        value={formData.revenue}
        onChange={handleChange}
        error={errors.revenue}
        placeholder="0"
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-surface-700">
          Primary Contact
        </label>
        <select
          name="primaryContactId"
          value={formData.primaryContactId}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
<option value="">Select a contact</option>
          {contacts.map(contact => (
            <option key={contact.Id} value={contact.Id}>
              {contact.first_name} {contact.last_name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-surface-700">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="block w-full px-3 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Additional notes..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
        >
          {company ? 'Update Company' : 'Create Company'}
        </Button>
      </div>
    </form>
  )
}