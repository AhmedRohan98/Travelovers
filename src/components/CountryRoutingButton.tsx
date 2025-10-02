'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Box, Typography, Card } from '@mui/material'
import Grid from '@mui/material/Grid2'
import Image from 'next/image'
import { getCountryContinent } from '@/lib/data/countries'
import { Country } from './Countries'

interface CountryRoutingButtonProps {
  selectedCountry: string | null
  visaType: 'visit' | 'study'
  showAfterFirstQuestion?: boolean
}

// Specific 5 European countries to show for Europe/Schengen selections
const EUROPEAN_COUNTRIES: Country[] = [
  { name: 'Spain', flag: '/assets/countries/visit/flags/spain.png', continent: 'Europe' },
  { name: 'Italy', flag: '/assets/countries/visit/flags/italy.png', continent: 'Europe' },
  { name: 'Germany', flag: '/assets/countries/visit/flags/germany.png', continent: 'Europe' },
  { name: 'France', flag: '/assets/countries/visit/flags/france.png', continent: 'Europe' },
  { name: 'Greece', flag: '/assets/countries/visit/flags/greece.png', continent: 'Europe' }
]

export default function CountryRoutingButton({ 
  selectedCountry, 
  visaType, 
}: CountryRoutingButtonProps) {
  const [continent, setContinent] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedCountry) {
      setLoading(true)
      
      // Check if it's a direct Schengen/Europe selection
      const isSchengenSelection = selectedCountry.toLowerCase().includes('schengen') || 
                                 selectedCountry.toLowerCase().includes('europe')
      
      if (isSchengenSelection) {
        setContinent('Europe')
        setLoading(false)
      } else {
        getCountryContinent(selectedCountry, visaType)
          .then(continentData => {
            setContinent(continentData)
          })
          .catch(error => {
            console.error('Error fetching continent:', error)
            setContinent(null)
          })
          .finally(() => {
            setLoading(false)
          })
      }
    }
  }, [selectedCountry, visaType])

  if (!selectedCountry || loading) return null

  // Handle special cases for country name mapping
  const getCountrySlug = (country: string) => {
    const mappings: { [key: string]: string } = {
      'USA': 'usa',
      'United States': 'usa',
      'United States of America': 'usa',
      'United Kingdom': 'united_kingdom',
      'UK': 'united_kingdom',
      'Czech Republic': 'czech-republic',
      'South Korea': 'south-korea',
      'South Africa': 'south-africa',
      'New Zealand': 'new-zealand',
      'North Cyprus': 'north-cyprus',
      'Hong Kong': 'hong-kong',
      'Sri Lanka': 'sri-lanka',
      'United Arab Emirates': 'uae',
      'UAE': 'uae',
      'Schengen': 'france',
      'Schengen Area': 'france'
    }
    
    return mappings[country] || country.toLowerCase().replace(/\s+/g, '-')
  }

  // Get flag path for a country
  const getFlagPath = (country: string) => {
    const slug = getCountrySlug(country)
    return `/assets/countries/${visaType}/flags/${slug}.png`
  }

  const isEuropean = continent === 'Europe'

  if (isEuropean) {
    // Show 6 European countries in the same style as recommended countries
    return (
      <Grid container spacing={3}>
        {EUROPEAN_COUNTRIES.map((country) => {
          const href = `/${visaType}/${getCountrySlug(country.name)}`
          return (
            <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }} key={country.name}>
              <Link href={href} style={{ textDecoration: 'none' }}>
                <Card
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: 3,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                      border: '1px solid #B90C17',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      mb: 2,
                      height: 60,
                    }}
                  >
                    <Image
                      className="flag-image"
                      src={country.flag}
                      alt={`${country.name} flag`}
                      width={80}
                      height={50}
                      style={{
                        borderRadius: '8px',
                        objectFit: 'cover',
                        border: '1px solid #e0e0e0',
                      }}
                    />
                  </Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: '#333',
                      fontSize: '0.9rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100%',
                      lineHeight: 1.2
                    }}
                    title={country.name}
                  >
                    {country.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ 
                      color: '#888',
                      fontSize: '0.75rem',
                      display: 'block',
                      mt: 0.5
                    }}
                  >
                    {country.continent}
                  </Typography>
                </Card>
              </Link>
            </Grid>
          )
        })}
      </Grid>
    )
  }

  // Single country routing for non-European countries
  const href = `/${visaType}/${getCountrySlug(selectedCountry)}`
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Link href={href} style={{ textDecoration: 'none', maxWidth: '200px', width: '100%' }}>
        <Card
          sx={{
            p: 2,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
              border: '1px solid #B90C17',
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 1.5,
              height: 50,
            }}
          >
            <Image
              className="flag-image"
              src={getFlagPath(selectedCountry)}
              alt={`${selectedCountry} flag`}
              width={60}
              height={40}
              style={{
                borderRadius: '6px',
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
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: '#333',
              fontSize: '0.85rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
              lineHeight: 1.2,
              textAlign: 'center'
            }}
            title={selectedCountry}
          >
            {selectedCountry}
          </Typography>
          <Typography
            variant="caption"
            sx={{ 
              color: '#888',
              fontSize: '0.7rem',
              display: 'block',
              mt: 0.5,
              textAlign: 'center'
            }}
          >
            {continent || 'Country'}
          </Typography>
        </Card>
      </Link>
    </Box>
  )
}
