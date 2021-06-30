import React, { useState, useEffect } from "react";
import styles from './styles.css';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { withApollo } from "react-apollo";
import compose from 'recompose/compose';
import { withRouter, Link } from 'react-router-dom';
import * as commonFunctions from '../../utilities/commonFunctions';
import UserUtils from '../../utilities/userUtils';
import $ from 'jquery';
import { loader } from "graphql.macro";
import Select from 'react-select';
import UploadFile from './uploadVideo';

const USER = loader('../../graphql/auth/user.graphql');
const EDIT_PROFILE = loader('../../graphql/auth/updateProfile.graphql');
const TOPIC_OF_INTEREST = loader('../../graphql/auth/topicOfInterest.graphql');

const UPLOAD_VIDEO_RECODRING = loader('../../graphql/search/uploadVideoRecording.graphql');

const EditProfile = (props) => {

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
	const [profile, setProfile] = useState('');
	const [profileImage, setProfileImage] = useState('');
	const [hourRate, setHourRate] = useState('');
	const [profileSuccess, setProfileSuccess] = useState('');
	const [hasErrors, setHasErrors] = useState({});
	const [updateProfileCheck, setUpdateProfileCheck] = useState(false);

	const [userType, setUserType] = useState('');
	const [topicOfInterest, setTopicOfInterest] = useState([]);
	const [minHourlyRate, setMinHourlyRate] = useState('');
	const [maxHourlyRate, setMaxHourlyRate] = useState('');
	const [topicOfInterestData, setTopicOfInterestData] = useState([]);
	const [check, setCheck] = useState(false);


	useEffect(() => {

		const accessToken = UserUtils.getAccessToken();
		if (accessToken === null) {
			props.history.push('/login');
		}

		const userId = UserUtils.getUserID();
		if (userId === null) {
			props.history.push('/login');
		} else {
			$("#loadingDiv").show();
			// TO GET THE TOPIC OF INTEREST
			props.client.query({
				query: TOPIC_OF_INTEREST,
				fetchPolicy: "network-only"
			}).then(res => {
				if (res.data.topicOfInterest) {
					// setTopicOfInterestData(res.data.topicOfInterest);
					let temp = [];
					res.data.topicOfInterest.map((d) => {
						temp.push({ value: d.id, label: d.name });
						return null;
					})
					setTopicOfInterestData(temp);
				}
			}).catch(error => {
				let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
				console.log(errorMsg, 'error')
			});

			// TO GET THE LOGGED USER DETAILS
			props.client.query({
				query: USER,
				variables: {
					data: userId
				},
				fetchPolicy: "network-only"
			}).then(response => {
				if (response.data.user) {
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
					setProfileImage(response.data.user.avatar);
					setUserType(response.data.user.type)

					let tempData = [];
					response.data.user.topicOfInterest && response.data.user.topicOfInterest.map((d) => {
						tempData.push({ label: d.name, value: d.id });
						return null;
					})
					setTopicOfInterest(tempData);

					setMinHourlyRate(response.data.user.min_hourly_rate);
					setMaxHourlyRate(response.data.user.max_hourly_rate);
				}
				$("#loadingDiv").hide();
			}).catch(error => {
				let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
				console.log(errorMsg, 'error')
				$("#loadingDiv").hide();
			});
		}

	}, [props]);


	const handleFirstName = (e) => {
		setFirstName(e.target.value);
	}
	const handleLastName = (e) => {
		setLastName(e.target.value);
	}
	const handleEmail = (e) => {
		setEmail(e.target.value);
	}

	const handleCity = (e) => {
		setCity(e.target.value);
	}

	const handleState = (e) => {
		setState(e.target.value);
	}
	const handleCountry = (e) => {
		setCountry(e.target.value);
	}
	const handleTagLine = (e) => {
		setTagLine(e.target.value);
	}

	const handleQualification = (e) => {
		setQualification(e.target.value);
	}
	const handleCertification = (e) => {
		setCertification(e.target.value);
	}
	const handleExperience = (e) => {
		setExperience(e.target.value);
	}

	const handleHourlyRate = (val) => {
		val = val.replace(/[\D\s_]+/g, "");
		setHourRate(val);
	}

	const handleTopicOfInterest = (e) => {
		setCheck(true);
		setTopicOfInterest(Array.isArray(e) ? e.map(x => x.value) : []);
	}

	const handleMinHourlyRate = (val) => {
		val = val.replace(/[\D\s_]+/g, "");
		setMinHourlyRate(val);
	}

	const handleMaxHourlyRate = (val) => {
		val = val.replace(/[\D\s_]+/g, "");
		setMaxHourlyRate(val);
	}

	//HANDLE USER PROFILE IMAGE
	const handleProfileImage = (e) => {
		const imageFile = $("#profile")[0].files[0];
		setHasErrors({});
		let errors = {};
		let reader = new FileReader();
		reader.readAsDataURL(imageFile);
		reader.onloadend = function (e) {
			let base64string = reader.result;
			let fileName = imageFile.name;
			let fileSize = imageFile.size;
			if (fileSize <= 3145728) {
				if (fileName.indexOf("png") !== -1 || fileName.indexOf("jpg") !== -1 || fileName.indexOf("jpeg") !== -1) {
					setProfileImage(base64string);
					setProfile(e.target.value);
					setUpdateProfileCheck(true);
				} else {
					errors["profileError"] = "Please upload only jpg, jpeg or png images.";
					setHasErrors(errors);
				}
			} else {
				errors["profileError"] = "Image size can not exceed 3MB. Please try with a smaller image file.";
				setHasErrors(errors);
			}
		}
	}

	// FORM VALIDATIONS
	const validateForm = () => {
		let errors = {};
		let formIsValid = true;

		// FIRST NAME
		if (!firstName) {
			formIsValid = false;
			errors["firstName"] = "Please Enter a First Name.";
		}

		if (firstName && !commonFunctions.validateNames(firstName)) {
			formIsValid = false;
			errors["firstName"] = "You can not have spaces in First Name.";
		}

		// LAST NAME
		if (!lastName) {
			formIsValid = false;
			errors["lastName"] = "Please Enter a Last Name.";
		}

		if (lastName && !commonFunctions.validateNames(lastName)) {
			formIsValid = false;
			errors["lastName"] = "You can not have spaces in Last name.";
		}

		// EMAIL
		if (!email) {
			formIsValid = false;
			errors["email"] = "Please Enter your Email Address.";
		}
		if (email !== "" && !commonFunctions.validateEmail(email)) {
			formIsValid = false;
			errors["email"] = "Please Enter a valid Email Eddress.";
		}

		if (!city) {
			formIsValid = false;
			errors["city"] = "Please Enter City.";
		}

		if (!state) {
			formIsValid = false;
			errors["state"] = "Please Enter State.";
		}

		if (!country) {
			formIsValid = false;
			errors["country"] = "Please Enter Country.";
		}

		// FIELD FOR USER TYPE WIRTER (w)
		if (userType === 'W') {

			if (!tagLine) {
				formIsValid = false;
				errors["tagLine"] = "Please Enter Tag Line.";
			}


			if (!qualification) {
				formIsValid = false;
				errors["qualification"] = "Please Enter Qualification.";
			}

			if (!certification) {
				formIsValid = false;
				errors["certification"] = "Please Enter Certification.";
			}

			if (!experience) {
				formIsValid = false;
				errors["experience"] = "Please Enter your Experience.";
			}

			if (!hourRate) {
				formIsValid = false;
				errors["hourRate"] = "Please Enter a Hour Rate.";
			}
		}

		//FIELD FOR USER TYPE READER (R)
		if (userType === 'R') {
			if (topicOfInterest.length === 0) {
				formIsValid = false;
				errors["topicOfInterest"] = "Please Select your Interest.";
			}
			if (!minHourlyRate) {
				formIsValid = false;
				errors["minHourlyRate"] = "Please Enter a Min Hour Rate.";
			}
			if (!maxHourlyRate) {
				formIsValid = false;
				errors["maxHourlyRate"] = "Please Enter a Max Hour Rate.";
			}

			if (minHourlyRate && parseFloat(minHourlyRate) >= parseFloat(maxHourlyRate)) {
				formIsValid = false;
				errors["minHourlyRate"] = "Min Hour Should not be greather than max Hour RAteF";
			}

			if (maxHourlyRate && parseFloat(maxHourlyRate) <= parseFloat(minHourlyRate)) {
				formIsValid = false;
				errors["maxHourlyRate"] = "Max Hour Rate shoud not Be less than Min Hour Rate";
			}
		}
		setHasErrors(errors);
		return formIsValid;
	}

	// UPDATE USER FORM
	const submitProfile = (e) => {
		e.preventDefault();
		let errors = {};
		let topic_interest_arr;
		if (check) {
			topic_interest_arr = topicOfInterest;
		} else {
			let temp = [];
			topicOfInterest.length > 0 && topicOfInterest.map((d) => {
				temp.push(d.value);
			})
			topic_interest_arr = temp;
		}
		if (validateForm()) {
			$("#loadingDiv").show();
			props.client.mutate({
				mutation: EDIT_PROFILE,
				variables: {
					data: {
						"first_name": firstName,
						"last_name": lastName,
						"email": email,
						"profile_image": updateProfileCheck ? profileImage : '',
						"city": city,
						"state": state,
						"country": country,
						"tag_line": userType === 'W' ? tagLine : '',
						"qualification": userType === 'W' ? qualification : '',
						"certification": userType === 'W' ? certification : '',
						"experience": userType === 'W' ? experience : '',
						"hourly_rate": userType === 'W' ? hourRate : '',
						"topic_ids": userType === 'R' ? topic_interest_arr : '',
						"min_hourly_rate": userType === 'R' ? minHourlyRate : '',
						"max_hourly_rate": userType === 'R' ? maxHourlyRate : ''
					}
				}
			}).then(response => {
				if (response.data.editProfile) {
					setProfileSuccess('Profile updated Successfully.');
					$(window).scrollTop(0);
					setTimeout(() => {
						props.history.push('/view-profile');
					}, 1200);
					$("#loadingDiv").hide();
				}
			}).catch(error => {
				let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
				errors['profileError'] = errorMsg;
				setHasErrors(errors);
				$("#loadingDiv").hide();
			});
		}
	}

	const uploadVideoProfile = (e) => {
		const VideoFile = $("#uploadVideo")[0].files[0];

		setHasErrors({});
		let errors = {};
		if (VideoFile) {

			console.log(VideoFile, 'VideoFile', UPLOAD_VIDEO_RECODRING);
			props.client.mutate({
				mutation: UPLOAD_VIDEO_RECODRING,
				variables: {
					data: VideoFile
				}
			}).then(response => {
				if (response.data.uploadVideoRecording) {
					setProfileSuccess('Profile video updated Successfully.');
					$("#loadingDiv").hide();
				}
			}).catch(error => {
				let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
				errors['videoError'] = errorMsg;
				setHasErrors(errors);
				$("#loadingDiv").hide();
			});
		}

		return false;

		let reader = new FileReader();

		reader.readAsDataURL(VideoFile);
		reader.onloadend = function (e) {
			let base64string = reader.result;
			let fileName = VideoFile.name;
			// let fileSize = VideoFile.size;
			// if (fileSize <= 3145728) {
			if (fileName.indexOf("wmv") !== -1 ||
				fileName.indexOf("webm") !== -1 ||
				fileName.indexOf("mp4") !== -1 ||
				fileName.indexOf("m4p") !== -1 ||
				fileName.indexOf("flv") !== -1
			) {
				// console.log(base64string, 'upload');
				$("#loadingDiv").show();
				props.client.mutate({
					mutation: UPLOAD_VIDEO_RECODRING,
					variables: {
						data: { VideoFile }
					}
				}).then(response => {
					if (response.data.uploadVideoRecording) {
						setProfileSuccess('Profile video updated Successfully.');
						$("#loadingDiv").hide();
					}
				}).catch(error => {
					let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
					errors['videoError'] = errorMsg;
					setHasErrors(errors);
					$("#loadingDiv").hide();
				});

			} else {
				errors["videoError"] = "Please upload only wmv, webm, mp4,m4p or flv video.";
				setHasErrors(errors);
			}

			// else {
			// 	errors["profileError"] = "Image size can not exceed 3MB. Please try with a smaller image file.";
			// 	setHasErrors(errors);
			// }
		}
	}

	return (
		<Typography >
			<div className="profile-sec">
				<div className="container">
					<div className="profile-form">
						<h3>Edit Profile </h3>

						<form name="editProfile" onSubmit={submitProfile}>
							<div className="profile_box">
								<figure>
									<img src={`${(profileImage !== null && profileImage !== '') ? profileImage : '/images/default.png'}`} alt="profile" />
									<span className="upload-pic">
										<input
											type="file"
											name="profile"
											id="profile"
											value={profile}
											onChange={handleProfileImage}
										/>
										<span>Edit</span>
									</span>
									{profileSuccess !== '' && <div className='success-msg'>{profileSuccess}</div>}
									{hasErrors.profileError && <div className='error'>{hasErrors.profileError}</div>}
								</figure>
								<div className="form-group">
									<label>First Name</label>
									<input
										type="text"
										name="firstName"
										value={firstName}
										onChange={handleFirstName}
										className={`${hasErrors.firstName !== undefined ? 'is-invalid' : ''}`}
									/>
								</div>
								<div className="form-group">
									<label>Last Name</label>
									<input
										type="text"
										name="lastName"
										value={lastName}
										onChange={handleLastName}
										className={`${hasErrors.lastName !== undefined ? 'is-invalid' : ''}`}
									/>
								</div>
								<div className="form-group">
									<label>Email</label>
									<input
										type="text"
										name="email"
										value={email}
										disabled
										onChange={handleEmail}
										className={`${hasErrors.email !== undefined ? 'is-invalid' : ''}`}
									/>
								</div>
								<div className="form-group">
									<label>City</label>
									<input
										type="text"
										name="city"
										value={city}
										onChange={handleCity}
										className={`${hasErrors.city !== undefined ? 'is-invalid' : ''}`}
									/>
								</div>
								<div className="form-group">
									<label>State</label>
									<input
										type="text"
										name="state"
										value={state}
										onChange={handleState}
										className={`${hasErrors.state !== undefined ? 'is-invalid' : ''}`}
									/>
								</div>
								<div className="form-group">
									<label>Country</label>
									<input
										type="text"
										name="country"
										value={country}
										onChange={handleCountry}
										className={`${hasErrors.country !== undefined ? 'is-invalid' : ''}`}
									/>
								</div>

								{userType === "W" &&
									<React.Fragment>
										<div className="form-group">
											<label>TAG LINE</label>
											<input
												type="text"
												name="tagLine"
												value={tagLine}
												onChange={handleTagLine}
												className={`${hasErrors.tagLine !== undefined ? 'is-invalid' : ''}`}
											/>
										</div>
										<div className="form-group">
											<label>QUALIFICATION</label>
											<input
												type="text"
												name="qualification"
												value={qualification}
												onChange={handleQualification}
												className={`${hasErrors.qualification !== undefined ? 'is-invalid' : ''}`}
											/>
										</div>
										<div className="form-group">
											<label>CERTIFICATION</label>
											<input
												type="text"
												name="certification"
												value={certification}
												onChange={handleCertification}
												className={`${hasErrors.certification !== undefined ? 'is-invalid' : ''}`}
											/>
										</div>
										<div className="form-group">
											<label>EXPERIENCE</label>
											<textarea
												name="experience"
												value={experience}
												onChange={handleExperience}
												className={`${hasErrors.experience !== undefined ? 'is-invalid' : ''}`}
											></textarea>
										</div>
										<div className="form-group video-upload">
											<label>MY VIDEO</label>
											<UploadFile />
											{/* <form onSubmit={uploadVideoProfile} encType={'multipart/form-data'}> */}
											{/* <input
												type="file"
												name="video"
												id="uploadVideo"
												onChange={uploadVideoProfile}
											// value={profile}
											// className={`${hasErrors.profile !== undefined ? 'is-invalid' : ''}`}
											/> */}
											{/* </form> */}
											{/* <div className="record-video">Don't have video?<Link to="/record-self-video-profile"> Record</Link></div> */}
										</div>
										{hasErrors.videoError && <div className='error'>{hasErrors.videoError}</div>}
										<div className="form-group">
											<label>hourly rate </label>
											<input
												type="text"
												name="hourRate"
												value={hourRate}
												onChange={e => handleHourlyRate(e.target.value)}
												className={`${hasErrors.hourRate !== undefined ? 'is-invalid' : ''}`}
											/>
											<span className="hourRate">$ / Hour</span>
										</div>
									</React.Fragment>
								}

								{userType === "R" &&
									<React.Fragment>
										<div className="form-group">
											<label>Topic Of Interest </label>
											<Select
												isSearchable={false}
												className={`select-topics ${hasErrors.topicOfInterest !== undefined ? 'is-invalid' : ''}`}
												placeholder="Select Topics"
												value={check === false ? topicOfInterest : (topicOfInterestData.filter(obj => topicOfInterest.includes(obj.value)))}
												options={topicOfInterestData}
												onChange={handleTopicOfInterest}
												isMulti
												isClearable
											/>

										</div>
										<div className="form-group">
											<label>hourly rate </label>
											<input
												type="text"
												name="minHourlyRate"
												value={minHourlyRate}
												onChange={e => handleMinHourlyRate(e.target.value)}
												className={`hour-min ${hasErrors.minHourlyRate !== undefined ? 'is-invalid' : ''}`}
												placeholder="Min"
											/>&nbsp;&nbsp;
											<input
												type="text"
												name="maxHourlyRate"
												value={maxHourlyRate}
												onChange={e => handleMaxHourlyRate(e.target.value)}
												className={`hour-max ${hasErrors.maxHourlyRate !== undefined ? 'is-invalid' : ''}`}
												placeholder="Max"
											/>
											<span className="hourRate">$ / Hour</span>
										</div>
									</React.Fragment>
								}

								<div className="form-group update-button">
									<div>
										<Link to="/view-profile"><button className="back">Back</button></Link>
										<button className="update" type="submit">Update</button>
									</div>
								</div>
							</div>
						</form>

					</div>
				</div>
			</div>
		</Typography >
	);
};

const enhance = compose(
	withStyles(styles),
	withRouter,
	withApollo,
);
export default enhance(EditProfile);
