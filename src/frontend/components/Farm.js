import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import leftArrow from './assets/left_arrow.svg'
import menuIcon from './assets/mobile/menu.png'
import homeIcon from './assets/mobile/home.png'
import HowTo from './ActionHowTo'
import Menu from './ActionMenu'
import Mint from './ActionMint'
import AboutUs from './ActionAboutUs'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const Farm = ({ web3Handler, planting, account, nft, balance, closeMenu,toggleMenu, menu }) => {
    const [plant, setPlant] = useState(0)
    const [countdown, setCountdown] = useState(0)
    const [topText, setTopText] = useState("")

    const loadPlant = async () => {
        setPlant(3)
        setTopText("CLICK THE POT TO PLANT THE BEAN")
    }

    const buttonLinkOnClick = (elementId) => {
        console.log("buttonLinkOnClick: " + elementId)
        var ex = document.getElementById(elementId);
        ex.click();
    }

    const plantButton = async () => {
        console.log("plantButton")
        return

        // Connect
        if (account == null) {
            await web3Handler();
            return;
        }

        //verify bean balance
        //verify allowance

        console.log("triggerPlant");
        await planting.plant()
    }
    

    useEffect(() => {
        loadPlant()
    }, [])

    return (
        <div className="m-0 p-0 Farm">
            
            {/* NAVBAR */}
            <div className="navbarMobileDiv d-xl-none"> 
                <Row className="menuMobileCol">
                    <Col className="col-6 homeMobileCol">
                        <Image src={homeIcon} className = "homeMobileImage"  onClick={() => {closeMenu(); buttonLinkOnClick('backLink')}} />
                    </Col>
                    <Col className="col-6 menuMobileCol">
                        <Image src={menuIcon} className = "menuMobileImage"  onClick={() => toggleMenu(10)} />
                    </Col>
                </Row>
            </div>

            <div className="m-0 p-0 container-fluid">
                {/* BUTTONS */}
                <Row className="m-0 p-0 d-none d-xl-block" style={{marginTop: "5vh"}}>
                    <Col className="ps-5 pe-0 mx-0 my-4 col-3" style={{marginLeft: "", backgroundColor: "rgb(1,1,1,0.0)"}}>
                        <Row className="mx-0 p-0">
                            <div className="shortButton" onClick={() => buttonLinkOnClick('backLink')} >
                                <Image src={leftArrow} className ="leftArrowImage" />
                                <a href="/" id="backLink"></a>
                            </div>
                        </Row>
                    </Col>
                    <Col className="mx-0 p-0 my-4 col-6" style={{backgroundColor: "rgb(1,1,0,0.0)"}}>
                        <div className="longButton">
                            {topText}
                        </div>
                    </Col>
                    <Col className="pe-5 ps-0 mx-0 my-4 col-3" style={{marginLeft: "", backgroundColor: "rgb(1,1,1,0.0)"}}>
                    </Col>
                </Row>
                <Row className="m-0 p-0 d-xl-none" style={{marginTop: "5vh"}}>
                    <div className="longMobileButton">
                        {topText}
                    </div>
                </Row>

                <div className="plantDiv">
                    <Image src={`/plant_${plant}.png`} className={"plant plant_" + plant} onClick={plantButton} />
                </div>
            </div>
            

            {/* FRAME */}
            {
                {
                '0': <></>,
                '1': <Mint />,
                '2': <HowTo />,
                '3': <AboutUs />,
                '10': <Menu toggleMenu={toggleMenu} buttonLinkOnClick={buttonLinkOnClick}/>,
                }[menu]
            }
        </div>
    );
}
export default Farm