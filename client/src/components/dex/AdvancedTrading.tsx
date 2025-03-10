import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useAccount, useChainId } from 'wagmi';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type OrderType = 'limit' | 'stop-loss' | 'take-profit' | 'oco';

interface AdvancedOrder {
  type: OrderType;
  price: string;
  amount: string;
  stopPrice?: string;
  limitPrice?: string;
}

export function AdvancedTrading() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { toast } = useToast();

  const [orderType, setOrderType] = useState<OrderType>('limit');
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [stopPrice, setStopPrice] = useState("");
  const [limitPrice, setLimitPrice] = useState("");
  const [direction, setDirection] = useState<'buy' | 'sell'>('buy');

  const handleSubmitOrder = async () => {
    if (!isConnected) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to place orders",
        variant: "destructive"
      });
      return;
    }

    try {
      const order: AdvancedOrder = {
        type: orderType,
        price,
        amount,
        ...(orderType === 'stop-loss' && { stopPrice }),
        ...(orderType === 'oco' && { stopPrice, limitPrice })
      };

      // TODO: Implement order submission logic
      toast({
        title: "Order Placed",
        description: `Successfully placed ${orderType} order`
      });
    } catch (error) {
      toast({
        title: "Order Failed",
        description: error instanceof Error ? error.message : "Failed to place order",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Advanced Trading</h2>
          <RadioGroup
            value={direction}
            onValueChange={(value) => setDirection(value as 'buy' | 'sell')}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="buy" id="buy" />
              <Label htmlFor="buy" className="text-green-500">Buy</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sell" id="sell" />
              <Label htmlFor="sell" className="text-red-500">Sell</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Order Type</Label>
            <Select value={orderType} onValueChange={(value) => setOrderType(value as OrderType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="limit">Limit Order</SelectItem>
                <SelectItem value="stop-loss">Stop Loss</SelectItem>
                <SelectItem value="take-profit">Take Profit</SelectItem>
                <SelectItem value="oco">OCO (One-Cancels-Other)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Price</Label>
            <Input
              type="number"
              placeholder="0.0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          {(orderType === 'stop-loss' || orderType === 'oco') && (
            <div className="space-y-2">
              <Label>Stop Price</Label>
              <Input
                type="number"
                placeholder="0.0"
                value={stopPrice}
                onChange={(e) => setStopPrice(e.target.value)}
              />
            </div>
          )}

          {orderType === 'oco' && (
            <div className="space-y-2">
              <Label>Limit Price</Label>
              <Input
                type="number"
                placeholder="0.0"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
              />
            </div>
          )}
        </div>

        <Button
          onClick={handleSubmitOrder}
          disabled={!isConnected}
          className="w-full"
          variant={direction === 'buy' ? 'default' : 'destructive'}
        >
          {direction === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
        </Button>
      </div>
    </Card>
  );
}
