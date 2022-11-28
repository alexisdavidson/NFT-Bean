import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const HowTo = ({web3Handler, nft, account, balance, loading, price, supplyLeft, changeQuantity, mintButton, setQuantity, quantity}) => {

    return (
        <Row className="actionFrame">
            <Row className="mx-auto mintFrame">
                <div className="">MINT A BEAN & START A MAGICAL JOURNEY</div>
            </Row>
            <Row className="mx-auto mt-0 mb-4 mintFrame">
                <div className="">{price} ETH PER BEAN. MAXIMUM 2</div>
            </Row>
            <Row className="mx-auto mt-0 mb-4 ticketsFrame">
                <div className="">{supplyLeft}/5000 BEANS REMAINING</div>
            </Row>
            <Row className="mx-auto mt-0 mb-4 ticketsFrame">
                {account ? (
                    <>
                        <Col className="col-5">
                        </Col>
                        <Col className="col-2">
                            <span className="buttonquantity" onClick={() => changeQuantity(-1)}>-</span>
                            <span className="quantity">{quantity}</span>
                            <span className="buttonquantity" onClick={() => changeQuantity(1)}>+</span>
                        </Col>
                        <Col className="col-5">
                        </Col>
                    </>
                ) : (
                    <></>
                )}
            </Row>
            <Row className="mx-auto mt-0 mb-4 mintFrame">
                {account ? (
                        <div className="actionButton" onClick={mintButton} >MINT NOW</div>
                    ) : (
                        <div className="actionButton" onClick={web3Handler} >CONNECT</div>
                    )}
            </Row>
            <Row className="mx-auto mt-0 mb-4 ticketsFrame">
                {account ? (
                    <div className="addressText">{account.slice(0, 9) + '...' + account.slice(34, 42)}</div>
                ) : (
                    <></>
                )}
            </Row>
            {/* <Row className="mx-auto mt-0 mb-2">
                {account && balance < 2 ? (
                    <div className="ticketText">0,00 ETH</div>
                ) : (
                    <></>
                )}
            </Row>
            <Row className="mx-auto mt-0">
                {account && !loading ? (
                    balance < 2 ? (
                        <Button className="mintbutton" onClick={mintButton}>Mint Ticket</Button>
                    ) : (
                        <h2 className="ticketTitle">You had minted 1 ticket</h2>
                    )
                ) : (
                    <Button className="mintbutton" onClick={mintButton}>Connect</Button>
                )}
            </Row> */}

        </Row>
    );
}
export default HowTo