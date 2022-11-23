import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"
import './App.css';
import Navigation from './Navbar';
import Home from './Home';

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

import NFTAbi from '../contractsData/NFT.json'
import NFTAddress from '../contractsData/NFT-address.json'
import whitelistAddresses from './whitelistAddresses';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
window.Buffer = window.Buffer || require("buffer").Buffer; 

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

function App() {
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [isWhitelisted, setIsWhitelisted] = useState(false)
  const [balance, setBalance] = useState(0)
  const [ticketsLeft, setTicketsLeft] = useState(5000)
  const [nft, setNFT] = useState({})
  const [proof, setProof] = useState([])

  const getIsWhitelisted = async(acc, nft) => {
    console.log("getIsWhitelisted")
    
    const isPublicSale = await nft.publicSaleEnabled()
    if (isPublicSale) {
      console.log("public sale is enabled")
      setIsWhitelisted(true)
      return
    }

    console.log("whitelistAddresses:")
    console.log(whitelistAddresses)
    
    const accHashed = keccak256(acc)
    const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true});
    const hexProof = merkleTree.getHexProof(accHashed);

    console.log("hexProof: ")
    console.log(hexProof);
    console.log("keccak256(acc): ")
    console.log(keccak256(acc))
    const isValid = await nft.isValid(hexProof, accHashed);
    console.log("isValid: " + isValid)

    setIsWhitelisted(isValid)
    setProof(hexProof)
  }

  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    await getIsWhitelisted(accounts[0], nft)
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
      setTicketsLeft(ticketsLeft - 1)
      setBalance(balance + 1)
  }

  const loadContracts = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
    const ticketsLeftTemp = 5000 - await nft.currentToken()
    console.log("tickets left: " + ticketsLeftTemp)
    setTicketsLeft(ticketsLeftTemp)
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
        <Navigation />
        <Routes>
          <Route path="/" element={
            <Home web3Handler={web3Handler} loading={loading} account={account} nft={nft} 
              ticketsLeft={ticketsLeft} isWhitelisted={isWhitelisted} balance={balance}
              proof={proof}>
              </Home>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
