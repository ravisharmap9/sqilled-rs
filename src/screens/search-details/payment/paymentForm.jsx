import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import compose from 'recompose/compose';
import * as commonFunctions from '../../../utilities/commonFunctions';
import { withRouter } from 'react-router-dom';
import { withApollo } from "react-apollo";
import { loader } from "graphql.macro";
import $ from 'jquery';

const BOOK_AUTHOR = loader('../../../graphql/search/bookAuthor.graphql');

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#303238",
      fontSize: "16px",
      fontFamily: "sans-serif",
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#CFD7DF"
      }
    },
    invalid: {
      color: "#e5424d",
      ":focus": {
        color: "#303238"
      }
    }
  }
};

class PaymentForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      hourRate: this.props.hourRate,
      availabilityDate: this.props.availabilityDate,
      bookingStartime: this.props.bookingStartime,
      bookingEndTime: this.props.bookingEndTime,
      bookedHour: this.props.bookedHour,
      amount: this.props.amount,
      email: this.props.email,
      authorId: this.props.authorId,
      success: null,
      error: null
    }
  }

  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  getStripeToken = async (e) => {
    e.preventDefault();
    $("#loadingDiv").show();
    let tokenRes = await this.props.stripe.createToken({ email: this.props.email });
    let { availabilityDate, bookingStartime, bookingEndTime, bookedHour, authorId } = this.state;
    if (tokenRes.token) {
      this.props.client.mutate({
        mutation: BOOK_AUTHOR,
        variables: {
          "data": {
            "booking_date": availabilityDate,
            "start_time": bookingStartime,
            "end_time": bookingEndTime,
            "duration": bookedHour,
            "author_id": authorId,
            "token": tokenRes.token.id
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
    } else {
      if (tokenRes.error) {
        this.setState({ error: tokenRes.error.message });
      }
      $("#loadingDiv").hide();
    }
  }

  render() {

    let { email, amount, firstName, lastName, bookedHour, hourRate, error } = this.state;

    return (
      <div className="payment_form">
       
        {error && <div className='pay-error-msg'>{error}.</div>}
        <div className="card mt-5 p-4 text-white">
          <h2 className="form_heading">{`${firstName} ${lastName}`}</h2>
          <div className="flex">
          <p className="top mb-1">{email}</p>
          <p>{`${hourRate} $/hr - ${bookedHour} Hours`}</p>
          </div>
          {/* <p className="top mb-1">You need to pay</p> */}
          <div className="d-flex flex-row justify-content-between text-align-center xyz">
            <h2><i className="fas fa-dollar-sign"></i><span>Amount to pay: ${amount}</span></h2>
          </div>
          <form onSubmit={this.getStripeToken} className="paymentForm payment_form">
          <input
            className="form-control"
            type="hidden" name="amount"
            value={amount}
            onChange={this.changeHandler}
            disabled
          />
          <CardElement
            hidePostalCode={true}
            className="form-control card"
            options={CARD_ELEMENT_OPTIONS}
          />
          <input
            className="btn btn-primary"
            type="submit"
            value={`$ ${amount} Pay`}
          />
        </form>
        </div>
        
        
      </div>

    );
  }
}

const enhance = compose(
  withRouter,
  withApollo
);
export default enhance(injectStripe(PaymentForm));
