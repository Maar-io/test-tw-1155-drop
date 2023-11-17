// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC1155Drop.sol";

contract MyContract is ERC1155Drop {
    mapping(uint256 => bool) isEvolution;
    mapping(uint256 => uint256) baseEvolution;

    uint256 public constant ENERGY_TOKEN_ID = 0;

    modifier onlyAdmin() {
        require(msg.sender == owner(), "Account: not admin.");
        _;
    }

    uint256 evolutionPayment = 2;

    constructor(
        address _defaultAdmin,
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps,
        address _primarySaleRecipient
    )
        ERC1155Drop(
            _defaultAdmin,
            _name,
            _symbol,
            _royaltyRecipient,
            _royaltyBps,
            _primarySaleRecipient
        )
    {}

    function _transferTokensOnClaim(
        address _receiver,
        uint256 _tokenId,
        uint256 _quantity
    ) internal virtual override {
        // Claiming evolved token requires payment/burning in energy token
        if (isEvolution[_tokenId]) {
            _verifyEvolutionCondition(_receiver);
            // burn base egg
            _burn(_receiver, baseEvolution[_tokenId], 1);
            // burn energy token
            _burn(_receiver, ENERGY_TOKEN_ID, evolutionPayment);
        }

        _mint(_receiver, _tokenId, _quantity, "");
    }

    function setEvolution(
        uint256 _baseTokenId,
        uint256 _evolvedTokenId
    ) public onlyAdmin {
        isEvolution[_evolvedTokenId] = true;
        baseEvolution[_evolvedTokenId] = _baseTokenId;
    }

    function setEvolutionPayment(uint256 _evolutionPayment) public onlyAdmin {
        evolutionPayment = _evolutionPayment;
    }

    function _verifyEvolutionCondition(address _receiver) internal view {
        require(
            balanceOf[_receiver][ENERGY_TOKEN_ID] >= evolutionPayment,
            "Gacha: not enough energy tokens."
        );
    }
}
