'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid2 from '@mui/material/Grid2';
import { useTheme, alpha } from '@mui/material/styles';
import { ShieldCheck, ShieldAlert, ShieldQuestion, Building, User, FileText, Hash } from 'lucide-react';

import type { COIVerificationResponse } from '@/types/coi';

interface COIResultsSummaryProps {
  readonly data: COIVerificationResponse;
}

const statusConfig = {
  verified: { label: 'Verified', color: 'success' as const, Icon: ShieldCheck },
  expired: { label: 'Expired Policies', color: 'error' as const, Icon: ShieldAlert },
  partial: { label: 'Partial Match', color: 'warning' as const, Icon: ShieldQuestion },
  error: { label: 'Error', color: 'error' as const, Icon: ShieldAlert },
};

function InfoBlock({
  icon,
  label,
  value,
  subValue,
}: {
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly value?: string;
  readonly subValue?: string;
}) {
  if (!value) return null;
  return (
    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
      <Box sx={{ color: 'text.secondary', mt: 0.25 }}>{icon}</Box>
      <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {label}
        </Typography>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {value}
        </Typography>
        {subValue && (
          <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
            {subValue}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export function COIResultsSummary({ data }: COIResultsSummaryProps) {
  const theme = useTheme();
  const { label, color, Icon } = statusConfig[data.status];

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Verification Result
          </Typography>
          <Chip
            icon={<Icon size={16} />}
            label={label}
            color={color}
            variant="filled"
            size="medium"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {data.message && (
          <Typography
            variant="body2"
            sx={{
              mb: 2,
              p: 1.5,
              borderRadius: 1,
              bgcolor: alpha(theme.palette[color].main, 0.08),
              color: theme.palette[color].dark,
            }}
          >
            {data.message}
          </Typography>
        )}

        <Divider sx={{ mb: 2 }} />

        {/* Certificate info */}
        <Grid2 container spacing={3}>
          {data.certificateNumber && (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <InfoBlock
                icon={<Hash size={16} />}
                label="Certificate Number"
                value={data.certificateNumber}
              />
            </Grid2>
          )}

          {data.producer && (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <InfoBlock
                icon={<Building size={16} />}
                label="Producer / Agent"
                value={data.producer.name}
                subValue={[data.producer.address, data.producer.phone, data.producer.email]
                  .filter(Boolean)
                  .join('\n')}
              />
            </Grid2>
          )}

          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <InfoBlock
              icon={<User size={16} />}
              label="Insured"
              value={data.insured.name}
              subValue={data.insured.address}
            />
          </Grid2>

          {data.certificateHolder && (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <InfoBlock
                icon={<FileText size={16} />}
                label="Certificate Holder"
                value={data.certificateHolder.name}
                subValue={data.certificateHolder.address}
              />
            </Grid2>
          )}
        </Grid2>

        {/* Insurers */}
        {data.insurers && data.insurers.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Insurer Companies
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {data.insurers.map((insurer) => (
                <Chip
                  key={insurer.letter}
                  label={`${insurer.letter}: ${insurer.name}${insurer.naicNumber ? ` (NAIC ${insurer.naicNumber})` : ''}`}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}
