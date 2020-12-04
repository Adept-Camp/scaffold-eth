import React from "react";
import ReactPlayer from "react-player";

import styled from "styled-components";

const VideoPlayer = ({ url, assetInfo }) => {
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
          light={assetInfo.imageUrl}
          controls
        />
      )}
    </VideoWidget>
  );
};

const VideoWidget = styled.div`
  width: 100%;
  position: relative;
  padding-top: 100%;
`;

export default VideoPlayer;
