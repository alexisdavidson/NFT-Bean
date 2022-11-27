import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import logo from './assets/logo.png'
import HowTo from './ActionHowTo'
import Mint from './ActionMint'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const Home = ({ web3Handler, loading, account, nft, supplyLeft, balance }) => {

    const mintButton = async () => {
        // Connect
        if (account == null) {
            await web3Handler();
            return;
        }

        console.log("triggerMint");
        await nft.mint(1)
    }

    return (
        <>
            <div className="logoDiv">
                <Image src={logo} className = "logo" />
            </div>
            <div className="m-0 p-0 container-fluid">
                <HowTo />
            </div>
        </>
    );
}
export default Home