import React, { useEffect, useState } from "react";
import styles from './styles.css';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { withRouter, Link } from 'react-router-dom';
import compose from 'recompose/compose';
import UserUtils from '../../utilities/userUtils';

const Home = (props) => {
	const [isLogged, setIslogged] = useState(false);

	useEffect(() => {
		const accessToken = UserUtils.getAccessToken();
		if (accessToken !== null) {
			setIslogged(true);
			// props.history.push('/view-profile');
		}
	}, [props]);

	return (
		<Typography >
			<div className="about-sec">
				<div className="container">
					<div className="row">
						<div className="col-md-6">
							{!isLogged && <div className="about-left">
								<div className="more-flex more-flex-border">
									<Link to="/login" className="start-btn">User<i className="fa fa-angle-double-right"></i></Link>
									<Link to="/login" className="substack-btn">Professional<i className="fa fa-angle-double-right"></i></Link>
								</div>

							</div>
							}
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
);
export default enhance(Home);
