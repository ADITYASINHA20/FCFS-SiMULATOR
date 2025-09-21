import React, { useState } from "react";

// ------------------- Process Input Table Component -------------------
function ProcessInputTable({ processes, handleChange, calculateFCFS }) {
  return (
    <div className="mb-6 w-full overflow-x-auto">
      <table className="border-collapse border border-gray-400 mx-auto">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="border px-4 py-2">Process</th>
            <th className="border px-4 py-2">Arrival Time (AT)</th>
            <th className="border px-4 py-2">Burst Time (BT)</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((p, index) => (
            <tr key={p.id} className="text-center">
              <td className="border px-4 py-2">P{p.id}</td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  min="0"
                  value={p.at}
                  onChange={(e) => handleChange(index, "at", e.target.value)}
                  className="border p-1 w-20"
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  min="1"
                  value={p.bt}
                  onChange={(e) => handleChange(index, "bt", e.target.value)}
                  className="border p-1 w-20"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={calculateFCFS}
        className="mt-4 bg-green-600 text-blue px-4 py-2 rounded hover:bg-green-700"
      >
        Run FCFS
      </button>
    </div>
  );
}

// ------------------- Result Table Component -------------------
function ResultTable({ processes, results }) {
  return (
    <div className="w-full overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-2">Results</h2>
      <table className="border-collapse border border-gray-400 mx-auto mb-4">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="border px-4 py-2">Process</th>
            <th className="border px-4 py-2">AT</th>
            <th className="border px-4 py-2">BT</th>
            <th className="border px-4 py-2">CT</th>
            <th className="border px-4 py-2">TAT</th>
            <th className="border px-4 py-2">WT</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((p, i) => (
            <tr key={p.id} className="text-center">
              <td className="border px-4 py-2">P{p.id}</td>
              <td className="border px-4 py-2">{p.at}</td>
              <td className="border px-4 py-2">{p.bt}</td>
              <td className="border px-4 py-2">{results.ct[i]}</td>
              <td className="border px-4 py-2">{results.tat[i]}</td>
              <td className="border px-4 py-2">{results.wt[i]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-lg font-bold text-center">
        Average TAT: {results.avgTAT} | Average WT: {results.avgWT}
      </div>
    </div>
  );
}

// ------------------- Gantt Chart Component -------------------
function GanttChart({ processes, results }) {
  const colors = ["#3b82f6", "#f97316", "#10b981", "#f43f5e", "#8b5cf6", "#facc15"];

  return (
    <div className="mt-6 w-full overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-2">Gantt Chart</h2>

      {/* Bars */}
      <div className="flex border h-16 w-fit mx-auto">
        {processes.map((p, i) => {
          return (
            <div
              key={p.id}
              className="flex items-center justify-center border-r border-gray-400 text-white font-bold"
              style={{
                width: `${p.bt * 60}px`, 
                backgroundColor: colors[i % colors.length],
              }}
            >
              P{p.id}
            </div>
          );
        })}
      </div>

     
      <div className="flex mt-1 mx-auto w-fit">
        <span className="text-sm font-mono">0</span>
        {results.ct.map((ct, i) => (
          <span
            key={i}
            className="text-sm font-mono"
            style={{ marginLeft: `${processes[i].bt * 60 - 10}px` }}
          >
            {ct}
          </span>
        ))}
      </div>
    </div>
  );
}

// ------------------- Main FCFS Simulator Component -------------------
export default function FCFSSimulator() {
  const [numProcess, setNumProcess] = useState(3);
  const [processes, setProcesses] = useState([]);
  const [results, setResults] = useState(null);

  const generateInputs = () => {
    const arr = [];
    for (let i = 0; i < numProcess; i++) {
      arr.push({ id: i + 1, at: 0, bt: 1 });
    }
    setProcesses(arr);
    setResults(null);
  };

  const handleChange = (index, field, value) => {
    const updated = [...processes];
    updated[index][field] = parseInt(value);
    setProcesses(updated);
  };

  const calculateFCFS = () => {
  let time = 0;
  let n = processes.length;

  let ct = Array(n).fill(0);
  let tat = Array(n).fill(0);
  let wt = Array(n).fill(0);
  let totalTAT = 0, totalWT = 0;

  // 🔹 processes ke saath index bhi store karo
  const sorted = [...processes]
    .map((p, idx) => ({ ...p, originalIndex: idx }))
    .sort((a, b) => a.at - b.at);

  for (let i = 0; i < sorted.length; i++) {
    const { at, bt, originalIndex } = sorted[i];
    if (time < at) time = at; // CPU idle
    time += bt;

    ct[originalIndex] = time;
    tat[originalIndex] = ct[originalIndex] - at;
    wt[originalIndex] = tat[originalIndex] - bt;

    totalTAT += tat[originalIndex];
    totalWT += wt[originalIndex];
  }

  setResults({
    ct,
    tat,
    wt,
    avgTAT: (totalTAT / n).toFixed(2),
    avgWT: (totalWT / n).toFixed(2),
  });
};


  return (
    <div className="p-6 min-h-screen bg-gray-100 w-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          FCFS Scheduling Simulator
        </h1>
</div>
      {/* Input for number of processes */}
      <div className="mb-4">
        <input
          type="number"
          min="1"
          value={numProcess}
          onChange={(e) => setNumProcess(parseInt(e.target.value))}
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={generateInputs}
          className="bg-blue-600 text-blue px-4 py-2 rounded hover:bg-blue-700"
        >
          Generate Input Table
        </button>
      </div>

      {/* Render Input Table */}
      {processes.length > 0 && (
        <ProcessInputTable
          processes={processes}
          handleChange={handleChange}
          calculateFCFS={calculateFCFS}
        />
      )}

      {/* Render Results Table */}
      {results && <ResultTable processes={processes} results={results} />}

      {/* Render Gantt Chart */}
      {results && <GanttChart processes={processes} results={results} />}
    </div>
  );
}
