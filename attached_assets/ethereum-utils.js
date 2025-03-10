// CSP-safe Ethereum utilities to replace ethers.utils
// This avoids potential CSP issues with ethers' internal use of eval

const EthereumUtils = {
  // Format a value as ETH (human-readable)
  formatEther: function(value) {
    // Convert to string and handle different input types
    let valueStr;
    if (typeof value === 'bigint') {
      valueStr = value.toString();
    } else if (typeof value === 'string' && value.startsWith('0x')) {
      // Handle hex strings
      valueStr = BigInt(value).toString();
    } else {
      valueStr = String(value);
    }
    
    // Normalize to 18 decimals
    const wei = BigInt(valueStr);
    const divisor = BigInt(10) ** BigInt(18);
    const integerPart = (wei / divisor).toString();
    
    // Calculate decimal part
    const remainder = wei % divisor;
    let decimalPart = remainder.toString().padStart(18, '0');
    
    // Remove trailing zeros
    decimalPart = decimalPart.replace(/0+$/, '');
    
    // Format final result
    if (decimalPart.length > 0) {
      return `${integerPart}.${decimalPart}`;
    } else {
      return integerPart;
    }
  },
  
  // Parse ETH to wei (blockchain representation)
  parseEther: function(value) {
    // Validate and normalize input
    if (typeof value !== 'string' && typeof value !== 'number') {
      throw new Error('Value must be a string or number');
    }
    
    const valueStr = String(value);
    
    // Parse ether amount
    let integerPart = '0';
    let decimalPart = '';
    
    if (valueStr.includes('.')) {
      const parts = valueStr.split('.');
      integerPart = parts[0];
      decimalPart = parts[1].slice(0, 18).padEnd(18, '0');
    } else {
      integerPart = valueStr;
      decimalPart = '0'.repeat(18);
    }
    
    // Handle negative values
    const isNegative = integerPart.startsWith('-');
    if (isNegative) {
      integerPart = integerPart.substring(1);
    }
    
    // Combine and convert to bigint
    const wei = BigInt(integerPart + decimalPart);
    return isNegative ? -wei : wei;
  },
  
  // Format a value with specified decimals
  formatUnits: function(value, decimals) {
    // Convert inputs to standard format
    let valueStr;
    if (typeof value === 'bigint') {
      valueStr = value.toString();
    } else if (typeof value === 'string' && value.startsWith('0x')) {
      valueStr = BigInt(value).toString();
    } else {
      valueStr = String(value);
    }
    
    const decimalCount = Number(decimals);
    
    // Normalize to specified decimals
    const wei = BigInt(valueStr);
    const divisor = BigInt(10) ** BigInt(decimalCount);
    const integerPart = (wei / divisor).toString();
    
    // Calculate decimal part
    const remainder = wei % divisor;
    let decimalPart = remainder.toString().padStart(decimalCount, '0');
    
    // Remove trailing zeros
    decimalPart = decimalPart.replace(/0+$/, '');
    
    // Format final result
    if (decimalPart.length > 0) {
      return `${integerPart}.${decimalPart}`;
    } else {
      return integerPart;
    }
  },
  
  // Parse value from human-readable format to raw
  parseUnits: function(value, decimals) {
    // Validate and normalize input
    if (typeof value !== 'string' && typeof value !== 'number') {
      throw new Error('Value must be a string or number');
    }
    
    const valueStr = String(value);
    const decimalCount = Number(decimals);
    
    // Parse value
    let integerPart = '0';
    let decimalPart = '';
    
    if (valueStr.includes('.')) {
      const parts = valueStr.split('.');
      integerPart = parts[0];
      decimalPart = parts[1].slice(0, decimalCount).padEnd(decimalCount, '0');
    } else {
      integerPart = valueStr;
      decimalPart = '0'.repeat(decimalCount);
    }
    
    // Handle negative values
    const isNegative = integerPart.startsWith('-');
    if (isNegative) {
      integerPart = integerPart.substring(1);
    }
    
    // Combine and convert to bigint
    const rawValue = BigInt(integerPart + decimalPart);
    return isNegative ? -rawValue : rawValue;
  },
  
  // Create a safe contract interface without using eval or new Function
  // This replaces ethers.Contract with a simpler implementation
  createContractInterface: function(address, abi, provider) {
    // Parse the ABI to extract function signatures
    const functions = {};
    
    // Process each ABI entry
    abi.forEach(item => {
      if (typeof item === 'string') {
        // Process human-readable ABI
        const match = item.match(/^(function|event)\s+([^\s(]+)\(([^)]*)\)(\s+\w+)?(\s+returns\s+\(([^)]*)\))?/);
        if (match) {
          const name = match[2];
          const inputs = match[3].split(',').filter(Boolean).map(param => ({ type: param.trim().split(' ')[0] }));
          
          functions[name] = {
            name,
            inputs,
            type: match[1], // 'function' or 'event'
            constant: match[4]?.includes('view') || match[4]?.includes('pure'),
            outputs: match[6] ? match[6].split(',').filter(Boolean).map(param => ({ type: param.trim().split(' ')[0] })) : []
          };
        }
      } else if (item.type === 'function') {
        // Standard ABI object
        functions[item.name] = item;
      }
    });
    
    // Create the contract interface
    const contract = {
      address,
      functions,
      
      // Connect with a signer
      connect: function(signer) {
        return EthereumUtils.createContractInterface(address, abi, signer);
      },
      
      // Call a contract function
      callFunction: async function(functionName, args = []) {
        if (!functions[functionName]) {
          throw new Error(`Function ${functionName} not found in contract ABI`);
        }
        
        const func = functions[functionName];
        
        // Encode function call data
        // This is a simplified version - in production, use a proper encoder
        const funcSignature = `${functionName}(${func.inputs.map(i => i.type).join(',')})`;
        const functionSignatureHash = this.keccak256(funcSignature).slice(0, 10);
        
        // Different behavior for view/pure functions vs. state-changing functions
        if (func.constant) {
          // View/pure function - use eth_call
          const callData = {
            to: address,
            data: functionSignatureHash // This is simplified - need proper ABI encoding
          };
          
          const result = await provider.send('eth_call', [callData, 'latest']);
          return result; // This needs proper decoding
        } else {
          // State-changing function - use eth_sendTransaction
          const txData = {
            to: address,
            data: functionSignatureHash, // This is simplified - need proper ABI encoding
            ...args[args.length - 1] // Last argument might be tx options
          };
          
          const txHash = await provider.send('eth_sendTransaction', [txData]);
          return txHash;
        }
      },
      
      // Simple keccak256 hash (this is just a placeholder - use a proper library)
      keccak256: function(text) {
        // Placeholder - in production use a proper keccak256 implementation
        return '0x' + Array.from(text).reduce((hash, char) => 
          ((hash << 5) - hash + char.charCodeAt(0))|0, 0).toString(16).padStart(64, '0');
      }
    };
    
    // Create function wrappers
    Object.keys(functions).forEach(funcName => {
      contract[funcName] = async function(...args) {
        return await contract.callFunction(funcName, args);
      };
    });
    
    return contract;
  },
  
  // Constants
  constants: {
    MaxUint256: BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'),
    AddressZero: '0x0000000000000000000000000000000000000000'
  },
  
  // Additional utility functions can be added here
};

// Export the utilities
window.safeEthers = {
  utils: EthereumUtils,
  constants: EthereumUtils.constants,
  Contract: EthereumUtils.createContractInterface
};