
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
// Monetization utilities for 0x Swap API integration
// Based on: https://docs.0x.org/0x-api-swap/guides/how-to-monetize-your-app-using-0x-swap-api

/**
 * Monetization options configuration
 */
export interface MonetizationConfig {
  // Affiliate fee collection (trading fee)
  collectAffiliateFee: boolean;
  affiliateFeeRecipient: string;
  affiliateFeeBps: string; // Basis points (0-1000, where 100 = 1%)
  
  // Trade surplus collection (positive slippage)
  collectPositiveSlippage: boolean;
  positiveSlippageRecipient: string;
}

/**
 * Default configuration with no monetization
 */
export const defaultMonetizationConfig: MonetizationConfig = {
  collectAffiliateFee: false,
  affiliateFeeRecipient: '',
  affiliateFeeBps: '0',
  collectPositiveSlippage: false,
  positiveSlippageRecipient: ''
};

/**
 * Get quote parameters with monetization options applied
 * @param baseParams Base API parameters
 * @param config Monetization configuration
 * @returns API parameters with monetization options
 */
export function getMonetizedQuoteParams(
  baseParams: Record<string, any>,
  config: MonetizationConfig
): Record<string, any> {
  const params = { ...baseParams };
  
  // Add affiliate fee parameters if enabled
  if (config.collectAffiliateFee && config.affiliateFeeRecipient) {
    params.affiliateAddress = config.affiliateFeeRecipient;
    
    if (config.affiliateFeeBps && config.affiliateFeeBps !== "0") {
      params.affiliateFeeBps = config.affiliateFeeBps;
    }
  }

  // Add positive slippage collection if enabled
  if (config.collectPositiveSlippage && config.positiveSlippageRecipient) {
    params.positiveSlippageRecipient = config.positiveSlippageRecipient;
  }
  
  return params;
}

/**
 * Calculate estimated revenue from a trade based on configuration
 * @param quoteData Quote data from 0x API
 * @param config Monetization configuration
 * @returns Estimated revenue in USD
 */
export function calculateEstimatedRevenue(
  quoteData: any,
  config: MonetizationConfig
): number {
  let estimatedRevenue = 0;
  
  // Calculate affiliate fee revenue
  if (config.collectAffiliateFee && 
      quoteData?.affiliateFee && 
      quoteData?.affiliateFeeUsd) {
    estimatedRevenue += parseFloat(quoteData.affiliateFeeUsd);
  }
  
  // Calculate positive slippage revenue (if available in quote)
  if (config.collectPositiveSlippage && 
      quoteData?.positiveSlippage && 
      quoteData?.positiveSlippageUsd) {
    estimatedRevenue += parseFloat(quoteData.positiveSlippageUsd);
  }
  
  return estimatedRevenue;
}
