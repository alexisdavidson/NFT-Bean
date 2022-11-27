import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Image, Row, Col, Button } from 'react-bootstrap'

const Menu = ({closeMenu, toggleMenu, buttonLinkOnClick}) => {

    return (
        <Row className="actionFrame">
            <Row className="m-0 p-0">
                <div className="mobileMenuButton" onClick={() => toggleMenu(1)}>MINT A BEAN</div>
                <div className="mobileMenuButton" onClick={() => {closeMenu == null ? buttonLinkOnClick('farmLink') : closeMenu()}}>FARM</div>
                <div className="mobileMenuButton" onClick={() => toggleMenu(2)}>HOW TO</div>
                <div className="mobileMenuButton" onClick={() => buttonLinkOnClick('twitterLink')}>TWITTER</div>
                <div className="mobileMenuButton" onClick={() => buttonLinkOnClick('discordLink')}>DISCORD</div>
                <div className="mobileMenuButton" onClick={() => toggleMenu(3)}>ABOUT US</div>
            </Row>
        </Row>
    );
}
export default Menu