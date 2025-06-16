import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import { dealService, contactService, companyService } from '@/services'

const DEAL_STAGES = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']

export default function DealForm({ deal, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    stage: 'Lead',
    closeDate: '',
    contactId: '',
    companyId: '',
    ownerId: 'sales-rep-1',
    notes: ''
  })
  const [contacts, setContacts] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

useEffect(() => {
    if (deal) {
      setFormData({
        name: deal.Name || '',
        amount: deal.amount?.toString() || '',
        stage: deal.stage || 'Lead',
        closeDate: deal.close_date ? new Date(deal.close_date).toISOString().split('T')[0] : '',
        contactId: deal.contact_id?.toString() || '',
        companyId: deal.company_id?.toString() || '',
        ownerId: deal.owner_id || 'sales-rep-1',
        notes: deal.notes || ''
      })
    }
  }, [deal])

  useEffect(() => {
    Promise.all([loadContacts(), loadCompanies()])
  }, [])

  const loadContacts = async () => {
    try {
      const contactsData = await contactService.getAll()
      setContacts(contactsData)
    } catch (error) {
      toast.error('Failed to load contacts')
    }
  }

  const loadCompanies = async () => {
    try {
      const companiesData = await companyService.getAll()
      setCompanies(companiesData)
    } catch (error) {
      toast.error('Failed to load companies')
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
      newErrors.name = 'Deal name is required'
    }
    
    if (!formData.amount || isNaN(Number(formData.amount))) {
      newErrors.amount = 'Valid amount is required'
    }
    
    if (!formData.closeDate) {
      newErrors.closeDate = 'Close date is required'
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
        amount: Number(formData.amount),
        stage: formData.stage,
        closeDate: formData.closeDate,
        contactId: formData.contactId ? parseInt(formData.contactId, 10) : null,
        companyId: formData.companyId ? parseInt(formData.companyId, 10) : null,
        ownerId: formData.ownerId,
        notes: formData.notes
      }
      if (deal) {
        await dealService.update(deal.Id, dataToSave)
        toast.success('Deal updated successfully')
      } else {
        await dealService.create(dataToSave)
        toast.success('Deal created successfully')
      }
      
      onSave?.()
    } catch (error) {
      toast.error(deal ? 'Failed to update deal' : 'Failed to create deal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Deal Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          error={errors.amount}
          required
          placeholder="0"
        />
        
        <FormField
          label="Close Date"
          name="closeDate"
          type="date"
          value={formData.closeDate}
          onChange={handleChange}
          error={errors.closeDate}
          required
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-surface-700">
          Stage
        </label>
        <select
          name="stage"
          value={formData.stage}
          onChange={handleChange}
          className="block w-full px-3 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          {DEAL_STAGES.map(stage => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-surface-700">
            Contact
          </label>
          <select
            name="contactId"
            value={formData.contactId}
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
            Company
          </label>
          <select
            name="companyId"
            value={formData.companyId}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
<option value="">Select a company</option>
          {companies.map(company => (
            <option key={company.Id} value={company.Id}>
              {company.Name}
            </option>
          ))}
          </select>
        </div>
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
          {deal ? 'Update Deal' : 'Create Deal'}
        </Button>
      </div>
    </form>
  )
}