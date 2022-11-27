import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import logo from './assets/logo.png'
import HowTo from './ActionHowTo'
import Mint from './ActionMint'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const Home = ({ web3Handler, loading, account, nft, supplyLeft, balance }) => {
    const [menu, setMenu] = useState(0)

    const closeFrame = () => {
        setMenu(0)
    }

    const toggleMenu = (menuId) => {
        if (menu == menuId)
            closeFrame()
        else
            setMenu(menuId)
    }

    const buttonLinkOnClick = (elementId) => {
        var ex = document.getElementById(elementId);
        ex.click();
    }

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
            {/* LOGO */}
            <div className="logoDiv"> <Image src={logo} className = "logo" /> </div>


            {/* FRAME */}
            <div className="m-0 p-0 container-fluid">
                {/* BUTTONS */}
                <Row className="m-0 p-0">
                    <Col className="ps-5 pe-0 mx-0 my-4 col-3" style={{marginLeft: "", backgroundColor: "rgb(1,1,1,0.0)"}}>
                        <Row className="mx-0 p-0" style={{marginTop: "30vh"}}>
                            <div className="actionButton" onClick={() => toggleMenu(1)} >
                                MINT A BEAN
                            </div>
                        </Row>
                        <Row className="m-0 p-0">
                            <div className="actionButton" onClick={() => toggleMenu(2)} >
                                FARM
                            </div>
                        </Row>
                        <Row className="m-0 p-0">
                            <div className="actionButton" onClick={() => toggleMenu(3)} >
                                HOW TO
                            </div>
                        </Row>
                    </Col>
                    <Col className="m-0 p-0 col-6" style={{backgroundColor: "rgb(1,1,0,0.0)"}}>
                    </Col>
                    <Col className="pe-5 ps-0 mx-0 my-4 col-3" style={{marginLeft: "", backgroundColor: "rgb(1,1,1,0.0)"}}>
                        <Row className="mx-0 p-0" style={{marginTop: "30vh"}}>
                            <div className="actionButton" onClick={() => buttonLinkOnClick('twitterLink')} >
                                TWITTER
                                <a href="https://twitter.com" target="_blank" id="twitterLink"></a>
                            </div>
                        </Row>
                        <Row className="m-0 p-0">
                            <div className="actionButton" onClick={() => buttonLinkOnClick('discordLink')} >
                                DISCORD
                                <a href="https://discord.com" target="_blank" id="discordLink"></a>
                            </div>
                        </Row>
                        <Row className="m-0 p-0">
                            <div className="actionButton" onClick={() => toggleMenu(4)} >
                                ABOUT US
                            </div>
                        </Row>
                    </Col>
                </Row>

                {menu == 1 ? (
                    <HowTo />
                ) : (
                    <></>
                )}
            </div>
        </>
    );
}
export default Home