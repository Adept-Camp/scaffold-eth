import { Network, OpenSeaPort } from "opensea-js";
import React, { useEffect, useRef, useState } from "react";
import { onNetworkUpdate, web3Provider } from "../constants";
import { SingleNFT } from "../components";

export default () => {
  const [accountAddress, setAccountAddress] = useState(null);

  const seaportRef = useRef(null);

  const onChangeAddress = () => {
    seaportRef.current = new OpenSeaPort(web3Provider, {
      networkName: Network.Main,
    });
    const web3 = seaportRef.current.web3;
    web3.eth.getAccounts((err, res) => {
      setAccountAddress(res[0]);
    });
  };

  useEffect(() => {
    onChangeAddress();
    onNetworkUpdate(onChangeAddress);
  }, []);

  return (
    <div>
      <main>
        <div className="container py-3">
          <div className="card-deck">
            <SingleNFT
              seaport={seaportRef.current}
              tokenAddress="0x9fed46c6de6c49f0ba2c60401f8f72408a15ee28"
              tokenId="4"
            />
            <SingleNFT
              seaport={seaportRef.current}
              tokenAddress="0x60f80121c31a0d46b5279700f9df786054aa5ee5"
              tokenId="71403"
            />
            <SingleNFT
              seaport={seaportRef.current}
              tokenAddress="0x144b8f23a774e3f019c9610d1aa4d88a77ad39f6"
              tokenId="22"
            />
          </div>
        </div>
      </main>
    </div>
  );
};
