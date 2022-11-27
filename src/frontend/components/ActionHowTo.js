import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'

const HowTo = () => {

    return (
        <Row className="actionFrame">
            <Row className="m-0 p-0">
                <h2 className="">HOW TO BEANSTALKER?</h2>
            </Row>
            <Row className="mx-auto mt-0 mb-4">
                <div className="">1. PLANT THE BEAN 
                                <br/>2. CHECK THE GROWTH PROGRESS 
                                <br/>3. CLIMB THE BEANSTALK 
                                <br/>4. ENTER THE GIANT'S CASTLE 
                                <br/>5. DONT WAKE THE GIANT 
                                <br/>6. LOOT THE TREASURE 
                                <br/>7. PROCEED TO THE NEXT CHAPTER</div>
            </Row>
            <Row className="mx-auto mt-0 mb-4">
                <div className="">BEANSTALKER IS A REWRITE BASED ON JACK & THE BEANSTALK</div>
            </Row>
        </Row>
    );
}
export default HowTo