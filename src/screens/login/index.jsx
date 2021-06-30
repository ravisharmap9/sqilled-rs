import React, { useState, useEffect } from "react";
import styles from './styles.css';
import compose from 'recompose/compose';
import { withRouter, Link } from 'react-router-dom';
import { withApollo } from "react-apollo";
import * as commonFunctions from '../../utilities/commonFunctions';
import UserUtils from '../../utilities/userUtils';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { loader } from "graphql.macro";
import $ from 'jquery';
import momentTimeZone from 'moment-timezone';

import firebase, { onMessageListener } from './firebase';

const LOGIN = loader('../../graphql/auth/signin.graphql');

const Login = (props) => {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [fcmToken, setFcmToken] = useState('');
	const [hasErrors, setHasErrors] = useState({});


	useEffect(() => {
		const accessToken = UserUtils.getAccessToken();
		if (accessToken !== null) {
			props.history.push('/view-profile');
		}

		//Notification funtioinalty
		const messaging = firebase.messaging();

		messaging.getToken().then((token) => {
			if (token) {
				console.log(token, 'Token')
				setFcmToken(token);
			} else {
				alert("Notification permission not granted")
			}
		}).catch((e) => {
			console.log('error', e);
		});

		onMessageListener().then((payload) => {
			console.log(payload, 'payload')
		});


	}, [props]);

	const handleEmail = (e) => {
		setEmail(e.target.value);
	}

	const handlePassword = (e) => {
		setPassword(e.target.value);
	}

	const validateForm = () => {
		let errors = {};
		let formIsValid = true;

		if (!email) {
			formIsValid = false;
			errors["email"] = "Please Enter your Email.";
		}

		if (email !== "" && !commonFunctions.validateEmail(email)) {
			formIsValid = false;
			errors["email"] = "Please Enter a valid Email Eddress.";
		}

		if (!password) {
			formIsValid = false;
			errors["password"] = "Please Enter your Password.";
		}

		setHasErrors(errors);
		return formIsValid;
	}

	const handleSubmitLogin = (e) => {
		e.preventDefault()
		let errors = {};
		const timeZone = momentTimeZone.tz.guess(true);
		if (validateForm()) {
			$("#loadingDiv").show();
			props.client.mutate({
				mutation: LOGIN,
				variables: {
					data: {
						"username": email,
						"password": password,
						"device_token": fcmToken,
						"time_zone": timeZone
					}
				}
			}).then(response => {
				if (response.data) {
					UserUtils.setAccessToken(response.data.login.access_token);
					UserUtils.setUserID(response.data.login.user.id);
					const url = UserUtils.getSaveUrl();
					if (url !== null) {
						props.history.push(`/${url}`);
					} else {
						props.history.push('/view-profile');
					}
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
								<h3>Login</h3>
								<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's</p>
								<form name="register" onSubmit={handleSubmitLogin}>
									<div className="more-flex more-flex-border">
										<div className="loginForm">
											{hasErrors.error && <div className='error'>{hasErrors.error}.</div>}
											<div className="form-group">
												<input
													type="text"
													placeholder="Email"
													name="email"
													onChange={handleEmail}
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
											<div className="form-group login-button">
												<button type="sumbit">Login</button>
												<p>Not Register?  <Link to="/register">Create New Account</Link></p>
											</div>
										</div>
									</div>
								</form>
							</div>
						</div>
						<div className="col-md-6">
							<div className="about-right">
								<img src="images/about-img4.png" alt="" />
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
	withApollo,
);
export default enhance(Login);
