import React, { useState, useEffect } from 'react';
import compose from 'recompose/compose';
import { withRouter, Link } from 'react-router-dom';
import { withApollo } from "react-apollo";
import { withStyles } from '@material-ui/core/styles';
import globalStyles from '../../layout/globalStyles';
import styles from './styles.css';
import combineStyles from '../../../utilities/combineStyles';
import * as commonFunctions from '../../../utilities/commonFunctions';
import UserUtils from '../../../utilities/userUtils';
import SearchInput from '../../../screens/search-list/searchInput';
import { loader } from "graphql.macro";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { onMessageListener } from '../../../screens/login/firebase';

const USER = loader('../../../graphql/auth/user.graphql');

const Header = (props) => {

	const [userID, setUserID] = useState(null);
	const [profileImage, setProfileImage] = useState('');
	const [userName, setUsername] = useState('');
	const [userType, setUserType] = useState("");

	useEffect(() => {
		const userId = UserUtils.getUserID();
		if (userId !== null) {
			setUserID(userId);
			props.client.query({
				query: USER,
				variables: {
					data: userId
				},
				fetchPolicy: "network-only"
			}).then(response => {
				if (response.data.user) {
					setUsername(response.data.user.first_name + ' ' + response.data.user.last_name);
					setProfileImage(response.data.user.avatar);
					setUserType(response.data.user.type);
				}
			}).catch(error => {
				let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
				console.log(errorMsg, 'error')
			});

			// const messaging = firebase.messaging();
			onMessageListener().then(payload => {
				if (payload.notification.title) {
					callToaster(payload);
				}
			}).catch(err => console.log('failed: ', err));
		}

	}, [props]);

	const logOut = (e) => {
		e.preventDefault();
		props.history.push('/login');
		UserUtils.logout();
	}


	const callToaster = (payload) => {
		toast.success(`${payload.notification.title} ${payload.notification.body}`, {
			position: toast.POSITION.TOP_RIGHT,
			onClose: () => toasterCallBackFunc()
		});
	}

	const toasterCallBackFunc = () => {
		if ((props.history.location.pathname !== '/video-chat')) {
			props.history.push('/my-bookings');
		}
	}

	return (
		<React.Fragment>
			<div className="header-sec">
				<div className="container">
					<div className="header-nav">
						<div className="nav-left">
							<h3><Link to="/">SQILLED</Link></h3>
						</div>
						<div className="nav-right">
							<nav className="navbar navbar-expand-lg">
								<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
									<span className="navbar-toggler-icon"><i className="fa fa-bars"></i></span>
								</button>

								<div className="collapse navbar-collapse" id="navbarSupportedContent">
									<ToastContainer autoClose={false} />
									<SearchInput />
									{userID !== null
										? (<React.Fragment>
											<div className="top-bar-right">
												<div className="profile-block-nav">
													<figure>
														<img src={`${(profileImage !== null && profileImage !== '') ? profileImage : '/images/default.png'}`} alt="profile" />
													</figure>
													<p>{userName}</p>
													<div className="header-toggle">
														<ul>
															<li><Link to="/view-profile" >My Profile</Link></li>
															<li><Link to="/edit-profile" >Edit Profile</Link></li>
															<li><Link to="/my-bookings" >My Bookings</Link></li>
															{/* {userType === "W" && <li><Link to="/writer-availability">Writer Availability</Link></li>} */}
															<li><Link to="/#" onClick={logOut}>Log out</Link></li>
														</ul>
													</div>
												</div>
											</div>
										</React.Fragment>
										) : (<React.Fragment>
											<div className="social-row">
												<a href="/#"><i className="fa fa-facebook"></i></a>
												<a href="/#"><i className="fa fa-twitter"></i></a>
												<a href="/#"><i className="fa fa-pinterest-p"></i></a>
												<a href="/#"><i className="fa fa-instagram"></i></a>
												<a href="/#"><i className="fa fa-youtube"></i></a>
												<a href="/#"><i className="fa fa-rss"></i></a>
											</div>
										</React.Fragment>
										)}
								</div>
							</nav>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

const combinedStyles = combineStyles(globalStyles, styles);

const enhance = compose(
	withStyles(combinedStyles),
	withRouter,
	withApollo
);
export default enhance(Header);
