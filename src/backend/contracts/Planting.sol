// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Planting is Ownable {
    enum Phase {
        POT,
        BEAN,
        SPROUTING,
        SAPLING,
        ADULT,
        FULLGROWN
    }

    struct Plant {
        Phase phase;
        uint256 timestampPhaseStarted;
    }

    mapping(address => Plant) plantPerUser;
    mapping(Phase => uint256) phaseDuration;

    event PlantingSuccessful(address user);

    constructor() {
        phaseDuration[POT] = 0; // Can start planting right away
        phaseDuration[BEAN] = 4 * 3600; // 4 Hours
        phaseDuration[SPROUTING] = 18 * 3600; // 18 Hours
        phaseDuration[SAPLING] = 18 * 3600; // 48 Hours
        phaseDuration[ADULT] = 18 * 3600; // 96 Hours
    }

    function plant() public {
        require(currentPhaseFinished(msg.sender), "The current growing phase of your plant is not finished yet!");
        require(plantPerUser[_user].phase < Phase.ADULT, "Your plant already reached maximum growth!");

        plantPerUser[_user].phase += 1;
    }

    function currentPhaseFinished(address _user) public view returns(bool) {
        Plant userPlant = plantPerUser[_user];
        uint256 _currentTimestamp = block.timestamp;
        return userPlant.timestampPhaseStarted + phaseDuration[userPlant.phase] < _currentTimestamp;
    }

    function getCurrentPhase(address _user) public view returns(uint256) {
        return plantPerUser[_user].phase;
    }

    function getTimestampPhaseStarted(address _user) public view returns(uint256) {
        return plantPerUser[_user].timestampPhaseStarted;
    }
    
    function withdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}
