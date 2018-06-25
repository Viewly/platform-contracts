pragma solidity ^0.4.24;

import "./dappsys/math.sol";
import "./dappsys/token.sol";
import "./dappsys/auth.sol";

// Pay to publish videos on Viewly.
contract VideoPublisher is DSAuth, DSMath {

    DSToken public viewToken;
    uint public priceView;
    uint public priceEth;
    // videoID => publisher
    mapping (bytes12 => address) public videos;
    event Published(bytes12 videoID);

    function VideoPublisher(
        DSToken viewToken_,
        uint priceView_,
        uint priceEth_) public {
        viewToken = viewToken_;
        priceView = priceView_;
        priceEth = priceEth_;
    }

    function publish(bytes12 videoID) payable public {
        require(videos[videoID] == 0);
        if (msg.value == 0) {
            require(viewToken.transferFrom(msg.sender, this, priceView));
        } else {
            require(msg.value >= priceEth);
        }
        videos[videoID] = msg.sender;
        emit Published(videoID);
    }

    function publishFor(bytes12 videoID, address beneficiary) payable public {
        require(videos[videoID] == 0);
        if (msg.value == 0) {
            require(viewToken.transferFrom(msg.sender, this, priceView));
        } else {
            require(msg.value >= priceEth);
        }
        videos[videoID] = beneficiary;
        emit Published(videoID);
    }

    function setPrices(uint priceView_, uint priceEth_) public auth {
        priceView = priceView_;
        priceEth = priceEth_;
    }

    function withdraw(address addr) public payable auth {
        uint tokenBalance = viewToken.balanceOf(this);
        if (tokenBalance > 0) {
            viewToken.transfer(addr, tokenBalance);
        }
        if (address(this).balance > 0) {
            addr.transfer(address(this).balance);
        }
    }

    function destruct(address addr) public payable auth {
        require(address(this).balance == 0);
        require(viewToken.balanceOf(this) == 0);
        selfdestruct(addr);
    }

    function () public payable {
        revert();
    }

}
