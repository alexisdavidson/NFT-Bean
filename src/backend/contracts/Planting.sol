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
        ADULT
    }

    struct Plant {
        Phase phase;
        uint256 timestampPhaseStarted;
    }

    mapping(address => Plant) public plantPerUser;
    mapping(Phase => uint256) public phaseDuration;

    event PlantingSuccessful(address user);

    constructor() {
        phaseDuration[Phase.POT] = 0; // Can start planting right away
        phaseDuration[Phase.BEAN] = 4 * 3600; // 4 Hours
        phaseDuration[Phase.SPROUTING] = 18 * 3600; // 18 Hours
        phaseDuration[Phase.SAPLING] = 18 * 3600; // 48 Hours
        phaseDuration[Phase.ADULT] = 18 * 3600; // 96 Hours
    }

    function plant() public {
        require(currentPhaseFinished(msg.sender), "The current growing phase of your plant is not finished yet!");
        require(plantPerUser[msg.sender].phase < Phase.ADULT, "Your plant already reached maximum growth!");

        plantPerUser[msg.sender].phase = nextPhase(plantPerUser[msg.sender].phase);
    }

    function nextPhase(Phase phase) private view returns(Phase) {
        if (phase == Phase.POT)
            return Phase.BEAN;
        if (phase == Phase.BEAN)
            return Phase.SPROUTING;
        if (phase == Phase.SPROUTING)
            return Phase.SAPLING;
        return Phase.ADULT;
    }

    function currentPhaseFinished(address _user) public view returns(bool) {
        Plant memory userPlant = plantPerUser[_user];
        uint256 _currentTimestamp = block.timestamp;
        return userPlant.timestampPhaseStarted + phaseDuration[userPlant.phase] < _currentTimestamp;
    }

    function getPlant(address _user) public view returns(Plant memory plant) {
        return plantPerUser[_user];
    }
    
    function withdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}
