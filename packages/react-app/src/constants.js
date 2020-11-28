// everything below is from ships-log constants

import * as Web3 from 'web3'
import BigNumber from 'bignumber.js'
import { PortisProvider } from 'portis'

// MY INFURA_ID, SWAP IN YOURS FROM https://infura.io/dashboard/ethereum
export const INFURA_ID = "5ce0898319eb4f5c9d4c982c8f78392a";

//MY ETHERSCAN_ID, SWAP IN YOURS FROM https://etherscan.io/myapikey
export const ETHERSCAN_KEY = "PSW8C433Q667DVEX5BCRMGNAH9FSGFZ7Q8";

require('dotenv').config()
// const PrivateKeyProvider = require('truffle-privatekey-provider');
// const privateKey = process.env.ESD_PRIVATE_KEY;
const infuraId = process.env.INFURA_KEY;
//const etherscanKey = process.env.ESD_ETHERSCAN_KEY;

export const GOOGLE_ANALYTICS_ID = 'UA-111688253-4'
export const OPENSEA_URL = "https://opensea.io"
export const OPENSEA_JS_URL = "https://github.com/ProjectOpenSea/opensea-js"
export const GITHUB_URL = "https://adept.camp"
export const DEFAULT_DECIMALS = 18
export let web3Provider = typeof web3 !== 'undefined'
  ? window.web3.currentProvider
 // : new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/9afe2a08386146b9b2b833ba4b51e90a')
 : new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/' + infuraId)
// Replace this with Redux for more complex logic
const networkCallbacks = []
export const onNetworkUpdate = (callback) => {
  networkCallbacks.push(callback)
}

export async function connectWallet() {
  if (!window.web3) {
    web3Provider = new PortisProvider({
      // Put your Portis API key here
    })
  } else if (window.ethereum) {
    window.ethereum.enable()
  } else {
    const errorMessage = 'You need an Ethereum wallet to interact with this marketplace. Unlock your wallet, get MetaMask.io or Portis on desktop, or get Trust Wallet or Coinbase Wallet on mobile.'
    alert(errorMessage)
    throw new Error(errorMessage)
  }
  networkCallbacks.map((c) => c(web3Provider))
}

export function toUnitAmount(baseAmount, tokenContract = null) {
  const decimals = tokenContract && tokenContract.decimals != null
    ? tokenContract.decimals
    : DEFAULT_DECIMALS

  const amountBN = new BigNumber(baseAmount.toString())
  return amountBN.div(new BigNumber(10).pow(decimals))
}

export function toBaseUnitAmount(unitAmount, tokenContract = null) {
  const decimals = tokenContract && tokenContract.decimals != null
    ? tokenContract.decimals
    : DEFAULT_DECIMALS

  const amountBN = new BigNumber(unitAmount.toString())
  return amountBN.times(new BigNumber(10).pow(decimals))
}

export async function promisify(inner) {
  return new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) { reject(err) }
      resolve(res)
    })
  )
}

