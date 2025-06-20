import { Box, Typography, Container } from '@mui/material'
import VisitorForm from '@/components/VisitorForm'

export default function Home() {
  return (
    <Box 
      component="main" 
      sx={{ 
        minHeight: '100vh', 
        py: 6,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6}>
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              color: 'white',
              mb: 3,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            Welcome to LimitZero
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'rgba(255,255,255,0.9)',
              maxWidth: '600px',
              mx: 'auto',
              fontWeight: 300
            }}
          >
            Connect with us and discover limitless possibilities
          </Typography>
        </Box>
        <VisitorForm />
      </Container>
    </Box>
  )
}