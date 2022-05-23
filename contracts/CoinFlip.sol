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
        if (coinOption == 0) {
            // eligió heads
            if (lastTail < firstTail) {
                enqueue(msg.sender, 0);
                balance += msg.value;
            } else {
                address player = dequeue(1);
                uint256 result = flipCoin();
                if (result == 0) {
                    // gana heads
                    headsWins += 1;
                    gamesCount += 1;
                    emit Result(msg.sender, player, result);
                    payable(msg.sender).transfer(400000000000000000);
                } else {
                    // gana tails
                    tailsWins += 1;
                    gamesCount += 1;
                    emit Result(player, msg.sender, result);
                    payable(player).transfer(400000000000000000);
                }
            }
        } else if (coinOption == 1) {
            // eligió tails
            if (lastHead < firstHead) {
                enqueue(msg.sender, 1);
                balance += msg.value;
            } else {
                address player = dequeue(0);
                uint256 result = flipCoin();
                if (result == 0) {
                    // gana heads
                    headsWins += 1;
                    gamesCount += 1;
                    emit Result(player, msg.sender, result);
                    payable(player).transfer(400000000000000000);
                } else {
                    // gana tails
                    tailsWins += 1;
                    gamesCount += 1;
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
    }

    function dequeue(uint256 queue) private returns (address player) {
        if (queue == 0) {
            require(lastHead >= firstHead, "Head queue is empty");
            player = headsQueue[firstHead];
            delete headsQueue[firstHead];
            firstHead += 1;
        } else if (queue == 1) {
            require(lastTail >= firstTail, "Tail queue is Empty");
            player = tailsQueue[firstTail];
            delete tailsQueue[firstTail];
            firstTail += 1;
        }
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

    function setBetPrice() public view onlyOwner returns (bool success) {}
}
