import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const HowTo = ({web3Handler, nft, account, balance, loading, buttonLinkOnClick, price, supplyLeft, changeQuantity, mintButton, setQuantity, quantity}) => {

    return (
        <Row className="actionFrame">
            {balance < 2 ? (
                <>
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
                                <Col className="quantitySelector">
                                    <span className="buttonQuantity" onClick={() => changeQuantity(-1)}>-</span>
                                    <span className="quantity">{quantity}</span>
                                    <span className="buttonQuantity" onClick={() => changeQuantity(1)}>+</span>
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
                </>
            ) : (
                <>
                    <Row className="mx-auto mintFrame">
                        <div className="">YOU HAVE 2 BEANS. PLANT YOUR BEAN & START YOUR MAGICAL JOURNEY TODAY!</div>
                    </Row>
                    <Row className="mx-auto mt-0 mb-4 mintFrame">
                        <div className="actionButton" onClick={() => buttonLinkOnClick('farmLink')} >GO TO FARM</div>
                    </Row>
                </>
            )}
            <Row className="mx-auto mt-0 mb-4 ticketsFrame">
                {account ? (
                    <div className="addressText">{account.slice(0, 9) + '...' + account.slice(34, 42)}</div>
                ) : (
                    <></>
                )}
            </Row>
        </Row>
    );
}
export default HowTo