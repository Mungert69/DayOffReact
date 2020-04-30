import React, { useState } from 'react';
import moment from "moment";
import Select from 'react-select';
import { Row, Col, Container, Button } from 'react-bootstrap'
import DataTable from './DataTable';
import UserContractInfo from './UserContractInfo';
import Spinny from './Spinny.gif'; // with import
const apiBaseUrl = 'http://192.168.1.22:10202';

const fontStyle = { color: 'green' };
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
export default class TestApi extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            weekData: {},
            holTypes: [],
            workTypes: [],
            userTypes: [],
            durations: [],
            users: [],
            selectedHolTypeOption: -1,
            selectedHolWorkOption: -1,
            selectedDurationOption: -1,
            selectedUserTypeOption: -1,
            selectedUser: { firstName: 'None' },
            userFilter: 1,
            selectedRow: null,
            selectedCol: null,
            event: null,
            result: '',
            hiddenBut: true,
            hiddenContractInfo: true,
            loading: false
        };
    }


    getData(props) {

        fetch(apiBaseUrl + '/api/datestable/WeekData/' + props.fromDate + '/' + props.toDate)
            .then(
                response => response.json(),
                error => console.log('An error occurred in  TestApi.js :  getData()', error)
            )
            .then(data => {
                this.setState({ weekData: data, isLoaded: true }, () => { props.setDayWorkObjs(data.dayWorkObjs) })
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
        var urlStr = apiBaseUrl + `/api/datestable/GetUserTypes`;
        fetch(urlStr)
            .then(
                response => response.json(),
                error => console.log('An error occurred in  TestApi.js : componentDidMount() fetch /api/datestable/GetUserTypes ', error)
            )
            .then(data => {
                this.setState({ userTypes: data })
            }
            );
        urlStr = apiBaseUrl + `/api/datestable/GetHolTypes`;
        fetch(urlStr)
            .then(
                response => response.json(),
                error => console.log('An error occurred in  TestApi.js : componentDidMount() fetch /api/datestable/GetHolTypes ', error)
            )
            .then(data => {
                this.setState({ holTypes: data })
            }
            );
        urlStr = apiBaseUrl + `/api/datestable/GetWorkTypes`;
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
        const { event, selectedHolTypeOption, selectedWorkTypeOption } = this.state;
        if (selectedHolTypeOption === -1 && selectedWorkTypeOption === -1) { return; }
        if (event === null) { return; }
        const urlStr = apiBaseUrl + `/api/datestable/DeleteEvent/` + event.eventID + `/` + event.eventType + '/';
        fetch(urlStr)
            .then(
                response => response.json(),
                error => console.log('An error occurred in  TestApi.js : deleteEvent()', error)
            )
            .then(data => {
                this.setState({ result: data, isLoaded: true, selectedRow: -1, selectedCol: -1, event: null, hiddenBut: true }, () => { this.getData(this.props); })
            }
            );
    }


    updateEvent() {
        const { event, selectedDurationOption, selectedWorkTypeOption, selectedHolTypeOption } = this.state;
        this.setState({ loading: true }, () => {
            if (event === null) { return; }
            if (selectedHolTypeOption === -1 && selectedWorkTypeOption === -1) { return; }
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
                urlStr = apiBaseUrl + `/api/datestable/SwapEvent/` + event.userID + `/` + valueType + '/' + valueDuration + '/' + moment(this.props.selectedDate).format('DD-MM-YYYY') + '/' + eventType + '/' + event.eventType + '/' + event.eventID + '/'
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
                    this.setState({ result: data, isLoaded: true, selectedRow: -1, selectedCol: -1, hiddenBut: true, loading: false }, () => { this.getData(this.props); })
                }
                );



        });

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

    setUserFilter = (userFilter, isTypeFilter) => {
        var user = '';


        if (isTypeFilter) {
            this.setState({ userFilter: userFilter, hiddenBut: true, hiddenContractInfo: true });
            return;
        }

        else {
            user = this.state.users.filter(u => u.firstName.toLowerCase() == userFilter.toLowerCase())[0];
            this.setState({ selectedUser: user, userFilter: userFilter, hiddenBut: true, hiddenContractInfo: false });

        }
    }

    setUserTypeFilter = (e) => {
        this.setUserFilter(e.value, true);
    }

    setEvent = (event, indexRow, indexCol) => {
        const { holTypes, workTypes, durations, users, userDataRows, selectedCol, selectedRow } = this.state;
        if (event.eventID === -1) {
            this.setState({ selectedHolTypeOption: -1, selectedWorkTypeOption: -1, selectedDurationOption: { value: event.duration, label: durations[event.duration] }, event: event, result: '', selectedRow: indexRow, selectedCol: indexCol });

        }
        else {
            if (event.eventType === 0) {
                this.setState({ selectedWorkTypeOption: -1, selectedHolTypeOption: { value: event.holType, label: holTypes[event.holType].value + ' : ' + holTypes[event.holType].label }, selectedDurationOption: { value: event.duration, label: durations[event.duration] }, event: event, result: '', selectedRow: indexRow, selectedCol: indexCol });

            }
            if (event.eventType === 1) {
                this.setState({ selectedHolTypeOption: -1, selectedWorkTypeOption: { value: event.workType, label: workTypes[event.workType].value + ' : ' + workTypes[event.workType].label }, selectedDurationOption: { value: event.duration, label: durations[event.duration] }, event: event, result: '', selectedRow: indexRow, selectedCol: indexCol });

            }
        }

        this.props.setDate(moment(event.eventDate), null, null, users[this.getUserIndex(event.userID)]);
        const user = users[this.getUserIndex(event.userID)];
        this.setState({ selectedUser: user, hiddenBut: false });
    }


    render() {
        const { hiddenContractInfo, selectedUser, weekData, isLoaded, selectedHolTypeOption, selectedWorkTypeOption, selectedUserTypeOption, selectedDurationOption, result, selectedCol, selectedRow } = this.state;

        if (isLoaded) {
            var dateDisplay = {};
            var buttonDisplay = {};

            if (!this.props.hiddenCal) {
                dateDisplay = { display: 'none' };;
            }
            if (this.state.hiddenBut) {
                buttonDisplay = { display: 'none' };;
            }
            var selectHolTypes = [];
            this.state.holTypes.map((holType) => {
                selectHolTypes.push({ label: holType.value + ' : ' + holType.label, value: holType.id });
            });
            var selectWorkTypes = [];
            this.state.workTypes.map((workType) => {
                selectWorkTypes.push({ label: workType.value + ' : ' + workType.label, value: workType.id });
            });
            var selectUserTypes = [];
            selectUserTypes.push({ label: 'All', value: -1 });
            this.state.userTypes.map((userType) => {
                selectUserTypes.push({ label: userType.value, value: userType.id });
            });
            var selectDurations = [];
            this.state.durations.map((txt, id) => {
                selectDurations.push({ label: txt, value: id });
            });
            return (
                <span> <Row>
                    <Col ><a o style={{ color: 'blue' }} onClick={() => this.props.setHiddenCal(!this.props.hiddenCal)} >Calendar</a></Col>
                    <Col ><a o style={{ color: 'blue' }} onClick={() => this.props.setHiddenWeekDays(!this.props.hiddenWeekDays)} >Work For Week</a></Col>

                    <Col style={dateDisplay}><span >Selected Date : {this.props.selectedDate.format('DD-MM-YYYY')}</span></Col>
                    <Col >Selected User :<span style={fontStyle}> {selectedUser.firstName}</span></Col>
                </Row>
                    <Row><Col>{result}</Col></Row>
                    <Row>
                        <Col>Holiday Type</Col>
                        <Col>Work Type</Col>
                    </Row>
                    <Row>

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
                    <Row><Col >
                        <Button hidden={this.state.loading} style={buttonDisplay} onClick={() => this.updateEvent()}>
                       
                            Update
                                     </Button>
                                     { this.state.loading ?  <img  width="50" height="50"  src={Spinny} />: null }
                    </Col>
                        <Col>
                            <Button hidden={this.state.loading} style={buttonDisplay} onClick={() => this.deleteEvent()}>
                                Delete
                                     </Button>
                                     { this.state.loading ?  <img  width="50" height="50"  src={Spinny} />: null }
                 
                        </Col>
                    </Row>


                    <Row >
                        <DataTable setUserTypeFilter={this.setUserTypeFilter} selectUserTypes={selectUserTypes} selectedUserTypeOption={selectedUserTypeOption} weekData={weekData} selectedCol={selectedCol} selectedRow={selectedRow} durations={this.state.durations} holTypes={this.state.holTypes} workTypes={this.state.workTypes} setEvent={this.setEvent} setUserFilter={this.setUserFilter} userFilter={this.state.userFilter} />
                    </Row>
                    <Row hidden={hiddenContractInfo}><UserContractInfo user={selectedUser} /></Row>


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