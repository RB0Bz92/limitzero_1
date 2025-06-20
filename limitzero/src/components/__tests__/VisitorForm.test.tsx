import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@/lib/theme'
import VisitorForm from '../VisitorForm'

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('VisitorForm', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders all form fields', () => {
    renderWithTheme(<VisitorForm />)
    
    expect(screen.getByLabelText(/preferred contact name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit information/i })).toBeInTheDocument()
  })

  it('renders header with correct text and icon', () => {
    renderWithTheme(<VisitorForm />)
    
    expect(screen.getByText('Get in Touch')).toBeInTheDocument()
    expect(screen.getByText(/we'd love to connect with you/i)).toBeInTheDocument()
  })

  it('updates form data when user types in fields', async () => {
    const user = userEvent.setup()
    renderWithTheme(<VisitorForm />)
    
    const nameInput = screen.getByLabelText(/preferred contact name/i)
    const emailInput = screen.getByLabelText(/email address/i)
    const ageInput = screen.getByLabelText(/age/i)
    
    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(ageInput, '30')
    
    expect(nameInput).toHaveValue('John Doe')
    expect(emailInput).toHaveValue('john@example.com')
    expect(ageInput).toHaveValue(30)
  })

  it('allows user to select country from dropdown', async () => {
    const user = userEvent.setup()
    renderWithTheme(<VisitorForm />)
    
    const countrySelect = screen.getByLabelText(/country/i)
    await user.click(countrySelect)
    
    const usOption = screen.getByText('United States')
    await user.click(usOption)
    
    expect(countrySelect).toHaveValue('US')
  })

  it('shows all country options in dropdown', async () => {
    const user = userEvent.setup()
    renderWithTheme(<VisitorForm />)
    
    const countrySelect = screen.getByLabelText(/country/i)
    await user.click(countrySelect)
    
    expect(screen.getByText('United States')).toBeInTheDocument()
    expect(screen.getByText('Canada')).toBeInTheDocument()
    expect(screen.getByText('United Kingdom')).toBeInTheDocument()
    expect(screen.getByText('Australia')).toBeInTheDocument()
    expect(screen.getByText('Germany')).toBeInTheDocument()
    expect(screen.getByText('France')).toBeInTheDocument()
    expect(screen.getByText('Japan')).toBeInTheDocument()
    expect(screen.getByText('Brazil')).toBeInTheDocument()
    expect(screen.getByText('India')).toBeInTheDocument()
    expect(screen.getByText('Other')).toBeInTheDocument()
  })

  it('submits form with correct data and shows success message', async () => {
    const user = userEvent.setup()
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Success' })
    })
    global.fetch = mockFetch
    
    renderWithTheme(<VisitorForm />)
    
    await user.type(screen.getByLabelText(/preferred contact name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
    await user.click(screen.getByLabelText(/country/i))
    await user.click(screen.getByText('United States'))
    await user.type(screen.getByLabelText(/age/i), '30')
    
    await user.click(screen.getByRole('button', { name: /submit information/i }))
    
    expect(mockFetch).toHaveBeenCalledWith('/api/visitors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contactName: 'John Doe',
        email: 'john@example.com',
        country: 'US',
        age: '30'
      })
    })
    
    await waitFor(() => {
      expect(screen.getByText(/thank you! your information has been saved successfully/i)).toBeInTheDocument()
    })
  })

  it('shows error message when form submission fails', async () => {
    const user = userEvent.setup()
    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400
    })
    global.fetch = mockFetch
    
    renderWithTheme(<VisitorForm />)
    
    await user.type(screen.getByLabelText(/preferred contact name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
    await user.click(screen.getByLabelText(/country/i))
    await user.click(screen.getByText('United States'))
    await user.type(screen.getByLabelText(/age/i), '30')
    
    await user.click(screen.getByRole('button', { name: /submit information/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/something went wrong. please try again/i)).toBeInTheDocument()
    })
  })

  it('shows error message when network error occurs', async () => {
    const user = userEvent.setup()
    const mockFetch = jest.fn().mockRejectedValue(new Error('Network error'))
    global.fetch = mockFetch
    
    renderWithTheme(<VisitorForm />)
    
    await user.type(screen.getByLabelText(/preferred contact name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
    await user.click(screen.getByLabelText(/country/i))
    await user.click(screen.getByText('United States'))
    await user.type(screen.getByLabelText(/age/i), '30')
    
    await user.click(screen.getByRole('button', { name: /submit information/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/something went wrong. please try again/i)).toBeInTheDocument()
    })
  })

  it('disables submit button while submitting', async () => {
    const user = userEvent.setup()
    const mockFetch = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ ok: true, json: async () => ({}) }), 100))
    )
    global.fetch = mockFetch
    
    renderWithTheme(<VisitorForm />)
    
    await user.type(screen.getByLabelText(/preferred contact name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
    await user.click(screen.getByLabelText(/country/i))
    await user.click(screen.getByText('United States'))
    await user.type(screen.getByLabelText(/age/i), '30')
    
    const submitButton = screen.getByRole('button', { name: /submit information/i })
    await user.click(submitButton)
    
    expect(screen.getByRole('button', { name: /submitting/i })).toBeDisabled()
  })

  it('clears form after successful submission', async () => {
    const user = userEvent.setup()
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Success' })
    })
    global.fetch = mockFetch
    
    renderWithTheme(<VisitorForm />)
    
    const nameInput = screen.getByLabelText(/preferred contact name/i)
    const emailInput = screen.getByLabelText(/email address/i)
    const ageInput = screen.getByLabelText(/age/i)
    
    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.click(screen.getByLabelText(/country/i))
    await user.click(screen.getByText('United States'))
    await user.type(ageInput, '30')
    
    await user.click(screen.getByRole('button', { name: /submit information/i }))
    
    await waitFor(() => {
      expect(nameInput).toHaveValue('')
      expect(emailInput).toHaveValue('')
      expect(ageInput).toHaveValue(null)
    })
  })

  it('validates required fields', () => {
    renderWithTheme(<VisitorForm />)
    
    expect(screen.getByLabelText(/preferred contact name/i)).toBeRequired()
    expect(screen.getByLabelText(/email address/i)).toBeRequired()
    expect(screen.getByLabelText(/country/i)).toBeRequired()
    expect(screen.getByLabelText(/age/i)).toBeRequired()
  })

  it('sets correct input constraints for age field', () => {
    renderWithTheme(<VisitorForm />)
    
    const ageInput = screen.getByLabelText(/age/i)
    expect(ageInput).toHaveAttribute('type', 'number')
    expect(ageInput).toHaveAttribute('min', '1')
    expect(ageInput).toHaveAttribute('max', '120')
  })

  it('sets correct input type for email field', () => {
    renderWithTheme(<VisitorForm />)
    
    const emailInput = screen.getByLabelText(/email address/i)
    expect(emailInput).toHaveAttribute('type', 'email')
  })

  it('can close success snackbar', async () => {
    const user = userEvent.setup()
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Success' })
    })
    global.fetch = mockFetch
    
    renderWithTheme(<VisitorForm />)
    
    await user.type(screen.getByLabelText(/preferred contact name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
    await user.click(screen.getByLabelText(/country/i))
    await user.click(screen.getByText('United States'))
    await user.type(screen.getByLabelText(/age/i), '30')
    
    await user.click(screen.getByRole('button', { name: /submit information/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/thank you! your information has been saved successfully/i)).toBeInTheDocument()
    })
    
    const closeButton = screen.getByLabelText(/close/i)
    await user.click(closeButton)
    
    await waitFor(() => {
      expect(screen.queryByText(/thank you! your information has been saved successfully/i)).not.toBeInTheDocument()
    })
  })

  it('can close error snackbar', async () => {
    const user = userEvent.setup()
    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400
    })
    global.fetch = mockFetch
    
    renderWithTheme(<VisitorForm />)
    
    await user.type(screen.getByLabelText(/preferred contact name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
    await user.click(screen.getByLabelText(/country/i))
    await user.click(screen.getByText('United States'))
    await user.type(screen.getByLabelText(/age/i), '30')
    
    await user.click(screen.getByRole('button', { name: /submit information/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/something went wrong. please try again/i)).toBeInTheDocument()
    })
    
    const closeButton = screen.getByLabelText(/close/i)
    await user.click(closeButton)
    
    await waitFor(() => {
      expect(screen.queryByText(/something went wrong. please try again/i)).not.toBeInTheDocument()
    })
  })
})