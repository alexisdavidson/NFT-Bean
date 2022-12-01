import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"
import './App.css';
import Home from './Home';
import Farm from './Farm';

import { useState, useEffect, useRef } from 'react'
import { ethers } from 'ethers'

import NFTAbi from '../contractsData/NFT.json'
import NFTAddress from '../contractsData/NFT-address.json'
import PlantingAbi from '../contractsData/Planting.json'
import PlantingAddress from '../contractsData/Planting-address.json'
import configContract from "./configContract.json";

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const totalSupply = 5000

function App() {
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(0)
  const [supplyLeft, setSupplyLeft] = useState(totalSupply)
  const [price, setPrice] = useState(0.008)
  const [nft, setNFT] = useState({})
  const [planting, setPlanting] = useState({})
  const [menu, setMenu] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [menuFarm, setMenuFarm] = useState(false)
  const [beanToUse, setBeanToUse] = useState(0)
  const [amountMinted, setAmountMinted] = useState(0)
  const [currentTimestamp, setCurrentTimestamp] = useState(0)
  const [plantObject, setPlantObject] = useState({})
  const [plant, setPlant] = useState(0)
  const [timeleft, setTimeleft] = useState(0)
  const [provider, setProvider] = useState({})
  const [intervalVariable, setIntervalVariable] = useState(null)
  let timeleftLastTick = 0

  const providerRef = useRef();
  providerRef.current = provider;
  const quantityRef = useRef();
  quantityRef.current = quantity;
  const balanceRef = useRef();
  balanceRef.current = balance;
  const supplyLeftRef = useRef();
  supplyLeftRef.current = supplyLeft;
  const amountMintedRef = useRef();
  amountMintedRef.current = amountMinted;
  const plantingRef = useRef();
  plantingRef.current = planting;
  const accountRef = useRef();
  accountRef.current = account;
  const currentTimestampRef = useRef();
  currentTimestampRef.current = currentTimestamp;
  const intervalRef = useRef();
  intervalRef.current = intervalVariable;
  
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
    loadOpenSeaItems(accounts[0], nft)
    await loadPlant(plantingRef.current)
    plantingRef.current.on("PlantingSuccessful", (user) => {
        console.log("PlantingSuccessful");
        console.log(user);

        loadPlant(plantingRef.current)
    });
  }

  const loadOpenSeaItems = async (acc, nft) => {
    let items = await fetch(`${configContract.OPENSEA_API_TESTNETS}/assets?owner=${acc}&asset_contract_address=${nft.address}&format=json`)
    .then((res) => res.json())
    .then((res) => {
      return res.assets
    })
    .catch((e) => {
      console.error(e)
      console.error('Could not talk to OpenSea')
      return null
    })

    console.log(items)

    if (items != null && items.length > 0) {
      console.log("bean to use: " + items[0].token_id)
      setBeanToUse(items[0].token_id)
    }
    else 
      console.log("OpenSea could not find a bean for address " + acc)
  }

  const getTimeLeft = (currentTimestamp, timestampStart, duration) => {
    const timestampEnd = timestampStart + duration
    let timestampRelative = timestampEnd - currentTimestamp

    // console.log("timestampStart")
    // console.log(timestampStart)
    // console.log("duration")
    // console.log(duration)
    // console.log("currentTimestamp")
    // console.log(currentTimestamp)

    return timestampRelative
}

  const loadPlant = async (planting) => {
    console.log("load plant for " + accountRef.current)
    console.log("planting.address: " + planting.address)
    const plantObjectTemp = await planting.getPlant(accountRef.current)
    console.log("plantObjectTemp: " + plantObjectTemp)
    setPlantObject(plantObjectTemp)
    const phaseDurationTemp = parseInt(await planting.phaseDuration(plantObjectTemp.phase))
    setPlantImage(plantObjectTemp, phaseDurationTemp)
    console.log("phase: " + plantObjectTemp.phase + ", duration: " + phaseDurationTemp + ", start: " + parseInt(plantObjectTemp[1]))
    
    await updateCurrentTimestampFromBlockchain()

    clearInterval(intervalRef.current)
    console.log("Set interval")
    setIntervalVariable(setInterval(() => {
      setCurrentTimestamp(currentTimestampRef.current + 1)
      // console.log("currentTimestamp: " + currentTimestampRef.current)

      let timeleftTemp = getTimeLeft(currentTimestampRef.current, parseInt(plantObjectTemp[1]), phaseDurationTemp)
      setTimeleft(timeleftTemp)
      let cooldownDone = timeleftTemp <= 0
      let justFinishedCooldown = cooldownDone && timeleftLastTick > 0
      console.log("timeleftTemp: " + timeleftTemp)
      console.log("timeleftLastTick: " + timeleftLastTick)

      if (justFinishedCooldown) {
          loadPlant(planting)
      }
      timeleftLastTick = timeleftTemp
      
    }, 1000))
}

