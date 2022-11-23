import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Button } from 'react-bootstrap'
import ticket from './assets/ticket0001.png'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const Home = ({ web3Handler, loading, account, nft, ticketsLeft, isWhitelisted, balance, proof }) => {

    const mintButton = async () => {
        // Connect
        if (account == null) {
            await web3Handler();
            return;
        }

        console.log("triggerMint");
        await nft.mint(proof)
    }

    return (
        <div className="m-0 p-0 container-fluid">
            <Row className="splashScreen my-3 p-3 container-fluid">
                <Row className="mx-auto mt-2 p-0">
                    <h2 className="ticketTitle">Else Exchange Ticket Free Mint</h2>
                </Row>
                <Row className="mx-auto mt-4 mb-4">
                    <img className="ticketImage m-auto" src={ticket} />
                </Row>
                <Row className="mx-auto mt-0 mb-2">
                    <div className="ticketText">{ticketsLeft}/5000 Tickets Remaining</div>
                </Row>
                <Row className="mx-auto mt-0 mb-2">
                    {account && isWhitelisted == true && balance == 0 ? (
                        <div>1</div>
                    ) : (
                        <></>
                    )}
                </Row>
                <Row className="mx-auto mt-0 mb-2">
                    {account && isWhitelisted == true && balance == 0 ? (
                        <div className="ticketText">0,00 ETH</div>
                    ) : (
                        <></>
                    )}
                </Row>
                <Row className="mx-auto mt-0">
                    {account && !loading ? (
                        isWhitelisted == true ? (
                                balance == 0 ? (
                                    <Button className="mintbutton" onClick={mintButton}>Mint Ticket</Button>
                                ) : (
                                    <h2 className="ticketTitle">You had minted 1 ticket</h2>
                                )
                        ) : (
                            <div className="ticketText">You are not whitelisted.</div>
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
                </Row>
                <Row className="mx-auto mt-0 mb-4">
                    <div className="ticketText">1 Ticket per Wallet</div>
                </Row>
            </Row>
        </div>
    );
}
export default Home