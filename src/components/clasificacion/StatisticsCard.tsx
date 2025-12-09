// src/components/clasificacion/StatisticsCard.tsx

'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Stack,
} from '@mui/material';

interface StatisticsCardProps {
  label: string;
  value: number;
  icon?: React.ReactNode;
  color?: string;
  percentage?: number;
  variant?: 'total' | 'healthy' | 'affected';
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({
  label,
  value,
  icon,
  color,
  percentage,
  variant = 'total',
}) => {
  const getColor = () => {
    if (color) return color;
    if (variant === 'healthy') return '#4CAF50';
    if (variant === 'affected') return '#F44336';
    return '#2196F3';
  };

  const bgColor = getColor();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: `5px solid ${bgColor}`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: `${bgColor}20`,
                mr: 1,
                color: bgColor,
              }}
            >
              {icon}
            </Box>
          )}
          <Typography
            color="textSecondary"
            gutterBottom
            variant="caption"
            sx={{ fontWeight: 600, textTransform: 'uppercase' }}
          >
            {label}
          </Typography>
        </Box>

        <Stack spacing={1}>
          <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: bgColor,
              }}
            >
              {value}
            </Typography>
          </Box>

          {percentage !== undefined && (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 0.5,
                }}
              >
                <Typography variant="caption" color="textSecondary">
                  Porcentaje
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 600, color: bgColor }}
                >
                  {percentage}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: bgColor,
                    borderRadius: 3,
                  },
                }}
              />
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};