const setPlantImage = (plantObjectTemp) => {
    let cooldownDone = timeleft <= 0

    if(plantObjectTemp.phase == 0) {
        setPlant(0)
    }
    else if(plantObjectTemp.phase == 1) {
        setPlant(1)
        if (cooldownDone) {
            setPlant(2)
        }
    }
    else if(plantObjectTemp.phase == 2) {
        setPlant(2)
        if (cooldownDone) {
            setPlant(3)
        }
    }
    else if(plantObjectTemp.phase == 3) {
        setPlant(3)
        if (cooldownDone) {
            setPlant(4)
        }
    }
    else if(plantObjectTemp.phase == 4) {
        setPlant(4)
        if (cooldownDone) {
            setPlant(5)
        }
    }
}

  const mintFinished = async (nft) => {
      console.log("mintFinished: " + quantityRef.current)
      setSupplyLeft(supplyLeftRef.current - quantityRef.current)
      setBalance(balanceRef.current + quantityRef.current)
      // setBeanToUse(amountMintedRef.current)
  }

  const updateCurrentTimestampFromBlockchain = async () => {
    console.log("getCurrentTimestamp")
    const currentBlock = await providerRef.current.getBlockNumber();
    const blockchainTimestamp = (await providerRef.current.getBlock(currentBlock)).timestamp;

    console.log(blockchainTimestamp)
    setCurrentTimestamp(blockchainTimestamp)
  }

  const loadContracts = async () => {
    const providerTemp = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(providerTemp)
    const signer = providerTemp.getSigner()

    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
    const planting = new ethers.Contract(PlantingAddress.address, PlantingAbi.abi, signer)
    const amountMintedTemp = parseInt(await nft.totalSupply()) + parseInt(await nft.burnAmount())
    setAmountMinted(amountMintedTemp)
    const supplyLeftTemp = totalSupply - amountMintedTemp
    console.log("tickets left: " + supplyLeftTemp)
    setSupplyLeft(supplyLeftTemp)
    setPrice(fromWei(await nft.getPrice()))
    setNFT(nft)
    setPlanting(planting)
    nft.on("MintSuccessful", (user) => {
        console.log("MintSuccessful");
        console.log(user);

        mintFinished(nft);
    });

    console.log("nft address: " + nft.address)
    console.log("planting address: " + planting.address)
  }
  

  useEffect(async () => {
    loadContracts()

    return () => {
      clearInterval(intervalRef.current);
      nft?.removeAllListeners("MintSuccessful");
    };
  }, [])

  return (
    <BrowserRouter>
      <div className="App" id="wrapper">
        {!menuFarm ? (
            <Home web3Handler={web3Handler} account={account} nft={nft} planting={planting} setMenuFarm={setMenuFarm}
              supplyLeft={supplyLeft} balance={balance} closeMenu={closeMenu} toggleMenu={toggleMenu} menu={menu} price={price}
              changeQuantity={changeQuantity} mintButton={mintButton} setQuantity={setQuantity} quantity={quantity} >
            </Home>
        ) : (
          <Farm plant={plant} plantObject={plantObject} loadPlant={loadPlant} timeleft={timeleft}
            currentTimestamp={currentTimestamp} provider={provider} web3Handler={web3Handler} account={account} nft={nft} planting={planting} setMenuFarm={setMenuFarm}
            supplyLeft={supplyLeft} balance={balance} closeMenu={closeMenu} toggleMenu={toggleMenu} menu={menu} price={price}
            changeQuantity={changeQuantity} mintButton={mintButton} setQuantity={setQuantity} quantity={quantity} 
            beanToUse={beanToUse}>
          </Farm>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
