import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import AssetMetadata from "../ships-log-Order/AssetMetadata";

export default ({ tokenAddress = "0x06012c8cf97bead5deae237070f9587f8e7a266d", tokenId = "1", seaport = null }) => {
  const [assetInfo, setAssetInfo] = useState(null);

  const handleLoadAsset = useCallback(async () => {
    setAssetInfo(null);
    if (seaport) {
      const asset = await seaport.api.getAsset({
        tokenAddress, // string
        tokenId, // string | number | null
      });

      console.log(asset);
      setAssetInfo(asset);
    }
  }, [tokenAddress, tokenId, seaport]);

  useEffect(() => {
    handleLoadAsset();
  }, [handleLoadAsset]);

  if (!assetInfo) return <SingleNFTContainer>Loading •••</SingleNFTContainer>;
  return (
    <SingleNFTContainer>
      <AssetMetadata asset={assetInfo} />
    </SingleNFTContainer>
  );
};

const SingleNFTContainer = styled.div.attrs({ className: "card mx-2 mb-4" })`
  min-width: 200px;
  img {
    height: 240px;
    max-width: 100%;
  }
  img.small {
    max-width: 50%;
    height: 240px;
  }
`;
