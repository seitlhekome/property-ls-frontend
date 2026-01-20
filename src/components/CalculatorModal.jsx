// src/components/CalculatorModal.jsx
import React, { useState } from "react";

export default function CalculatorModal({ calcMort, fmt }) {
  const [price, setPrice] = useState("");
  const [deposit, setDeposit] = useState("");
  const [rate, setRate] = useState(""); // annual interest rate in %
  const [term, setTerm] = useState(""); // term in years
  const [monthlyPayment, setMonthlyPayment] = useState(null);

  // ---------------- CALCULATE MORTGAGE ----------------
  const calculateMortgage = () => {
    const principal = Number(price) - Number(deposit);
    const monthlyRate = Number(rate) / 100 / 12;
    const months = Number(term) * 12;

    if (principal <= 0 || monthlyRate <= 0 || months <= 0) {
      return alert("Enter valid numbers for price, deposit, rate, and term");
    }

    const payment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    setMonthlyPayment(payment);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 overflow-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative p-6">
        {/* Close button */}
        <button
          onClick={() => calcMort(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Mortgage Calculator
        </h2>

        <div className="flex flex-col gap-3">
          <div>
            <label className="block mb-1 font-medium">Property Price (M)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Deposit (M)</label>
            <input
              type="number"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Annual Interest Rate (%)</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Term (Years)</label>
            <input
              type="number"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <button
            onClick={calculateMortgage}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Calculate
          </button>

          {monthlyPayment !== null && (
            <p className="mt-3 text-lg font-semibold">
              Estimated Monthly Payment: <span className="text-blue-700">{fmt(monthlyPayment.toFixed(2))}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
