import React, { useState, useEffect } from "react";
import styles from './styles.css';
import Typography from '@material-ui/core/Typography';
import { withApollo } from "react-apollo";
import { withStyles } from '@material-ui/core/styles';
import { withRouter, Link } from 'react-router-dom';
import compose from 'recompose/compose';
import UserUtils from '../../utilities/userUtils';
import * as commonFunctions from '../../utilities/commonFunctions';
import { loader } from "graphql.macro";
import $ from 'jquery';
import moment from 'moment';
import { DatetimePickerTrigger } from 'rc-datetime-picker';
import TimeRange from 'react-time-range';
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import PaymentForm from './payment/paymentForm';
import { Elements, StripeProvider } from 'react-stripe-elements';
import PaymentWithoutCard from './payment/paymentWithoutCard';

const USER = loader('../../graphql/auth/user.graphql');
const CHECK_SLOTS_BOOKINGS = loader('../../graphql/search/checkAvailableBookingSlots.graphql');

const STRIPE_KEY = process.env.REACT_APP_STRIPE_KEY;

const SearchDetails = (props) => {

	const [authorId, setAuthorId] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [city, setCity] = useState('');
	const [state, setState] = useState('');
	const [country, setCountry] = useState('');
	const [tagLine, setTagLine] = useState('');
	const [qualification, setQualification] = useState('');
	const [certification, setCertification] = useState('');
	const [experience, setExperience] = useState('');
	const [profileImage, setProfileImage] = useState('');
	const [hourRate, setHourRate] = useState('');
	const [userType, setUserType] = useState('');
	const [topicOfInterest, setTopicOfInterest] = useState('');
	const [minHourlyRate, setMinHourlyRate] = useState('');
	const [maxHourlyRate, setMaxHourlyRate] = useState('');

	const [startTime, setStartTime] = useState(moment().add(1, 'hours'));
	const [endTime, setEndTime] = useState(moment().add(1, 'hours'));
	const [bookingStartime, setBookingStartTime] = useState('');
	const [bookingEndTime, setBookingEndTime] = useState('');

	const [availabilityDate, SetAvailabilityDate] = useState(moment());
	const [minDateRange, setMinDateRange] = useState();
	const [bookDate, setBookDate] = useState('');
	const [bookedHour, setBookedHours] = useState('');
	const [paymentAmount, setPaymentAmount] = useState('');

	const [openModal, setOpenModal] = useState(false);
	const [hasErrors, setHasErrors] = useState({});
	const [successMsg, setSuccessMsg] = useState('');

	const [isCardAvail, SetIsCardAvail] = useState(null);
	const [cardType, setCardType] = useState('');
	const [userName, setUsername] = useState('');

	const [slotAvail, setSlotAvail] = useState(false);
	const [unAvailabilityData, setUnAvailabliltyData] = useState([]);
	const [slotMessage, setSlotMessage] = useState('');
	const [slotModal, setSlotModal] = useState(false);

	const [disableBtn, setDisableBtn] = useState(false);


	useEffect(() => {
		const userId = UserUtils.getSearchedUserId();
		if (userId === null) {
			props.history.push('/search');
		} else {

			$("#loadingDiv").show();
			// TO GET THE LOGGED USER DETAILS
			const loggedUserId = UserUtils.getUserID();
			props.client.query({
				query: USER,
				variables: {
					data: loggedUserId
				},
				fetchPolicy: "network-only"
			}).then(response => {
				if (response.data.user) {
					// setUserType(response.data.user.type);
					setUsername(`${response.data.user.first_name} ${response.data.user.last_name}`);
					SetIsCardAvail(response.data.user.card_last_four);
					setCardType(response.data.user.card_brand);
				}
				// $("#loadingDiv").hide();
			}).catch(error => {
				let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
				console.log(errorMsg, 'error');
				$("#loadingDiv").hide();
			});

			// TO GET THE SEARCH AUTHOR DETAILS
			let currDate = new Date();
			setMinDateRange(moment(currDate.toLocaleDateString()));


			props.client.query({
				query: USER,
				variables: {
					data: userId
				},
				fetchPolicy: "network-only"
			}).then(response => {
				if (response.data.user) {
					setAuthorId(response.data.user.id);
					setFirstName(response.data.user.first_name);
					setLastName(response.data.user.last_name);
					setEmail(response.data.user.email);
					setCity(response.data.user.city);
					setState(response.data.user.state);
					setCountry(response.data.user.country);
					setQualification(response.data.user.qualification);
					setExperience(response.data.user.experience);
					setHourRate(response.data.user.hourly_rate);
					setTagLine(response.data.user.tag_line);
					setCertification(response.data.user.certification);
					setUserType(response.data.user.type);
					setProfileImage(response.data.user.avatar);
					setTopicOfInterest(response.data.user.topicOfInterest && response.data.user.topicOfInterest.name);
					setMinHourlyRate(response.data.user.min_hourly_rate);
					setMaxHourlyRate(response.data.user.max_hourly_rate);
				}
				$("#loadingDiv").hide();
			}).catch(error => {
				let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
				console.log(errorMsg, 'error');
				$("#loadingDiv").hide();
			});
		}

	}, [props]);

	const handleChange = (e) => {
		setHasErrors({});
		SetAvailabilityDate(e);
		setDisableBtn(false);
		setSlotMessage('');
		const b_date = e.format('YYYY-MM-DD');
		setBookDate(b_date);
	};

	const returnFunctionStart = (event) => {
		if (event.startTime) {
			setDisableBtn(false);
			setSlotMessage('');
			setHasErrors({});
			setStartTime(moment(new Date(event.startTime)));
			// setEndTime(moment(new Date(event.startTime)).add(1, 'hours'));
		}

		// let errors = {};
		// setSlotMessage('');
		// if (bookDate === "") {
		// 	errors['bookDateError'] = 'Please Select Availability Date.';
		// 	setHasErrors(errors);
		// } else if (event.startTime) {
		// 	setHasErrors({});
		// 	// setStartTime(moment(new Date(event.startTime)));
		// 	// setEndTime(moment(new Date(event.startTime)).add(1, 'hours'));

		// 	// CHECK BOOKING SLOTS
		// 	$("#loadingDiv").show();
		// 	props.client.query({
		// 		query: CHECK_SLOTS_BOOKINGS,
		// 		variables: {
		// 			data: {
		// 				"date": bookDate,
		// 				"start_time": (moment(new Date(event.startTime)).format('HH:mm:ss')),
		// 				"end_time": (moment(new Date(event.startTime)).add(1, 'hours').format('HH:mm:ss'))
		// 			}
		// 		},
		// 		fetchPolicy: "network-only"
		// 	}).then(response => {
		// 		if (response.data.checkAvailableBookingSlot.status === 'UNAVAILABLE') {
		// 			setSlotAvail(true);
		// 			setSlotMessage(response.data.checkAvailableBookingSlot.status);
		// 			setUnAvailabliltyData(response.data.checkAvailableBookingSlot.unavailable_time_slot);
		// 		} else {
		// 			setSlotMessage(response.data.checkAvailableBookingSlot.status);
		// 			setSlotAvail(false);
		// 			setUnAvailabliltyData([]);
		// 		}
		// 		$("#loadingDiv").hide();
		// 	}).catch(error => {
		// 		let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
		// 		console.log(errorMsg, 'error');
		// 		$("#loadingDiv").hide();
		// 	});
		// }
	}

	const returnFunctionEnd = async (event) => {
		setHasErrors({});
		let errors = {};
		setSlotMessage('');
		if (startTime === "") {
			errors['timeError'] = 'Please Select Start Time.';
			setHasErrors(errors);
		} else if (bookDate === "") {
			errors['bookDateError'] = 'Please Select Availability Date.';
			setHasErrors(errors);
		} else if (event.endTime) {
			// setStartTime(moment(new Date(event.endTime)).subtract(1, 'hours'));
			setEndTime(moment(new Date(event.endTime)));

			const date1 = new Date(startTime);
			const date2 = new Date(event.endTime);
			let diff = date2.getTime() - date1.getTime();
			let msec = diff;
			let hh = Math.floor(msec / 1000 / 60 / 60);
			if (hh === 0) {
				errors['timeError'] = 'Start and End Time should not be same.';
				setHasErrors(errors);
				return;
			}
			if (hh >= 1) {
				// CHECK BOOKING SLOTS
				$("#loadingDiv").show();
				props.client.query({
					query: CHECK_SLOTS_BOOKINGS,
					variables: {
						data: {
							"author_id": authorId,
							"date": bookDate,
							"start_time": (moment(new Date(startTime)).format('HH:mm:ss')),
							"end_time": (moment(new Date(event.endTime)).format('HH:mm:ss'))
						}
					},
					fetchPolicy: "network-only"
				}).then(response => {
					if (response.data.checkAvailableBookingSlot.status === 'UNAVAILABLE') {
						setSlotAvail(true);
						setDisableBtn(false);
						setSlotMessage(response.data.checkAvailableBookingSlot.status);
						setUnAvailabliltyData(response.data.checkAvailableBookingSlot.unavailable_time_slot);
					} else {
						$(".error").empty();
						setSlotMessage(response.data.checkAvailableBookingSlot.status);
						setSlotAvail(false);
						setDisableBtn(true);
						setUnAvailabliltyData([]);
					}
					$("#loadingDiv").hide();
				}).catch(error => {
					let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
					console.log(errorMsg, 'error');
					$("#loadingDiv").hide();
				});
			}
		}
	}

	const onOpenModal = () => {

		const timeErrorMsg = $('.error').text();
		setSlotMessage("");
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

			setBookedHours(hh);
			const pay_amount = parseFloat(hh) * parseFloat(hourRate);
			setPaymentAmount(pay_amount);
			setBookingStartTime(moment(new Date(startTime)).format('HH:mm:ss'));
			setBookingEndTime(moment(new Date(endTime)).format('HH:mm:ss'));
			setOpenModal(true);
		}
	}

	const onCloseModal = (data) => {
		if (data.status !== undefined && data.status === 'SUCCESS') {
			if ($("#scrollTop").offset() !== undefined) {
				$('html, body').animate({
					scrollTop: $("#scrollTop").offset().top
				}, 1000)
			}
			setSuccessMsg(data.message);
			setStartTime(moment().add(1, 'hours'));
			setEndTime(moment().add(2, 'hours'));
			SetAvailabilityDate(moment());
			setBookDate('');
			setTimeout(() => {
				props.history.push('/my-bookings');
			}, 2000);

		}
		setOpenModal(false);
		setSlotModal(false);
	}

	const openSlotModal = () => {
		setSlotModal(true);
	}

	return (
		<Typography >
			<div className="profile-sec">
				<div className="container search-details-page">
					<div className="profile-form" id="scrollTop">
						<h3>{`${firstName} ${lastName}`}<Link to="/search">Back</Link></h3>
						<div className="profile_box">
							<figure>
								<img src={`${(profileImage !== null && profileImage !== '') ? profileImage : '/images/default.png'}`} alt="profile" />
							</figure>
							{successMsg !== undefined && <div className='pay-success-msg'>{successMsg}.</div>}
							<div className="form-group">
								<label>First Name</label>
								<span>{`${firstName} ${lastName}`}</span>
							</div>
							<div className="form-group">
								<label>Email</label>
								<span>{email || 'N/A'}</span>
							</div>
							<div className="form-group">
								<label>City</label>
								<span>{city || 'N/A'}</span>
							</div>
							<div className="form-group">
								<label>State</label>
								<span>{state || 'N/A'}</span>
							</div>
							<div className="form-group">
								<label>Country</label>
								<span>{country || 'N/A'}</span>
							</div>
							{userType === 'W' &&
								<React.Fragment>
									<div className="form-group">
										<label>Tag Line</label>
										<span>{tagLine || 'N/A'}</span>
									</div>
									<div className="form-group">
										<label>Qualification</label>
										<span>{qualification || 'N/A'}</span>
									</div>
									<div className="form-group">
										<label>Certification</label>
										<span>{certification || 'N/A'}</span>
									</div>
									<div className="form-group">
										<label>Experience</label>
										<span>{experience || 'N/A'}</span>
									</div>
									<div className="form-group">
										<label>My video</label>
										<span>Video Here</span>
									</div>
									<div className="form-group">
										<label>Hourly Rate </label>
										<span>{`${hourRate ? `$${hourRate}/hr` : 'N/A'}`}</span>
									</div>
								</React.Fragment>
							}

							{userType === 'R' &&
								<React.Fragment>
									<div className="form-group">
										<label>Topic of Interest </label>
										<span>{`${topicOfInterest || 'N/A'}`}</span>
									</div>
									<div className="form-group">
										<label>Hourly Rate </label>
										<span>{`${minHourlyRate ? `Min: ${minHourlyRate} - Max: ${maxHourlyRate} $/hr` : 'N/A'}`}</span>
									</div>
								</React.Fragment>
							}

							<div className="booking-box">
								<div className="form-group set-date">
									<label className="check-date">Availability Date</label>
									<DatetimePickerTrigger
										closeOnSelectDay={true}
										moment={availabilityDate}
										showTimePicker={false}
										minDate={minDateRange}
										onChange={handleChange}
									>
										<input
											type="text"
											value={bookDate ? moment(new Date(`${bookDate}`)).format('L') : ''}
											className={`form-control ${hasErrors.bookDateError !== undefined ? 'is-invalid' : ''}`}
										/>
									</DatetimePickerTrigger>
								</div>

								<div className="form-group set-time">
									<span className="check-slots"><label>Availability Time </label>{slotAvail && <p className="check-slots-popup" onClick={openSlotModal}>Check Unavailablity</p>}</span>
									<TimeRange
										use24Hours={false}
										minuteIncrement={60}
										startMoment={startTime}
										endMoment={endTime}
										equalTimeError={true}
										onStartTimeChange={returnFunctionStart}
										onEndTimeChange={returnFunctionEnd}
									/>
									<div className="form-group" >
										{(slotMessage === 'AVAILABLE') && <div className='success-msg-time'>{'The selected slot is available.'}</div>}
										{(slotMessage === 'UNAVAILABLE') && <div className='error-msg-time'>{'The selected slot is unavailable. Please Check Slot Unavailablity'}</div>}
										{(hasErrors.timeError !== undefined) && <div className='error-msg-time'>{hasErrors.timeError}</div>}
									</div>
								</div>

								<div className="form-group" >
									<button disabled={!disableBtn} className="update booking-btn" onClick={onOpenModal} data-toggle="modal" data-target="#exampleModalScrollable">Book Now</button>
								</div>
							</div>

							<Modal open={openModal} onClose={onCloseModal} closeOnOverlayClick={false}>
								<div className="stripe-details">
									{isCardAvail !== null
										&& (<React.Fragment>
											<PaymentWithoutCard
												firstName={firstName}
												hourRate={hourRate}
												lastName={lastName}
												availabilityDate={bookDate}
												bookingStartime={bookingStartime}
												bookingEndTime={bookingEndTime}
												bookedHour={bookedHour}
												amount={paymentAmount}
												email={email}
												authorId={authorId}
												cardBrand={cardType}
												isCardAvail={isCardAvail}
												userName={userName}
												onCloseModal={onCloseModal}
											/>
										</React.Fragment>
										)}

									{isCardAvail === null
										&& (<React.Fragment>
											<StripeProvider apiKey={STRIPE_KEY}>
												<Elements>
													<PaymentForm
														firstName={firstName}
														hourRate={hourRate}
														lastName={lastName}
														availabilityDate={bookDate}
														bookingStartime={bookingStartime}
														bookingEndTime={bookingEndTime}
														bookedHour={bookedHour}
														amount={paymentAmount}
														email={email}
														authorId={authorId}
														onCloseModal={onCloseModal}
													/>
												</Elements>
											</StripeProvider>
										</React.Fragment>
										)}
								</div>
							</Modal>
						</div>

						<Modal open={slotModal} onClose={onCloseModal} closeOnOverlayClick={false}>
							<div className="modal-unavail">
								<h3>Check Slot UnAvailability</h3>
								<table className="table">
									<tr>
										<th>SNO</th>
										<th>Date</th>
										<th>START TIME</th>
										<th>END TIME</th>
									</tr>
									<tbody>
										{unAvailabilityData.length > 0 && unAvailabilityData.map((d, index) => {
											return (
												<tr key={index}>
													<td>{index + 1}</td>
													<td>{moment(new Date(`${bookDate}`)).format('L')}</td>
													<td>{moment(new Date(`${bookDate} ${d.start_time}`)).format('LT')}</td>
													<td>{moment(new Date(`${bookDate} ${d.end_time}`)).format('LT')}</td>
												</tr>
											)
										})
										}
									</tbody>
								</table>
							</div>
						</Modal>
					</div>
				</div>
			</div>
		</Typography>
	);
};

const enhance = compose(
	withStyles(styles),
	withRouter,
	withApollo,
);
export default enhance(SearchDetails);