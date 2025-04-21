import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ username: "", email: "", role: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:4000/api/user-management", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setForm({ username: user.username, email: user.email, role: user.role });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:4000/api/user-management/${editingUser}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;
  
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4000/api/user-management/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User deleted successfully!");
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Failed to delete user!");
    }
  };  
  
  
  return (
    <div className="min-h-screen">
      <Navbar role="admin" />
      <div className="max-w-7xl mx-auto pt-25">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>
        
        <div className="flex gap-10">
          {/* Table Section */}
          <div className="w-2/3">
            <div className="overflow-y-auto h-[500px] rounded-lg">
              <table className="w-full table-auto text-center bg-gray-200">
                <thead className="sticky top-0 bg-neutral-900 text-orange-400 z-10">
                  <tr>
                    <th className="p-3">Username</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-gray-400">
                      <td className="p-3">{user.username}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.role}</td>
                      <td className="p-3 space-x-3">
                        <button
                          onClick={() => handleEdit(user)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>


          {/* Edit Form Section */}
          {editingUser && (
            <div className="w-1/3 bg-gray-200 p-6 rounded-lg h-fit">
              <h2 className="text-xl mb-4 font-semibold text-center">Edit User Role</h2>
              <label className="block mb-1 text-sm font-medium">Username:</label>
              <input
                type="text"
                placeholder="Username"
                className="block w-full mb-3 p-2 rounded bg-gray-100"
                value={form.username}
                readOnly
              />
              <label className="block mb-1 text-sm font-medium">Email:</label>
              <input
                type="email"
                placeholder="Email"
                className="block w-full mb-3 p-2 rounded bg-gray-100"
                value={form.email}
                readOnly
              />
              <label className="block mb-1 text-sm font-medium">Role:</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="block w-full mb-3 p-2 rounded bg-gray-100"
              >
                <option value="customer">Customer</option>
                <option value="restaurant_owner">Restaurant Owner</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleUpdate}
                  className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded text-white"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />

    </div>
  );
};

export default ManageUsers;
