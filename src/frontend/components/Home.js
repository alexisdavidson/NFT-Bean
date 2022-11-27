import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import logo from './assets/logo.png'
import logoMobile from './assets/mobile/logo.png'
import menuIcon from './assets/mobile/menu.png'
import homeIcon from './assets/mobile/home.png'
import HowTo from './ActionHowTo'
import Mint from './ActionMint'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const Home = ({ web3Handler, loading, account, nft, supplyLeft, balance }) => {
    const [menu, setMenu] = useState(0)

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
        <div className="m-0 p-0 Home">
            {/* LOGO */}
            <div className="logoDiv d-none d-xl-block"> <Image src={logo} className = "logo" /> </div>
            <div className="logoDiv d-xl-none"> <Image src={logoMobile} className = "logo" /> </div>


            {/* MENU */}
            <div className="menuMobileDiv d-xl-none"> 
                <Row className="menuMobileCol">
                    <Col className="col-6 homeMobileCol">
                        <Image src={homeIcon} className = "homeMobileImage"  onClick={() => closeMenu()} />
                    </Col>
                    <Col className="col-6 menuMobileCol">
                        <Image src={menuIcon} className = "menuMobileImage"  onClick={() => toggleMenu(10)} />
                    </Col>
                </Row> 
            </div>

            {/* BUTTONS */}
            <div className="m-0 p-0 container-fluid d-none d-xl-block">
                <Row className="m-0 p-0">
                    <Col className="ps-5 pe-0 mx-0 my-4 col-3" style={{marginLeft: "", backgroundColor: "rgb(1,1,1,0.0)"}}>
                        <Row className="mx-0 p-0" style={{marginTop: "30vh"}}>
                            <div className="actionButton" onClick={() => toggleMenu(1)} >
                                MINT A BEAN
                            </div>
                        </Row>
                        <Row className="m-0 p-0">
                            <div className="actionButton" onClick={() => buttonLinkOnClick('farmLink')} >
                                FARM
                                <a href="/farm" id="farmLink"></a>
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

                {/* FRAME */}
                {menu == 1 ? (
                    <HowTo />
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
export default Home