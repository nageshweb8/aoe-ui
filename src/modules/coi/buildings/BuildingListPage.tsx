'use client';

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

import { PageShell } from '@shared/components';

import { EmptyState } from '../shared/components';

/**
 * Building List Page — Manage buildings/properties and their
 * certificate holder information and assigned requirement templates.
 *
 * TODO: Wire to buildingService.getBuildings() once API is ready.
 */
export function BuildingListPage() {
  const buildings: unknown[] = [];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <PageShell
          title="Buildings & Properties"
          description="Manage your buildings, certificate holders, and COI requirements"
        />
        <Button variant="contained" size="small" disabled>
          Add Building
        </Button>
      </Box>

      <Card sx={{ mt: 2 }}>
        <CardContent sx={{ p: 0 }}>
          {buildings.length === 0 ? (
            <EmptyState
              title="No Buildings"
              description="Add a building or property to start managing COI requirements."
              action={
                <Button variant="contained" size="small" disabled>
                  Add Building
                </Button>
              }
            />
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Building Name</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Certificate Holder</TableCell>
                    <TableCell>Template</TableCell>
                    <TableCell>Vendors</TableCell>
                    <TableCell>Compliance</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: 'center', py: 2 }}
                      >
                        Data rows — Coming Soon
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
