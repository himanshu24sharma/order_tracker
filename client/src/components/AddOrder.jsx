import { useState } from "react";

function AddOrder({ onAdd }) {
  const [form, setForm] = useState({
    customerName: "",
    product: "",
    price: "",
  });
  const [smartInput, setSmartInput] = useState("");

  const parseInput = (text) => {
    const words = text.trim().split(/\s+/);
    if (words.length === 0 || words[0] === "")
      return { customerName: "", product: "", price: "" };

    let price = "";
    let productWords = words;

    // Find the last numeric word as price
    for (let i = words.length - 1; i >= 0; i--) {
      if (/^\d+(\.\d+)?$/.test(words[i])) {
        price = words[i];
        productWords = words.slice(0, i);
        break;
      }
    }

    let customerName = "";
    let product = "";

    if (productWords.length > 0) {
      customerName = productWords[0];
      product = productWords.slice(1).join(" ");
    }

    return {
      customerName,
      product,
      price,
    };
  };

  const handleSmartInputBlur = () => {
    const parsed = parseInput(smartInput);
    setForm(parsed);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.customerName || !form.product || !form.price) return;
    onAdd({
      customerName: form.customerName,
      product: form.product,
      price: parseFloat(form.price),
    });
    setForm({ customerName: "", product: "", price: "" });
    setSmartInput("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Order</h2>
      <div className="form-group">
        <input
          type="text"
          placeholder="Type order details... (e.g., ravi hoodie M 1200)"
          value={smartInput}
          onChange={(e) => setSmartInput(e.target.value)}
          onBlur={handleSmartInputBlur}
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="customerName"
          placeholder="Customer Name"
          value={form.customerName}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="product"
          placeholder="Product"
          value={form.product}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          step="0.01"
        />
      </div>
      <button type="submit">Add Order</button>
    </form>
  );
}

export default AddOrder;
