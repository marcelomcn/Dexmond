
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import { Request, Response } from "express";

// Configuration - in production these should be in environment variables
const API_KEY = "your-0x-api-key"; // You'll need to get a real API key
const BASE_URL = "https://api.0x.org";

export async function registerRoutes(app: Express): Promise<Server> {
  // Token price route
  app.get('/api/price', async (req: Request, res: Response) => {
    try {
      const { sellToken, buyToken, sellAmount } = req.query;
      
      if (!sellToken || !buyToken || !sellAmount) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      const response = await axios.get(`${BASE_URL}/swap/v1/price`, {
        params: {
          sellToken,
          buyToken,
          sellAmount,
        },
        headers: {
          '0x-api-key': API_KEY
        }
      });

      return res.json(response.data);
    } catch (error) {
      console.error('Price API error:', error);
      return res.status(500).json({ error: 'Failed to fetch price data' });
    }
  });

  // Quote route - get an executable quote
  app.get('/api/quote', async (req: Request, res: Response) => {
    try {
      const { sellToken, buyToken, sellAmount, takerAddress } = req.query;
      
      if (!sellToken || !buyToken || !sellAmount) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      const response = await axios.get(`${BASE_URL}/swap/v1/quote`, {
        params: {
          sellToken,
          buyToken,
          sellAmount,
          takerAddress
        },
        headers: {
          '0x-api-key': API_KEY
        }
      });

      return res.json(response.data);
    } catch (error) {
      console.error('Quote API error:', error);
      return res.status(500).json({ error: 'Failed to fetch quote data' });
    }
  });

  // Orderbook data route
  app.get('/api/orderbook', async (req: Request, res: Response) => {
    try {
      const { baseToken, quoteToken } = req.query;
      
      if (!baseToken || !quoteToken) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      // Use the 0x API to get real orderbook data
      const response = await axios.get(`${BASE_URL}/orderbook/v1`, {
        params: {
          baseToken,
          quoteToken,
        },
        headers: {
          '0x-api-key': API_KEY
        }
      });

      // Process and format the orderbook data
      const bids = response.data.bids.records.map((bid: any) => ({
        type: 'buy',
        price: parseFloat(bid.order.makerAmount) / parseFloat(bid.order.takerAmount),
        amount: parseFloat(bid.order.takerAmount),
        total: parseFloat(bid.order.makerAmount),
        source: bid.order.source || 'Unknown'
      }));

      const asks = response.data.asks.records.map((ask: any) => ({
        type: 'sell',
        price: parseFloat(ask.order.takerAmount) / parseFloat(ask.order.makerAmount),
        amount: parseFloat(ask.order.makerAmount),
        total: parseFloat(ask.order.takerAmount),
        source: ask.order.source || 'Unknown'
      }));

      return res.json({ bids, asks });
    } catch (error) {
      console.error('Orderbook API error:', error);
      return res.status(500).json({ error: 'Failed to fetch orderbook data' });
    }
  });

  // Token price history for chart
  app.get('/api/price-history', async (req: Request, res: Response) => {
    try {
      const { token, vs_currency = 'usd', days = 30 } = req.query;
      
      if (!token) {
        return res.status(400).json({ error: 'Missing token parameter' });
      }

      // Use CoinGecko API for historical price data
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${token}/market_chart`, {
        params: {
          vs_currency,
          days
        }
      });

      // Format data for candlestick chart
      const priceData = response.data.prices;
      const candleData = [];
      
      // Process daily candles from hourly data
      for (let i = 0; i < priceData.length; i += 24) {
        if (i + 24 < priceData.length) {
          const dayPrices = priceData.slice(i, i + 24);
          const time = dayPrices[0][0] / 1000; // Convert to seconds for chart library
          const open = dayPrices[0][1];
          const close = dayPrices[dayPrices.length - 1][1];
          const high = Math.max(...dayPrices.map(p => p[1]));
          const low = Math.min(...dayPrices.map(p => p[1]));
          
          candleData.push({
            time,
            open,
            high,
            low,
            close
          });
        }
      }

      return res.json(candleData);
    } catch (error) {
      console.error('Price history API error:', error);
      return res.status(500).json({ error: 'Failed to fetch price history data' });
    }
  });

  // Token list route
  app.get('/api/tokens', async (req: Request, res: Response) => {
    try {
      const { chainId = 1 } = req.query;
      
      // Get token list from 0x API
      const response = await axios.get(`${BASE_URL}/swap/v1/tokens`, {
        headers: {
          '0x-api-key': API_KEY
        }
      });

      // Filter by chain ID if needed
      const tokens = response.data.records.filter((token: any) => 
        !chainId || token.chainId === parseInt(chainId as string)
      );

      return res.json(tokens);
    } catch (error) {
      console.error('Tokens API error:', error);
      return res.status(500).json({ error: 'Failed to fetch token list' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
