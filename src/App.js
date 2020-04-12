import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Calendar from 'react-calendar';
import { CustomTable } from './Components/table';
import TestApi from './Components/TestApi';
import DayWorkTable from './Components/DayWorkTable';
import moment from "moment";
import { Row, Col, Container, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';




function App() {
  const currMinus = moment().add(-1, 'days'); // get current date
  const curr= moment();
  const first = currMinus.clone().startOf('week').add(1, 'days').format('DD-MM-YYYY');
  const last = currMinus.clone().endOf('week').add(1, 'days').format('DD-MM-YYYY');;

  const [selectedDate, setSelectedDate] = useState(curr);
  const [fromDate, setFromDate] = useState(first);
  const [toDate, setToDate] = useState(last);
  const [user, setUser] = useState({});
  const [hiddenCal, setHiddenCal] = useState(false);
  const [hiddenWeekDays, setHiddenWeekDays] = useState(false);
  const [dayWorkObjs, setDayWorkObjs]=useState();
 
  const fontStyle = { color: 'green' };

  const setDate = (date, fromDate, toDate, user) => {
    setSelectedDate(date);
    if (user != null) {
      setUser(user);
    }
    if (fromDate != null) {
      setFromDate(fromDate);
    }

    if (toDate != null) {
      setToDate(toDate);
    }

  }

  const onDayClick = (d) => {


    const currMinus = moment(d).add(-1, 'days'); // get current date
    const curr= moment(d);
    const first = currMinus.clone().startOf('week').add(1, 'days').format('DD-MM-YYYY');
    const last = currMinus.clone().endOf('week').add(1, 'days').format('DD-MM-YYYY');;

    var firstDay = first.toString();
    var lastDay = last.toString();
    console.log("SELECTED DAY: ", curr.toString(), " First Day ", firstDay, " Last Day: " + lastDay);
    setDate(curr, first, last);


  };

  return (
    <div className="App">

      <header className="App-header">
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossorigin="anonymous"
        />
        <Container>

          <Row >
            <Col hidden={hiddenCal}>
              <Calendar  onClickDay={onDayClick}
                value={selectedDate.toDate()}
              />
                 </Col>
            <Col hidden={hiddenWeekDays}>
             
              <DayWorkTable hidden={hiddenWeekDays} dayWorkObjs={dayWorkObjs}></DayWorkTable>
            </Col>
            <Col >
             
              <TestApi setDayWorkObjs={setDayWorkObjs} hiddenCal={hiddenCal} hiddenWeekDays={hiddenWeekDays} setHiddenWeekDays={setHiddenWeekDays} setHiddenCal={setHiddenCal} fromDate={fromDate} toDate={toDate} setDate={setDate} selectedDate={selectedDate} />
            </Col>
          </Row>
        </Container>


      </header>
    </div>
  );
}

export default App;
