import { useState, useEffect } from 'react';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const API = "https://financialmodelingprep.com/api/v4/"

const columns = [
    {id: 'transactionDate', label: 'Transactin Date', minWidth: 170},
    {id: 'assetTraded', label: 'Asset Traded', minWidth: 170},
    {id: 'transactionType', label: 'Transactin Type', minWidth: 170},
    {id: 'amount', label: 'Amount', minWidth: 170},
    {id: 'representative', label: 'Rep. Name', minWidth: 170},
    {id: 'district', label: 'District', minWidth: 170},
]

function createData(transactionDate, assetTraded, transactionType, amount, representative, district) {
    return {transactionDate, assetTraded, transactionType, amount, representative, district};
}

function GovernmentTrading() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    

    useEffect(() => {
        fetch(`${API}senate-disclosure-rss-feed?page=0&apikey=${process.env.REACT_APP_API_KEY}`)
        .then((r) => r.json())
        .then((r) => {
            const newRows = r.map((transaction) => {
                return createData(
                    transaction.transactionDate,
                    transaction.assetDescription,
                    transaction.type,
                    transaction.amount,
                    transaction.representative,
                    transaction.district
                );
            })
            setRows(newRows);
            setIsLoading(false);
        })
    },[])
    
    return (
        <>
            {rows.length > 0 && (
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 840 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => {
                                        return (
                                            <TableRow key={row.code} hover role="checkbox" tabIndex={-1}>
                                                {columns.map((column) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell key={column.id} align={column.align}>
                                                            {column.format && typeof value === 'number'
                                                                ? column.format(value)
                                                                : value}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[20, 50, 100]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            )}
        </>
    )
}
export default GovernmentTrading;