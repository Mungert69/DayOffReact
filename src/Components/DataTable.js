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
const useStyles = makeStyles({
  table: {

  },
});
const customStyles = {
  option: (provided, state) => ({
    ...provided,
    border: '1px solid #757575',
    borderRadius: '0',
    minHeight: '1px',
    height: '42px',
  }),
  input: (provided) => ({
    ...provided,
    minHeight: '1px',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    minHeight: '1px',
    paddingTop: '0',
    paddingBottom: '0',
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    minHeight: '1px',
    height: '24px',
  }),
  clearIndicator: (provided) => ({
    ...provided,
    minHeight: '1px',
  }),
  valueContainer: (provided) => ({
    ...provided,
    minHeight: '1px',
    height: '40px',
    paddingTop: '0',
    paddingBottom: '0',
  }),
  singleValue: (provided) => ({
    ...provided,
    minHeight: '1px',
    paddingBottom: '2px',
  }),


}

function renderTableHeader(weekData) {

  return (

    <TableRow >
      <TableCell colSpan={2}>
        

      </TableCell>
      {weekData.headerDates.map((headerDate) => <TableCell >{' '}{moment(headerDate).format('ddd')}{' '}</TableCell>
      )}

    </TableRow>
  )


}



function renderTableBody(weekData, selectedCol, selectedRow, holTypes, workTypes, setEvent, setUserFilter, userFilter) {
  return weekData.userDataRows.map((userDataRow, indexRow) => {
    var timeStr = '';
    var userName = '';
    const userNameFilter = userDataRow.user.firstName;

    if (indexRow % 2 == 0) {
      timeStr = 'AM'
      userName = userDataRow.user.firstName;
    }
    else {
      timeStr = 'PM'
      userName = '';
    }
    if (userFilter == -1 || userFilter == userDataRow.user.userType || userFilter === undefined || userFilter == userNameFilter)
      return (

        <TableRow  >
          <TableCell>
            <a onClick={() => setUserFilter(userName, false)} >{userName}</a>
          </TableCell>
          <TableCell>{timeStr}</TableCell>
          {userDataRow.userRow.map((event, indexCol) => {
            var style = {
              color: 'black',
            };
            if (indexRow === selectedRow) {
              style = {
                color: 'blue'
              };
            };
            if (indexCol === selectedCol && indexRow === selectedRow) {
              style = {
                font: 'bold',
                color: 'red'
              };
            };
            var type;
            if (event.eventType === 0) {
              type = holTypes[event.holType].value
            }
            if (event.eventType === 1) {
              type = workTypes[event.workType].value
            }
            if (event.eventID == -1 || event.eventID == -2) {
              return event.eventID == -1 ? <TableCell>
                <a style={style} onClick={() => setEvent(event, indexRow, indexCol)} >{' --- '}</a>
              </TableCell>
                : <TableCell></TableCell>
            } else {
              return <TableCell style={style}>
                <a style={style} onClick={() => setEvent(event, indexRow, indexCol)}>{type} </a>
              </TableCell>
            }
          }

          )}
        </TableRow>
      )
  })
}

export default function DataTable(props) {
  const classes = useStyles();
  const events = props.weekData.eventData.eventItems;
  var eventNames = '';
  events.map((event) => { eventNames += event.eventName + ' , ' });
  if (eventNames.length > 0) {
    eventNames = eventNames.slice(0, -3);
  }
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="TLP Rota">
        <TableHead>
          <TableRow size="small">
            <TableCell align="center" colSpan={1}>
              Events
            </TableCell>
            <TableCell align="right" colSpan={7}>{eventNames}</TableCell>
          </TableRow>
          {renderTableHeader(props.weekData)}
        </TableHead>
        <TableBody>
          {renderTableBody(props.weekData, props.selectedCol, props.selectedRow, props.holTypes, props.workTypes, props.setEvent, props.setUserFilter, props.userFilter)}
        </TableBody>
      </Table>
    </TableContainer>
  );
}