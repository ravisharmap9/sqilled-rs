import React, { useState, useEffect } from "react";
import styles from './styles.css';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import { withRouter, Link } from 'react-router-dom';
import { withApollo } from "react-apollo";
import Typography from '@material-ui/core/Typography';
import * as commonFunctions from '../../utilities/commonFunctions';
import UserUtils from '../../utilities/userUtils';
import { loader } from "graphql.macro";
import $ from 'jquery';
const REGISTER = loader('../../graphql/auth/signup.graphql');

const Register = (props) => {

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [type, setType] = useState('');
	const [hasErrors, setHasErrors] = useState({});
	const [registerSuccess, setRegisterSuccess] = useState('');

	useEffect(() => {
		const accessToken = UserUtils.getAccessToken();
		if (accessToken !== null) {
			props.history.push('/view-profile');
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
	const handlePassword = (e) => {
		setPassword(e.target.value);
	}
	const handleConfirmPassword = (e) => {
		setConfirmPassword(e.target.value);
	}
	const handleType = (e) => {
		setType(e.target.value);
	}

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

		// PASSWORD & CONFIRM PASSWORD
		if (!password) {
			formIsValid = false;
			errors["password"] = "Please Enter your Password.";
		}

		if (password && password.length < 8) {
			formIsValid = false;
			errors["password"] = "Password must be at least 8 characters.";
		}

		if (!confirmPassword) {
			formIsValid = false;
			errors["confirmPassword"] = "Please Enter your Confirmation Password.";
		}

		if (confirmPassword && confirmPassword !== password) {
			formIsValid = false;
			errors["confirmPassword"] = "Password and Confirmation Password does not match.";
		}

		if (!type) {
			formIsValid = false;
			errors["type"] = "Please Enter your User Type.";
		}
		setHasErrors(errors);
		return formIsValid;
	}

	const registerUser = (e) => {
		e.preventDefault()
		let errors = {};
		if (validateForm()) {
			$("#loadingDiv").show();
			props.client.mutate({
				mutation: REGISTER,
				variables: {
					data: {
						"first_name": firstName,
						"last_name": lastName,
						"email": email,
						"password": password,
						"password_confirmation": confirmPassword,
						"type": type
					}
				}
			}).then(response => {
				if (response.data.register.status === 'USER_REGISTERED') {
					setRegisterSuccess(response.data.register.message);
					setFirstName('');
					setLastName('');
					setEmail('');
					setPassword('');
					setConfirmPassword('');
					setType('');
				}
				$("#loadingDiv").hide();
			}).catch(error => {
				let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
				errors['error'] = errorMsg;
				setHasErrors(errors);
				$("#loadingDiv").hide();
			});
		}
	}


	return (
		<Typography >
			<div className="about-sec">
				<div className="container">
					<div className="row">
						<div className="col-md-6">
							<div className="about-left">
								<h3>Register</h3>
								<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's</p>
								<form name="register" onSubmit={registerUser}>
									<div className="more-flex more-flex-border">
										<div className="loginForm">
											{registerSuccess !== '' && <div className='success-msg'>{registerSuccess}.<span class="redirect-login"><Link to="/login">Login</Link></span></div>}
											{hasErrors.error && <div className='error'>{hasErrors.error}.</div>}
											<div className="form-group">
												<input
													type="text"
													name="firstName"
													value={firstName}
													onChange={handleFirstName}
													placeholder="First Name"
													className={`${hasErrors.firstName !== undefined ? 'is-invalid' : ''}`}
												/>
												{(hasErrors.firstName !== undefined) && <div className='error-msg'>{hasErrors.firstName}</div>}
											</div>
											<div className="form-group">
												<input
													type="text"
													name="lastName"
													value={lastName}
													onChange={handleLastName}
													placeholder="Last Name"
													className={`${hasErrors.lastName !== undefined ? 'is-invalid' : ''}`}
												/>
												{(hasErrors.lastName !== undefined) && <div className='error-msg'>{hasErrors.lastName}</div>}
											</div>
											<div className="form-group">
												<input
													type="text"
													name="email"
													value={email}
													onChange={handleEmail}
													placeholder="Email"
													className={`${hasErrors.email !== undefined ? 'is-invalid' : ''}`}
												/>
												{(hasErrors.email !== undefined) && <div className='error-msg'>{hasErrors.email}</div>}
											</div>
											<div className="form-group">
												<input
													type="password"
													name="password"
													value={password}
													onChange={handlePassword}
													placeholder="Password"
													className={`${hasErrors.password !== undefined ? 'is-invalid' : ''}`}
												/>
												{(hasErrors.password !== undefined) && <div className='error-msg'>{hasErrors.password}</div>}
											</div>
											<div className="form-group">
												<input
													type="password"
													name="confirmPassword"
													value={confirmPassword}
													onChange={handleConfirmPassword}
													placeholder="Confirm Password"
													className={`${hasErrors.confirmPassword !== undefined ? 'is-invalid' : ''}`}
												/>
												{(hasErrors.confirmPassword !== undefined) && <div className='error-msg'>{hasErrors.confirmPassword}</div>}
											</div>
											<div className="form-group">
												<select
													className={`form-control ${hasErrors.type !== undefined ? 'is-invalid' : ''}`}
													name={type}
													value={type}
													onChange={handleType}
												>
													<option value="">--Select--</option>
													<option value="W">Writer</option>
													<option value="R">Reader</option>
												</select>
												{(hasErrors.type !== undefined) && <div className='error-msg'>{hasErrors.type}</div>}
											</div>
											<div className="form-group login-button">
												<button type="sumbit">Register</button>
												<p>Already have a account? <Link to="/login">Login</Link></p>
											</div>
										</div>
									</div>
								</form>
							</div>
						</div>
						<div className="col-md-6">
							<div className="about-right">
								<img src="images/about-img4.png" alt="about" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</Typography>
	);
};

const enhance = compose(
	withStyles(styles),
	withRouter,
	withApollo
);
export default enhance(Register);
