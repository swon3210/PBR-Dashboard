'use client';

import * as React from 'react';
import { OutlinedInput, Skeleton } from '@mui/material';
// import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { useSelection } from '@/hooks/use-selection';

export interface Company {
  id: string;
  avatar?: string;
  name: string;
}

interface CompaniesTableProps {
  loading?: boolean;
  page?: number;
  rows?: Company[];
  rowsPerPage?: number;
  onPageChange: (page: number) => void;
}

const TableRowsLoader = ({ rowsCount }: { rowsCount: number }) => {
  return Array(rowsCount)
    .fill(0)
    .map((_, index) => (
      <TableRow key={index}>
        <TableCell component="th" scope="row">
          <Skeleton animation="wave" variant="text" />
        </TableCell>
        <TableCell>
          <Skeleton animation="wave" variant="text" />
        </TableCell>
        {/* <TableCell>
          <Skeleton animation="wave" variant="text" />
        </TableCell>
        <TableCell>
          <Skeleton animation="wave" variant="text" />
        </TableCell> */}
      </TableRow>
    ));
};

export function CompaniesTable({
  loading,
  rows = [],
  page = 0,
  rowsPerPage = 10,
  onPageChange,
}: CompaniesTableProps): React.JSX.Element {
  const [searchText, setSearchText] = React.useState('');

  const rowIds = React.useMemo(() => {
    return rows.map((customer) => customer.id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  const filteredRows = rows.filter((row) => row.name.toLowerCase().includes(searchText.toLowerCase()));
  const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const paginatedFilteredRows = paginatedRows.filter((row) =>
    row.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      selectAll();
    } else {
      deselectAll();
    }
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ overflowX: 'auto', flexGrow: '1' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox checked={selectedAll} indeterminate={selectedSome} onChange={handleCheckboxChange} />
              </TableCell>
              <TableCell>
                <OutlinedInput
                  defaultValue=""
                  fullWidth
                  size="small"
                  placeholder="회사명"
                  value={searchText}
                  onChange={handleSearchInputChange}
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRowsLoader rowsCount={10} />
            ) : (
              paginatedFilteredRows.map((row) => {
                const isSelected = selected?.has(row.id);

                return (
                  <TableRow hover key={row.id} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            selectOne(row.id);
                          } else {
                            deselectOne(row.id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                        {/* <Avatar /> */}
                        <Typography variant="subtitle2">{row.name}</Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={filteredRows.length}
        onPageChange={(_, pageIndex) => {
          onPageChange(pageIndex);
        }}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]}
      />
    </Card>
  );
}
