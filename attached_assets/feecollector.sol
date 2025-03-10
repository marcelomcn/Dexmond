// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/IDexmondFactory.sol";
import "./interfaces/IDexmondPair.sol";
import "./interfaces/IERC20.sol";
import "./libraries/TransferHelper.sol";

/**
 * @title DexmondFeeCollector
 * @dev Collects and distributes fees from the Dexmond protocol
 * This contract receives LP fees from the protocol and allows the owner to
 * claim them in the form of tokens or ETH
 */
contract DexmondFeeCollector {
    address public owner;
    address public factory;
    address public weth;
    
    // Events
    event FeesClaimed(address token, address recipient, uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "DexmondFeeCollector: caller is not the owner");
        _;
    }
    
    /**
     * @dev Constructor
     * @param _factory The address of the Dexmond factory
     * @param _weth The address of the WETH contract
     */
    constructor(address _factory, address _weth) {
        owner = msg.sender;
        factory = _factory;
        weth = _weth;
        
        // Set this contract as the fee recipient in the factory
        IDexmondFactory(_factory).setFeeTo(address(this));
    }
    
    /**
     * @dev Transfers ownership of the contract to a new account
     * @param newOwner The address of the new owner
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "DexmondFeeCollector: new owner is the zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
    
    /**
     * @dev Claims LP token fees and converts them to the specified token
     * @param pair The address of the LP pair to claim fees from
     * @param token The token to receive (usually one of the tokens in the pair)
     * @param recipient The address to receive the claimed fees
     */
    function claimFees(address pair, address token, address recipient) external onlyOwner {
        require(recipient != address(0), "DexmondFeeCollector: recipient is zero address");
        
        IDexmondPair lpToken = IDexmondPair(pair);
        uint256 lpBalance = lpToken.balanceOf(address(this));
        
        if (lpBalance > 0) {
            // Extract the underlying tokens
            lpToken.transfer(pair, lpBalance); // Transfer LP tokens back to the pair
            (uint256 amount0, uint256 amount1) = lpToken.burn(address(this)); // Burn LP tokens and get tokens
            
            address token0 = lpToken.token0();
            address token1 = lpToken.token1();
            
            // Transfer the requested token to the recipient
            if (token == token0) {
                IERC20(token0).transfer(recipient, amount0);
                emit FeesClaimed(token0, recipient, amount0);
                
                // Transfer the other token to the owner
                if (amount1 > 0) {
                    IERC20(token1).transfer(owner, amount1);
                }
            } else if (token == token1) {
                IERC20(token1).transfer(recipient, amount1);
                emit FeesClaimed(token1, recipient, amount1);
                
                // Transfer the other token to the owner
                if (amount0 > 0) {
                    IERC20(token0).transfer(owner, amount0);
                }
            } else {
                revert("DexmondFeeCollector: token not in pair");
            }
        }
    }
    
    /**
     * @dev Claims LP token fees for all pairs and converts them to the specified token when possible
     * @param token The token to receive (if it's in any pair)
     * @param recipient The address to receive the claimed fees
     */
    function claimAllFees(address token, address recipient) external onlyOwner {
        require(recipient != address(0), "DexmondFeeCollector: recipient is zero address");
        
        uint256 pairCount = IDexmondFactory(factory).allPairsLength();
        
        for (uint256 i = 0; i < pairCount; i++) {
            address pairAddress = IDexmondFactory(factory).allPairs(i);
            IDexmondPair lpToken = IDexmondPair(pairAddress);
            
            uint256 lpBalance = lpToken.balanceOf(address(this));
            if (lpBalance > 0) {
                // Extract the underlying tokens
                lpToken.transfer(pairAddress, lpBalance);
                (uint256 amount0, uint256 amount1) = lpToken.burn(address(this));
                
                address token0 = lpToken.token0();
                address token1 = lpToken.token1();
                
                // Transfer tokens based on the requested token
                if (token == token0 || token == address(0)) {
                    IERC20(token0).transfer(recipient, amount0);
                    emit FeesClaimed(token0, recipient, amount0);
                } else {
                    IERC20(token0).transfer(owner, amount0);
                }
                
                if (token == token1 || token == address(0)) {
                    IERC20(token1).transfer(recipient, amount1);
                    emit FeesClaimed(token1, recipient, amount1);
                } else {
                    IERC20(token1).transfer(owner, amount1);
                }
            }
        }
    }
    
    /**
     * @dev Rescue any ERC20 tokens sent to this contract by mistake
     * @param token The address of the token to rescue
     * @param to The address to send the tokens to
     * @param amount The amount of tokens to rescue
     */
    function rescueTokens(address token, address to, uint256 amount) external onlyOwner {
        IERC20(token).transfer(to, amount);
    }
    
    /**
     * @dev Rescue ETH sent to this contract by mistake
     * @param to The address to send the ETH to
     * @param amount The amount of ETH to rescue
     */
    function rescueETH(address payable to, uint256 amount) external onlyOwner {
        TransferHelper.safeTransferETH(to, amount);
    }
    
    // Allow the contract to receive ETH
    receive() external payable {}
}