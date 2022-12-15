import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'

const Menu = ({toggleMenu, buttonLinkOnClick, farmButton}) => {

    return (
        <Row className="actionFrame">
            <Row className="m-0 p-0">
                <Row className="m-0 p-0">
                    <div className="mobileMenuButton" onClick={() => buttonLinkOnClick('openseaLink')}>OPENSEA</div>
                </Row>
                <Row className="m-0 p-0">
                    <div className="mobileMenuButton" onClick={farmButton}>FARM</div>
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