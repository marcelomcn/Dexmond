
import React, { useTransition } from "react";
import { CrossChainBridge } from "../components/dex/CrossChainBridge";
import { CrossChainSwap } from "../components/dex/CrossChainSwap";
import { WalletConnect } from "@/components/dex/WalletConnect";

export default function CrossChainPage() {
  const [isPending, startTransition] = useTransition();

  React.useEffect(() => {
    // Wrap any data fetching or expensive computations with startTransition
    startTransition(() => {
      // Any suspending operations happen here
    });
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-7xl dex-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Cross-Chain Bridge
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Show loading indicator when pending */}
        {isPending ? (
          <div className="col-span-2 flex justify-center py-10">
            <div className="loading-animation" />
          </div>
        ) : (
          <>
            <div>
              <WalletConnect />
              <CrossChainBridge />
            </div>
            <div>
              <CrossChainSwap />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
