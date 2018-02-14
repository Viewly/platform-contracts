pragma solidity ^0.4.2;

import "./dappsys/math.sol";
import "./dappsys/token.sol";
import "./dappsys/auth.sol";

// This contract allows people to use VIEW tokens to publish videos on Viewly.
contract VideoPublisher is DSAuth, DSMath {

    DSToken public viewToken;
    uint public price;
    mapping (bytes12 => bool) public videos;
    event Published(
        bytes12 videoID,
        uint price
    );

    function VideoPublisher(DSToken viewToken_, uint price_) public {
        viewToken = viewToken_;
        price = price_;
    }

    function publish(bytes12 videoID) public {
        require(!videos[videoID]);
        require(viewToken.transferFrom(msg.sender, this, price));
        videos[videoID] = true;
        Published(videoID, price);
    }

    function setPrice(uint newPrice) public auth {
        price = newPrice;
    }

    function withdraw(address addr) public auth {
        viewToken.transfer(addr, viewToken.balanceOf(this));
    }

    function destruct(address addr) public auth {
        require(viewToken.balanceOf(this) == 0);
        selfdestruct(addr);
    }

    function () public payable {
        revert();
    }

}
