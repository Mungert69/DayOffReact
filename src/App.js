import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Calendar from './Components/CalendarComp';
import { CustomTable } from './Components/table';
import TestApi from './Components/TestApi';
import moment from "moment";
import { Row, Col, Container } from 'react-bootstrap'




function App() {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [fromDate, setFromDate] = useState(moment().format('MM-DD-YYYY'));
  const [toDate, setToDate] = useState(moment().add(6, 'days').format('MM-DD-YYYY'));
  const [user, setUser] = useState({});



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
          <Row>
            <Col>Selected Date : {selectedDate.format('DD-MM-YYYY')}</Col>
            <Col>Selected User : {user.firstName}</Col>
          </Row>
          <Row>
            <Col><Calendar setDate={setDate} /></Col>           
            <Col> <TestApi fromDate={fromDate} toDate={toDate} setDate={setDate} selectedDate={selectedDate} />
            </Col>
          </Row>
        </Container>


      </header>
    </div>
  );
}

export default App;
