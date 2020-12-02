import React, { useCallback, useEffect, useState, useMemo } from "react";
import { OrderSide } from "opensea-js/lib/types";
import styled from "styled-components";
import moment from "moment";

import { connectWallet } from "../../constants";
import AssetMetadata from "./AssetMetadata";
import SalePrice from "./SalePrice";

export default ({
  tokenAddress = "0x06012c8cf97bead5deae237070f9587f8e7a266d",
  tokenId = "1",
  accountAddress,
  seaport,
}) => {
  const [assetInfo, setAssetInfo] = useState(null);
  const [orders, setOrders] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [creatingOrder, setCreatingOrder] = useState(false);

  const isOwner = useMemo(() => {
    if (!assetInfo) return false;
    const owner = assetInfo.owner;
    return accountAddress && accountAddress.toLowerCase() === owner.address.toLowerCase();
  }, []);

  const handleLoadAsset = useCallback(async () => {
    setAssetInfo(null);
    setOrders(null);
    if (seaport) {
      const asset = await seaport.api.getAsset({
        tokenAddress, // string
        tokenId, // string | number | null
      });

      const { orders, count } = await seaport.api.getOrders({
        asset_token_address: tokenAddress,
        token_id: tokenId,
        side: OrderSide.Sell,
      });

      console.log(asset, orders);
      setAssetInfo(asset);
      setOrders(orders);
    }
  }, [tokenAddress, tokenId, seaport]);

  useEffect(() => {
    handleLoadAsset();
  }, [handleLoadAsset]);

  const onError = error => {
    // Ideally, you'd handle this error at a higher-level component
    // using props or Redux
    setErrorMessage(error.message);
    setTimeout(() => setErrorMessage(null), 3000);
    // throw error;
  };

  const fulfillOrder = async () => {
    if (!accountAddress) {
      await connectWallet();
    }
    try {
      setCreatingOrder(true);
      await seaport.fulfillOrder({ order: orders[0], accountAddress });
    } catch (error) {
      onError(error);
    } finally {
      setCreatingOrder(false);
    }
  };

  const renderBuyButton = (canAccept = true) => {
    const buyAsset = async () => {
      if (accountAddress && !canAccept) {
        setErrorMessage("You already own this asset!");
        return;
      }
      fulfillOrder();
    };
    return (
      <button disabled={creatingOrder} onClick={buyAsset} className="btn btn-primary w-100">
        Buy{creatingOrder ? "ing" : ""} for <SalePrice order={orders[0]} />
      </button>
    );
  };

  if (!assetInfo || !orders) return <SingleNFTContainer>Loading •••</SingleNFTContainer>;

  return (
    <SingleNFTContainer>
      <AssetMetadata asset={assetInfo} />
      {errorMessage ? (
        <div className="alert alert-warning mb-0" role="alert">
          {errorMessage}
        </div>
      ) : (
        <li className="list-group-item">{orders.length > 0 && renderBuyButton(!isOwner)}</li>
      )}
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
