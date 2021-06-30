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

const SEARCH_AUTHORS = loader('../../graphql/search/searchAuthors.graphql');

const SearchList = (props) => {

	const [searchKeyword, setSearchKeyword] = useState(null);
	const [searchList, setSearchList] = useState([]);
	const [size, setSize] = useState(10);
	const [pageCount, setPageCount] = useState(1);

	useEffect(() => {
		const keyword = UserUtils.getSearchKeyword();
		if (keyword !== null) {
			setSearchKeyword(keyword);
			$("#loadingDiv").show();

			props.client.query({
				query: SEARCH_AUTHORS,
				variables: {
					data: keyword,
					"first": size,
					"page": pageCount
				},
				fetchPolicy: "network-only"
			}).then(response => {
				if (response.data.searchAuthor) {
					setSearchList(response.data.searchAuthor.data);
					setPageCount(response.data.searchAuthor.paginatorInfo.lastPage);
					setSize(response.data.searchAuthor.paginatorInfo.perPage)
					$("#loadingDiv").hide();
				}
			}).catch(error => {
				let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
				console.log(errorMsg, 'error')
				$("#loadingDiv").hide();
			});

		}
	}, [props, size, pageCount]);

	const handlePage = (data) => {
		let selected = data.selected + 1;
		$("#loadingDiv").show();
		props.client.query({
			query: SEARCH_AUTHORS,
			variables: {
				data: searchKeyword,
				"first": size,
				"page": selected
			},
			fetchPolicy: "network-only"
		}).then(response => {
			if (response.data.searchAuthor) {
				setSearchList(response.data.searchAuthor.data);
				setPageCount(response.data.searchAuthor.paginatorInfo.lastPage);
				$("#loadingDiv").hide();
			}
		}).catch(error => {
			let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
			console.log(errorMsg, 'error')
			$("#loadingDiv").hide();
		});
	}

	const handleSearchDetails = (e, id) => {
		const accessToken = UserUtils.getAccessToken();
		UserUtils.setSearchedUserId(id);
		if (accessToken !== null) {
			props.history.push('/search-details');
		} else {
			UserUtils.setSaveUrl('search-details');
			props.history.push('/login');
		}
	}

	return (
		<Typography >
			<div className="search-list">
				<div className="container">
					<h3>Search Results</h3>
					<div className="search-table">
						<table>
							<thead>
								<th>PROFILE</th>
								<th>NAME</th>
								<th>HOURLY RATE</th>
								<th>QUALIFICATION</th>
								<th>CITY</th>
								<th>STATE</th>
								<th>COUNTRY</th>
								<th>TAG LINE</th>
								<th>Action</th>
							</thead>
							<tbody>
								{(searchList && searchList.length > 0) && searchList.map((d, index) => {
									return (
										<tr key={index}>
											<td>
												<figure className="profile">
													<img src={`${d.avatar !== null ? d.avatar : '/images/default.png'}`} alt="profile" />
												</figure>
											</td>
											<td>{`${d.first_name} ${d.last_name}`}</td>
											<td>{`${d.hourly_rate !== null ? '$' + d.hourly_rate + '/hr' : 'N/A'}`}</td>
											<td>{d.qualification || 'N/A'}</td>
											<td>{d.city || 'N/A'}</td>
											<td>{d.state || 'N/A'}</td>
											<td>{d.country || 'N/A'}</td>
											<td>{d.tag_line || 'N/A'} </td>
											<td><button className="booknow" onClick={e => handleSearchDetails(e, d.id)}>Details</button></td>
										</tr>
									)
								})}
								{(searchList && searchList.length === 0) &&
									<tr>
										<td colSpan="7" className="text-center">
											<h5>Data Not Found. Please try with Another Keyword</h5>
										</td>
									</tr>
								}
							</tbody>
						</table>
					</div>
				</div>

				{pageCount > 1
					? <div className="search-pagination">
						<div className="container">
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
					</div>
					: ''
				}
			</div>

		</Typography>
	);
};

const enhance = compose(
	withStyles(styles),
	withRouter,
	withApollo
);
export default enhance(SearchList);
