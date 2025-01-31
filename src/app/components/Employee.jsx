import { employees } from "@/data";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";

const teams = [...new Set(employees.map((emp) => emp.team))];
const roles = [...new Set(employees.map((emp) => emp.role))];

const EmployeeTable = () => {
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [visibleEmployees, setVisibleEmployees] = useState([]);
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);

  // Apply filtering to the entire dataset when search or filters change
  useEffect(() => {
    const applyFilters = () => {
      let updatedEmployees = employees;

      if (search) {
        updatedEmployees = updatedEmployees.filter((emp) =>
          emp.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (teamFilter) {
        updatedEmployees = updatedEmployees.filter((emp) =>
          emp.team === teamFilter
        );
      }

      if (roleFilter) {
        updatedEmployees = updatedEmployees.filter((emp) =>
          emp.role === roleFilter
        );
      }

      setFilteredEmployees(updatedEmployees);
    };

    applyFilters();
    setCount(10); 
  }, [search, teamFilter, roleFilter]);

  useEffect(() => {
    setVisibleEmployees(filteredEmployees.slice(0, count));
  }, [filteredEmployees, count]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && count < filteredEmployees.length) {
          setLoading(true);
          setTimeout(() => {
            setCount((prev) => Math.min(prev + 10, filteredEmployees.length));
            setLoading(false);
          }, 1000);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [count, filteredEmployees]);

  return (
    <div className="p-4 max-w-6xl border rounded-lg shadow-lg w-full mx-auto">
      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by name..."
          className="p-2 border outline-none border-gray-300 rounded flex-grow sm:flex-auto w-full sm:w-auto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-2 outline-none border border-gray-300 rounded sm:w-auto w-full"
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
        >
          <option value="">All Teams</option>
          {teams.map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>
        <select
          className="p-2 outline-none border-gray-300 rounded sm:w-auto w-full"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full table-auto">
        <thead>
          <tr className="bg-black text-white">
            <th className="p-2 rounded-tl-md">Employee ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Role</th>
            <th className="p-2 rounded-tr-md">Team</th>
          </tr>
        </thead>
        <tbody>
          {visibleEmployees.length > 0 ? (
            visibleEmployees.map((emp, i) => (
              <tr
                key={emp.id}
                className={`text-center hover:bg-gray-200 ${
                  i % 2 === 0 ? "bg-white" : "bg-gray-100"
                }`}
              >
                <td className="border p-2">{emp.id}</td>
                <td className="border p-2">{emp.name}</td>
                <td className="border p-2">{emp.role}</td>
                <td className="border p-2">{emp.team}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="border p-4 text-center text-gray-500"
              >
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {loading && (
        <div className="p-4 flex items-center justify-center">
          <Image
            width={50}
            height={50}
            className=""
            alt="Loading"
            src="/assets/loader.svg"
          />
        </div>
      )}

      <div ref={observerRef} className="h-10" />
    </div>
  );
};

export default EmployeeTable;
