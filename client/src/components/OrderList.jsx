import OrderItem from "./OrderItem";

function OrderList({ groupedOrders, issues, onUpdateStatus, onAddIssue }) {
  const statuses = ["new", "packed", "shipped", "delivered"];

  return (
    <div className="orders-section">
      {statuses.map((status, index) => (
        <div key={status} className="status-group">
          <h2 className="status-heading">
            {status.charAt(0).toUpperCase() + status.slice(1)} Orders
          </h2>
          {groupedOrders[status].length === 0 ? (
            <p className="no-orders">No {status} orders.</p>
          ) : (
            groupedOrders[status].map((order) => (
              <OrderItem
                key={order.id}
                order={order}
                issues={issues.filter((issue) => issue.orderId === order.id)}
                onUpdateStatus={onUpdateStatus}
                onAddIssue={onAddIssue}
              />
            ))
          )}
          {index < statuses.length - 1 && <hr className="section-divider" />}
        </div>
      ))}
    </div>
  );
}

export default OrderList;
