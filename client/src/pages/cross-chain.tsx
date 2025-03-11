
import React, { Suspense, ErrorBoundary, useState } from "react";
import { CrossChainBridge } from "../components/dex/CrossChainBridge";
import { CrossChainSwap } from "../components/dex/CrossChainSwap";
import { WalletConnect } from "@/components/dex/WalletConnect";

// Error boundary component
class ErrorFallback extends React.Component<{children: React.ReactNode}> {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: any, errorInfo: any) {
    console.error("Cross-chain component failed:", error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-300 rounded-md bg-red-50 text-red-800">
          <h3 className="text-lg font-medium">Something went wrong</h3>
          <button 
            className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Loading component
const Loading = () => (
  <div className="flex items-center justify-center w-full h-48">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export default function CrossChainPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  React.useEffect(() => {
    // Simulate data loading to prevent immediate suspense
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!isLoaded) {
    return <Loading />;
  }
  
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Cross-Chain Bridge
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ErrorFallback>
          <Suspense fallback={<Loading />}>
            <div>
              <WalletConnect />
              <div className="mt-4">
                <CrossChainBridge />
              </div>
            </div>
          </Suspense>
        </ErrorFallback>
        
        <ErrorFallback>
          <Suspense fallback={<Loading />}>
            <div>
              <CrossChainSwap />
            </div>
          </Suspense>
        </ErrorFallback>
      </div>
    </div>
  );
}
