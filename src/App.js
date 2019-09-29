import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Calendar from './Components/CalendarComp';
import {CustomTable} from './Components/table';
import TestApi from './Components/TestApi';
import moment from "moment";


function App() {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [fromDate, setFromDate] = useState(moment().format('MM-DD-YYYY'));
  const [toDate, setToDate] = useState(moment().add(6,'days').format('MM-DD-YYYY'));


  
  const setDate =(date,fromDate,toDate) =>{
    setSelectedDate(date);
    if (fromDate!=null){
      setFromDate(fromDate);
    }
   
    if (toDate!=null){
      setToDate(toDate);
    }
    
  }

  
  
  return (
    <div className="App">
      <header className="App-header">
        {selectedDate.format('DD-MM-YYYY')}
        <p className="App-float-left">
          <Calendar setDate={setDate}/>
        </p>
        <p className="App-float-right">
       <TestApi fromDate={fromDate} toDate={toDate} setDate={setDate} selectedDate={selectedDate}/>
        </p>
      </header>
    </div>
  );
}

export default App;
