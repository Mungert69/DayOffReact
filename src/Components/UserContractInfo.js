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
const useStyles = makeStyles({
  table: {
  
  },
});



export default function UserContactInfo(props) {
  const classes = useStyles();
  const{user}=props;
    if (user===undefined) return null;
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const startDate  = new Date(user.startDate);
const endDate  = new Date(user.endDate);
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table}  aria-label="User Contract Info">
        <TableHead>
        <TableRow size="small">
            <TableCell align="center" colSpan={2}>
              User contract info for {user.firstName}
            </TableCell>
            
          </TableRow>
          </TableHead>
        <TableBody>
        <TableRow size="small">
            <TableCell align="center" colSpan={2}>
             Contract period From
            </TableCell>
            <TableCell align="center" colSpan={2}>
             {startDate.toLocaleDateString("en-US", options)}
            </TableCell>
          </TableRow>
          <TableRow size="small">
            <TableCell align="center" colSpan={2}>
             Contract period To
            </TableCell>
            <TableCell align="center" colSpan={2}>
             {endDate.toLocaleDateString("en-US", options)}
            </TableCell>
          </TableRow>
          <TableRow size="small">
            <TableCell align="center" colSpan={2}>
             Number of allowed days of each week
            </TableCell>
            <TableCell align="center" colSpan={2}>
             {user.daysAllowedPerWeek}
            </TableCell>
          </TableRow>
          <TableRow size="small">
            <TableCell align="center" colSpan={2}>
             Number of holiday days in contract period
            </TableCell>
            <TableCell align="center" colSpan={2}>
             {user.totalHolidays}
            </TableCell>
          </TableRow>
          <TableRow size="small">
            <TableCell align="center" colSpan={2}>
             Number of holiday days booked or taken
            </TableCell>
            <TableCell align="center" colSpan={2}>
             {user.holidaysTaken}
            </TableCell>
          </TableRow>
           </TableBody>
      </Table>
    </TableContainer>
  );
}