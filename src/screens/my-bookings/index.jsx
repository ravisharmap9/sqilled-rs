import React, { useState, useEffect } from "react";
import styles from './styles.css';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
import { withApollo } from "react-apollo";
import * as commonFunctions from '../../utilities/commonFunctions';
import UserUtils from '../../utilities/userUtils';
import { loader } from "graphql.macro";
import ReactPaginate from 'react-paginate';
import $ from 'jquery';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import moment from 'moment';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import CompletedBooking from './completedBooking';
import ExpiredCanceledBooking from './expireCanceled';
import Countdown from 'react-countdown';
import WriterAvailability from "./writerAvailability";

const USER = loader('../../graphql/auth/user.graphql');
const MY_BOOKINGS = loader('../../graphql/search/getBooking.graphql');
const CANCELLED_BOOKING = loader('../../graphql/search/cancelledBooking.graphql');

let counterVal = 0;
const MyBookings = (props) => {

	const [bookedList, setBookList] = useState([]);
	const [status, setStatus] = useState(0);
	const [size, setSize] = useState(10);
	const [pageCount, setPageCount] = useState(1);
	const [userType, setUserType] = useState('');
	const [startVideoCall, setStartVideoCall] = useState(0);
	const [userId, setUserId] = useState("");

	useEffect(() => {
		const accessToken = UserUtils.getAccessToken();
		const userId = UserUtils.getUserID();
		if (accessToken === null) {
			props.history.push('/login');
		} else {
			handleBookingStatus(status);
			setUserId(userId);
			props.client.query({
				query: USER,
				variables: {
					data: userId
				},
				fetchPolicy: "network-only"
			}).then(response => {
				if (response.data.user) {
					setUserType(response.data.user.type);
				}
				$("#loadingDiv").hide();
			}).catch(error => {
				let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
				console.log(errorMsg, 'error');
				$("#loadingDiv").hide();
			});
		}
	}, [props, status, counterVal]);

	const handleBookingStatus = async (status) => {
		$("#loadingDiv").show();
		await props.client.query({
			query: MY_BOOKINGS,
			variables: {
				data: status,
				"first": size,
				"page": 1
			},
			fetchPolicy: "network-only"
		}).then(response => {
			if (response.data.getBookings) {
				setBookList(response.data.getBookings.data);
				setPageCount(response.data.getBookings.paginatorInfo.lastPage);
				setSize(response.data.getBookings.paginatorInfo.perPage)
				setStatus(status);
				$("#loadingDiv").hide();
			}
		}).catch(error => {
			let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
			console.log(errorMsg, 'error')
			$("#loadingDiv").hide();
		});
	}

	const handlePage = (data) => {
		let selected = data.selected + 1;
		$("#loadingDiv").show();
		props.client.query({
			query: MY_BOOKINGS,
			variables: {
				data: status,
				"first": size,
				"page": selected
			},
			fetchPolicy: "network-only"
		}).then(response => {
			if (response.data.getBookings) {
				setBookList(response.data.getBookings.data);
				setPageCount(response.data.getBookings.paginatorInfo.lastPage);
				$("#loadingDiv").hide();
			}
		}).catch(error => {
			let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
			console.log(errorMsg, 'error')
			$("#loadingDiv").hide();
		});
	}

	const startVideoCalling = (id, bookingData) => {
		const data = { userType: userType, bookingId: id, bookingData: bookingData };
		UserUtils.setBookingId(JSON.stringify(data));
		props.history.push('/video-chat');
	}

	const Completionist = () => {
		let count = 0;
		count++;
		setStartVideoCall(count);
		return <span></span>;
	}

	// Renderer callback with condition
	const renderer = ({ days, hours, minutes, seconds, completed }) => {
		if (completed) {
			// Render a completed state
			return <Completionist />;
		} else {
			// Render a countdown
			return <button className="timer-btn">{days > 2 ? `${checkDigit(days)} Days ` : (days > 1 ? `${checkDigit(days)} Day ` : '')}{checkDigit(hours)}:{checkDigit(minutes)}:{checkDigit(seconds)}</button>;
		}
	};

	const checkDigit = (num) => {
		if (num < 10) {
			return `0${num}`;
		} else {
			return num;
		}
	}

	const handleClickDelete = (id) => {
		$("#loadingDiv").show();
		props.client.mutate({
			mutation: CANCELLED_BOOKING,
			variables: {
				data: id
			},
		}).then(response => {
			if (response.data.cancelledBooking.status === "SUCCESS") {
				messageAlert(response.data.cancelledBooking.message);
				handleBookingStatus(status);
			} else {
				messageAlert(response.data.cancelledBooking.message);
				handleBookingStatus(status);
			}
			$("#loadingDiv").hide();
		}).catch(error => {
			let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
			messageAlert(errorMsg);
			$("#loadingDiv").hide();
		});
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

	const cancelBooking = (id) => {
		confirmAlert({
			customUI: ({ onClose }) => {
				return (
					<div className='custom-ui'>
						<h1>Are you sure?</h1>
						<p>You want to delete this Booling?</p>
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

	return (
		<Typography >
			<div className="search-list">
				<div className="container">
					<h3>My Bookings</h3>
					<div className="my-bookings">
						<Tabs>
							<TabList>
								<Tab onClick={() => handleBookingStatus(0)}>Upcoming Bookings</Tab>
								<Tab onClick={() => handleBookingStatus(2)}>Completed Bookings</Tab>
								<Tab>Expired Bookings</Tab>
								{userType === "W" && <Tab>Writer Availability</Tab>}
							</TabList>
							<TabPanel>

								<div className="search-table">
									<table>
										<thead>
											<th>PROFILE</th>
											<th>NAME</th>
											<th>CITY</th>
											<th>STATE</th>
											<th>DATE</th>
											<th>START TIME</th>
											<th>END TIME</th>
											<th>Action</th>
											<th>Cancel Booking</th>
										</thead>
										<tbody>
											{(bookedList && bookedList.length > 0) && bookedList.map((d, index) => {
												let enableDisableFlag = true;
												const timeData = moment(new Date(d.booking_date + ' ' + d.start_time)).startOf('hour').fromNow()
												let startTime = new Date(d.booking_date + ' ' + d.start_time).getTime();
												startTime = startTime - (5 * 60 * 1000);
												const currentTime = new Date().getTime();
												// console.log(startTime, currentTime, startTime < currentTime)
												// Reducing 5 minutes from start Time
												// const endTime = new Date(d.booking_date + ' ' + d.end_time).getTime();
												const currentDate = moment(new Date()).format("YYYY-MM-DD");
												const currentHr = new Date().getHours();
												const endTimeHr = new Date(d.booking_date + ' ' + d.end_time).getHours();
												const startTimeHr = new Date(d.booking_date + ' ' + d.start_time).getHours();

												if (timeData.includes('ago')) {
													enableDisableFlag = false;
												}
												let currentSession = false;
												if (((d.booking_date === currentDate) && (parseInt(endTimeHr) - parseInt(currentHr) === (parseInt(endTimeHr) - parseInt(startTimeHr))))) {
													currentSession = true;
												}

												{ console.log(d) }
												return (
													<React.Fragment>
														{userType === "R" &&
															<React.Fragment>
																<tr key={index}>
																	<td>
																		<figure className="profile">
																			<img src={`${d.author.avatar !== null ? d.author.avatar : '/images/default.png'}`} alt="profile" />
																		</figure>
																	</td>
																	<td>{`${d.author.first_name} ${d.author.last_name}`}</td>
																	<td>{d.author.city || 'N/A'}</td>
																	<td>{d.author.state || 'N/A'}</td>
																	<td>{moment(new Date(`${d.booking_date}`)).format('L')}</td>
																	<td><span className="time-data">{moment(new Date(`${d.booking_date} ${d.start_time}`)).format('LT')}</span></td>
																	<td><span className="time-data">{moment(new Date(`${d.booking_date} ${d.end_time}`)).format('LT')}</span></td>
																	<td>
																		{(currentTime > startTime && enableDisableFlag && startVideoCall === 1) &&
																			<button title="Start Video Call" className="video-call-btn" onClick={e => startVideoCalling(d.id, d)}>Start Call</button>
																		}
																		{(currentSession)
																			&& <button title="Start Video Call" className="video-call-btn" onClick={e => startVideoCalling(d.id, d)}>Start Call</button>
																		}
																		{enableDisableFlag && <span title="Time left to start Video Call"> <Countdown date={startTime} renderer={renderer} disabled /></span>}

																		{(!enableDisableFlag && !currentSession) && <button title="Video Call Time has been completed" disabled>Time Completed</button>}
																	</td>
																	<td><button title="Cancelled Booking" className="cancel-booking" onClick={e => cancelBooking(d.id)}>Cancel Booking</button></td>
																</tr>
															</React.Fragment>
														}
														{userType === "W" &&
															<React.Fragment>
																<tr key={index}>
																	<td>
																		<figure className="profile">
																			<img src={`${d.reader.avatar !== null ? d.reader.avatar : '/images/default.png'}`} alt="profile" />
																		</figure>
																	</td>
																	<td>{`${d.reader.first_name} ${d.reader.last_name}`}</td>
																	<td>{d.reader.city || 'N/A'}</td>
																	<td>{d.reader.state || 'N/A'}</td>
																	<td>{moment(new Date(`${d.booking_date}`)).format('L')}</td>
																	<td><span className="time-data">{moment(new Date(`${d.booking_date} ${d.start_time}`)).format('LT')}</span></td>
																	<td><span className="time-data">{moment(new Date(`${d.booking_date} ${d.end_time}`)).format('LT')}</span></td>
																	<td>
																		{(currentTime > startTime && enableDisableFlag && startVideoCall === 1)
																			&& <button title="Start Video Call" className="video-call-btn" onClick={e => startVideoCalling(d.id, d)}>Start Call</button>
																		}
																		{(currentSession)
																			&& <button title="Start Video Call" className="video-call-btn" onClick={e => startVideoCalling(d.id, d)}>Start Call</button>
																		}
																		{(enableDisableFlag)
																			&& <span title="Time left to start Video Call"> <Countdown date={startTime} renderer={renderer} disabled /></span>}

																		{(!enableDisableFlag && !currentSession)
																			&& <button title="Video Call Time has been completed" disabled>Time Completed</button>}
																	</td>
																	<td><button title="Cancelled Booking" className="cancel-booking" onClick={e => cancelBooking(d.id)}>Cancel Booking</button></td>
																</tr>
															</React.Fragment>
														}

													</React.Fragment>
												)
											})}

											{(bookedList && bookedList.length === 0) &&
												<tr>
													<td colSpan="6" className="text-center">
														<h5>Data Not Found.</h5>
													</td>
												</tr>
											}
										</tbody>
									</table>

									{pageCount > 1
										? <div className="search-pagination">
											<ul className="pagination pagination-sm m-0 float-right">
												<ReactPaginate
													previousLabel={<i className="fa fa-angle-double-left"></i>}
													nextLabel={<i className="fa fa-angle-double-right"></i>}
													breakLabel={<a href="#/">...</a>}
													pageCount={pageCount}
													onPageChange={handlePage}
													breakClassName={"break-me"}
													containerClassName={"pagination"}
													subContainerClassName={"pages pagination"}
													activeClassName={"active"}
													pageClassName="page-item"
													pageLinkClassName="page-link" />
											</ul>
										</div>
										: ''
									}
								</div>
							</TabPanel>

							<TabPanel>
								<CompletedBooking userType={userType} userId={userId} />
							</TabPanel>

							<TabPanel>
								<ExpiredCanceledBooking userType={userType} />
							</TabPanel>

							<TabPanel>
								<WriterAvailability />
							</TabPanel>

						</Tabs>
					</div>
				</div>


			</div>

		</Typography >
	);
};

const enhance = compose(
	withStyles(styles),
	withRouter,
	withApollo
);
export default enhance(MyBookings);
