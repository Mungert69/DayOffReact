import React, { useState } from 'react';
import moment from "moment";
import Select from 'react-select';
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
            holiday: null
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

                        return holiday.holidayID == -1 ? <td><a onClick={() => this.setHoliday(holiday)} >{'-'}</a></td> : <td><button onClick={() => this.setHoliday(holiday)}>{this.state.durations[holiday.duration]}{' : '}{this.state.types[holiday.holType]} </button></td>
                    }

                    )}
                </tr>
            )
        })
    }

    setHoliday(holiday) {

        this.setState({ selectedTypeOption: holiday.holType, selectedDurationOption: holiday.duration, holiday: holiday });
        this.props.setDate(moment(holiday.holDate, null, null));
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


                    <table id='users'>
                        <tbody>
                            {this.renderTableHeader(weekData)}
                            {this.renderTableBody(weekData)}
                            <tr>
                                <td><Select

                                    autosize={true}
                                    options={selectTypes}
                                    value={selectedTypeOption}
                                    onChange={this.handleTypeChange}
                                ></Select></td>
                                <td><Select

                                    autosize={true}
                                    options={selectDurations}
                                    value={selectedDurationOption}
                                    onChange={this.handleDurationChange}
                                ></Select></td>
                                <td> <button onClick={() => this.updateHoliday()}>
                                    Click me
                                     </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table><tbody>

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