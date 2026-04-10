import { useState, useEffect } from "react";
import AddOrder from "./components/AddOrder";
import OrderList from "./components/OrderList";
import api from "./services/api";

function App() {
  const [orders, setOrders] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIssues = async () => {
    try {
      const response = await api.get("/issues");
      setIssues(response.data);
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchIssues();
  }, []);

  const handleAddOrder = async (order) => {
    try {
      await api.post("/orders", order);
      fetchOrders();
    } catch (error) {
      console.error("Error adding order:", error);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/orders/${id}`, { status });
      fetchOrders();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleAddIssue = async (issue) => {
    try {
      await api.post("/issues", issue);
      fetchIssues();
    } catch (error) {
      console.error("Error adding issue:", error);
    }
  };

  const handleResolveIssue = async (id) => {
    try {
      await api.patch(`/issues/${id}`, { status: "resolved" });
      fetchIssues();
    } catch (error) {
      console.error("Error resolving issue:", error);
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const groupedOrders = {
    new: filteredOrders.filter((order) => order.status === "new"),
    packed: filteredOrders.filter((order) => order.status === "packed"),
    shipped: filteredOrders.filter((order) => order.status === "shipped"),
    delivered: filteredOrders.filter((order) => order.status === "delivered"),
  };

  const pendingIssues = issues
    .filter((issue) => issue.status === "open")
    .map((issue) => ({
      ...issue,
      customerName:
        orders.find((order) => order.id === issue.orderId)?.customerName ||
        "Unknown",
    }));

  return (
    <div className="container">
      <h1>Order Tracker</h1>
      <AddOrder onAdd={handleAddOrder} />
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search orders by customer name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {pendingIssues.length > 0 && (
        <div className="pending-issues">
          <h2>⚠ Pending Issues</h2>
          {pendingIssues.map((issue) => (
            <div key={issue.id} className="pending-issue-item">
              <span>
                {issue.customerName} — {issue.type} — "{issue.note}"
              </span>
              <button onClick={() => handleResolveIssue(issue.id)}>
                Mark Resolved
              </button>
            </div>
          ))}
        </div>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <OrderList
          groupedOrders={groupedOrders}
          issues={issues}
          onUpdateStatus={handleUpdateStatus}
          onAddIssue={handleAddIssue}
        />
      )}
    </div>
  );
}

export default App;
