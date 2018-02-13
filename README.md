![](https://i.imgur.com/ekvJd60.png)

## Platform Contracts
A collection of Ethereum smart contracts to be used in the Viewly platform.

### VideoPublisher
VideoPublisher acts as a gatekeeper to making videos public on Viewly.
Users need to pay a small fee (in VIEW Tokens) to have their videos published.
The fee can be changed at any time by the contract admin, however the fee change does
not impact already published videos.

**Published videos receive the following perks:**
 - Backup, storage and retreival of original video files on IPFS network
 - Future re-transcoding for higher visual fidelity when new encoders become available (VP9, AV1)
 - Unlimited streaming from Viewly's CDN
 - Public Listing on Viewly (Alpha)

