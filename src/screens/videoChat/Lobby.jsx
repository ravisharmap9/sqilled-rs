import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
const Lobby = ({
  username,
  handleUsernameChange,
  roomName,
  handleRoomNameChange,
  handleSubmit,
  connecting

}) => {
  useEffect(() => {

  });
  return (
    <React.Fragment>
      <Link to="/my-bookings" className="btn btn-danger">Back</Link>
      <form onSubmit={handleSubmit} className="video-call">
        <h2>Join Room</h2>
        <div>
          <label htmlFor="name">Username:</label>
          <input
            type="text"
            id="field"
            value={username}
            onChange={handleUsernameChange}
            required
            readOnly={connecting}
          />
        </div>
        <div>
          <label htmlFor="room">Room id:</label>
          <input
            readOnly={connecting}
            type="text"
            id="room"
            value={roomName}
            onChange={handleRoomNameChange}
            required
          />
        </div>
        <button type="submit" disabled={connecting} className="btn btn-primary">
          {connecting ? "Connecting" : "Join Call"}
        </button>
      </form>
    </React.Fragment>
  );
};

export default Lobby;