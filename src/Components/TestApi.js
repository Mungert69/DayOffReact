import React, { useState } from 'react';
import moment from "moment";
import Select from 'react-select';

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
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.fromDate !== nextProps.fromDate) {
            const apiBaseUrl = 'http://192.168.1.250:10202';
            fetch(apiBaseUrl + '/api/datestable/WeekData/' + nextProps.fromDate + '/' + nextProps.toDate)
                .then(
                    response => response.json(),
                    error => console.log('An error occurred in  TestApi.js : ', error)
                )
                .then(data => {
                    this.setState({ weekData: data, isLoaded: true })
                }
                );

        }

    }
    componentDidMount() {
        const apiBaseUrl = `http://192.168.1.250:10202`;
        var urlStr = apiBaseUrl + `/api/datestable/WeekData/` + this.props.fromDate + `/` + this.props.toDate;
        fetch(urlStr)
            .then(
                response => response.json(),
                error => console.log('An error occurred in  TestApi.js : ', error)
            )
            .then(data => {
                this.setState({ weekData: data, isLoaded: true })
            }
            );
        urlStr = apiBaseUrl + `/api/datestable/GetTypes`;
        fetch(urlStr)
            .then(
                response => response.json(),
                error => console.log('An error occurred in  TestApi.js : ', error)
            )
            .then(data => {
                this.setState({ types: data })
            }
            );
        urlStr = apiBaseUrl + `/api/datestable/GetDurations`;
        fetch(urlStr)
            .then(
                response => response.json(),
                error => console.log('An error occurred in  TestApi.js : ', error)
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

    updateHoliday(holiday) {
        const apiBaseUrl = `http://192.168.1.250:10202`;
        const urlStr = apiBaseUrl + `/api/datestable/UpdateHoliday/` + holiday.holidayID + `/` + this.props.toDate;
        const test = '';
        fetch(urlStr)
            .then(
                response => response.json(),
                error => console.log('An error occurred in  TestApi.js : ', error)
            )
            .then(data => {
                this.setState({ weekData: data, isLoaded: true })
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

                        return holiday.holidayID == -1 ? <td>{'-'}</td> : <td><button onClick={() => this.props.setDate(moment(holiday.holDate),null,null)}>{this.state.durations[holiday.duration]}{' : '}{this.state.types[holiday.holType]} </button></td>
                    }

                    )}
                </tr>
            )
        })
    }
  
    render() {
        const { weekData, isLoaded, selectedTypeOption, selectedDurationOption } = this.state;

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

<button onClick={(e) => this.handleClick(e)}>
        Click me
      </button>
                    <table id='users'>
                        <tbody>
                            {this.renderTableHeader(weekData)}
                            {this.renderTableBody(weekData)}
                        </tbody>
                    </table>
                    <table><tbody>
                        <tr>
                            <td><Select
                                options={selectTypes}
                                value={selectedTypeOption}
                                onChange={this.handleTypeChange}
                            ></Select></td>
                            <td><Select
                                options={selectDurations}
                                onChange={this.handleDurationChange}
                            ></Select></td></tr>
                    </tbody></table>


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