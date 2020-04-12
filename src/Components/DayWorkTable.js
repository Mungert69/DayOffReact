import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import moment from "moment";
import Select from 'react-select';


function renderTableBody(dayWorkObjs) {
    if (dayWorkObjs==undefined) return null;
    return dayWorkObjs.map((dayWorkObj, indexRow) => {

        return (

           
            <TableRow >
  <TableCell>{dayWorkObj.dayOfWeek}
                </TableCell>
                <TableCell>
                    {dayWorkObj.ohcAm}
                </TableCell>
                <TableCell>
                    {dayWorkObj.ohcPm}
                </TableCell>
                <TableCell>
                    {dayWorkObj.mcAm}
                </TableCell>
                <TableCell>
                    {dayWorkObj.mcPm}
                </TableCell>
            </TableRow>

                 )
    })
}

export default function DataTable(props) {

    return (
        <TableContainer component={Paper}>
            <Table aria-label="Day Work Table">
            <TableHead>
        <TableRow size="small">
           
        <TableCell >
             Day
            </TableCell>
            <TableCell >
             OHC AM
            </TableCell>
            <TableCell >
             OHC PM
            </TableCell>
            <TableCell >
             MC AM
            </TableCell>
            <TableCell >
             MC PM
            </TableCell>
          </TableRow>
             </TableHead>
                <TableBody>
                        {renderTableBody(props.dayWorkObjs)}
                </TableBody>
            </Table>
        </TableContainer>
    );
}