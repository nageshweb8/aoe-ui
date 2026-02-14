'use client';

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AlertTriangle } from 'lucide-react';

import type { COIPolicyExpiration } from '@/types/coi';
import { formatPolicyDate } from '@/utils/coiValidation';

interface COIExpirationAlertProps {
  readonly expirations: readonly COIPolicyExpiration[];
}

export function COIExpirationAlert({ expirations }: COIExpirationAlertProps) {
  if (expirations.length === 0) return null;

  return (
    <Alert
      severity="error"
      icon={<AlertTriangle size={22} />}
      sx={{
        '& .MuiAlert-message': { width: '100%' },
      }}
    >
      <AlertTitle sx={{ fontWeight: 700 }}>
        {expirations.length === 1
          ? '1 Policy Has Expired'
          : `${expirations.length} Policies Have Expired`}
      </AlertTitle>

      <Typography variant="body2" sx={{ mb: 1.5 }}>
        The following policies are expired as of today and require immediate attention:
      </Typography>

      <Box component="ul" sx={{ m: 0, pl: 2.5, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        {expirations.map((exp) => (
          <li key={`${exp.policyNumber}-${exp.typeOfInsurance}`}>
            <Typography variant="body2" component="span">
              <strong>{exp.typeOfInsurance}</strong> (Policy #{exp.policyNumber}) —
              expired on {formatPolicyDate(exp.policyExpirationDate)},{' '}
              <strong>{exp.daysExpired} day{exp.daysExpired !== 1 ? 's' : ''} ago</strong>
            </Typography>
          </li>
        ))}
      </Box>
    </Alert>
  );
}
