import { theme } from '../theme'

describe('Theme Configuration', () => {
  it('has correct primary color', () => {
    expect(theme.palette.primary.main).toBe('#1976d2')
  })

  it('has correct secondary color', () => {
    expect(theme.palette.secondary.main).toBe('#dc004e')
  })

  it('has correct background color', () => {
    expect(theme.palette.background.default).toBe('#f5f5f5')
  })

  it('has correct typography settings', () => {
    expect(theme.typography.fontFamily).toBe('Roboto, Arial, sans-serif')
    expect(theme.typography.h4?.fontWeight).toBe(600)
  })

  it('has correct MuiPaper component overrides', () => {
    expect(theme.components?.MuiPaper?.styleOverrides?.root?.borderRadius).toBe(12)
  })

  it('has correct MuiButton component overrides', () => {
    const buttonOverrides = theme.components?.MuiButton?.styleOverrides?.root
    expect(buttonOverrides?.borderRadius).toBe(8)
    expect(buttonOverrides?.textTransform).toBe('none')
    expect(buttonOverrides?.fontWeight).toBe(500)
  })

  it('is a valid MUI theme object', () => {
    expect(theme).toHaveProperty('palette')
    expect(theme).toHaveProperty('typography')
    expect(theme).toHaveProperty('components')
    expect(theme).toHaveProperty('spacing')
    expect(theme).toHaveProperty('breakpoints')
  })
})