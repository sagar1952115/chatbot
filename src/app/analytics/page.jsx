"use client";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  RadialBarChart,
  RadialBar,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer
} from "recharts";
import GaugeChart from "react-gauge-chart"; // ✅ Correct import
import Navbar from "../components/Navbar";
import Image from "next/image";
import EmployeeTable from "../components/Employee";

const AnalyticsPage = () => {
  const [tab, setTab] = useState("charts");
  const [data, setData] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      value: Math.random() * 100
    }))
  );

  return (
    <div className="h-screen  overflow-auto border flex flex-col">
      <Navbar name="Chat Analytics" show={false} />
      <div className="p-6 flex-1   overflow-auto flex flex-col h-full">
        <div className="flex lg:justify-center mb-6">
          <button
            className={` px-6 p-2 text-lg font-medium ${
              tab === "charts" ? "border-b-2  border-gray-800  " : "  "
            }`}
            onClick={() => setTab("charts")}
          >
            Charts
          </button>
          <button
            className={`px-6 p-2 text-lg font-medium ${
              tab === "table" ? "border-b-2  border-gray-800  " : " "
            }`}
            onClick={() => setTab("table")}
          >
            Table
          </button>
        </div>

        {tab === "charts" ? (
          <div className="grid w-full max-w-6xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-6">
            {/* Line Chart */}
            <div className="bg-white border shadow-lg rounded-lg p-4 flex flex-col justify-center items-center h-72">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data}>
                  <XAxis dataKey="id" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Scatter Chart */}
            <div className="bg-white border shadow-lg rounded-lg p-4 flex flex-col justify-center items-center h-72">
              <ResponsiveContainer width="100%" height={200}>
                <ScatterChart>
                  <XAxis type="number" dataKey="id" />
                  <YAxis type="number" dataKey="value" />
                  <Tooltip />
                  <Scatter data={data} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Radial Bar Chart */}
            <div className="bg-white border shadow-lg rounded-lg p-4 flex flex-col justify-center items-center h-72">
              <ResponsiveContainer width="100%" height={200}>
                <RadialBarChart innerRadius="10%" outerRadius="80%" data={data}>
                  <RadialBar
                    minAngle={15}
                    background
                    clockWise
                    dataKey="value"
                    fill="#82ca9d"
                  />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>

            {/* Gauge Chart */}
            <div className="bg-white border  shadow-lg rounded-lg p-4 flex flex-col justify-center items-center h-72">
              <GaugeChart
                textColor="#757573  "
                id="gauge-chart"
                nrOfLevels={10}
                percent={0.6}
              />
            </div>
          </div>
        ) : (
          <EmployeeTable />
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
