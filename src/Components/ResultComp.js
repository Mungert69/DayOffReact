import React from 'react';
import { Row, Col, Container } from 'react-bootstrap'
export default function ResultComp(props) {

    const spanStyle = {
        textAlign: 'center',
        width: '100%'
    };

    if (props.result == undefined || props.result == null || props.result.message.length == 0) return null;
    return (
        <a onClick={() => { props.handleResultClick() }} >
            <div class={props.result.success ? "resultDisplaySuccess" : " resultDisplay"}>
                <div class='resultText'>
                    <Row>
                        <div style={spanStyle}>{props.result.message}</div>
                    </Row>
                    <Row>
                        <div style={spanStyle}>Click Screen to continue.</div>
                    </Row>
                </div>
            </div>
        </a>
    );
};