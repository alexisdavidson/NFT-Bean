import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'

const HowTo = () => {

    return (
        <Row className="actionFrame">
            <Row className="mx-auto mt-4 mb-4">
                {/* <img className="ticketImage m-auto" src={ticket} /> */}
            </Row>
            {/* <Row className="mx-auto mt-0 mb-2">
                <div className="ticketText">{supplyLeft}/5000 Tickets Remaining</div>
            </Row>
            <Row className="mx-auto mt-0 mb-2">
                {account && balance < 2 ? (
                    <div className="ticketText">0,00 ETH</div>
                ) : (
                    <></>
                )}
            </Row>
            <Row className="mx-auto mt-0">
                {account && !loading ? (
                    balance == 0 ? (
                        <Button className="mintbutton" onClick={mintButton}>Mint Ticket</Button>
                    ) : (
                        <h2 className="ticketTitle">You had minted 1 ticket</h2>
                    )
                ) : (
                    <Button className="mintbutton" onClick={mintButton}>Connect</Button>
                )}
            </Row>
            <Row className="mx-auto mt-0 mb-4">
                {account ? (
                    <Button className="addressButton">{account}</Button>
                ) : (
                    <></>
                )}
            </Row> */}
            {/* <Row className="mx-auto mt-0 mb-4">
                <div className="ticketText">1 Ticket per Wallet</div>
            </Row> */}
        </Row>
    );
}
export default HowTo