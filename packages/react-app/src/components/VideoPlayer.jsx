import React from "react";
import ReactPlayer from "react-player";

import styled from "styled-components";

const VideoPlayer = ({ url }) => {
  return (
    <VideoWidget>
      {url && (
        <ReactPlayer
          url={url}
          width="100%"
          height="100%"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
          playing
          light
        />
      )}
    </VideoWidget>
  );
};

const VideoWidget = styled.div`
  width: 100%;
  position: relative;
  padding-top: 56.25%;
`;

export default VideoPlayer;
