
import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { withRouter, Link } from 'react-router-dom';
import { withApollo } from "react-apollo";
import compose from 'recompose/compose';

const UPLOAD_VIDEO_RECODRING = gql`
  mutation ($file: Upload!) {
    uploadVideoRecording(file: $file) {
      message
      status
    }
  }
`;

const UploadVideo = () => {
  const [mutate] = useMutation(UPLOAD_VIDEO_RECODRING);
  const onChange = ({
    target: {
      validity,
      files: [file],
    },
  }) => {
    if (validity.valid) {
      const d = { variables: { file } };
      console.log(d, 'test')
      mutate({ variables: { file } });
    }
  }

  return (
    <>
      <input type="file" onChange={onChange} />
    </>
  )
}

const enhance = compose(
  withRouter,
  withApollo,
);
export default enhance(UploadVideo);