'use client';
import React, { useState } from 'react';

import {
  Autocomplete,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

/* Types */

interface RowData {
  id: number;
  name: string;
  age: number;
  location: string;
  contact: string;
}

interface Filters {
  id: string;
  name: string;
  age: string;
  location: string;
  contact: string;
}

/* Data Create Function */

function createData(
  id: number,
  name: string,
  age: number,
  location: string,
  contact: string,
): RowData {
  return { id, name, age, location, contact };
}

/* Sample Data */

const rows: RowData[] = [
  createData(1, 'Ravi', 25, 'Hyderabad', '9000000001'),
  createData(2, 'Sita', 28, 'Bangalore', '9000000002'),
  createData(3, 'Kiran', 22, 'Chennai', '9000000003'),
  createData(4, 'Anjali', 30, 'Mumbai', '9000000004'),
  createData(5, 'Rahul', 27, 'Delhi', '9000000005'),
  createData(6, 'Priya', 24, 'Pune', '9000000006'),
];

/* Get Unique Locations for Dropdown */

const uniqueLocations = Array.from(new Set(rows.map((r) => r.location)));

export default function CollapsibleTable() {
  const [filters, setFilters] = useState<Filters>({
    id: '',
    name: '',
    age: '',
    location: '',
    contact: '',
  });

  const [page, setPage] = useState<number>(0);
  const rowsPerPage = 8;

  /* Filtering */

  const filteredData = rows.filter((row) =>
    (Object.keys(filters) as (keyof Filters)[]).every((key) =>
      String(row[key]).toLowerCase().includes(filters[key].toLowerCase()),
    ),
  );

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper elevation={3}>
      <TableContainer>
        <Table
          sx={{
            '& .MuiTableCell-root': {
              borderBottom: 'none',
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell />
              {['ID', 'NAME', 'AGE', 'LOCATION', 'CONTACT'].map((col) => (
                <TableCell key={col}>
                  <Typography fontWeight="light">{col}</Typography>
                </TableCell>
              ))}
            </TableRow>

            {/* Filter Row */}
            <TableRow>
              <TableCell />

              {/* ID */}
              <TableCell>
                <TextField
                  size="small"
                  value={filters.id}
                  onChange={(e) => setFilters({ ...filters, id: e.target.value })}
                  sx={{ '& .MuiInputBase-root': { height: 30, fontSize: 13 } }}
                />
              </TableCell>

              {/* NAME */}
              <TableCell>
                <TextField
                  size="small"
                  value={filters.name}
                  onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                  sx={{ '& .MuiInputBase-root': { height: 30, fontSize: 13 } }}
                />
              </TableCell>

              {/* AGE */}
              <TableCell>
                <TextField
                  size="small"
                  value={filters.age}
                  onChange={(e) => setFilters({ ...filters, age: e.target.value })}
                  sx={{ '& .MuiInputBase-root': { height: 30, fontSize: 13 } }}
                />
              </TableCell>

              {/* LOCATION - Autocomplete Dropdown */}
              <TableCell>
                <Autocomplete
                  size="small"
                  options={uniqueLocations}
                  value={filters.location || null}
                  onChange={(_, newValue) =>
                    setFilters({
                      ...filters,
                      location: newValue || '',
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{
                        '& .MuiInputBase-root': {
                          height: 30,
                          fontSize: 13,
                        },
                      }}
                    />
                  )}
                />
              </TableCell>

              {/* CONTACT */}
              <TableCell>
                <TextField
                  size="small"
                  value={filters.contact}
                  onChange={(e) => setFilters({ ...filters, contact: e.target.value })}
                  sx={{ '& .MuiInputBase-root': { height: 30, fontSize: 13 } }}
                />
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.map((row) => (
              <TableRow key={row.id}>
                <TableCell />
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.age}</TableCell>
                <TableCell>{row.location}</TableCell>
                <TableCell>{row.contact}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[8]}
      />
    </Paper>
  );
}
