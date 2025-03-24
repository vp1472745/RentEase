import React from 'react'

const Transactions = () => {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mt-5">My Transactions</h2>
        <div className="flex gap-4 mt-5">
          <button className="px-4 py-2 rounded-full bg-blue-100 text-blue-600">All</button>
          <button className="px-4 py-2 rounded-full bg-blue-100 text-blue-600">Premium</button>
          <button className="px-4 py-2 rounded-full bg-blue-100 text-blue-600">Pay Rent</button>
          <button className="px-4 py-2 rounded-full bg-blue-100 text-blue-600">Policies</button>
          <button className="px-4 py-2 rounded-full bg-blue-100 text-blue-600">Rent Agreement</button>
        </div>
      </div>
    );
  };
  
  export default Transactions;
  