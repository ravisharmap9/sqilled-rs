import { useEffect, useState } from "react";
import { withApollo } from "react-apollo";
import { withRouter } from 'react-router-dom';
import compose from 'recompose/compose';
import * as commonFunctions from '../../utilities/commonFunctions';
import { loader } from "graphql.macro";
import $ from 'jquery';
import moment from 'moment';
import { DatetimePickerTrigger } from 'rc-datetime-picker';
import TimeRange from 'react-time-range';
import "react-responsive-modal/styles.css";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const SAVE_AUTHOR_UNAVILABLE_DATE = loader('../../graphql/search/saveAuthorUnAvailableDate.graphql');
const GET_AUTHOR_UNAVILABLE_DATE = loader('../../graphql/search/getAuthorUnAvailableDate.graphql');
const UPDATE_DATE = loader('../../graphql/search/editAuthorUnAvailableDate.graphql');
const DELETE = loader('../../graphql/search/deleteAuthorUnAvailableDate.graphql');

const WriterAvailability = (props) => {

  const [openModal, setOpenModal] = useState(false);
  const [editOpenModal, setEditOpenModal] = useState("");
  const [authorData, setAuthorData] = useState([]);
  const [availabilityDate, SetAvailabilityDate] = useState(moment());
  const [minDateRange, setMinDateRange] = useState();
  const [bookDate, setBookDate] = useState('');
  const [startTime, setStartTime] = useState(moment().add(1, 'hours'));
  const [endTime, setEndTime] = useState(moment().add(1, 'hours'));
  const [editData, setEditData] = useState({});
  const [hasErrors, setHasErrors] = useState({});

  useEffect(() => {
    // TO GET THE SEARCH AUTHOR DETAILS
    let currDate = new Date();
    setMinDateRange(moment(currDate.toLocaleDateString()));
    getData();
  }, [])

  const getData = () => {
    $("#loadingDiv").show();
    props.client.query({
      query: GET_AUTHOR_UNAVILABLE_DATE,
      fetchPolicy: "network-only"
    }).then(response => {
      if (response.data.getAuthorUnavailableDate) {
        setAuthorData(response.data.getAuthorUnavailableDate);
        $("#loadingDiv").hide();
      }
    }).catch(error => {
      let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
      messageAlert(errorMsg);
      $("#loadingDiv").hide();
    });
  }

  const onOpenModal = () => {
    setOpenModal(true);
  }

  const onCloseModal = () => {
    setOpenModal(false);
    setEditOpenModal(false);
  }

  const handleDate = (e) => {
    SetAvailabilityDate(e);
    const b_date = e.format('YYYY-MM-DD');
    setBookDate(b_date);
  }

  const returnFunctionStart = (event) => {
    if (event.startTime) {
      setStartTime(moment(new Date(event.startTime)));
      setEndTime(moment(new Date(event.startTime)).add(1, 'hours'));
    }
  }

  const returnFunctionEnd = (event) => {
    if (event.endTime) {
      // setStartTime(moment(new Date(event.endTime)).subtract(1, 'hours'));
      setEndTime(moment(new Date(event.endTime)));
    }
  }

  const handleDelete = (id) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>Are you sure?</h1>
            <p>You want to delete this?</p>
            <button className="no-cancel" onClick={onClose}>No</button>
            <button className="delete-booking"
              onClick={() => {
                handleClickDelete(id);
                onClose();
              }}
            >Yes, Delete it!
            </button>
          </div>
        );
      }
    });
  }

  const handleClickDelete = (id) => {
    $("#loadingDiv").show();
    props.client.mutate({
      mutation: DELETE,
      variables: {
        data: id
      },
    }).then(response => {
      if (response.data.DeleteAuthorUnavailableDate.status === "SUCCESS") {
        messageAlert(response.data.DeleteAuthorUnavailableDate.message);
        getData();
      } else {
        messageAlert(response.data.DeleteAuthorUnavailableDate.message);
        getData();
      }
      $("#loadingDiv").hide();
    }).catch(error => {
      let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
      messageAlert(errorMsg);
      $("#loadingDiv").hide();
    });
  }

  const handleSubmit = () => {
    const timeErrorMsg = $('.error').text();
    let errors = {};
    const date1 = new Date(startTime);
    const date2 = new Date(endTime);
    let diff = date2.getTime() - date1.getTime();
    let msec = diff;
    let hh = Math.floor(msec / 1000 / 60 / 60);

    if (bookDate === "") {
      errors['bookDateError'] = 'Please Select Availability Date.';
      setHasErrors(errors);
    } else if (hh === 0) {
      errors['timeError'] = 'Please Select Start and End Time.';
      setHasErrors(errors);
    } else if (timeErrorMsg !== "") {
      errors['timeError'] = '';
      errors['timeErrorMsg'] = '.';
      setHasErrors(errors);
    } else {
      setHasErrors({});
      const s_time = moment(new Date(startTime)).format('HH:mm:ss');
      const e_time = moment(new Date(endTime)).format('HH:mm:ss');
      $("#loadingDiv").show();
      props.client.mutate({
        mutation: SAVE_AUTHOR_UNAVILABLE_DATE,
        variables: {
          "data": {
            "unavailable_date": bookDate,
            "start_time": s_time,
            "end_time": e_time
          }
        },
      }).then(response => {
        if (response.data.saveAuthorUnavailableDate.status === 'SUCCESS') {
          setOpenModal(false);
          setBookDate("");
          setStartTime(moment().add(1, 'hours'));
          setEndTime(moment().add(1, 'hours'));
          messageAlert(response.data.saveAuthorUnavailableDate.message);
          getData();
        } else {
          setOpenModal(false);
          messageAlert(response.data.saveAuthorUnavailableDate.message);
        }
        $("#loadingDiv").hide();
      }).catch(error => {
        let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
        setOpenModal(false);
        messageAlert(errorMsg);
        $("#loadingDiv").hide();
      });

    }
  }

  const handleUpdate = (id) => {
    if (id) {
      const timeErrorMsg = $('.error').text();
      let errors = {};
      const date1 = new Date(startTime);
      const date2 = new Date(endTime);
      let diff = date2.getTime() - date1.getTime();
      let msec = diff;
      let hh = Math.floor(msec / 1000 / 60 / 60);

      if (bookDate === "") {
        errors['bookDateError'] = 'Please Select Availability Date.';
        setHasErrors(errors);
      } else if (hh === 0) {
        errors['timeError'] = 'Please Select Start and End Time.';
        setHasErrors(errors);
      } else if (timeErrorMsg !== "") {
        errors['timeError'] = '';
        errors['timeErrorMsg'] = '.';
        setHasErrors(errors);
      } else {
        setHasErrors({});
        const s_time = moment(new Date(startTime)).format('HH:mm:ss');
        const e_time = moment(new Date(endTime)).format('HH:mm:ss');
        $("#loadingDiv").show();
        props.client.mutate({
          mutation: UPDATE_DATE,
          variables: {
            "data": {
              "id": id,
              "unavailable_date": bookDate,
              "start_time": s_time,
              "end_time": e_time
            }
          },
        }).then(response => {
          if (response.data.editAuthorUnavailableDate.status === 'SUCCESS') {
            setEditOpenModal(false);
            setBookDate("");
            setStartTime(moment().add(1, 'hours'));
            setEndTime(moment().add(1, 'hours'));
            messageAlert(response.data.editAuthorUnavailableDate.message);
            getData();
          } else {
            setEditOpenModal(false);
            messageAlert(response.data.editAuthorUnavailableDate.message);
          }
          $("#loadingDiv").hide();
        }).catch(error => {
          let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
          setOpenModal(false);
          messageAlert(errorMsg);
          setEditOpenModal(false);
          $("#loadingDiv").hide();
        });
      }
    } else {
      setEditOpenModal(false);
    }
  }

  const handleEdit = (d) => {
    setEditData(d);
    setBookDate(d.unavailable_date);
    setEditOpenModal(true);
  }

  const messageAlert = (msg) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>{msg}</h1>
            <button className="okay-btn" onClick={onClose}>Okay</button>
          </div>
        );
      }
    });
  }

  return (
    <>
      <div className="search-list writer-availability">
        <div className="container">
          <button title="ADD" className="add-availability" onClick={onOpenModal}>+ ADD UNAVAILABILITY</button>
          <div className="my-bookings">
            <div className="search-table">
              <table>
                <thead>
                  <th>SNO</th>
                  <th>DATE</th>
                  <th>START TIME</th>
                  <th>END TIME</th>
                  <th>Action</th>
                </thead>
                <tbody>
                  {(authorData && authorData.length > 0) && authorData.map((d, index) => {
                    return (
                      <tr key={index}>
                        <td>{`${index + 1}`}</td>
                        <td>{moment(new Date(`${d.unavailable_date}`)).format('L')}</td>
                        <td><span className="time-data">{moment(new Date(`${d.unavailable_date} ${d.start_time}`)).format('LT')}</span></td>
                        <td><span className="time-data">{moment(new Date(`${d.unavailable_date} ${d.end_time}`)).format('LT')}</span></td>
                        <td>
                          <span className="btn-group">
                            <i class="fa fa-edit" aria-hidden="true" onClick={(e) => handleEdit(d)}></i>
                            <i class="fa fa-trash" aria-hidden="true" onClick={(e) => handleDelete(d.id)}></i>
                          </span>
                        </td>
                      </tr>
                    )
                  })}

                  {(authorData && authorData.length === 0) &&
                    <tr>
                      <td colSpan="5" className="text-center">
                        <h5>Data Not Found.</h5>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ADD UNAVAILABE DATE */}
        <Modal open={openModal} onClose={onCloseModal} closeOnOverlayClick={false}>
          <h3 className="pt-2">Select Date and Time</h3>
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12 col-md-4"><label>Select Date</label></div>
              <div className="col-xs-6 col-md-1">:</div>
              <div className="col-xs-6 col-md-5">
                <DatetimePickerTrigger
                  closeOnSelectDay={true}
                  moment={availabilityDate}
                  showTimePicker={false}
                  minDate={minDateRange}
                  onChange={handleDate}
                >
                  <input
                    className="form-control"
                    type="text"
                    value={bookDate ? moment(new Date(`${bookDate}`)).format('L') : ''}
                    className={`form-control ${hasErrors.bookDateError !== undefined ? 'is-invalid' : ''}`}
                  />
                </DatetimePickerTrigger>
              </div>
              <div className="col-xs-12 col-md-4"><label>Select Time</label></div>
              <div className="col-xs-6 col-md-1">:</div>
              <div className="col-xs-6 col-md-5">
                <TimeRange
                  className="form-control"
                  use24Hours={false}
                  minuteIncrement={60}
                  startMoment={startTime}
                  endMoment={endTime}
                  equalTimeError={true}
                  onStartTimeChange={returnFunctionStart}
                  onEndTimeChange={returnFunctionEnd}
                />
                {(hasErrors.timeError !== undefined) && <div className='error-msg-time'>{hasErrors.timeError}</div>}
              </div>
              <div className="col-xs-12 col-md-12"><button title="ADD" onClick={handleSubmit} className="btn btn-success submit-btn" >SUBMIT</button></div>
            </div>
          </div>
        </Modal>
        {/* END HERE */}


        {/* UPDATE */}
        <Modal open={editOpenModal} onClose={onCloseModal} closeOnOverlayClick={false}>
          <h3 className="pt-2">Select Date and Time</h3>

          <div className="container-fluid">
            <div className="display-data">
              <p><b>Selected Date and Time :  Date-</b> {editData.unavailable_date ? moment(new Date(`${editData.unavailable_date}`)).format('L') : ''}, <b>Time: Start- </b>{moment(new Date(`${editData.unavailable_date} ${editData.start_time}`)).format('LT')}  <b>End-</b> {moment(new Date(`${editData.unavailable_date} ${editData.end_time}`)).format('LT')}</p>
            </div>
            <div className="row">
              <div className="col-xs-12 col-md-4"><label>Select Date</label></div>
              <div className="col-xs-6 col-md-1">:</div>
              <div className="col-xs-6 col-md-5">
                <DatetimePickerTrigger
                  closeOnSelectDay={true}
                  moment={availabilityDate}
                  showTimePicker={false}
                  minDate={minDateRange}
                  onChange={handleDate}
                >
                  <input
                    className="form-control"
                    type="text"
                    value={bookDate ? moment(new Date(`${bookDate}`)).format('L') : ''}
                    className={`form-control ${hasErrors.bookDateError !== undefined ? 'is-invalid' : ''}`}
                  />
                </DatetimePickerTrigger>
              </div>
              <div className="col-xs-12 col-md-4"><label>Select Time</label></div>
              <div className="col-xs-6 col-md-1">:</div>
              <div className="col-xs-6 col-md-5">
                <TimeRange
                  className="form-control"
                  use24Hours={false}
                  minuteIncrement={60}
                  startMoment={startTime}
                  endMoment={endTime}
                  equalTimeError={true}
                  onStartTimeChange={returnFunctionStart}
                  onEndTimeChange={returnFunctionEnd}
                />
                {(hasErrors.timeError !== undefined) && <div className='error-msg-time'>{hasErrors.timeError}</div>}
              </div>
              <div className="col-xs-12 col-md-12"><button title="ADD" onClick={(e) => handleUpdate(editData.id ? editData.id : '')} className="btn btn-success submit-btn" >UPDATE</button></div>
            </div>
          </div>
        </Modal>

      </div>
    </>
  )
}


const enhance = compose(
  withRouter,
  withApollo
);
export default enhance(WriterAvailability);