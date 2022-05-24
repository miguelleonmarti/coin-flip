// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CoinFlip {
    // owner
    address private owner;
    uint256 public balance = 0;

    // variables
    uint256 public betPrice = 200000000000000000;
    uint256 private randNonce = 0;

    // stats
    uint256 public gamesCount = 0;
    uint256 public headsWins = 0;
    uint256 public tailsWins = 0;

    // virtual queues
    mapping(address => bool) private playersInQueue;
    mapping(uint256 => address) private headsQueue;
    mapping(uint256 => address) private tailsQueue;
    uint256 public firstHead = 1;
    uint256 public lastHead = 0;
    uint256 public firstTail = 1;
    uint256 public lastTail = 0;

    event NeedToWait(address player);
    event Result(address winner, address loser, uint256 result);
    event BetPriceUpdate(uint256 betPrice);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this.");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function play(uint256 coinOption) public payable {
        require(msg.value == betPrice, "Invalid price");
        require(coinOption == 0 || coinOption == 1, "Invalid coin option");
        require(!isPlayerInQueue(msg.sender), "You are in queue already");
        if (coinOption == 0) {
            if (lastTail < firstTail) {
                enqueue(msg.sender, 0);
                balance += msg.value;
            } else {
                address player = dequeue(1);
                uint256 result = flipCoin();
                gamesCount += 1;
                if (result == 0) {
                    headsWins += 1;
                    emit Result(msg.sender, player, result);
                    payable(msg.sender).transfer(400000000000000000);
                } else {
                    tailsWins += 1;
                    emit Result(player, msg.sender, result);
                    payable(player).transfer(400000000000000000);
                }
            }
        } else {
            if (lastHead < firstHead) {
                enqueue(msg.sender, 1);
                balance += msg.value;
            } else {
                address player = dequeue(0);
                uint256 result = flipCoin();
                gamesCount += 1;
                if (result == 0) {
                    headsWins += 1;
                    emit Result(player, msg.sender, result);
                    payable(player).transfer(400000000000000000);
                } else {
                    tailsWins += 1;
                    emit Result(msg.sender, player, result);
                    payable(msg.sender).transfer(400000000000000000);
                }
            }
        }
    }

    function enqueue(address player, uint256 queue) private {
        if (queue == 0) {
            lastHead += 1;
            headsQueue[lastHead] = player;
        } else if (queue == 1) {
            lastTail += 1;
            headsQueue[lastTail] = player;
        }
        playersInQueue[player] = true;
    }

    function dequeue(uint256 queue) private returns (address player) {
        if (queue == 0) {
            require(lastHead >= firstHead, "Head queue is empty");
            player = headsQueue[firstHead];
            firstHead += 1;
        } else if (queue == 1) {
            require(lastTail >= firstTail, "Tail queue is Empty");
            player = tailsQueue[firstTail];
            firstTail += 1;
        }
        playersInQueue[player] = false;
    }

    function flipCoin() private returns (uint256 result) {
        randNonce++;
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.timestamp, msg.sender, randNonce)
                )
            ) % 2;
    }

    function isPlayerInQueue(address player) public view returns (bool) {
        return playersInQueue[player];
    }
}
