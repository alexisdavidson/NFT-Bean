import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"
import './App.css';
import Home from './Home';
import Farm from './Farm';

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

import NFTAbi from '../contractsData/NFT.json'
import NFTAddress from '../contractsData/NFT-address.json'
import PlantingAbi from '../contractsData/Planting.json'
import PlantingAddress from '../contractsData/Planting-address.json'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const totalSupply = 5000

function App() {
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(0)
  const [supplyLeft, setSupplyLeft] = useState(totalSupply)
  const [price, setPrice] = useState(0.008)
  const [nft, setNFT] = useState({})
  const [planting, setPlanting] = useState({})
  const [menu, setMenu] = useState(0)
  const [quantity, setQuantity] = useState(1)
  
  const changeQuantity = (direction) => {
      if (quantity + direction < 1)
          setQuantity(1)
      else if (quantity + direction > 2)
          setQuantity(2)
      else
          setQuantity(quantity + direction)
  }

  const mintButton = async () => {
      console.log("mint button")
      let price = fromWei(await nft.getPrice()) * quantity;
      console.log("Price: " + price + " wei");
      console.log("Quantity: " + quantity)
      await nft.mint(quantity, { value: toWei(price) });
  }

  const closeMenu = () => {
      toggleMenu(0)
  }

  const toggleMenu = (menuId) => {
      console.log("toggleMenu " + menuId)
      if (menu == menuId)
          setMenu(0)
      else
          setMenu(menuId)
  }

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
    const planting = new ethers.Contract(PlantingAddress.address, PlantingAbi.abi, signer)
    const supplyLeftTemp = totalSupply - await nft.totalSupply()
    console.log("tickets left: " + supplyLeftTemp)
    setSupplyLeft(supplyLeftTemp)
    setPrice(fromWei(await nft.getPrice()))
    listenToEvents(nft)
    setNFT(nft)
    setPlanting(planting)
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
            <Home web3Handler={web3Handler} loading={loading} account={account} nft={nft} planting={planting}
              supplyLeft={supplyLeft} balance={balance} closeMenu={closeMenu} toggleMenu={toggleMenu} menu={menu} price={price}
              changeQuantity={changeQuantity} mintButton={mintButton} setQuantity={setQuantity} quantity={quantity} >
            </Home>
          } />
          <Route path="/farm" element={
            <Farm web3Handler={web3Handler} loading={loading} account={account} nft={nft} planting={planting}
              supplyLeft={supplyLeft} balance={balance} closeMenu={closeMenu} toggleMenu={toggleMenu} menu={menu} price={price}
              changeQuantity={changeQuantity} mintButton={mintButton} setQuantity={setQuantity} quantity={quantity} >
            </Farm>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
