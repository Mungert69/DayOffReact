import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Calendar from 'react-calendar';
import { CustomTable } from './Components/table';
import TestApi from './Components/TestApi';
import moment from "moment";
import { Row, Col, Container, Button } from 'react-bootstrap'




function App() {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [fromDate, setFromDate] = useState(moment().format('DD-MM-YYYY'));
  const [toDate, setToDate] = useState(moment().add(6, 'days').format('DD-MM-YYYY'));
  const [user, setUser] = useState({});
  const [hiddenCal, setHiddenCal] = useState(false);

  const fontStyle = { color: 'yellow' };

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


    const curr = moment(d); // get current date

    const first = curr.clone().startOf('week').add(1, 'days').format('DD-MM-YYYY');
    const last = curr.clone().endOf('week').add(1, 'days').format('DD-MM-YYYY');;

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

          <Row xs={4}>
            <Col hidden={hiddenCal}>
              <Calendar  onClickDay={onDayClick}
                value={selectedDate.toDate()}
              />
            </Col>

            <Col xs={8}>
              <Row>
                <Col xs={3}><a o style={{color: 'lightblue'}} onClick={() => setHiddenCal(!hiddenCal)} >Calendar</a></Col>
                <Col xs={5} >Selected Date :<span style={fontStyle}> {selectedDate.format('DD-MM-YYYY')}</span></Col>
                <Col xs={4}>Selected User :<span style={fontStyle}> {user.firstName}</span></Col>
              </Row>
              <TestApi fromDate={fromDate} toDate={toDate} setDate={setDate} selectedDate={selectedDate} />
            </Col>
          </Row>
        </Container>


      </header>
    </div>
  );
}

export default App;
