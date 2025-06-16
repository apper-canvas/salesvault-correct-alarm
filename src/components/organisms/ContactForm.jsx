import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { companyService, contactService } from "@/services";

export default function ContactForm({ contact, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobTitle: '',
    companyId: '',
    status: 'Active',
    notes: ''
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [companies, setCompanies] = useState([])

  // Load companies for dropdown
  useEffect(() => {
    loadCompanies()
  }, [])

  // Populate form data when contact prop changes
  useEffect(() => {
    if (contact) {
      setFormData({
        firstName: contact.first_name || '',
        lastName: contact.last_name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        jobTitle: contact.job_title || '',
        companyId: contact.company_id?.toString() || '',
        status: contact.status || 'Active',
        notes: contact.notes || ''
      })
    }
  }, [contact])

  async function loadCompanies() {
    try {
      const companiesData = await companyService.getAll()
      setCompanies(companiesData || [])
    } catch (error) {
      console.error('Failed to load companies:', error)
      setCompanies([])
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  function validateForm() {
    const newErrors = {}
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      // Transform form data to match database field names (only updateable fields)
      const dataToSave = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        job_title: formData.jobTitle,
        company_id: formData.companyId ? parseInt(formData.companyId, 10) : null,
        status: formData.status,
        notes: formData.notes
      }
      
      if (contact) {
        await contactService.update(contact.Id, dataToSave)
        toast.success('Contact updated successfully')
      } else {
        await contactService.create(dataToSave)
        toast.success('Contact created successfully')
      }
      
      onSave?.()
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error(contact ? 'Failed to update contact' : 'Failed to create contact')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          error={errors.firstName}
          required
        />
        
        <FormField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={errors.lastName}
          required
        />
      </div>

      <FormField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        required
      />

      <FormField
        label="Phone"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
      />

      <FormField
        label="Job Title"
        name="jobTitle"
        value={formData.jobTitle}
        onChange={handleChange}
        error={errors.jobTitle}
      />

      <FormField
        label="Company"
        name="companyId"
        type="select"
        value={formData.companyId}
        onChange={handleChange}
        error={errors.companyId}
        options={[
          { value: '', label: 'Select a company' },
          ...companies.map(company => ({
            value: company.Id?.toString() || '',
            label: company.Name || 'Unnamed Company'
          }))
        ]}
      />

      <FormField
        label="Status"
        name="status"
        type="select"
        value={formData.status}
        onChange={handleChange}
        error={errors.status}
        options={[
          { value: 'Active', label: 'Active' },
          { value: 'Lead', label: 'Lead' },
          { value: 'Prospect', label: 'Prospect' },
          { value: 'Inactive', label: 'Inactive' }
        ]}
      />

      <FormField
        label="Notes"
        name="notes"
        type="textarea"
        value={formData.notes}
        onChange={handleChange}
        error={errors.notes}
        rows={4}
      />

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
        
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
        >
          {contact ? 'Update Contact' : 'Create Contact'}
        </Button>
      </div>
</div>
    </form>
  )
}