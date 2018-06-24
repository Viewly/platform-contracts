pragma solidity ^0.4.2;

import "./dappsys/math.sol";
import "./dappsys/token.sol";
import "./dappsys/auth.sol";

// Pay to publish videos on Viewly.
contract VideoPublisher is DSAuth, DSMath {

    DSToken public viewToken;
    uint public priceView;
    uint public priceEth;
    mapping (bytes12 => bool) public videos;
    event Published(
        bytes12 videoID,
        address publisher
    );

    function VideoPublisher(
        DSToken viewToken_,
        uint priceView_,
        uint priceEth_) public {
        viewToken = viewToken_;
        priceView = priceView_;
        priceEth = priceEth_;
    }

    function publish(bytes12 videoID) public {
        require(!videos[videoID]);
        if (msg.value == 0) {
            require(viewToken.transferFrom(msg.sender, this, priceView));
        } else {
            require(msg.value >= priceEth);
        }
        videos[videoID] = true;
        Published(videoID, msg.sender);
    }

    function setPrices(uint priceView_, uint priceEth_) public auth {
        priceView = priceView_;
        priceEth = priceEth_;
    }

    function withdraw(address addr) public auth {
        uint tokenBalance = viewToken.balanceOf(this);
        if (tokenBalance > 0) {
            viewToken.transfer(addr, tokenBalance);
        }
        if (this.balance > 0) {
            addr.transfer(this.balance);
        }
    }

    function destruct(address addr) public auth {
        require(this.balance == 0);
        require(viewToken.balanceOf(this) == 0);
        selfdestruct(addr);
    }

    function () public payable {
        revert();
    }

}
