import React, { useState, useCallback, useEffect } from "react";
import { withStyles } from '@material-ui/core/styles';
import Styles from './styles.css';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
import { withApollo } from "react-apollo";
import { loader } from "graphql.macro";
import * as commonFunctions from '../../utilities/commonFunctions';
import UserUtils from '../../utilities/userUtils';
import Video from "twilio-video";
// import Lobby from "./Lobby";
import Room from "./Room";
import $ from 'jquery';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const VIDEO_CALL = loader('../../graphql/search/videoCall.graphql');
const READER_VIDEO_CALL = loader('../../graphql/search/readerJoinVideoCall.graphql');
const END_VIDEO_CALL = loader('../../graphql/search/endVideoCall.graphql');

const VideoChat = (props) => {
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");
  const [room, setRoom] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [token, setToken] = useState("");
  const [bookingID, setBookingID] = useState('');

  // const handleUsernameChange = useCallback((event) => {
  //   setUsername(event.target.value);
  // }, []);

  // const handleRoomNameChange = useCallback((event) => {
  //   setRoomName(event.target.value);
  // }, []);

  const handleSubmit = useCallback(() => {
    $("#loadingDiv").show();
    const userBookingData = JSON.parse(UserUtils.getBookingId());
    if (userBookingData.bookingId) {
      setBookingID(userBookingData.bookingId);
      // setUserType(data.userType);
      $("#loadingDiv").show();
      if (userBookingData.userType === "W") {
        props.client.mutate({
          mutation: VIDEO_CALL,
          variables: {
            data: userBookingData.bookingId
          },
        }).then(response => {
          if (response.data.startVideoCall.jwt_token) {
            setToken(response.data.startVideoCall.jwt_token);
            setRoomName(response.data.startVideoCall.room_sid);
            setUsername(response.data.startVideoCall.room_name);
            // VIDEO CALL CONNECTION
            connectVideoCall(response.data.startVideoCall.jwt_token, response.data.startVideoCall.room_name);
          }
          $("#loadingDiv").hide();
        }).catch(error => {
          let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
          messageAlert(errorMsg);
          $("#loadingDiv").hide();
        });
      } else {
        props.client.mutate({
          mutation: READER_VIDEO_CALL,
          variables: {
            data: userBookingData.bookingId
          },
        }).then(response => {
          if (response.data.readerJoinVideoCall.jwt_token) {
            setToken(response.data.readerJoinVideoCall.jwt_token);
            setRoomName(response.data.readerJoinVideoCall.room_sid);
            setUsername(response.data.readerJoinVideoCall.room_name);
            // VIDEO CALL CONNECTION
            connectVideoCall(response.data.readerJoinVideoCall.jwt_token, response.data.readerJoinVideoCall.room_name);
          }
          $("#loadingDiv").hide();
        }).catch(error => {
          let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
          messageAlert(errorMsg);
          $("#loadingDiv").hide();
        });
      }
    }
  }, []);

  // VIDEO CALL CONNECTION WITH TWILO
  const connectVideoCall = (token, roomName) => {
    setConnecting(true);
    Video.connect(token, {
      name: roomName,
    }).then((room) => {
      setConnecting(false);
      setRoom(room);
      $("#loadingDiv").hide();
    }).catch((err) => {
      console.error(err);
      setConnecting(false);
      $("#loadingDiv").hide();
    });
  }

  // const handleSubmit = useCallback(
  //   async (event) => {
  //     event.preventDefault();
  //     $("#loadingDiv").show();
  //     setConnecting(true);
  //     console.log(token, 'token')
  //     Video.connect(token, {
  //       name: roomName,
  //     }).then((room) => {
  //       setConnecting(false);
  //       setRoom(room);
  //       $("#loadingDiv").hide();
  //     }).catch((err) => {
  //       console.error(err);
  //       setConnecting(false);
  //       $("#loadingDiv").hide();
  //     });

  //   },
  //   [roomName, token]
  // );

  const handleLogout = useCallback(() => {
    setRoom((prevRoom) => {
      if (prevRoom) {
        prevRoom.localParticipant.tracks.forEach((trackPub) => {
          trackPub.track.stop();
        });
        prevRoom.disconnect();
        props.history.push('/my-bookings');
        const userBookingData = JSON.parse(UserUtils.getBookingId());
        props.client.mutate({
          mutation: END_VIDEO_CALL,
          variables: {
            data: userBookingData.bookingId
          },
        }).then(response => {
          if (response.data.endVideoCall.status === "SUCCESS") {
            // props.history.push('/my-bookings');
          }
          $("#loadingDiv").hide();
        }).catch(error => {
          let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
          messageAlert(errorMsg);
          $("#loadingDiv").hide();
        });

      }
      return null;
    });
  }, [props]);

  useEffect(() => {
    if (room) {
      const tidyUp = (event) => {
        if (event.persisted) {
          handleSubmit();
          return;
        }
        if (room) {
          // handleSubmit();
          handleLogout();
        }
      };
      window.addEventListener("pagehide", tidyUp);
      window.addEventListener("beforeunload", tidyUp);
      return () => {
        window.removeEventListener("pagehide", tidyUp);
        window.removeEventListener("beforeunload", tidyUp);
      };
    } else {
      handleSubmit();
    }
  }, [props, room, handleLogout]);

  const messageAlert = (msg) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>{msg}</h1>
            <button className="okay-btn" onClick={onClose}>Okay</button>
          </div>
        );
      }
    });
  }

  let render;
  if (room) {
    render = (
      <>
        <Room
          roomName={roomName}
          room={room}
          props={props}
          username={username}
          bookingID={bookingID}
          handleLogout={handleLogout}
          token={token}
        />
      </>
    );
  } else {
    render = (
      <div className="jumbotron text-center">
        <h1>Connecting...</h1>
      </div>
      // <Lobby
      //   username={username}
      //   roomName={roomName}
      //   handleUsernameChange={handleUsernameChange}
      //   handleRoomNameChange={handleRoomNameChange}
      //   handleSubmit={handleSubmit}
      //   connecting={connecting}
      // />
    );
  }
  return render;
};

const enhance = compose(
  withStyles(Styles),
  withRouter,
  withApollo
);
export default enhance(VideoChat);
