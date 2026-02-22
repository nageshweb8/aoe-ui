'use client';
import React, { useState } from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Autocomplete,
  Box,
  Checkbox,
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
  TableSortLabel,
  TextField,
} from '@mui/material';

import ExpandTable from './ExpandTable';

interface RowData {
  id: number;
  name: string;
  age: number;
  location: string;
  contact: string;
}

type FilterType = {
  [key in keyof RowData]: string;
};

const initialData: RowData[] = [
  { id: 1, name: 'Ravi', age: 25, location: 'Hyderabad', contact: '9876543210' },
  { id: 2, name: 'Sita', age: 28, location: 'Vijayawada', contact: '9123456780' },
  { id: 3, name: 'Kiran', age: 30, location: 'Chennai', contact: '9012345678' },
  { id: 4, name: 'Anjali', age: 22, location: 'Bangalore', contact: '9988776655' },
];

export default function FilterTable() {
  const [data] = useState<RowData[]>(initialData);
  const [selected, setSelected] = useState<number[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);

  const [filters, setFilters] = useState<FilterType>({
    id: '',
    name: '',
    age: '',
    location: '',
    contact: '',
  });

  const [orderBy, setOrderBy] = useState<keyof RowData>('id');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(2);

  const locationOptions = [...new Set(data.map((row) => row.location))];

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field: keyof RowData, value: string) => {
    setFilters({ ...filters, [field]: value });
    setPage(0);
  };

  const handleCheckboxChange = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = paginatedData.map((row) => row.id);
      setSelected(allIds);
    } else {
      setSelected([]);
    }
  };

  const handleSort = (property: keyof RowData) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleExpand = (id: number) => {
    setExpanded(expanded === id ? null : id);
  };

  const filteredData = data.filter(
    (row) =>
      row.id.toString().includes(filters.id) &&
      row.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      row.age.toString().includes(filters.age) &&
      row.location.toLowerCase().includes(filters.location.toLowerCase()) &&
      row.contact.includes(filters.contact),
  );

  const sortedData = [...filteredData].sort((a, b) => {
    const valueA = a[orderBy];
    const valueB = b[orderBy];

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return order === 'asc' ? valueA - valueB : valueB - valueA;
    } else {
      return order === 'asc'
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    }
  });

  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const isAllSelected =
    paginatedData.length > 0 && paginatedData.every((row) => selected.includes(row.id));

  const isIndeterminate = selected.length > 0 && !isAllSelected;

  return (
    <Box p={3}>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#98d064' }}>
                <TableCell sx={{ color: 'white' }} />

                <TableCell padding="checkbox">
                  <Checkbox
                    sx={{
                      color: 'white',
                      '&.Mui-checked': { color: 'white' },
                    }}
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onChange={handleSelectAll}
                  />
                </TableCell>

                {(['id', 'name', 'age', 'location', 'contact'] as (keyof RowData)[]).map(
                  (column) => (
                    <TableCell key={column} sx={{ color: 'white' }}>
                      <TableSortLabel
                        active={orderBy === column}
                        direction={orderBy === column ? order : 'asc'}
                        onClick={() => handleSort(column)}
                        sx={{
                          color: 'white',
                          '&.Mui-active': { color: 'white' },
                          '& .MuiTableSortLabel-icon': { color: 'white !important' },
                        }}
                      >
                        <strong>{column.toUpperCase()}</strong>
                      </TableSortLabel>

                      {column === 'location' ? (
                        <Autocomplete
                          size="small"
                          options={locationOptions}
                          value={filters.location || null}
                          onChange={(_, newValue) => handleFilterChange('location', newValue || '')}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Location"
                              sx={{
                                mt: 1,
                                backgroundColor: 'white',
                                borderRadius: 1,
                              }}
                            />
                          )}
                        />
                      ) : (
                        <TextField
                          size="small"
                          value={filters[column]}
                          onChange={(e) => handleFilterChange(column, e.target.value)}
                          placeholder={`Filter ${column}`}
                          sx={{
                            mt: 1,
                            backgroundColor: 'white',
                            borderRadius: 1,
                          }}
                        />
                      )}
                    </TableCell>
                  ),
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    sx={{
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                      '&:hover': {
                        backgroundColor: '#2fa5b4 !important',
                      },
                    }}
                  >
                    <TableCell>
                      <IconButton size="small" onClick={() => handleExpand(row.id)}>
                        {expanded === row.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>

                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.includes(row.id)}
                        onChange={() => handleCheckboxChange(row.id)}
                      />
                    </TableCell>

                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.age}</TableCell>
                    <TableCell>{row.location}</TableCell>
                    <TableCell>{row.contact}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={7} sx={{ padding: 0 }}>
                      <Collapse in={expanded === row.id} timeout="auto" unmountOnExit>
                        <Box margin={2}>
                          <ExpandTable />
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={sortedData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[4, 8, 10]}
        />
      </Paper>
    </Box>
  );
}
