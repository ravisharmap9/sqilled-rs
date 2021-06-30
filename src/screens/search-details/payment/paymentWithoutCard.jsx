import React, { Component } from 'react';
import compose from 'recompose/compose';
import * as commonFunctions from '../../../utilities/commonFunctions';
import { withRouter } from 'react-router-dom';
import { withApollo } from "react-apollo";
import { loader } from "graphql.macro";
import $ from 'jquery';

const BOOK_AUTHOR = loader('../../../graphql/search/bookAuthor.graphql');

class PaymentWithoutCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      hourRate: this.props.hourRate,
      isCardAvail: this.props.isCardAvail,
      cardBrand: this.props.cardBrand,
      availabilityDate: this.props.availabilityDate,
      bookingStartime: this.props.bookingStartime,
      bookingEndTime: this.props.bookingEndTime,
      bookedHour: this.props.bookedHour,
      amount: this.props.amount,
      email: this.props.email,
      authorId: this.props.authorId,
      userName: this.props.userName,
      success: null,
      error: null
    }
  }

  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    let { availabilityDate, bookingStartime, bookingEndTime, bookedHour, authorId } = this.state;

    $("#loadingDiv").show();
    this.props.client.mutate({
      mutation: BOOK_AUTHOR,
      variables: {
        "data": {
          "booking_date": availabilityDate,
          "start_time": bookingStartime,
          "end_time": bookingEndTime,
          "duration": bookedHour,
          "author_id": authorId,
          "token": ""
        }
      },
    }).then(response => {
      if (response.data.saveBooking.status === 'SUCCESS') {
        this.setState({ success: response.data.saveBooking.message });
        this.props.onCloseModal(response.data.saveBooking);
      } else {
        this.setState({ error: response.data.saveBooking.message });
      }
      $("#loadingDiv").hide();
    }).catch(error => {
      let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
      this.setState({ error: errorMsg });
      $("#loadingDiv").hide();
    });
  }

  render() {

    let { email, userName, amount, firstName, lastName, hourRate, bookedHour, isCardAvail, cardBrand, error } = this.state;

    return (
      <div>
        {error && <div className='pay-error-msg'>{error}.</div>}

        <form onSubmit={this.handleSubmit} className="paymentForm">
          <div className="with-out-card container d-flex justify-content-center payment_form">
            <div className="card mt-5 p-4 text-white">
              <h2>{`${firstName} ${lastName}`}</h2>
              <div className="flex">
                <p className="top mb-1">{email}</p>
                <p>{`${hourRate} $/hr - ${bookedHour} Hours`}</p>
              </div>
              {/* <p className="top mb-1">You need to pay</p> */}
              <div className="d-flex flex-row justify-content-between text-align-center xyz">
                <h2><i className="fas fa-dollar-sign"></i><span>Amount to pay: ${amount}</span></h2>
              </div>
              <div className="card-content mt-4 mb-4">
                <div class="d-flex">
                  <div className="card-brand">{cardBrand}</div>
                  <div class="pl-2">
                    <span class="name">{userName}</span>
                    <div><span class="cross">XXXX XXXX XXXX</span><span class="pin ml-2">{isCardAvail}</span></div>
                  </div>
                </div>
              </div>
              <div className="mt-2"> <button className="btn btn-block btn-lg btn-primary"><span>${amount} Make payment </span></button> </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const enhance = compose(
  withRouter,
  withApollo
);
export default enhance((PaymentWithoutCard));
