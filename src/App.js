import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  // ✅ Use environment variable for API base URL
  const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Fetch all items
  useEffect(() => {
    axios
      .get(`${API}/api/items`)
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Error fetching items:", err));
  }, [API]);

  // Handle input
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Create or Update item
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await axios.put(`${API}/api/items/${editingId}`, form);
        setItems(items.map((i) => (i._id === editingId ? res.data : i)));
        setEditingId(null);
      } else {
        const res = await axios.post(`${API}/api/items`, form);
        setItems([...items, res.data]);
      }
      setForm({ name: "", description: "" });
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  // Delete item
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/items/${id}`);
      setItems(items.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  // Edit item
  const handleEdit = (item) => {
    setForm({ name: item.name, description: item.description });
    setEditingId(item._id);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📋 MERN CRUD App</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <button type="submit">{editingId ? "Update" : "Add"}</button>
      </form>

      <ul>
        {items.map((item) => (
          <li key={item._id}>
            <strong>{item.name}</strong>: {item.description}
            <button onClick={() => handleEdit(item)}>✏️ Edit</button>
            <button onClick={() => handleDelete(item._id)}>🗑 Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
