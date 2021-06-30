import React, { useEffect, useState } from "react";
import Participant from "./Participant";
import UserUtils from '../../utilities/userUtils';
// import { withRouter } from 'react-router-dom';
// import { withApollo } from "react-apollo";
import * as commonFunctions from '../../utilities/commonFunctions';
import { loader } from "graphql.macro";
const CALL_IN_PROGRESS = loader('../../graphql/search/callInProgress.graphql');
let countVal = 0;
const Room = ({ roomName, room, handleLogout, props, bookingID }) => {
  const [participants, setParticipants] = useState([]);
  const [toggleAudio, setToggleAudio] = useState(true);
  const [toggleVideo, setToggleVideo] = useState(true);
  const [timer, setTimer] = useState("");
  const [userName, setUserName] = useState('');
  const [callInProgress, setCallInProgress] = useState('');

  useEffect(() => {

    const participantConnected = (participant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };
    setUserName(room.name);
    room.on("participantConnected", participantConnected);
    room.on("participantDisconnected", participantDisconnected);
    room.participants.forEach(participantConnected);
    return () => {
      room.off("participantConnected", participantConnected);
      room.off("participantDisconnected", participantDisconnected);
      countVal = 0;
    };

  }, [room]);

  const remoteParticipants = participants.map((participant) => {
    // If user participant has joined the call then hit the progress api
    if (participant.sid && countVal === 0) {
      countVal++;
      props.client.mutate({
        mutation: CALL_IN_PROGRESS,
        variables: {
          data: bookingID
        },
      }).then(response => {
        if (response.data.callInProgress) {
          setCallInProgress('Call is in Progess...');
        }
      }).catch(error => {
        let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
        console.log(errorMsg, 'error');
      });
    }
    return (
      <Participant
        key={participant.sid}
        participant={participant}
        isLocal={false}
      />
    )

  });

  // New code
  const handleAudioToggle = () => {
    room.localParticipant.audioTracks.forEach(track => {
      if (track.track.isEnabled) {
        track.track.disable();
      } else {
        track.track.enable();
      }
      setToggleAudio(track.track.isEnabled);
    });
  };

  const handleVideoToggle = () => {
    room.localParticipant.videoTracks.forEach(track => {
      if (track.track.isEnabled) {
        track.track.disable();
      } else {
        track.track.enable();
      }
      setToggleVideo(track.track.isEnabled);
    });
  };


  useEffect(() => {

    const userBookingData = JSON.parse(UserUtils.getBookingId());
    // const startTime = userBookingData.bookingData.start_time;
    const endTime = userBookingData.bookingData.end_time;
    const bookingDate = userBookingData.bookingData.booking_date;

    let timerFunc = setInterval(() => {
      var countDownDate = new Date(`${bookingDate} ${endTime}`).getTime();
      var now = new Date().getTime();
      var distance = countDownDate - now;
      // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      if (seconds > 0) {
        setTimer(`H:${checkDigit(hours)} M:${checkDigit(minutes)} S:${checkDigit(seconds)}`);
      }

      if (seconds < 0) {
        setTimer(`Time Out`);
        setTimeout(() => {
          handleLogout();
        }, 2500);
      }
    }, 1000)

    return () => {
      clearInterval(timerFunc)
    }
  }, [handleLogout]);

  const checkDigit = (num) => {
    if (num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  return (
    <div className="room">
      <span className="video-call-timer">
        {callInProgress}
        <p className="timer">Timer: {timer}</p>
      </span>
      <h2>Room: {userName}</h2>
      <div className="video-chat-room">
        <div className="local-participant">
          {room ? (
            <Participant
              key={room.localParticipant.sid}
              participant={room.localParticipant}
              handleAudioToggle={handleAudioToggle}
              handleVideoToggle={handleVideoToggle}
              handleCallDisconnect={handleLogout}
              toggleAudio={toggleAudio}
              toggleVideo={toggleVideo}
              isLocal={true}
            />
          ) : (
            ""
          )}
        </div>

        <div className="remote-participants">
          {/* <h3>Remote Participants</h3> */}
          {remoteParticipants}
        </div>
      </div>
    </div>
  );
};

export default Room;

