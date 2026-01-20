import React from "react";

export default function CalculatorModal({ calcVals, setCalcVals, calcMort, fmt }) {
  // Mortgage calculation function
  const calculateMortgage = () => {
    const principal = parseFloat(calcVals.price || 0) - parseFloat(calcVals.deposit || 0);
    const annualRate = parseFloat(calcVals.rate || 0) / 100;
    const months = parseInt(calcVals.term || 0) * 12;

    if (!principal || !annualRate || !months) return 0;

    const monthlyRate = annualRate / 12;
    const payment =
      (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

    return payment.toFixed(2);
  };

  const monthlyPayment = calculateMortgage();

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

        <h2 className="text-2xl font-bold mb-4 text-gray-800">Mortgage Calculator</h2>

        <div className="flex flex-col gap-3">
          <input
            type="number"
            placeholder="Property Price"
            value={calcVals.price}
            onChange={(e) =>
              setCalcVals({ ...calcVals, price: e.target.value })
            }
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            placeholder="Deposit Amount"
            value={calcVals.deposit}
            onChange={(e) =>
              setCalcVals({ ...calcVals, deposit: e.target.value })
            }
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            placeholder="Interest Rate (%)"
            value={calcVals.rate}
            onChange={(e) =>
              setCalcVals({ ...calcVals, rate: e.target.value })
            }
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            placeholder="Term (years)"
            value={calcVals.term}
            onChange={(e) =>
              setCalcVals({ ...calcVals, term: e.target.value })
            }
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="mt-4 p-4 bg-gray-100 rounded text-gray-800 text-center font-semibold">
            Monthly Payment: <span className="text-blue-600">{fmt(monthlyPayment)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
