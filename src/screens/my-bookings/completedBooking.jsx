import React, { useState, useEffect } from "react";
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
import { withApollo } from "react-apollo";
import * as commonFunctions from '../../utilities/commonFunctions';
import { loader } from "graphql.macro";
import ReactPaginate from 'react-paginate';
import $ from 'jquery';
import 'react-tabs/style/react-tabs.css';
import moment from 'moment';

const MY_BOOKINGS = loader('../../graphql/search/getBooking.graphql');

const CompletedBooking = (props) => {

  const [size, setSize] = useState(10);
  const [bookedList, setBookList] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [userType, setUserType] = useState('');

  useEffect(() => {
    setUserType(props.userType);
    $("#loadingDiv").show();
    props.client.query({
      query: MY_BOOKINGS,
      variables: {
        data: 2,
        "first": size,
        "page": 1
      },
      fetchPolicy: "network-only"
    }).then(response => {
      if (response.data.getBookings) {
        setBookList(response.data.getBookings.data);
        setPageCount(response.data.getBookings.paginatorInfo.lastPage);
        setSize(response.data.getBookings.paginatorInfo.perPage)
        $("#loadingDiv").hide();
      }
    }).catch(error => {
      let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
      console.log(errorMsg, 'error')
      $("#loadingDiv").hide();
    });
  }, [props, size]);

  const handlePage = (data) => {
    let selected = data.selected + 1;
    $("#loadingDiv").show();
    props.client.query({
      query: MY_BOOKINGS,
      variables: {
        data: 2,
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

  return (
    <>
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
          </thead>
          <tbody>
            {(bookedList && bookedList.length > 0) && bookedList.map((d, index) => {
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
                        <td>Completed</td>
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
                        <td>Completed</td>
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
    </>
  )
}

const enhance = compose(
  withRouter,
  withApollo
);
export default enhance(CompletedBooking);