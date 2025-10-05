'use client'

import React from 'react'
import Link from 'next/link'
import { Box, Typography, Grid, Card } from '@mui/material'
import Image from 'next/image'

interface StudyCountryRecommendationsProps {
  countries: string[]
}

// Helper function to get country slug for routing
const getCountrySlug = (country: string) => {
  const mappings: { [key: string]: string } = {
    'USA': 'usa',
    'United States': 'usa',
    'United States of America': 'usa',
    'United Kingdom': 'united-kingdom',
    'UK': 'united-kingdom',
    'united_kingdom': 'united-kingdom',
    'Czech Republic': 'czech-republic',
    'czech_republic': 'czech-republic',
    'South Korea': 'south-korea',
    'south_korea': 'south-korea',
    'South Africa': 'south-africa',
    'south_africa': 'south-africa',
    'New Zealand': 'new-zealand',
    'new_zealand': 'new-zealand',
    'North Cyprus': 'north-cyprus',
    'north_cyprus': 'north-cyprus',
    'Hong Kong': 'hong-kong',
    'hong_kong': 'hong-kong',
    'Sri Lanka': 'sri-lanka',
    'sri_lanka': 'sri-lanka',
    'United Arab Emirates': 'uae',
    'UAE': 'uae',
    'uae': 'uae'
  }
  
  return mappings[country] || country.toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-')
}

// Helper function to get flag path - uses study flags first, then visit flags as fallback
const getFlagPath = (country: string) => {
  // Countries that exist in study flags
  const studyFlagMappings: { [key: string]: string } = {
    'USA': 'usa',
    'United States': 'usa',
    'United States of America': 'usa',
    'Germany': 'germany',
    'Austria': 'austria',
    'Italy': 'italy',
    'France': 'france',
    'Canada': 'canada',
    'Australia': 'australia',
    'Belgium': 'belgium',
    'Cyprus': 'cyprus',
    'Hungary': 'hungary'
  }
  
  // Countries that exist in visit flags (fallback)
  const visitFlagMappings: { [key: string]: string } = {
    'United Kingdom': 'united_kingdom',
    'UK': 'united_kingdom',
    'united_kingdom': 'united_kingdom',
    'Norway': 'norway',
    'Finland': 'finland',
    'Spain': 'spain',
    'Switzerland': 'switzerland',
    'Czech Republic': 'czech_republic',
    'czech_republic': 'czech_republic',
    'South Korea': 'south_korea',
    'south_korea': 'south_korea',
    'South Africa': 'south_africa',
    'south_africa': 'south_africa',
    'New Zealand': 'new_zealand',
    'new_zealand': 'new_zealand',
    'North Cyprus': 'north_cyprus',
    'north_cyprus': 'north_cyprus',
    'Hong Kong': 'hong_kong',
    'hong_kong': 'hong_kong',
    'Sri Lanka': 'sri_lanka',
    'sri_lanka': 'sri_lanka',
    'United Arab Emirates': 'uae',
    'UAE': 'uae',
    'uae': 'uae'
  }
  
  // Check study flags first
  if (studyFlagMappings[country]) {
    return `/assets/countries/study/flags/${studyFlagMappings[country]}.png`
  }
  
  // Fallback to visit flags
  if (visitFlagMappings[country]) {
    return `/assets/countries/visit/flags/${visitFlagMappings[country]}.png`
  }
  
  // Final fallback - try study flags with converted name
  const flagSlug = country.toLowerCase().replace(/\s+/g, '_')
  return `/assets/countries/study/flags/${flagSlug}.png`
}

export default function StudyCountryRecommendations({ 
  countries
}: StudyCountryRecommendationsProps) {
  if (!countries || countries.length === 0) {
    return null
  }

  return (
    <Card sx={{ 
      p: 2, 
      bgcolor: 'white', 
      borderRadius: 2, 
      border: '1px solid #e0e0e0',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      width: { xs: '100%', lg: 280 },
      maxHeight: 400,
      overflow: 'auto'
    }}>
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 600, 
            color: '#B90C1C', 
            mb: 0.5,
            fontSize: '1rem'
          }}
        >
          🎓 Recommended
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#666',
            fontSize: '0.75rem',
            lineHeight: 1.2
          }}
        >
          Based on your selection
        </Typography>
      </Box>

      <Grid container spacing={1}>
        {countries.map((country) => {
          const href = `/study/${getCountrySlug(country)}`
          const flagPath = getFlagPath(country)
          
          return (
            <Grid item xs={4} key={country}>
              <Link href={href} style={{ textDecoration: 'none' }}>
                <Card
                  sx={{
                    p: 1.5,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: 1.5,
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
                      border: '1px solid #B90C17',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      mb: 1,
                      width: 40,
                      height: 25
                    }}
                  >
                    <Image
                      className="flag-image"
                      src={flagPath}
                      alt={`${country} flag`}
                      width={40}
                      height={25}
                      style={{
                        borderRadius: '4px',
                        objectFit: 'cover',
                        border: '1px solid #e0e0e0',
                      }}
                      onError={(e) => {
                        // Fallback to a default flag
                        const target = e.target as HTMLImageElement
                        target.src = '/assets/travelogo.png'
                      }}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 500,
                      color: '#333',
                      fontSize: '0.7rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100%',
                      lineHeight: 1.1
                    }}
                    title={country}
                  >
                    {country}
                  </Typography>
                </Card>
              </Link>
            </Grid>
          )
        })}
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 2, pt: 1, borderTop: '1px solid #f0f0f0' }}>
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#666',
            fontSize: '0.65rem',
            lineHeight: 1.2
          }}
        >
          Click to view details
        </Typography>
      </Box>
    </Card>
  )
}
