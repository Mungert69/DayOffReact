import React from 'react';
import { Row, Col, Container } from 'react-bootstrap'
export default function ResultComp(props) {
  
  const spanStyle={
    textAlign: 'center',
    width: '100%'
  };
  if (props.result.length==0) return null;
  return (
    <a style={{ color: 'blue' }} onClick={() => {props.handleResultClick()}} ><div class='resultDisplay'><div class='resultText'>
      <Row>
        <div style={spanStyle}>{props.result}</div>
      </Row>
      <Row>
      <div style={spanStyle}>Click Screen to continue.</div>
      </Row>
      </div></div></a>
   );
};