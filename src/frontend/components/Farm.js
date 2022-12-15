import { useState, useEffect, useRef } from 'react'
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
const lastPlantId = 5

const Farm = ({ beanToUse, currentTimestamp, plant, timeleft, plantObject, web3Handler, planting, account, nft, balance, closeMenu, castleEnabled, enterCastleFunction }) => {
    const plantingRef = useRef();
    plantingRef.current = planting;

    const zeroPad = (num, places) => String(num).padStart(places, '0')

    const getTopText = () => {
        if (currentTimestamp == 0)
            return ""
        
        let topText = ""
        // console.log("GETTOPTEXT")
        // console.log("timeLeft: " + timeleft)
        let cooldownDone = timeleft <= 0
        
        if(plantObject[0] == 0) {
            topText=("CLICK THE POT TO PLANT THE BEAN")
            if(cooldownDone && balance == 0 && plant == 0)
                topText=("YOU DON'T HAVE A BEAN.")
        }
        else if(plantObject[0] == 1) {
            topText=("BEAN PLANTED. NEXT STAGE IN ") + getTimeLeftString(timeleft)
            if (cooldownDone) {
                topText=("IT'S SPROUTING. CLICK THE POT TO CONTINUE GROWING")
            }
        }
        else if(plantObject[0] == 2) {
            topText=("NEXT STAGE IN ") + getTimeLeftString(timeleft)
            if (cooldownDone) {
                topText=("NICE SAPLING. CLICK THE POT TO CONTINUE GROWING")
            }
        }
        else if(plantObject[0] == 3) {
            topText=("NEXT STAGE IN ") + getTimeLeftString(timeleft)
            if (cooldownDone) {
                topText=("LOOKING GOOD. CLICK THE BEANSTALK TO CONTINUE GROWING")
            }
        }
        else if(plantObject[0] == 4) {
            topText=("NEXT STAGE IN ") + getTimeLeftString(timeleft)
            if (cooldownDone) {
                topText=("SUCH A MAJESTIC BEANSTALK! CLICK THE BEANSTALK TO CLIMB!")
            }
        }

        return topText
    }

    // click anywhere on screen for last plant
    const checkClickLastPlant = () => {
        if (plant == lastPlantId) {
            console.log("castleEnabled: " + castleEnabled)
            if (castleEnabled)
                enterCastleFunction()
        }
    }
  

    const units = {
        year: 31536000000,
        month: 2628000000,
        day: 86400000,
        hour: 3600000,
        minute: 60000,
        second: 1000,
    }

    const getTimeLeftString = (timestampRelative) => {
        timestampRelative *= 1000;
        // 06:00:00
        const hoursLeft = Math.floor(timestampRelative / units.hour)
        timestampRelative -= hoursLeft * units.hour

        const minsLeft = Math.floor(timestampRelative / units.minute)
        timestampRelative -= minsLeft * units.minute

        const secsLeft = Math.floor(timestampRelative / units.second)

        return zeroPad(hoursLeft, 2) + ":" + zeroPad(minsLeft, 2) + ":" + zeroPad(secsLeft, 2) + "";
    }

    const buttonLinkOnClick = async (elementId) => {
        console.log("buttonLinkOnClick: " + elementId)
        var ex = document.getElementById(elementId);

        if (elementId == "farmLink" && account == null)
            await web3Handler();

        ex.click();
    }

    const plantButton = async () => {
        console.log("plantButton")

        let beanToUseTemp = beanToUse

        if(balance == 0 && plant == 0) {
            console.log("YOU DON'T HAVE A BEAN.")
            return
        }
        if (beanToUse == 0) {
            let totalSupplyTemp = parseInt(await nft.totalSupply())
            let burnAmountTemp = parseInt(await nft.burnAmount())

            console.log("totalSupplyTemp")
            console.log(totalSupplyTemp)
            console.log("burnAmountTemp")
            console.log(burnAmountTemp)

            beanToUseTemp = totalSupplyTemp + burnAmountTemp
        }

        console.log("triggerPlant " + beanToUseTemp);
        console.log("planting", planting)
        await planting.plant(beanToUseTemp)
    }
    

    useEffect(async () => {
        return () => {
            planting?.removeAllListeners("PlantingSuccessful");
        };
    }, [])

    return (
        <div className="m-0 p-0 Farm">
            {/* <div className="m-0 p-0 FarmLastPlant"  onClick={() => checkClickLastPlant()}> */}
            <div className={ "m-0 p-0 " + (plant == lastPlantId ? "FarmLastPlant" : "")} onClick={() => checkClickLastPlant()}>
                {/* NAVBAR */}
                <div className="navbarMobileDiv d-xl-none"> 
                    <Row className="menuMobileCol">
                        <Col className="col-6 homeMobileCol">
                            <Image src={homeIcon} className = "homeMobileImage"  onClick={() => {closeMenu(); buttonLinkOnClick('backLink')}} />
                        </Col>
                        <Col className="col-6 menuMobileCol">
                            {/* <Image src={menuIcon} className = "menuMobileImage"  onClick={() => toggleMenu(10)} /> */}
                        </Col>
                    </Row>
                </div>

                <div className="m-0 p-0 container-fluid d-none d-xl-block">
                    {/* BUTTONS */}
                    <Row className="m-0 p-0" style={{marginTop: "5vh"}}>
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
                                {getTopText()}
                            </div>
                        </Col>
                        <Col className="pe-5 ps-0 mx-0 my-4 col-3" style={{marginLeft: "", backgroundColor: "rgb(1,1,1,0.0)"}}>
                        </Col>
                    </Row>
                </div>

                <div className="m-0 p-0 d-xl-none">
                    <Row className="m-0" style={{backgroundColor: "rgb(1,1,0,0.0)"}}>
                        <div className="longMobileButton">
                            {getTopText()}
                        </div>
                    </Row>
                </div>

                <div className="plantDiv">
                    {plant != lastPlantId ? (
                        <Image src={`/plant_${plant}.png`} className={"plant plant_" + plant} onClick={plantButton} />
                    ) : (
                        <></>
                    )}
                </div>
                
            </div>
        </div>
    );
}
export default Farm