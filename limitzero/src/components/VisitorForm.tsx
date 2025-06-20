'use client'

import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Button,
  Typography,
  Container,
  Stack,
  Snackbar,
  Alert
} from '@mui/material'
import { PersonAdd } from '@mui/icons-material'

interface FormData {
  email: string
  country: string
  age: string
  contactName: string
}

const countries = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'JP', label: 'Japan' },
  { value: 'BR', label: 'Brazil' },
  { value: 'IN', label: 'India' },
  { value: 'other', label: 'Other' }
]

export default function VisitorForm() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    country: '',
    age: '',
    contactName: ''
  })
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/visitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowSuccess(true)
        setFormData({
          email: '',
          country: '',
          age: '',
          contactName: ''
        })
      } else {
        setShowError(true)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setShowError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container maxWidth="sm">
      <Card elevation={4} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <PersonAdd color="primary" sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h4" component="h2" color="primary">
              Get in Touch
            </Typography>
          </Box>
          
          <Typography variant="body1" color="text.secondary" mb={4}>
            We'd love to connect with you. Please share some information about yourself.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Preferred Contact Name"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="How should we call you?"
              />

              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                variant="outlined"
                placeholder="your@email.com"
              />

              <TextField
                fullWidth
                select
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                variant="outlined"
              >
                {countries.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                required
                variant="outlined"
                inputProps={{ min: 1, max: 120 }}
                placeholder="Your age"
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isSubmitting}
                sx={{ py: 1.5, mt: 3 }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Information'}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Thank you! Your information has been saved successfully.
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={4000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: '100%' }}>
          Something went wrong. Please try again.
        </Alert>
      </Snackbar>
    </Container>
  )
}