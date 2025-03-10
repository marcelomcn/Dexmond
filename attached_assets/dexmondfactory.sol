// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DexmondPair.sol";
import "./interfaces/IDexmondFactory.sol";
import "./interfaces/IDexmondPair.sol";

contract DexmondFactory is IDexmondFactory {
    address public override feeTo;
    address public override feeToSetter;
    
    // Default fee is 0.3%
    uint256 public constant override FEE_NUMERATOR = 3;
    uint256 public constant override FEE_DENOMINATOR = 1000;

    mapping(address => mapping(address => address)) public override getPair;
    address[] public override allPairs;

    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    constructor(address _feeToSetter) {
        feeToSetter = _feeToSetter;
    }

    function allPairsLength() external view override returns (uint) {
        return allPairs.length;
    }

    function createPair(address tokenA, address tokenB) external override returns (address pair) {
        require(tokenA != tokenB, 'Dexmond: IDENTICAL_ADDRESSES');
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), 'Dexmond: ZERO_ADDRESS');
        require(getPair[token0][token1] == address(0), 'Dexmond: PAIR_EXISTS');
        
        bytes memory bytecode = type(DexmondPair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        
        IDexmondPair(pair).initialize(token0, token1);
        
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // populate mapping in the reverse direction
        allPairs.push(pair);
        
        emit PairCreated(token0, token1, pair, allPairs.length);
    }

    function setFeeTo(address _feeTo) external override {
        require(msg.sender == feeToSetter, 'Dexmond: FORBIDDEN');
        feeTo = _feeTo;
    }

    function setFeeToSetter(address _feeToSetter) external override {
        require(msg.sender == feeToSetter, 'Dexmond: FORBIDDEN');
        feeToSetter = _feeToSetter;
    }
}