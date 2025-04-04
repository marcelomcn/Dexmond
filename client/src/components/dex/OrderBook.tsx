import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";

interface Order {
  price: number;
  amount: number;
  total: number;
  type: 'buy' | 'sell';
}

export function OrderBook() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateOrders = async () => {
      try {
        setLoading(true);
        const newOrders = await window.dexmond.orderbook.generateOrderbookData();
        setOrders(newOrders);
        setError(null);
      } catch (error) {
        console.error("Failed to load orderbook:", error);
        setError("Failed to load orderbook data");
      } finally {
        setLoading(false);
      }
    };

    updateOrders();
    const interval = setInterval(updateOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="loading-animation" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-400">
        {error}
      </div>
    );
  }

  const buyOrders = orders.filter(o => o.type === 'buy').sort((a, b) => b.price - a.price);
  const sellOrders = orders.filter(o => o.type === 'sell').sort((a, b) => a.price - b.price);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Buy Orders</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Price</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {buyOrders.map((order, i) => (
              <TableRow key={i}>
                <TableCell className="text-green-500">
                  {order.price.toFixed(6)}
                </TableCell>
                <TableCell>{order.amount.toFixed(4)}</TableCell>
                <TableCell>{order.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Sell Orders</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Price</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sellOrders.map((order, i) => (
              <TableRow key={i}>
                <TableCell className="text-red-500">
                  {order.price.toFixed(6)}
                </TableCell>
                <TableCell>{order.amount.toFixed(4)}</TableCell>
                <TableCell>{order.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}