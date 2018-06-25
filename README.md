![](https://i.imgur.com/ekvJd60.png)

# Platform Contracts
A collection of Ethereum smart contracts to be used on the Viewly platform.

## VideoPublisher
VideoPublisher acts as a gatekeeper to making videos public on Viewly.
Users need to pay a small fee in VIEW Tokens to have their videos published.
The fee can be changed at any time by changing `VideoPublisher.price`, however the fee change does
not impact already published videos.

**Published videos receive the following perks:**
 - Backup, storage and retreival of original video files on the IPFS network
 - Future re-transcoding for higher visual fidelity when new encoders become available (VP9, AV1)
 - Unlimited streaming from Viewly's CDN
 - Public Listing on Viewly (Alpha)

## NameRegistrar
NameRegistrar is the contract for registering *(brand)* names on Viewly. The brand names proxy *(point to)* an arbitrary channel on Viewly, as set by the *transient owner*.

eg:
```
view.ly/<name>
view.ly/apple 
view.ly/pewdiepie
```

#### Transient Ownership
In an effort to prevent *[name-squatting](https://en.wikipedia.org/wiki/Cybersquatting)*, the names on Viewly cannot be permanently owned. Rather, names have transient owners, where a **user who stakes the most tokens behind a name, has control over said name**. If another user stakes more tokens than the current transient owner,  he/she will become a new transient owner after the *challenge period*.

Users can withdraw their stake from a name at any-time, and can withdraw all of the staked tokens after a *withdraw period* is over.

The *withdraw period* has to be longer than the *challenge period*, such that the users cannot hijack the names by repeated stake/unstake behavior. Further, the *challenge period* only resets when the staking action has potential transient ownership consequences.

**Exhibit A**

1.) A name-squatter or an impostor stakes 10 VIEW behind `view.ly/pewdiepie`. 
2.) The real *pewdiepie* joins Viewly. His brand name is worth more to him, so he stakes 1,000 VIEW behind `view.ly/pewdiepie`. During the challenge period, the impostor can engage in a bidding war. However the brand is more valuable to the legitimate brand owner, and as such, he is more likely to stake more.

3.) After the challenge period, the highest stakeholder (assuming *pewdiepie*) wins the control of the name, and sets `view.ly/pewdiepie` to point to `view.ly/c/<real-pewdiepie-channel-id>`.

**Exhibit B**

Sometimes names have long term interests from multiple users, or groups of users. Sometimes the interests of said users/groups shift with passing of time. An example of such name would be `bitcoin` or `view.ly/bitcoin`. In the traditional domain name registration system, an early stakeholder (initial buyer of the domain) could acquire the name for cheap, and remain in control despite the value and interest in such name increasing in orders of magnitude. 

The flexibility of the *Transient Ownership* system allows for the ownership (control) over a name to change over time, based on free market forces. No capital is destroyed in the process, since tokens are merely locked up (not spent or destroyed), and can be withdrawn at any time in full.

**Edge Case Limitations**

a.) A sufficiently wealthy user stakes a large amount of tokens behind a name X. Assuming a condition where user dies, and/or if his keys are permanently lost, the name might remain locked forever, if the amount of tokens staked surpasses name's practical utility value. Adding an *expiry* or *TTL* to active stakes would remedy this inefficiency, at the expense of some inconvenience to all users.

b.) A malicious and sufficiently wealthy user could acquire control of valuable brand names, and demand a ransom or a "fee" for unstaking, and releasing control to the brand owner, assuming that the ransom is sufficient to offset the negative effects of such behavior on the value of the locked stake. If this edge case materializes as a systemic problem, this contract could be improved by adding *identity oracles* and offsetting the amplitude of locked stake on the transient ownership.



## VotingStakeDelegator

VotingStakeDelegator allows VIEW Token holders to _delegate_ their stake - in partial or in full - to another Ethereum account. This is useful for two purposes:

a.) **Security**. Allowing users to delegate their voting power to a convenient hot wallet, such as Metamask running in the browser.

b.) **Liquid Democracy**. Stakeholders whom chose to abstain from participation in governance or distribution game voting may delegate their voting power to others, and enable a form of _liquid democracy_. Ideally, individuals posessing good intent, skill and effort would be the beneficiaries of the delegation. 

The delegation is % based, with 3 points of precision _(delegation of 1 is 0.001% and the delegation of 100,000 is 100%)_. A stakeholder can split their delegated stake up to 255 beneficiaries.


# Governance
All contracts in this repository have an option of setting an authority, such that the authority would have the ability of changing *some* contract parameters. 

Once an appropriate governance model is found, the ownership of the contracts owners should be revoked, and the governance contract should become the new authority.

This would enable the community and/or stakeholders to propose parameter changes and apply/reject those changes based on some - currently undefined - governance process.

## Mainnet contracts
- [ViewToken](https://etherscan.io/address/0xf03f8d65bafa598611c3495124093c56e8f638f0)
- [VideoPublisher](https://etherscan.io/address/0x9048A059c4beF8775ecF6E24197Fd987B387edc1) _(deprecated)_
- [VideoPublisher 2.0](https://etherscan.io/address/0x54df6e2D8f0E9a015Bf804b64ed8e9BAd6ccbaca)
