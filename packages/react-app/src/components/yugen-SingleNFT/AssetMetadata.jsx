import React from "react";

import styled from "styled-components";
import VideoPlayer from "../VideoPlayer";

const AssetMetadata = ({ asset, meta }) => {
  return (
    <React.Fragment>
      {meta.animation_url ? (
        <VideoPlayer url={meta.animation_url} />
      ) : (
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="text-center d-inline-block m-100"
          href={asset.openseaLink}
        >
          <img alt="Asset artwork" src={asset.imageUrl} />
        </a>
      )}

      <div className="card-body h-25">
        <h5 className="card-title">{asset.name}</h5>
        <p className="card-text text-truncate">
          <a target="_blank" rel="noopener noreferrer" href={asset.openseaLink} className="card-link">
            {asset.assetContract.name} #{asset.tokenId}
          </a>
        </p>
        <p className="card-text">{asset.description}</p>
        {meta && (
          <MetaContainer>
            <table>
              <thead>
                <MetaHeader>
                  <MetaCell>Key</MetaCell>
                  <MetaCell>Value</MetaCell>
                </MetaHeader>
              </thead>
              <tbody>
                {Object.keys(meta).map((key, i) => {
                  return (
                    <MetaRow isOdd={i % 2} key={key}>
                      <MetaCell>{key}</MetaCell>
                      <MetaCell>{JSON.stringify(meta[key])}</MetaCell>
                    </MetaRow>
                  );
                })}
              </tbody>
            </table>
          </MetaContainer>
        )}
      </div>
    </React.Fragment>
  );
};

const MetaContainer = styled.div`
  overflow: scroll;
`;

const MetaRow = styled.tr`
  background: ${props => (props.isOdd ? "lightgrey" : "white")};
`;

const MetaHeader = styled.tr`
  background: grey;
`;

const MetaCell = styled.td`
  border: 1px solid black;
  text-align: left;
`;

export default AssetMetadata;
