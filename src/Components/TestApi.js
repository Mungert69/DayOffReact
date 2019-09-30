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
    control: () => ({
        // none of react-select's styles are passed to <Control />
        width: 100,
    }),
    singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 300ms';

        return { ...provided, opacity, transition };
    }
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
            selectedTypeOption: null,
            selectedDurationOption: null,
            holiday: null,
            result: ''
        };
    }

    getData(props) {
        const apiBaseUrl = 'http://192.168.1.250:10202';
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
        const apiBaseUrl = `http://192.168.1.250:10202`;
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
    }

    handleTypeChange = (selectedTypeOption) => {
        this.setState({ selectedTypeOption });
    }

    handleDurationChange = (selectedDurationOption) => {
        this.setState({ selectedDurationOption });
    }

    deleteHoliday() {
        const { holiday } = this.state;
        const apiBaseUrl = `http://192.168.1.250:10202`;

        const urlStr = apiBaseUrl + `/api/datestable/DeleteHoliday/` + holiday.holidayID + `/`;
        fetch(urlStr)
            .then(
                response => response.json(),
                error => console.log('An error occurred in  TestApi.js : deleteHoliday()', error)
            )
            .then(data => {
                this.setState({ result: data, isLoaded: true }, () => { this.getData(this.props); })
            }
            );
    }

    updateHoliday() {
        const { holiday, selectedDurationOption, selectedTypeOption } = this.state;
        const apiBaseUrl = `http://192.168.1.250:10202`;
        const valueType = selectedTypeOption && selectedTypeOption.value;
        const valueDuration = selectedDurationOption && selectedDurationOption.value;
        var urlStr = '';
        if (holiday.holidayID == -1) {
            urlStr = apiBaseUrl + `/api/datestable/CreateHoliday/` + holiday.userID + `/` + valueType + '/' + valueDuration + '/' + moment(this.props.selectedDate).format('MM-DD-YYYY') + '/'

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
                this.setState({ result: data, isLoaded: true }, () => { this.getData(this.props); })
            }
            );


    }

    renderTableHeader(weekData) {

        return (
            <tr key={0}>
                <td>{' '}</td>
                {weekData.headerDates.map((headerDate) => <td>{moment(headerDate).format('dddd')}</td>
                )}
            </tr>)


    }

    renderTableBody(weekData) {
        return weekData.userDataRows.map((userDataRow, index) => {

            return (



                <tr key={index}>
                    <td>{userDataRow.user.firstName}</td>
                    {userDataRow.userRow.map((holiday, index) => {

                        return holiday.holidayID == -1 ? <td><a onClick={() => this.setHoliday(holiday)} >{'-'}</a></td> : <td><a onClick={() => this.setHoliday(holiday)}>{this.state.durations[holiday.duration]}{' : '}{this.state.types[holiday.holType]} </a></td>
                    }

                    )}
                </tr>
            )
        })
    }

    setHoliday(holiday) {
        const { types, durations } = this.state;
        this.setState({ selectedTypeOption: { value: holiday.holType, label: types[holiday.holType] }, selectedDurationOption: { value: holiday.duration, label: durations[holiday.duration] }, holiday: holiday, result: '' });
        this.props.setDate(moment(holiday.holDate, null, null));
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

                    <Row><table id='users'>
                        <tbody>
                            {this.renderTableHeader(weekData)}
                            {this.renderTableBody(weekData)}

                        </tbody>
                    </table></Row>


                    <Row>
                        <Col ><Select
                            options={selectDurations}
                            value={selectedDurationOption}
                            onChange={this.handleDurationChange}
                        ></Select></Col>
                        <Col> <Select
                            options={selectTypes}
                            value={selectedTypeOption}
                            onChange={this.handleTypeChange}
                        ></Select></Col>
                    </Row><Row><Col>
                        <button onClick={() => this.updateHoliday()}>
                            Update
                                     </button>
                    </Col>
                        <Col>
                            <button onClick={() => this.deleteHoliday()}>
                                Delete
                                     </button>
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