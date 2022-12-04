import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'

const Menu = ({web3Handler, account, closeMenu, toggleMenu, buttonLinkOnClick, setMenuFarm}) => {

    return (
        <Row className="actionFrame">
            <Row className="m-0 p-0">
                <Row className="m-0 p-0">
                    <div className="mobileMenuButton" onClick={() => toggleMenu(1)}>MINT A BEAN</div>
                </Row>
                <Row className="m-0 p-0">
                    <div className="mobileMenuButton" onClick={async () => { closeMenu(); if (account == null) await web3Handler(); setMenuFarm(true);}}>FARM</div>
                </Row>
                <Row className="m-0 p-0">
                    <div className="mobileMenuButton" onClick={() => toggleMenu(2)}>HOW TO</div>
                </Row>
                <Row className="m-0 p-0">
                    <div className="mobileMenuButton" onClick={() => buttonLinkOnClick('twitterLink')}>TWITTER</div>
                </Row>
                <Row className="m-0 p-0">
                    <div className="mobileMenuButton" onClick={() => buttonLinkOnClick('discordLink')}>DISCORD</div>
                </Row>
                <Row className="m-0 p-0">
                    <div className="mobileMenuButton" onClick={() => buttonLinkOnClick('aboutusLink')}>ABOUT US</div>
                </Row>
            </Row>
        </Row>
    );
}
export default Menu