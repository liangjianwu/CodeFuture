import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { TableHead, Radio, ListItemButton, ListItemText } from '@mui/material';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Checkbox from '@mui/material/Checkbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};


export default function MyTable(props) {
    const { totalRow, rows, headers, OpentionComponent, checkbox, onChangePage, onChangeRowsPerPage, onSelected, defaultSelected,order,onOrder,showPageination } = props
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(props.rowsPerPage);
    const [selected, setSelected] = useState(defaultSelected ? defaultSelected : [])
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = 0;//page > 0 ? Math.max(0, (1 + page) * rowsPerPage - totalRow) : 0;    
    useEffect(() => {
        setSelected(defaultSelected ? defaultSelected : [])
    }, [rows, defaultSelected])
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        onChangePage && onChangePage(newPage, rowsPerPage)
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        onChangeRowsPerPage && onChangeRowsPerPage(parseInt(event.target.value, 10))
    };
    const setItemSelected = (selects) => {
        setSelected(selects)
        onSelected && onSelected(selects)
    }
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.id);
            setItemSelected(newSelecteds);
            return;
        }
        setItemSelected([]);
    };
    const handleItemClick = (event, id) => {
        if (props.singleOption) {
            setItemSelected([id])
            return
        }
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setItemSelected(newSelected);
    };
    const rowsSelectedStatus = () => {
        if (props.singleOption) return
        let ret = 0
        rows.map(row => {
            if (selected.indexOf(row.id) >= 0) ret += 1
        })
        return ret === 0 ? -1 : (ret === rows.length ? 1 : 0)
    }
    const isSelected = (id) => selected.indexOf(id) !== -1;
    return (<Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer component={Paper} >
            <Table sx={{ width: "100%" }} size={rows.length > 10 ? 'small' : ''} aria-label="custom pagination table">
                <TableHead>
                    <TableRow sx={{ background: '#00f1' }}>
                        {checkbox && <TableCell padding="checkbox">{props.singleOption !== true && <Checkbox
                            color="primary"
                            indeterminate={rowsSelectedStatus() === 0}
                            checked={rows.length > 0 && rowsSelectedStatus() === 1}
                            onChange={handleSelectAllClick}
                            inputProps={{
                                'aria-label': 'select all desserts',
                            }}
                        />}</TableCell>}
                        {headers.map((item, index) => {
                            return <TableCell key={index} align={index > 0 ? 'left' : 'left'}>
                                {order && order.fields.indexOf(item.name)>=0 ? <ListItemButton sx={{p:0,margin:0}} onClick={()=>{onOrder?onOrder(item):console.log("no function")}}>                                    
                                {item.showName}{order.name === item.name ? (order.order === 'desc' ? <ExpandMore color='secondary'/>:<ExpandLess  color='secondary'/>):<ExpandMore color='disabled'/>}
                                </ListItemButton>:item.showName
                            }</TableCell>
                        })}
                        {OpentionComponent && <TableCell sx={{ width: 50 }}></TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => {
                        const isItemSelected = isSelected(row.id);
                        const labelId = `enhanced-table-checkbox-${index}`;
                        return <TableRow key={index}
                            hover
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            selected={isItemSelected}
                        >
                            {checkbox && <TableCell padding="checkbox">{props.singleOption ? <Radio
                                color="primary"
                                checked={isItemSelected}
                                onClick={(event) => handleItemClick(event, row.id)}
                                inputProps={{
                                    'aria-labelledby': labelId,
                                }}
                            /> : <Checkbox
                                color="primary"
                                checked={isItemSelected}
                                onClick={(event) => handleItemClick(event, row.id)}
                                inputProps={{
                                    'aria-labelledby': labelId,
                                }}
                            />}</TableCell>}
                            {headers.map((hd, i) => {
                                return i == 0 ? <TableCell id={labelId} key={i} onClick={(event) => handleItemClick(event, row.id)} component="th" scope="row">{hd.func ? hd.func(row[hd.name], index, row) : row[hd.name]}</TableCell> :
                                    <TableCell onClick={(event) => handleItemClick(event, row.id)} key={i} align="left">{hd.func ? hd.func(row[hd.name], index, row) : row[hd.name]}</TableCell>
                            })}
                            {OpentionComponent && <TableCell sx={{ width: 50 }}>{OpentionComponent(row.id, index)}</TableCell>}
                        </TableRow>
                    })}

                    {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={headers.length + 2} />
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
        {showPageination !== false &&
            <TablePagination
                rowsPerPageOptions={-1}
                colSpan={headers.length + (checkbox ? 1 : 0) + (OpentionComponent ? 1 : 0)}
                count={totalRow}
                rowsPerPage={rowsPerPage}
                page={page}
                // SelectProps={{
                //     inputProps: {
                //         'aria-label': 'rows per page',
                //     },
                //     native: true,
                // }}
                labelRowsPerPage={""}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
            />}
    </Paper>
    );
}
