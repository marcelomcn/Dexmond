import { useState, MouseEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from 'wagmi';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getTokensByChain, type Token } from "@/lib/tokens";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FlashLoanHistory {
  id: string;
  token: Token;
  amount: string;
  fee: string;
  timestamp: number;
  txHash: string;
  status: 'completed' | 'failed';
}

export function FlashLoan() {
  const { address } = useAccount();
  const { toast } = useToast();
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState("");

  // Mock flash loan history
  const [history] = useState<FlashLoanHistory[]>([
    {
      id: "1",
      token: getTokensByChain(1).find(t => t.symbol === "USDC")!,
      amount: "1000000",
      fee: "300",
      timestamp: Date.now() - 3600000,
      txHash: "0x1234...5678",
      status: 'completed'
    },
    {
      id: "2",
      token: getTokensByChain(1).find(t => t.symbol === "DAI")!,
      amount: "500000",
      fee: "150",
      timestamp: Date.now() - 7200000,
      txHash: "0x8765...4321",
      status: 'failed'
    }
  ]);

  const handleFlashLoan = async () => {
    if (!address) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to execute flash loan",
        variant: "destructive"
      });
      return;
    }

    if (!selectedToken || !amount) {
      toast({
        title: "Invalid Input",
        description: "Please select a token and enter an amount",
        variant: "destructive"
      });
      return;
    }

    try {
      // In production, implement actual flash loan logic here
      toast({
        title: "Flash Loan Initiated",
        description: `Executing flash loan for ${amount} ${selectedToken.symbol}`
      });
    } catch (error) {
      toast({
        title: "Flash Loan Failed",
        description: error instanceof Error ? error.message : "Failed to execute flash loan",
        variant: "destructive"
      });
    }
  };

  const calculateFee = (amount: string): string => {
    // Mock fee calculation - 0.09% fee
    return ((parseFloat(amount) * 0.0009) || 0).toString();
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Flash Loans</h2>
          <div className="text-sm text-muted-foreground">
            Fee: 0.09%
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Token</Label>
              <Select
                value={selectedToken?.address}
                onValueChange={(value) => {
                  const token = getTokensByChain(1).find(t => t.address === value);
                  setSelectedToken(token || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  {getTokensByChain(1).map((token) => (
                    <SelectItem key={token.address} value={token.address}>
                      {token.symbol}
                    </SelectItem>
                  ))}
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

            {amount && selectedToken && (
              <div className="p-4 bg-secondary rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Flash Loan Amount</span>
                    <span>{amount} {selectedToken.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Fee (0.09%)</span>
                    <span>{calculateFee(amount)} {selectedToken.symbol}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total to Repay</span>
                    <span>{
                      (parseFloat(amount) + parseFloat(calculateFee(amount))).toString()
                    } {selectedToken.symbol}</span>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleFlashLoan}
              className="w-full"
              disabled={!selectedToken || !amount}
            >
              Execute Flash Loan
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Flash Loan History</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Token</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell>{formatTime(loan.timestamp)}</TableCell>
                    <TableCell>{loan.token.symbol}</TableCell>
                    <TableCell>{loan.amount}</TableCell>
                    <TableCell>{loan.fee}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${
                        loan.status === 'completed' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Card>
  );
}
