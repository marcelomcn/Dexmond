
import React, { useState, useEffect, Suspense } from "react";
import { CrossChainBridge } from "../components/dex/CrossChainBridge";
import { CrossChainSwap } from "../components/dex/CrossChainSwap";
import { Layout } from "@/components/layout/Layout";

// Error boundary component
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Cross-chain page error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-red-500">Something went wrong</h2>
          <p className="mt-4">Please try refreshing the page or contact support.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="mt-4 text-muted-foreground">Loading cross-chain features...</p>
    </div>
  </div>
);

export default function CrossChainPage() {
  const [activeTab, setActiveTab] = useState("swap");

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex gap-4 mb-4 border-b border-border">
          <button
            className={`px-4 py-2 ${activeTab === "swap" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
            onClick={() => setActiveTab("swap")}
          >
            Cross-Chain Swap
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "bridge" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
            onClick={() => setActiveTab("bridge")}
          >
            Bridge Assets
          </button>
        </div>

        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            {activeTab === "swap" ? <CrossChainSwap /> : <CrossChainBridge />}
          </Suspense>
        </ErrorBoundary>
      </div>
    </Layout>
  );
}
