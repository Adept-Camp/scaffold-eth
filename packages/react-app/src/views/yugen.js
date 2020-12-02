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
              tokenAddress="0x06012c8cf97bead5deae237070f9587f8e7a266d"
              tokenId="40"
            />
            <SingleNFT
              seaport={seaportRef.current}
              tokenAddress="0x06012c8cf97bead5deae237070f9587f8e7a266d"
              tokenId="50"
            />
            <SingleNFT
              seaport={seaportRef.current}
              tokenAddress="0x06012c8cf97bead5deae237070f9587f8e7a266d"
              tokenId="80"
            />
          </div>
        </div>
      </main>
    </div>
  );
};
