import React, { useCallback, useEffect, useState, useMemo } from "react";
import { OrderSide } from "opensea-js/lib/types";
import styled from "styled-components";

import { connectWallet } from "../../constants";
import SalePrice from "./SalePrice";

import Web3 from "web3";
import Axios from "axios";

const infuraId = process.env.INFURA_KEY;
const web3 = new Web3(
  Web3.givenProvider || new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/" + infuraId),
);

export default ({
  tokenAddress = "0x06012c8cf97bead5deae237070f9587f8e7a266d",
  tokenId = "1",
  accountAddress,
  seaport,
}) => {
  const [assetInfo, setAssetInfo] = useState(null);
  const [orders, setOrders] = useState(null);
  const [assetMeta, setAssetMeta] = useState(null);
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
      try {
        const asset = await seaport.api.getAsset({
          tokenAddress, // string
          tokenId, // string | number | null
        });
        setAssetInfo(asset);
      } catch (error) {
        setAssetInfo(null);
      }

      try {
        // const abi = ["function tokenURI(uint256 _tokenId) view returns (string URI)"];
        const abi = [
          {
            type: "function",
            name: "tokenURI",
            inputs: [{ name: "_tokenId", type: "uint256" }],
            outputs: [{ name: "URI", type: "string" }],
            constant: true,
          },
        ];

        const tokenContract = new web3.eth.Contract(abi, tokenAddress);
        const result = await tokenContract.methods.tokenURI(tokenId).call();

        Axios.get(`${result}`).then(res => {
          setAssetMeta(res.data);
        });
      } catch (error) {
        console.error(error);
      }

      try {
        const { orders } = await seaport.api.getOrders({
          asset_token_address: tokenAddress,
          token_id: tokenId,
          side: OrderSide.Sell,
        });
        setOrders(orders);
      } catch (error) {
        setOrders([]);
      }
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

  if (!assetInfo || !orders) return <FeaturedNFTContainer>Loading •••</FeaturedNFTContainer>;

  console.log(assetInfo);
  return (
    <FeaturedNFTContainer>
      <NFTColumn>
        <h5 className="card-title">{assetInfo.name}</h5>
        <p className="card-text text-truncate">
          <a target="_blank" rel="noopener noreferrer" href={assetInfo.openseaLink} className="card-link">
            {assetInfo.assetContract.name} #{assetInfo.tokenId}
          </a>
        </p>
        <p className="card-text">{assetInfo.description}</p>
        {errorMessage ? (
          <div className="alert alert-warning mb-0" role="alert">
            {errorMessage}
          </div>
        ) : (
          orders.length > 0 && renderBuyButton(!isOwner)
        )}
      </NFTColumn>
      <NFTColumn>
        <NFTImageLink
          target="_blank"
          rel="noopener noreferrer"
          className="text-center d-inline-block m-100"
          href={assetInfo.openseaLink}
        >
          <NFTImg alt="Asset artwork" src={assetInfo.imageUrlOriginal} />
        </NFTImageLink>
      </NFTColumn>
    </FeaturedNFTContainer>
  );
};

const FeaturedNFTContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const NFTColumn = styled.div`
  width: 49%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const NFTImageLink = styled.a`
  width: 100%;
  padding-top: 100%;
  position: relative;
`;

const NFTImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;
