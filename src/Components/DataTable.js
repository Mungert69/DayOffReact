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


function renderTableHeader(weekData) {

    return (
        <TableRow >
            <TableCell>{' - '} </TableCell>
            {weekData.headerDates.map((headerDate) => <TableCell >{' '}{moment(headerDate).format('ddd')}{' '}</TableCell>
            )}
            
          </TableRow>
       )


}

function renderTableBody(weekData, selectedCol, selectedRow, durations, types, setHoliday) {
    return weekData.userDataRows.map((userDataRow, indexRow) => {

        return (



            <TableRow  >
                <TableCell>{userDataRow.user.firstName}</TableCell>
                {userDataRow.userRow.map((holiday, indexCol) => {
                    var style = {
                            color: 'black',
                          };
                          if ( indexRow === selectedRow) {
                            style = {
                                color: 'blue'
                              };
                        };
                    if ( indexCol === selectedCol && indexRow === selectedRow) {
                        style = {
                            font: 'bold',
                            color: 'red'
                          };
                    };
                    return holiday.holidayID == -1 ?
                        <TableCell>
                            <a style={style} onClick={() => setHoliday(holiday, indexRow, indexCol)} >{' ---- '}</a>
                        </TableCell>
                        :
                        <TableCell style={style}>
                            <a style={style} onClick={() => setHoliday(holiday, indexRow, indexCol)}>{durations[holiday.duration]}{' : '}{types[holiday.holType]} </a>
                        </TableCell>
                }

                )}
            </TableRow>
        )
    })
}

export default function DataTable(props) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          {renderTableHeader(props.weekData)}
        </TableHead>
        <TableBody>
          {renderTableBody(props.weekData, props.selectedCol, props.selectedRow, props.durations, props.types, props.setHoliday)}
        </TableBody>
      </Table>
    </TableContainer>
  );
}