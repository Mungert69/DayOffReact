import React, { useState } from 'react';
import moment from "moment";
import Select from 'react-select';
import { Row, Col, Container } from 'react-bootstrap'
import DataTable from './DataTable';

const apiBaseUrl = 'http://192.168.1.20:10202';

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
            holTypes: [],
            workTypes: [],
            durations: [],
            users: [],
            selectedHolTypeOption: null,
            selectedHolWorkOption: null,
            selectedDurationOption: null,
            selectedRow: null,
            selectedCol: null,
            event: null,
            result: ''
        };
    }


    getData(props) {

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

        this.getData(this.props);
        var urlStr = apiBaseUrl + `/api/datestable/GetHolTypes`;
        fetch(urlStr)
            .then(
                response => response.json(),
                error => console.log('An error occurred in  TestApi.js : componentDidMount() fetch /api/datestable/GetHolTypes ', error)
            )
            .then(data => {
                this.setState({ holTypes: data })
            }
            );
        var urlStr = apiBaseUrl + `/api/datestable/GetWorkTypes`;
        fetch(urlStr)
            .then(
                response => response.json(),
                error => console.log('An error occurred in  TestApi.js : componentDidMount() fetch /api/datestable/GetWorkTypes ', error)
            )
            .then(data => {
                this.setState({ workTypes: data })
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

    handleHolTypeChange = (selectedHolTypeOption) => {
        this.setState({ selectedHolTypeOption, selectedWorkTypeOption: -1 });
    }

    handleWorkTypeChange = (selectedWorkTypeOption) => {
        this.setState({ selectedWorkTypeOption, selectedHolTypeOption: -1 });
    }

    handleDurationChange = (selectedDurationOption) => {
        this.setState({ selectedDurationOption });
    }

    deleteEvent() {
        const { event } = this.state;

        const urlStr = apiBaseUrl + `/api/datestable/DeleteEvent/` + event.eventID + `/` + event.eventType + '/';
        fetch(urlStr)
            .then(
                response => response.json(),
                error => console.log('An error occurred in  TestApi.js : deleteEvent()', error)
            )
            .then(data => {
                this.setState({ result: data, isLoaded: true, selectedRow: -1, selectedCol: -1, event : null }, () => { this.getData(this.props); })
            }
            );
    }


    updateEvent() {
        const { event, selectedDurationOption, selectedWorkTypeOption, selectedHolTypeOption } = this.state;
        
        if (event===null){return;}
        const apiBaseUrl = `http://192.168.1.20:10202`;
        var valueType = null;
        var eventType = 0;
        if (selectedHolTypeOption !== -1) {
            valueType = selectedHolTypeOption && selectedHolTypeOption.value;
            eventType = 0;
        }
        if (selectedWorkTypeOption !== -1) {
            valueType = selectedWorkTypeOption && selectedWorkTypeOption.value;
            eventType = 1;
        }


        const valueDuration = selectedDurationOption && selectedDurationOption.value;
        var urlStr = '';
        var eventID = event.eventID;

        if (eventID !== -1 && eventType !== event.eventType) {
            urlStr = apiBaseUrl + `/api/datestable/SwapEvent/` + event.userID + `/` + valueType + '/' + valueDuration + '/'  + moment(this.props.selectedDate).format('DD-MM-YYYY') + '/' + eventType + '/' +event.eventType+'/' + event.eventID+'/'
        }
        else {
            if (eventID === -1) {

                urlStr = apiBaseUrl + `/api/datestable/CreateEvent/` + event.userID + `/` + valueType + '/' + valueDuration + '/' + moment(this.props.selectedDate).format('DD-MM-YYYY') + '/' + eventType + '/'

            }
            else {

                urlStr = apiBaseUrl + `/api/datestable/UpdateEvent/` + event.eventID + `/` + valueType + '/' + valueDuration + '/' + eventType + '/'

            }

        }


        const test = '';
        fetch(urlStr)
            .then(
                response => response.json(),
                error => console.log('An error occurred in  TestApi.js : updateEvent', error)
            )
            .then(data => {
                this.setState({ result: data, isLoaded: true, selectedRow: -1, selectedCol: -1 }, () => { this.getData(this.props); })
            }
            );


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

    setEvent = (event, indexRow, indexCol) => {
        const { holTypes, workTypes, durations, users, userDataRows, selectedCol, selectedRow } = this.state;
        if (event.eventType === 0) {
            this.setState({ selectedWorkTypeOption: -1, selectedHolTypeOption: { value: event.holType, label: holTypes[event.holType] }, selectedDurationOption: { value: event.duration, label: durations[event.duration] }, event: event, result: '', selectedRow: indexRow, selectedCol: indexCol });

        }
        if (event.eventType === 1) {
            this.setState({ selectedHolTypeOption: -1, selectedWorkTypeOption: { value: event.workType, label: workTypes[event.workType] }, selectedDurationOption: { value: event.duration, label: durations[event.duration] }, event: event, result: '', selectedRow: indexRow, selectedCol: indexCol });

        }
        this.props.setDate(moment(event.eventDate), null, null, users[this.getUserIndex(event.userID)]);
    }


    render() {
        const { weekData, isLoaded, selectedHolTypeOption, selectedWorkTypeOption, selectedDurationOption, result, selectedCol, selectedRow } = this.state;

        if (isLoaded) {
            var selectHolTypes = [];
            this.state.holTypes.map((txt, id) => {
                selectHolTypes.push({ label: txt, value: id });
            });
            var selectWorkTypes = [];
            this.state.workTypes.map((txt, id) => {
                selectWorkTypes.push({ label: txt, value: id });
            });
            var selectDurations = [];
            this.state.durations.map((txt, id) => {
                selectDurations.push({ label: txt, value: id });
            });
            return (
                <span>

                    <Row >
                        <DataTable weekData={weekData} selectedCol={selectedCol} selectedRow={selectedRow} durations={this.state.durations} holTypes={this.state.holTypes} workTypes={this.state.workTypes} setEvent={this.setEvent} />
                    </Row>
                    <Row><Col>{result}</Col></Row>
                    <Row>
                        <Col>Duration</Col>
                        <Col>Holiday Type</Col>
                        <Col>Work Type</Col>
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
                            options={selectHolTypes}
                            value={selectedHolTypeOption}
                            onChange={this.handleHolTypeChange}
                        ></Select></Col>
                        <Col > <Select
                            styles={customStyles}
                            options={selectWorkTypes}
                            value={selectedWorkTypeOption}
                            onChange={this.handleWorkTypeChange}
                        ></Select></Col>
                    </Row>
                    <Row><Col>
                        <a style={{ color: 'blue' }} onClick={() => this.updateEvent()}>
                            Update
                                     </a>
                    </Col>
                        <Col>
                            <a style={{ color: 'blue' }} onClick={() => this.deleteEvent()}>
                                Delete
                                     </a>
                        </Col>
                    </Row>




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