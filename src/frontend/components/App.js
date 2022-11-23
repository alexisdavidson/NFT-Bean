import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"
import './App.css';
import Home from './Home';

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

import NFTAbi from '../contractsData/NFT.json'
import NFTAddress from '../contractsData/NFT-address.json'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const totalSupply = 5000

function App() {
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(0)
  const [supplyLeft, setSupplyLeft] = useState(totalSupply)
  const [nft, setNFT] = useState({})

  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setBalance(await nft.balanceOf(accounts[0]))
    setAccount(accounts[0])
  }

  const listenToEvents = async (nft) => {
    nft.on("MintSuccessful", (user) => {
        console.log("MintSuccessful");
        console.log(user);

        mintFinished();
    });
  }

  const mintFinished = () => {
      console.log("mintFinished")
      setSupplyLeft(supplyLeft - 1)
      setBalance(balance + 1)
  }

  const loadContracts = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
    const supplyLeftTemp = totalSupply - await nft.currentToken()
    console.log("tickets left: " + supplyLeftTemp)
    setSupplyLeft(supplyLeftTemp)
    listenToEvents(nft)
    setNFT(nft)
    setLoading(false)
  }

  useEffect(() => {
    loadContracts()

    return () => {
      nft?.removeAllListeners("MintSuccessful");
    };
  }, [])

  return (
    <BrowserRouter>
      <div className="App" id="wrapper">
        {/* <Navigation /> */}
        <Routes>
          <Route path="/" element={
            <Home web3Handler={web3Handler} loading={loading} account={account} nft={nft} 
              supplyLeft={supplyLeft} balance={balance} >
              </Home>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
