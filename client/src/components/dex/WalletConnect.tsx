import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/lib/web3";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function WalletConnect() {
  const { connect, disconnect, address } = useWeb3();
  const [connecting, setConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      setConnecting(true);
      await connect();
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive"
      });
    } finally {
      setConnecting(false);
    }
  };

  if (address) {
    return (
      <Button 
        variant="outline"
        onClick={disconnect}
      >
        {address.slice(0, 6)}...{address.slice(-4)}
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleConnect}
      disabled={connecting}
    >
      {connecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
