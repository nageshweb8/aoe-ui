'use client';

import Link from 'next/link';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Plus } from 'lucide-react';

import { PageShell } from '@shared/components';

import { EmptyState } from '../shared/components';

/**
 * Vendor List Page — Data grid showing all vendors with status,
 * buildings assigned, COI count, compliance %, and last updated.
 *
 * TODO: Wire to vendorService.getVendors() once API is ready.
 */
export function VendorListPage() {
  // Placeholder — will be replaced with TanStack Query + real data
  const vendors: unknown[] = [];

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <PageShell
          title="Vendors"
          description="Manage vendors and their certificate of insurance compliance"
        />
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          component={Link}
          href="/certificate-of-insurance/vendors/add"
          size="small"
        >
          Add Vendor
        </Button>
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          {vendors.length === 0 ? (
            <EmptyState
              title="No vendors yet"
              description="Add your first vendor to start tracking their COI compliance."
              action={
                <Button
                  variant="outlined"
                  startIcon={<Plus size={16} />}
                  component={Link}
                  href="/certificate-of-insurance/vendors/add"
                  size="small"
                >
                  Add Vendor
                </Button>
              }
            />
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Vendor Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Buildings</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>COIs</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Compliance</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Last Updated</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', py: 2 }}>
                        Data rows will be populated from the API.
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
