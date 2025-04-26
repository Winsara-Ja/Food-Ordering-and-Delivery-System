import React, { useState } from 'react';

const ShippingForm = ({ nextStep }) => {
  const [shippingData, setShippingData] = useState({
    houseNumber: '',
    street: '',
    city: '',
    district: '',
    province: '',
    postalCode: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingData({ ...shippingData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep(shippingData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-zinc-50 p-10 rounded-xl shadow space-y-7 pt-8 border-zinc-300 border-2"

    >
      <h2 className="text-2xl font-semibold text-gray-800">Shipping Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'House Number', name: 'houseNumber' },
          { label: 'Street', name: 'street' },
          { label: 'City', name: 'city' },
          { label: 'District', name: 'district' },
          { label: 'Province', name: 'province' },
          { label: 'Postal Code', name: 'postalCode' },
          { label: 'Phone Number', name: 'phone' },
        ].map(({ label, name }) => (
          <div key={name} className="col-span-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
            <input
              type="text"
              name={name}
              value={shippingData[name]}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>

      <div className="pt-3">
      <button
  type="submit"
  style={{ backgroundColor: '#3859BC' }} 
  className="text-white font-medium px-6 py-2 rounded-md shadow"
>
  Next
</button>


      </div>
    </form>
  );
};

export default ShippingForm;
