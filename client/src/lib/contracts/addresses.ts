// Contract addresses will be populated after deployment
export const DEXMOND_ADDRESSES = {
  // Ethereum Mainnet
  1: {
    factory: "",
    router: "",
    feeCollector: "",
  },
  // Add other networks as needed
} as const;

export const WETH_ADDRESSES = {
  1: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // Ethereum Mainnet
  137: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", // Polygon (WMATIC)
} as const;
