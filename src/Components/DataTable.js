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


function renderTableHeader(weekData,setUserFilter) {

    return (
        <TableRow >
            <TableCell> <a  onClick={() => setUserFilter('All')} >All</a> </TableCell>
            <TableCell>{' '} </TableCell>
            {weekData.headerDates.map((headerDate) => <TableCell >{' '}{moment(headerDate).format('ddd')}{' '}</TableCell>
            )}
            
          </TableRow>
       )


}



function renderTableBody(weekData, selectedCol, selectedRow, durations, holTypes, workTypes,setEvent,setUserFilter,userFilter) {
    return weekData.userDataRows.map((userDataRow, indexRow) => {
      var timeStr='';
      var userName='';
      const userNameFilter= userDataRow.user.firstName;

      if ( indexRow % 2 == 0)
      {
        timeStr='AM'
        userName= userDataRow.user.firstName;
      }
      else
      {
        timeStr='PM'
        userName='';
      }
      if (userFilter=='All' || userFilter===undefined || userFilter==userNameFilter)
        return (

            <TableRow  >
                <TableCell>
                <a  onClick={() => setUserFilter(userName)} >{userName}</a>                 
                  </TableCell>
                <TableCell>{timeStr}</TableCell>
                {userDataRow.userRow.map((event, indexCol) => {
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
                    var type ;
                    if (event.eventType === 0){
                      type = holTypes[event.holType].value
                    }
                    if (event.eventType === 1){
                      type =workTypes[event.workType].value
                    }
                    return event.eventID == -1 ?
                        <TableCell>
                            <a style={style} onClick={() => setEvent(event, indexRow, indexCol)} >{' --- '}</a>
                        </TableCell>
                        : 
                        <TableCell style={style}>
                            <a style={style} onClick={() => setEvent(event, indexRow, indexCol)}>{type} </a>
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
          {renderTableHeader(props.weekData, props.setUserFilter)}
        </TableHead>
        <TableBody>
          {renderTableBody(props.weekData, props.selectedCol, props.selectedRow, props.durations, props.holTypes,props.workTypes, props.setEvent, props.setUserFilter, props.userFilter)}
        </TableBody>
      </Table>
    </TableContainer>
  );
}