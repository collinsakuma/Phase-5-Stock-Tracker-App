import { useEffect, useState } from 'react';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const columns = [
    { id: 'tradeDate', label: 'Trade date', minWidth: 170 },
    { id: 'symbol', label: 'Symbol', minWidth: 100 },
    {
        id: 'Name',
        label: 'Name',
        minWidth: 170,
        align: 'right',
    },
    {
        id: 'transactionType',
        label: 'Transaction type',
        minWidth: 170,
        align: 'right',
    },
    {
        id: 'Quantity',
        label: 'Quantity',
        minWidth: 170,
        align: 'right',
    },
    {
        id: 'sharePrice',
        label: 'Share Price',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toFixed(2),
    },
    {
        id: 'boughtTotal',
        label: 'Amount bought',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toFixed(2),
    },
    {
        id: 'soldTotal',
        label: 'Amount sold',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toFixed(2),
    },
  ];

function createData(tradeDate, symbol, Name, transactionType, Quantity, sharePrice, boughtTotal, soldTotal) {
return {tradeDate, symbol, Name, transactionType, Quantity, sharePrice, boughtTotal, soldTotal};
}
function Transactions() {
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
        fetch('/transactions_by_user_id')
            .then((r) => r.json())
            .then((r) => {
                const newRows = r.map((transaction) => {
                    const transactionBought = () => {
                        if (transaction.bought_total === 0) {
                            return null;
                        }
                        return `$ ${(transaction.bought_total).toFixed(2)}`;
                    }
                    const transactionSold = () => {
                        if (transaction.sold_total === 0) {
                            return null;
                        }
                        return `$ ${(transaction.sold_total).toFixed(2)}`;
                    }
                    const transactionType = () => {
                        if (transaction.bought_total === 0) {
                            return "Sell";
                        }
                        return "Buy";
                    }
                    
                    return createData(
                        transaction.created_at,
                        (transaction.stock.ticker).toUpperCase(), 
                        transaction.stock.company_name, 
                        transactionType(), 
                        transaction.quantity,
                        `$ ${(transaction.share_price).toFixed(2)}`, 
                        transactionBought(), 
                        transactionSold()
                    );
                });
                setRows(newRows);
                setIsLoading(false);
            })
    },[])

    if (isLoading) {
        return <div>Loading...</div>;
    }
    
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
    );
}

export default Transactions;