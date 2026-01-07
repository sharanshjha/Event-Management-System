import { useState, useEffect } from 'react';
import { vendorApi } from '../services/api';
import './Dashboard.css';

const VendorTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await vendorApi.getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading transactions...</div>;

  return (
    <div className="admin-section">
      <h2>Transactions</h2>
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr><td colSpan="7" className="no-data">No transactions found</td></tr>
            ) : (
              transactions.map(order => (
                <tr key={order._id}>
                  <td data-label="Order ID">{order._id.slice(-6)}</td>
                  <td data-label="Customer">{order.userId?.name || 'N/A'}</td>
                  <td data-label="Items">{order.items?.length || 0} items</td>
                  <td data-label="Total">₹{order.totalAmount}</td>
                  <td data-label="Payment">{order.paymentMethod?.toUpperCase()}</td>
                  <td data-label="Status">
                    <span className={`status-badge ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td data-label="Date">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorTransactions;
