import { useState } from 'react';
import { withRouter, Link } from 'react-router-dom';
import VideoRecorder from 'react-video-recorder';
import { loader } from "graphql.macro";
import { withApollo } from "react-apollo";
import compose from 'recompose/compose';
import $ from 'jquery';
import * as commonFunctions from '../../utilities/commonFunctions';
import UserUtils from '../../utilities/userUtils';

const UPLOAD_VIDEO_RECODRING = loader('../../graphql/search/uploadVideoRecording.graphql');

const RecordVideo = (props) => {
  const [videoData, setVideoData] = useState('');

  const videoRecordCallBack = (videoBlob) => {
    console.log('videoBlob', videoBlob)

    const fileData = new File([videoBlob])
    console.log(fileData, 'Data File');
    // let reader = new FileReader();
    // reader.readAsDataURL(videoBlob);
    // reader.onloadend = function (e) {
    //   console.log(reader.result)
    // }
    // var reader = new FileReader();
    // reader.readAsDataURL(videoBlob);
    // reader.onloadend = function () {
    // var base64String = reader.result;
    // console.log('Base64 String - ', base64String);

    // Simply Print the Base64 Encoded String,
    // without additional data: Attributes.
    // console.log('Base64 String without Tags- ', base64String.substr(base64String.indexOf(', ') + 1));
    // const data = base64String.substr(base64String.indexOf(', ') + 1);
    // $("#loadingDiv").show();
    // props.client.mutate({
    //   mutation: UPLOAD_VIDEO_RECODRING,
    //   variables: {
    //     data: { base64String }
    //   }
    // }).then(response => {
    //   if (response.data.uploadVideoRecording) {
    //     console.log(response, 'response')
    //     $("#loadingDiv").hide();
    //   }
    // }).catch(error => {
    //   let errorMsg = commonFunctions.parseGraphQLErrorMessage(error);
    //   console.log(errorMsg, 'err')
    //   $("#loadingDiv").hide();
    // });
    // setVideoData(data);
    // }
  }
  return (
    <>
      <Link className="btn btn-default back-btn" to="/edit-profile">Back</Link>
      <p className="video-record-title">Record Self Profile Video </p>

      <div className="record-video-profile">
        <VideoRecorder

          onRecordingComplete={videoBlob => {
            // Do something with the video...
            videoRecordCallBack(videoBlob)
          }}

        />
      </div>
    </>
  )
}


const enhance = compose(
  withRouter,
  withApollo,
);
export default enhance(RecordVideo);
