import React, { useCallback, useEffect, useState, useMemo } from "react";
import styled from "styled-components";

import { connectWallet } from "../../constants";
import AssetMetadata from "./AssetMetadata";
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
    if (seaport) {
      try {
        const asset = await seaport.api.getAsset({
          tokenAddress, // string
          tokenId, // string | number | null
        });
        console.log(asset);
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
      await seaport.fulfillOrder({ order: assetInfo.orders[0], accountAddress });
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
        Buy{creatingOrder ? "ing" : ""} for <SalePrice order={assetInfo.orders[0]} />
      </button>
    );
  };

  if (!assetInfo || !assetMeta) return <SingleNFTContainer>Loading •••</SingleNFTContainer>;

  console.log(assetMeta);
  return (
    <SingleNFTContainer>
      <AssetMetadata asset={assetInfo} meta={assetMeta} />
      {errorMessage ? (
        <div className="alert alert-warning mb-0" role="alert">
          {errorMessage}
        </div>
      ) : (
        <li className="list-group-item">{assetInfo.orders.length > 0 && renderBuyButton(!isOwner)}</li>
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
