'use client';
import React, { useState } from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Collapse,
  IconButton,
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
import Autocomplete from '@mui/material/Autocomplete';

import ExpandTable from './ExpandTable';

/* TYPES */

interface HistoryItem {
  date: string;
  action: string;
}

interface RowData {
  id: number;
  name: string;
  age: number;
  location: string;
  contact: string;
  history: HistoryItem[];
}

interface Filters {
  id: string;
  name: string;
  age: string;
  location: string;
  contact: string;
}

/* DATA */

function createData(
  id: number,
  name: string,
  age: number,
  location: string,
  contact: string,
): RowData {
  return {
    id,
    name,
    age,
    location,
    contact,
    history: [
      { date: '2024-01-01', action: 'Login' },
      { date: '2024-01-05', action: 'Updated Profile' },
    ],
  };
}

const rows: RowData[] = [
  createData(1, 'Ravi', 25, 'Hyderabad', '9000000001'),
  createData(2, 'Sita', 28, 'Bangalore', '9000000002'),
  createData(3, 'Kiran', 22, 'Chennai', '9000000003'),
  createData(4, 'Anjali', 30, 'Mumbai', '9000000004'),
  createData(5, 'Rahul', 27, 'Delhi', '9000000005'),
  createData(6, 'Priya', 24, 'Pune', '9000000006'),
  createData(7, 'Arjun', 29, 'Hyderabad', '9000000007'),
  createData(8, 'Divya', 26, 'Vizag', '9000000008'),
  createData(9, 'Manoj', 31, 'Kolkata', '9000000009'),
  createData(10, 'Sneha', 23, 'Jaipur', '9000000010'),
];

/* Unique Location Options for Dropdown */

const locationOptions: string[] = [...new Set(rows.map((row) => row.location))];

/* ROW COMPONENT */

interface RowProps {
  row: RowData;
}

function Row({ row }: RowProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <TableRow>
        <TableCell sx={{ borderBottom: 'none', width: 40 }}>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell sx={{ borderBottom: 'none' }}>{row.id}</TableCell>
        <TableCell sx={{ borderBottom: 'none' }}>{row.name}</TableCell>
        <TableCell sx={{ borderBottom: 'none' }}>{row.age}</TableCell>
        <TableCell sx={{ borderBottom: 'none' }}>{row.location}</TableCell>
        <TableCell sx={{ borderBottom: 'none' }}>{row.contact}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={6} sx={{ borderBottom: 'none', p: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <ExpandTable />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

/* MAIN COMPONENT */

export default function CollapsibleTable() {
  const [filters, setFilters] = useState<Filters>({
    id: '',
    name: '',
    age: '',
    location: '',
    contact: '',
  });

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage] = useState<number>(8);

  const filteredData = rows.filter((row) =>
    (Object.keys(filters) as (keyof Filters)[]).every((key) =>
      row[key].toString().toLowerCase().includes(filters[key].toLowerCase()),
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
              <TableCell sx={{ width: 40 }} />
              {['ID', 'NAME', 'AGE', 'LOCATION', 'CONTACT'].map((col) => (
                <TableCell key={col}>
                  <Typography fontWeight="light">{col}</Typography>
                </TableCell>
              ))}
            </TableRow>

            {/* FILTER ROW */}
            <TableRow>
              <TableCell />
              {(Object.keys(filters) as (keyof Filters)[]).map((col) => (
                <TableCell key={col}>
                  {col === 'location' ? (
                    <Autocomplete
                      size="small"
                      options={locationOptions}
                      value={filters.location || null}
                      onChange={(_, newValue: string | null) =>
                        setFilters({
                          ...filters,
                          location: newValue || '',
                        })
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select Location"
                          sx={{
                            '& .MuiInputBase-root': {
                              height: 30,
                              fontSize: 13,
                            },
                          }}
                        />
                      )}
                    />
                  ) : (
                    <TextField
                      size="small"
                      value={filters[col]}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFilters({ ...filters, [col]: e.target.value })
                      }
                      sx={{
                        '& .MuiInputBase-root': {
                          height: 30,
                          fontSize: 13,
                        },
                      }}
                    />
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.map((row) => (
              <Row key={row.id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={(_, newPage: number) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[8]}
        onRowsPerPageChange={() => {}}
      />
    </Paper>
  );
}
