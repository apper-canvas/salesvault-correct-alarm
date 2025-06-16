import Input from '@/components/atoms/Input'

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
  ...props
}) {
  return (
    <Input
      label={label}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      error={error}
      placeholder={placeholder}
      required={required}
      {...props}
    />
  )
}