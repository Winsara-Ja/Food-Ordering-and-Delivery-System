import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const Verification = () => {
  const [documents, setDocuments] = useState([]);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/documents", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setDocuments(res.data.documents || []);
    } catch (err) {
      console.error("Failed to fetch documents", err);
      setDocuments([]);
    }
  };

  const handleAction = async (id, action) => {
    const url = `http://localhost:4000/api/documents/${id}/${action}`;
    await axios.put(url, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    fetchDocuments();
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="admin" />
      <div className="max-w-5xl mx-auto p-6 font-sans pt-25">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify Business Documents</h2>

        {documents.length === 0 ? (
          <p className="text-center text-gray-500">No documents available.</p>
        ) : (
          <ul className="space-y-4">
            {documents.map((doc) => (
              <li
                key={doc._id}
                className="bg-white shadow-md rounded-lg p-4 border border-gray-200 flex items-center justify-between"
              >
                <div className="flex flex-col space-y-1">
                  <p><span className="font-semibold">Restaurant:</span> {doc.restaurant.name}</p>
                  <p><span className="font-semibold">Status:</span> {doc.status}</p>
                  <a
                    href={`http://localhost:4000${doc.documentUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline hover:text-blue-800 text-sm"
                  >
                    View Document
                  </a>
                </div>

                {doc.status === "pending" && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleAction(doc._id, "approve")}
                      className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(doc._id, "reject")}
                      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded text-sm"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Verification;
