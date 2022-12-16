import { useState, useEffect, useRef } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'
import leftArrow from './assets/left_arrow.svg'
import homeIcon from './assets/mobile/home.png'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())
const lastPlantId = 5

const Farm = ({ castleLooted, beanToUse, currentTimestamp, plant, timeleft, plantObject, web3Handler, planting, account, nft, balance, closeMenu, castle, castleEnabled }) => {
    const [background, setBackground] = useState("Farm")
    const [castleStep, setCastleStep] = useState(0)

    const plantingRef = useRef();
    plantingRef.current = planting;

    const zeroPad = (num, places) => String(num).padStart(places, '0')

    const getTopText = () => {
        if (castleStep > 0 || castleLooted > 0)
            return getTopCastleText()
        
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

    const stuckInCastleSequence = () => {
        return castleStep > 0 && castleStep < 5
    }

    const getTopCastleText = () => {
        let topText = ""

        if (castleLooted == 1) {
            topText = "YOU ONLY MANAGED TO LOOT 1 TALE TOKEN IN THE CHAOS! THERE'S NO WAY TO GO UP ANYMORE!"
        }
        else if (castleLooted == 2) {
            topText = "THE BEANSTALK IS GONE BUT YOU GOT A GOOSE, SEE YOU SOON IN THE CHAPTER 2, GOOSEBUMPER!"
        }
        else if (castleStep == 1) {
            topText = "YOU HAVE REACHED THE GIANT ISLE. CLICK THE CASTLE TO ENTER"
        }
        else if (castleStep == 2) {
            topText = "SELECT YOUR REWARD! A TREASURE BOX OR A GOOSE? CAREFUL! CHOOSE WISELY!"
        }
        else if (castleStep == 3) {
            topText = "OH NO! YOU WOKE THE GIANT! RUN!!!"
        }
        else if (castleStep == 3.5) {
            topText = "OH NO! YOU WOKE THE GIANT! THE TREASURE BOX IS TOO HEAVY! YOU CAN'T CARRY IT ALONG! RUN!!!"
        }
        else if (castleStep == 4) {
            topText = "TINKER QUICKLY CUTS THE BEANSTALK TO AVOID THE GIANT FROM COMING DOWN TO THE GROUND"
        }
        else if (castleStep == 4.5) {
            topText = "TINKER QUICKLY CUTS THE BEANSTALK TO AVOID THE GIANT FROM COMING DOWN TO THE GROUND"
        }
        else if (castleStep == 5) {
            topText = "THE BEANSTALK IS GONE BUT YOU GOT A GOOSE, SEE YOU SOON IN THE CHAPTER 2, GOOSEBUMPER!"
        }
        else if (castleStep == 5.5) {
            topText = "YOU ONLY MANAGED TO LOOT 1 TALE TOKEN IN THE CHAOS! THERE'S NO WAY TO GO UP ANYMORE!"
        }

        return topText
    }

    const pickLoot = async(choice) => {
        console.log("pickLoot", choice)

        await castle.loot(choice)
        castle.on("LootingSuccessful", (user, choice) => {
            console.log("LootingSuccessful");
            console.log("user", user);
            console.log("choice", choice);
            console.log("account", account);
            if (user.toLowerCase() == account.toLowerCase()) {
                if (choice == 1) {
                    setBackground("Castle_35")
                    setCastleStep(3.5)
                } else {
                    setBackground("Castle_3")
                    setCastleStep(3)
                }
            }
        });

        // if (choice == 1) {
        //     setBackground("Castle_35")
        //     setCastleStep(3.5)
        // } else {
        //     setBackground("Castle_3")
        //     setCastleStep(3)
        // }
    }

    // click anywhere on screen
    const checkClickScreen = () => {
        if (castleLooted != 0)
            return
        if (castleStep == 0 && plant == lastPlantId) {
            console.log("castleEnabled: " + castleEnabled)
            if (castleEnabled) {
                setBackground("Castle_1")
                setCastleStep(1)
            }
        }
        else if (castleStep == 1) {
            setBackground("Castle_2")
            setCastleStep(2)
        }
        else if (castleStep == 2) {
            // Must click precisely on the treasure or the Groove
        }
        else if (castleStep == 3) {
            setBackground("Castle_4")
            setCastleStep(4)
        }
        else if (castleStep == 3.5) {
            setBackground("Castle_45")
            setCastleStep(4.5)
        }
        else if (castleStep == 4) {
            setBackground("Castle_5")
            setCastleStep(5)
        }
        else if (castleStep == 4.5) {
            setBackground("Castle_55")
            setCastleStep(5.5)
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

    const fullscreenClass = () => {
        if (castleStep == 0 && plant == lastPlantId && castleLooted == 0) 
            return "FarmLastPlant"
        
        if (castleStep != 2 && castleStep < 5 && castleLooted == 0 && plant == lastPlantId)
            return "fullScreen"

        return ""
    }

    const displayClickAnywhereToContinue = () => {
        return castleStep >= 3 && castleStep <= 4.5
    }
    const clickAnywhereToContinueButtonClass = () => {
        if (castleStep >= 3 && castleStep <= 4.5)
            return "clickAnywhereToContinueButtonClass"
        return ""
    }

    useEffect(async () => {
        if (castleLooted == 1)
            setBackground("Castle_55")
        else if (castleLooted == 2)
            setBackground("Castle_5")

        return () => {
            planting?.removeAllListeners("PlantingSuccessful");
            castle?.removeAllListeners("LootingSuccessful");
        };
    }, [])

    return (
        <div className={"m-0 p-0 " + background}>
            {/* <div className="m-0 p-0 FarmLastPlant"  onClick={() => checkClickLastPlant()}> */}
            <div className={ "m-0 p-0 " + (fullscreenClass())} onClick={() => checkClickScreen()}>
                {/* NAVBAR */}
                <div className="navbarMobileDiv d-xl-none"> 
                    <Row className="menuMobileCol">
                        <Col className="col-6 homeMobileCol">
                            {!stuckInCastleSequence() ? (
                                <Image src={homeIcon} className = "homeMobileImage"  onClick={() => {closeMenu(); buttonLinkOnClick('backLink')}} />
                            ) : ( <></> )}
                        </Col>
                        <Col className="col-6 menuMobileCol">
                            {/* <Image src={menuIcon} className = "menuMobileImage"  onClick={() => toggleMenu(10)} /> */}
                        </Col>
                    </Row>
                </div>

                {/* DESKTOP */}
                <div className="m-0 p-0 container-fluid d-none d-xl-block">
                    {/* CLICK INDICATION */}
                    <div className="clickAnywhereToContinueDiv">
                        {displayClickAnywhereToContinue() ? (
                            <>
                                <div className={"clickAnywhereToContinue"} >CLICK ANYWHERE TO CONTINUE...</div>
                            </>
                        ) : ( <></> )}
                    </div>
                    
                    {/* BUTTONS */}
                    <Row className={"m-0 p-0 " + clickAnywhereToContinueButtonClass()} style={{marginTop: "5vh"}}>
                        <Col className="ps-5 pe-0 mx-0 my-4 col-3" style={{marginLeft: "", backgroundColor: "rgb(1,1,1,0.0)"}}>
                            <Row className="mx-0 p-0">
                                {!stuckInCastleSequence() ? (
                                    <div className="shortButton" onClick={() => buttonLinkOnClick('backLink')} >
                                        <Image src={leftArrow} className ="leftArrowImage" />
                                        <a href="/" id="backLink"></a>
                                    </div>
                                ) : ( <></> )}
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

                {/* MOBILE */}
                <div className="m-0 p-0 d-xl-none">
                    {/* TAP INDICATION */}
                    <div className="clickAnywhereToContinueDiv">
                        {displayClickAnywhereToContinue() ? (
                            <>
                                <div className={"clickAnywhereToContinue"} >TAP ANYWHERE TO CONTINUE</div>
                            </>
                        ) : ( <></> )}
                    </div>
                    <Row className="m-0" style={{backgroundColor: "rgb(1,1,0,0.0)"}}>
                        <div className="longMobileButton">
                            {getTopText()}
                        </div>
                    </Row>
                </div>

                {/* LAST PLANT */}
                <div className="plantDiv">
                    {castleLooted == 0 && castleStep == 0 && plant != lastPlantId ? (
                        <Image src={`/plant_${plant}.png`} className={"plant plant_" + plant} onClick={plantButton} />
                    ) : ( <></> )}
                </div>

                {/* TREASURE AND GOOSE */}
                <div className="treasureAndGooseDiv">
                    {castleStep == 2 ? (
                        <>
                            <div className={"treasure"} onClick={() => pickLoot(1)}></div>
                            <div className={"goose"} onClick={() => pickLoot(2)}></div>
                        </>
                    ) : ( <></> )}
                </div>
                
            </div>
        </div>
    );
}
export default Farm