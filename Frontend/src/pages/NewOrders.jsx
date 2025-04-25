import React from "react";

const ORDERS = [
  {
    id: "1234",
    date: "2024-03-10",
    restaurant: "Pizza Palace",
    items: ["Margherita Pizza", "Garlic Bread"],
    total: 22.98,
    status: "Delivered",
    image:
      "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "1235",
    date: "2024-03-09",
    restaurant: "Burger Joint",
    items: ["Chicken Burger", "Fries", "Coke"],
    total: 25.97,
    status: "Delivered",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=60",
  },
];

function NewOrders() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-slate-800">
        Order History
      </h2>
      <div className="space-y-4">
        {ORDERS.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={order.image}
                alt={order.restaurant}
                className="w-20 h-20 object-cover rounded-xl"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-slate-800">
                    {order.restaurant}
                  </h3>
                  <span className="text-sm text-slate-500">
                    {new Date(order.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  {order.items.join(", ")}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-800">
                      ${order.total.toFixed(2)}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-sm px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full">
                      {order.status}
                    </span>
                  </div>
                  <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-indigo-600"></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewOrders;
