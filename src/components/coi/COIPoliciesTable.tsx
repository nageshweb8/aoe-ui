'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import { useTheme, alpha } from '@mui/material/styles';
import { AlertTriangle, CheckCircle } from 'lucide-react';

import type { COIPolicy } from '@/types/coi';
import { formatPolicyDate, isDateExpired } from '@/utils/coiValidation';

interface COIPoliciesTableProps {
  readonly policies: readonly COIPolicy[];
}

export function COIPoliciesTable({ policies }: COIPoliciesTableProps) {
  const theme = useTheme();

  if (policies.length === 0) {
    return (
      <Card>
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            No policies found in this certificate.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          Policies ({policies.length})
        </Typography>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Type of Insurance</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Policy No.</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Effective Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Expiration Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {policies.map((policy) => {
                const expired = isDateExpired(policy.policyExpirationDate);
                return (
                  <TableRow
                    key={`${policy.policyNumber}-${policy.typeOfInsurance}`}
                    sx={{
                      bgcolor: expired ? alpha(theme.palette.error.main, 0.04) : 'transparent',
                      '&:hover': { bgcolor: alpha(theme.palette.action.hover, 0.06) },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {policy.insurerLetter && (
                          <Chip
                            label={policy.insurerLetter}
                            size="small"
                            variant="outlined"
                            sx={{ minWidth: 28, fontWeight: 700 }}
                          />
                        )}
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {policy.typeOfInsurance}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>
                        {policy.policyNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatPolicyDate(policy.policyEffectiveDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: expired ? 700 : 400, color: expired ? 'error.main' : 'text.primary' }}>
                        {formatPolicyDate(policy.policyExpirationDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {expired ? (
                        <Tooltip title="This policy has expired" arrow>
                          <Chip
                            icon={<AlertTriangle size={14} />}
                            label="Expired"
                            color="error"
                            size="small"
                            variant="filled"
                            sx={{ fontWeight: 600 }}
                          />
                        </Tooltip>
                      ) : (
                        <Chip
                          icon={<CheckCircle size={14} />}
                          label="Active"
                          color="success"
                          size="small"
                          variant="filled"
                          sx={{ fontWeight: 600 }}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Limits section per policy */}
        {policies.some((p) => p.limits && Object.keys(p.limits).length > 0) && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>
              Coverage Limits
            </Typography>
            {policies
              .filter((p) => p.limits && Object.keys(p.limits).length > 0)
              .map((policy) => (
                <Box
                  key={`limits-${policy.policyNumber}`}
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.divider, 0.3),
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {policy.typeOfInsurance}
                  </Typography>
                  <Box
                    component="table"
                    sx={{
                      width: '100%',
                      mt: 1,
                      borderCollapse: 'collapse',
                      '& td': { py: 0.25, fontSize: '0.8125rem' },
                      '& td:first-of-type': { color: 'text.secondary', pr: 2 },
                      '& td:last-of-type': { fontWeight: 600, fontFamily: 'monospace', textAlign: 'right' },
                    }}
                  >
                    <tbody>
                      {Object.entries(policy.limits!).map(([limitName, limitValue]) => (
                        <tr key={limitName}>
                          <td>{limitName}</td>
                          <td>{limitValue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Box>
                </Box>
              ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
