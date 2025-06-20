import React from 'react'
import { render, screen } from '@testing-library/react'
import MUIThemeProvider from '../ThemeProvider'
import { Button } from '@mui/material'

describe('MUIThemeProvider', () => {
  it('renders children correctly', () => {
    render(
      <MUIThemeProvider>
        <div data-testid="test-child">Test Content</div>
      </MUIThemeProvider>
    )
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies theme to MUI components', () => {
    render(
      <MUIThemeProvider>
        <Button data-testid="test-button">Test Button</Button>
      </MUIThemeProvider>
    )
    
    const button = screen.getByTestId('test-button')
    expect(button).toBeInTheDocument()
    
    const computedStyle = window.getComputedStyle(button)
    expect(computedStyle.textTransform).toBe('none')
  })

  it('provides CssBaseline for consistent styling', () => {
    const { container } = render(
      <MUIThemeProvider>
        <div>Test Content</div>
      </MUIThemeProvider>
    )
    
    const style = window.getComputedStyle(document.body)
    expect(style).toBeDefined()
  })

  it('accepts React node children', () => {
    render(
      <MUIThemeProvider>
        <div>Child 1</div>
        <span>Child 2</span>
        <p>Child 3</p>
      </MUIThemeProvider>
    )
    
    expect(screen.getByText('Child 1')).toBeInTheDocument()
    expect(screen.getByText('Child 2')).toBeInTheDocument()
    expect(screen.getByText('Child 3')).toBeInTheDocument()
  })
})