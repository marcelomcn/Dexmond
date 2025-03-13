
/**
 * Monetization utilities for Dexmond using 0x Swap API
 */

// Constants for monetization
const DEFAULT_AFFILIATE_ADDRESS = "0x0000000000000000000000000000000000000000"; // Replace with your wallet
const DEFAULT_AFFILIATE_FEE_BPS = "50"; // 0.5% fee (50 basis points)
const MAX_AFFILIATE_FEE_BPS = "100"; // Max 1% fee to be reasonable

/**
 * Configuration for monetization
 */
export interface MonetizationConfig {
  enabled: boolean;
  affiliateAddress: string;
  affiliateFeeBps: string;
}

// Default configuration
const defaultConfig: MonetizationConfig = {
  enabled: false,
  affiliateAddress: DEFAULT_AFFILIATE_ADDRESS,
  affiliateFeeBps: DEFAULT_AFFILIATE_FEE_BPS
};

// Current configuration (starts with default)
let currentConfig: MonetizationConfig = { ...defaultConfig };

/**
 * Initialize monetization with custom settings
 */
export function initializeMonetization(config?: Partial<MonetizationConfig>): MonetizationConfig {
  if (config) {
    currentConfig = {
      ...currentConfig,
      ...config
    };
  }
  return currentConfig;
}

/**
 * Enable or disable monetization
 */
export function setMonetizationEnabled(enabled: boolean): void {
  currentConfig.enabled = enabled;
}

/**
 * Set the affiliate fee recipient address
 */
export function setAffiliateAddress(address: string): void {
  if (address && typeof address === 'string' && address.startsWith('0x')) {
    currentConfig.affiliateAddress = address;
  }
}

/**
 * Set the affiliate fee in basis points (1% = 100 bps)
 */
export function setAffiliateFeeBps(bps: string): void {
  const bpsNum = parseInt(bps, 10);
  if (!isNaN(bpsNum) && bpsNum >= 0 && bpsNum <= parseInt(MAX_AFFILIATE_FEE_BPS, 10)) {
    currentConfig.affiliateFeeBps = bps;
  }
}

/**
 * Get the current monetization configuration
 */
export function getMonetizationConfig(): MonetizationConfig {
  return { ...currentConfig };
}

/**
 * Add monetization parameters to API requests
 */
export function addMonetizationParams(params: Record<string, any>): Record<string, any> {
  if (!currentConfig.enabled) {
    return params;
  }

  return {
    ...params,
    collectAffiliateFee: true,
    affiliateFeeRecipient: currentConfig.affiliateAddress,
    affiliateFeeBps: currentConfig.affiliateFeeBps
  };
}

// Add to window object for global access
if (typeof window !== 'undefined') {
  (window as any).dexmondMonetization = {
    initializeMonetization,
    setMonetizationEnabled,
    setAffiliateAddress,
    setAffiliateFeeBps,
    getMonetizationConfig
  };
}

// TypeScript declaration for global access
declare global {
  interface Window {
    dexmondMonetization: {
      initializeMonetization: typeof initializeMonetization;
      setMonetizationEnabled: typeof setMonetizationEnabled;
      setAffiliateAddress: typeof setAffiliateAddress;
      setAffiliateFeeBps: typeof setAffiliateFeeBps;
      getMonetizationConfig: typeof getMonetizationConfig;
    };
  }
}

export default {
  initializeMonetization,
  setMonetizationEnabled,
  setAffiliateAddress,
  setAffiliateFeeBps,
  getMonetizationConfig,
  addMonetizationParams
};
