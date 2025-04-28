import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const ManageMenus = () => {
  const [menus, setMenus] = useState([]);
  const [editingMenu, setEditingMenu] = useState(null);
  const [viewingMenu, setViewingMenu] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    available: true,
    imageUrl: "",
  });
  const [isCreating, setIsCreating] = useState(false);  // New state for create form

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:4000/api/menu/my-menu", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenus(res.data.menuItems || []);
    } catch (err) {
      console.error("Error fetching menu items:", err);
    }
  };

  const handleEdit = (item) => {
    setEditingMenu(item._id);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      available: item.available,
      imageUrl: item.imageUrl || "",
    });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:4000/api/menu/${editingMenu}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Menu item updated!");
      setEditingMenu(null);
      fetchMenus();
    } catch (err) {
      console.error("Error updating menu item:", err);
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this item?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4000/api/menu/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Menu item deleted!");
      fetchMenus();
    } catch (err) {
      console.error("Error deleting menu item:", err);
      toast.error("Delete failed");
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:4000/api/menu",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Menu item created!");
      setIsCreating(false);
      fetchMenus();
      // Clear form values after creating a new menu
      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        available: true,
        imageUrl: "",
      });
    } catch (err) {
      console.error("Error creating menu item:", err);
      toast.error("Create failed");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar role="restaurant_owner" />
      <div className="max-w-7xl mx-auto pt-24 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Menu Management</h1>
          <button
            onClick={() => setIsCreating(true)}
            className="bg-orange-400 hover:bg-orange-500 px-4 py-2 rounded text-white border border-orange-500 shadow-[inset_0_0_0_0] hover:shadow-md transition-shadow flex items-center space-x-2"
          >
            <span className="text-lg font-bold">+</span>
            <span>Create a New Menu</span>
          </button>
        </div>

        <div className="w-full overflow-x-auto rounded-lg">
          <table className="w-full text-center bg-gray-100 border border-gray-300">
            <thead className="bg-gray-600 text-white sticky top-0 z-10">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Description</th>
                <th className="p-3">Price</th>
                <th className="p-3">Category</th>
                <th className="p-3">Available</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menus.map((item) => (
                <tr key={item._id} className="border-b border-gray-300">
                  <td className="p-3">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="h-12 w-12 rounded mx-auto" />
                    ) : (
                      <span className="text-gray-400 italic">No Image</span>
                    )}
                  </td>
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">
                    {item.description?.length > 50
                      ? item.description.slice(0, 50) + "..."
                      : item.description}
                  </td>
                  <td className="p-3">Rs.{item.price}</td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3">{item.available ? "Yes" : "No"}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => setViewingMenu(item)}
                      className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-black"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-orange-500 hover:bg-orange-600 text-black px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create Menu Item Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-200 rounded-xl shadow-lg w-[500px] p-6 relative">
              <h2 className="text-xl font-semibold mb-4 text-center">Create New Menu Item</h2>
              <button
                className="absolute top-3 right-4 hover:text-red-500 text-2xl"
                onClick={() => setIsCreating(false)}
              >
                &times;
              </button>
              <label className="block mb-1 text-sm font-medium">Name:</label>
              <input
                type="text"
                className="w-full mb-3 p-2 rounded bg-gray-100"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <label className="block mb-1 text-sm font-medium">Description:</label>
              <textarea
                rows="2"
                className="w-full mb-3 p-2 rounded bg-gray-100"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <label className="block mb-1 text-sm font-medium">Price:</label>
              <input
                type="number"
                className="w-full mb-3 p-2 rounded bg-gray-100"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
              <label className="block mb-1 text-sm font-medium">Category:</label>
              <input
                type="text"
                className="w-full mb-3 p-2 rounded bg-gray-100"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
              <label className="block mb-1 text-sm font-medium">Available:</label>
              <select
                value={form.available}
                onChange={(e) => setForm({ ...form, available: e.target.value === "true" })}
                className="w-full mb-3 p-2 rounded bg-gray-100"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              <label className="block mb-1 text-sm font-medium">Image URL:</label>
              <input
                type="text"
                className="w-full mb-4 p-2 rounded bg-gray-100"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
              <button
                onClick={handleCreate}
                className="bg-orange-400 hover:bg-orange-600 px-4 py-2 rounded w-full text-white font-semibold"
              >
                Create Menu Item
              </button>
            </div>
          </div>
        )}

        {/* Edit Dialog Modal */}
        {editingMenu && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-200 rounded-xl shadow-lg w-[500px] p-6 relative">
              <h2 className="text-xl font-semibold mb-4 text-center">Edit Menu Item</h2>
              <button
                className="absolute top-3 right-4 hover:text-red-500 text-2xl"
                onClick={() => setEditingMenu(null)}
              >
                &times;
              </button>
              <label className="block mb-1 text-sm font-medium">Name:</label>
              <input
                type="text"
                className="w-full mb-3 p-2 rounded bg-gray-100"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <label className="block mb-1 text-sm font-medium">Description:</label>
              <textarea
                rows="2"
                className="w-full mb-3 p-2 rounded bg-gray-100"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <label className="block mb-1 text-sm font-medium">Price:</label>
              <input
                type="number"
                className="w-full mb-3 p-2 rounded bg-gray-100"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
              <label className="block mb-1 text-sm font-medium">Category:</label>
              <input
                type="text"
                className="w-full mb-3 p-2 rounded bg-gray-100"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
              <label className="block mb-1 text-sm font-medium">Available:</label>
              <select
                value={form.available}
                onChange={(e) => setForm({ ...form, available: e.target.value === "true" })}
                className="w-full mb-3 p-2 rounded bg-gray-100"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              <label className="block mb-1 text-sm font-medium">Image URL:</label>
              <input
                type="text"
                className="w-full mb-4 p-2 rounded bg-gray-100"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
              <button
                onClick={handleUpdate}
                className="bg-orange-400 hover:bg-orange-500 px-4 py-2 rounded w-full text-white font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* View Dialog Modal */}
        {viewingMenu && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-200 rounded-xl shadow-lg w-[500px] p-6 relative">
              <h2 className="text-xl font-semibold mb-4 text-center">Menu Item Details</h2>
              <button
                className="absolute top-3 right-4 hover:text-red-500 text-2xl"
                onClick={() => setViewingMenu(null)}
              >
                &times;
              </button>
              <p><span className="text-orange-400 font-medium">Name:</span> {viewingMenu.name}</p>
              <p><span className="text-orange-400 font-medium">Price:</span> Rs.{viewingMenu.price}</p>
              <p><span className="text-orange-400 font-medium">Category:</span> {viewingMenu.category}</p>
              <p><span className="text-orange-400 font-medium">Available:</span> {viewingMenu.available ? "Yes" : "No"}</p>
              <p><span className="text-orange-400 font-medium">Description:</span> {viewingMenu.description}</p>
              {viewingMenu.imageUrl && (
                <img
                  src={viewingMenu.imageUrl}
                  alt={viewingMenu.name}
                  className="mt-4 w-full h-56 object-cover rounded"
                />
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ManageMenus;
