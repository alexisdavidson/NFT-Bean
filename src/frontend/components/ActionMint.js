import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'

const fromWei = (num) => ethers.utils.formatEther(num)
const toWei = (num) => ethers.utils.parseEther(num.toString())

const HowTo = ({closeMenu, setMenuFarm, web3Handler, nft, account, balance, plantPhase, buttonLinkOnClick, price, supplyLeft, changeQuantity, mintButton, setQuantity, quantity}) => {

    return (
        <Row className="actionFrame actionMintFrame">
            {balance < 1  && plantPhase == 0 ? (
                <>
                    <Row className="mx-auto mintFrame">
                        <div className="">MINT A BEAN & START A MAGICAL JOURNEY</div>
                    </Row>
                    <Row className="mx-auto mt-0 mb-4 mintFrame">
                        <div className="">{price} ETH PER BEAN. 1 BEAN PER WALLET</div>
                    </Row>
                    <Row className="mx-auto mt-0 mb-4 ticketsFrame">
                        {account ? (
                            <div className="">{supplyLeft}/5000 BEANS REMAINING</div>
                        ) : (
                            <></>
                        )}
                    </Row>
                    <Row className="mx-auto mt-0 mb-4 ticketsFrame">
                        {account && false ? (
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
                        <div className="">BEAN MINTED. PLANT YOUR BEAN & START YOUR MAGICAL JOURNEY TODAY!</div>
                    </Row>
                    <Row className="mx-auto mt-0 mb-4 mintFrame">
                        <div className="actionButton" onClick={async () => {closeMenu(); if (account == null) await web3Handler(); setMenuFarm(true);}} >GO TO FARM</div>
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