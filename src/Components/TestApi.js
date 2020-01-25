import React, { useState } from 'react';
import moment from "moment";
import Select from 'react-select';
import { Row, Col, Container } from 'react-bootstrap'
const customStyles = {
    option: (provided, state) => ({
        ...provided,
        borderBottom: '1px dotted pink',
        color: state.isSelected ? 'red' : 'blue',
        padding: 20,
    }),
   
}
export default class TestApi extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            weekData: {},
            types: [],
            durations: [],
            users: [],
            selectedTypeOption: null,
            selectedDurationOption: null,
            selectedRow: null,
            selectedCol: null,
            holiday: null,
            result: ''
        };
    }


    getData(props) {
        const apiBaseUrl = 'http://192.168.1.20:10202';
        fetch(apiBaseUrl + '/api/datestable/WeekData/' + props.fromDate + '/' + props.toDate)
            .then(
                response => response.json(),
                error => console.log('An error occurred in  TestApi.js :  getData()', error)
            )
            .then(data => {
                this.setState({ weekData: data, isLoaded: true })
            }
            );

    }

    componentWillReceiveProps(nextProps) {
        if (this.props.fromDate !== nextProps.fromDate) {
            this.getData(nextProps);
        }

    }
    componentDidMount() {
        const apiBaseUrl = `http://192.168.1.20:10202`;
        this.getData(this.props);
        var urlStr = apiBaseUrl + `/api/datestable/GetTypes`;
        fetch(urlStr)
            .then(
                response => response.json(),
                error => console.log('An error occurred in  TestApi.js : componentDidMount() fetch /api/datestable/GetTypes ', error)
            )
            .then(data => {
                this.setState({ types: data })
            }
            );
        urlStr = apiBaseUrl + `/api/datestable/GetDurations`;
        fetch(urlStr)
            .then(
                response => response.json(),
                error => console.log('An error occurred in  TestApi.js : componentDidMount() fetch /api/datestable/GetDurations', error)
            )
            .then(data => {
                this.setState({ durations: data })
            }
            );
        urlStr = apiBaseUrl + `/api/datestable/GetUsers`;
        fetch(urlStr)
            .then(
                response => response.json(),
                error => console.log('An error occurred in  TestApi.js : componentDidMount() fetch /api/datestable/GetUsers', error)
            )
            .then(data => {
                this.setState({ users: data })
            }
            );
    }

    handleTypeChange = (selectedTypeOption) => {
        this.setState({ selectedTypeOption });
    }

    handleDurationChange = (selectedDurationOption) => {
        this.setState({ selectedDurationOption });
    }

    deleteHoliday() {
        const { holiday } = this.state;
        const apiBaseUrl = `http://192.168.1.20:10202`;

        const urlStr = apiBaseUrl + `/api/datestable/DeleteHoliday/` + holiday.holidayID + `/`;
        fetch(urlStr)
            .then(
                response => response.json(),
                error => console.log('An error occurred in  TestApi.js : deleteHoliday()', error)
            )
            .then(data => {
                this.setState({ result: data, isLoaded: true, selectedRow : -1, selectedCol : -1 }, () => { this.getData(this.props); })
            }
            );
    }

    updateHoliday() {
        const { holiday, selectedDurationOption, selectedTypeOption } = this.state;
        const apiBaseUrl = `http://192.168.1.20:10202`;
        const valueType = selectedTypeOption && selectedTypeOption.value;
        const valueDuration = selectedDurationOption && selectedDurationOption.value;
        var urlStr = '';
        if (holiday.holidayID == -1) {
            urlStr = apiBaseUrl + `/api/datestable/CreateHoliday/` + holiday.userID + `/` + valueType + '/' + valueDuration + '/' + moment(this.props.selectedDate).format('DD-MM-YYYY') + '/'

        }
        else {
            urlStr = apiBaseUrl + `/api/datestable/UpdateHoliday/` + holiday.holidayID + `/` + valueType + '/' + valueDuration + '/'

        }
        const test = '';
        fetch(urlStr)
            .then(
                response => response.json(),
                error => console.log('An error occurred in  TestApi.js : updateHoliday', error)
            )
            .then(data => {
                this.setState({ result: data, isLoaded: true , selectedRow : -1, selectedCol : -1}, () => { this.getData(this.props); })
            }
            );


    }

    renderTableHeader(weekData) {

        return (
            <tr key={0}>
                <td>{' '}</td>
                {weekData.headerDates.map((headerDate) => <td>{' - - '}{moment(headerDate).format('ddd')}{' - - '}</td>
                )}
            </tr>)


    }

    renderTableBody(weekData) {
        return weekData.userDataRows.map((userDataRow, indexRow) => {

            return (



                <tr key={indexRow}>
                    <td>{userDataRow.user.firstName}</td>
                    {userDataRow.userRow.map((holiday, indexCol) => {
                        var style = {
                                color: 'yellow',
                                fontSize: '12px'
                              };
                              if ( indexRow === this.state.selectedRow) {
                                style = {
                                    color: 'lightblue'
                                  };
                            };
                        if ( indexCol === this.state.selectedCol && indexRow === this.state.selectedRow) {
                            style = {
                                font: 'bold',
                                color: 'red'
                              };
                        };
                        return holiday.holidayID == -1 ?
                            <td >
                                <a style={style} onClick={() => this.setHoliday(holiday, indexRow, indexCol)} >{'-'}</a>
                            </td>
                            :
                            <td style={style}>
                                <a style={style} onClick={() => this.setHoliday(holiday, indexRow, indexCol)}>{this.state.durations[holiday.duration]}{' : '}{this.state.types[holiday.holType]} </a>
                            </td>
                    }

                    )}
                </tr>
            )
        })
    }

    getUserIndex(userID) {
        const { users } = this.state;
        var arrayIndex = -1;
        users.map((user, index) => {
            var test = '';
            if (user.id == userID) arrayIndex = index;
        })
        return arrayIndex;
    }

    setHoliday(holiday, indexRow, indexCol) {
        const { types, durations, users, userDataRows, selectedCol, selectedRow } = this.state;
        this.setState({ selectedTypeOption: { value: holiday.holType, label: types[holiday.holType] }, selectedDurationOption: { value: holiday.duration, label: durations[holiday.duration] }, holiday: holiday, result: '', selectedRow: indexRow, selectedCol: indexCol });
        this.props.setDate(moment(holiday.holDate), null, null, users[this.getUserIndex(holiday.userID)]);
    }


    render() {
        const { weekData, isLoaded, selectedTypeOption, selectedDurationOption, result } = this.state;

        if (isLoaded) {
            var selectTypes = [];
            this.state.types.map((txt, id) => {
                selectTypes.push({ label: txt, value: id });
            });
            var selectDurations = [];
            this.state.durations.map((txt, id) => {
                selectDurations.push({ label: txt, value: id });
            });
            return (
                <span>

                    <Row ><table id='users'>
                        <tbody>
                            {this.renderTableHeader(weekData)}
                            {this.renderTableBody(weekData)}

                        </tbody>
                    </table></Row>

                    <Row>
                        <Col>Select Duration</Col>
                        <Col>Select Type</Col>
                    </Row>
                    <Row>
                        <Col ><Select
                        styles={customStyles}
                            options={selectDurations}
                            value={selectedDurationOption}
                            onChange={this.handleDurationChange}
                        ></Select></Col>
                        <Col > <Select
                        styles={customStyles}             
                            options={selectTypes}
                            value={selectedTypeOption}
                            onChange={this.handleTypeChange}
                        ></Select></Col>
                    </Row>
                    <Row><Col>
                        <a style={{color : 'lightblue'}} onClick={() => this.updateHoliday()}>
                            Update
                                     </a>
                    </Col>
                        <Col>
                            <a style={{color : 'lightblue'}} onClick={() => this.deleteHoliday()}>
                                Delete
                                     </a>
                        </Col>
                    </Row>

                    <Row><Col>{result}</Col></Row>


                </span>
            );

        }
        else {
            return (
                <span>
                    Loading...
            </span>
            );

        }

    }
}