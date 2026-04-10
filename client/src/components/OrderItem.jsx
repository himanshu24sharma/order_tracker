import { useState } from "react";

function OrderItem({ order, issues, onUpdateStatus, onAddIssue }) {
  const [showForm, setShowForm] = useState(false);
  const [issueType, setIssueType] = useState("return");
  const [note, setNote] = useState("");

  const handleStatusChange = (newStatus) => {
    onUpdateStatus(order.id, newStatus);
  };

  const handleAddIssue = () => {
    onAddIssue({ orderId: order.id, type: issueType, note });
    setShowForm(false);
    setNote("");
  };

  return (
    <div className="order-card">
      <div className="order-info">
        <h3>{order.customerName}</h3>
        <p>
          <strong>Product:</strong> {order.product}
        </p>
        <p>
          <strong>Price:</strong> ${order.price}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className={`status-${order.status}`}>{order.status}</span>
        </p>
      </div>
      <div className="order-actions">
        {order.status === "new" && (
          <button onClick={() => handleStatusChange("packed")}>
            Mark Packed
          </button>
        )}
        {order.status === "packed" && (
          <button onClick={() => handleStatusChange("shipped")}>
            Mark Shipped
          </button>
        )}
        {order.status === "shipped" && (
          <button onClick={() => handleStatusChange("delivered")}>
            Mark Delivered
          </button>
        )}
        <button
          onClick={() => setShowForm(!showForm)}
          className="add-issue-btn"
        >
          + Issue
        </button>
      </div>
      {showForm && (
        <div className="issue-form">
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
          >
            <option value="return">Return</option>
            <option value="exchange">Exchange</option>
            <option value="complaint">Complaint</option>
          </select>
          <input
            type="text"
            placeholder="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button onClick={handleAddIssue}>Save</button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}
      {issues.length > 0 && (
        <div className="issues">
          {issues.map((issue) => (
            <p key={issue.id} className="issue-item">
              ⚠ Issue: {issue.type} — {issue.note}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderItem;
