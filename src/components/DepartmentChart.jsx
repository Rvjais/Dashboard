import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DepartmentChart = ({ data }) => {
  const chartData = data.map(dept => ({
    department: dept.department,
    Total: dept.total,
    Completed: dept.completed,
    Pending: dept.pending
  }));

  return (
    <div className="w-full h-64 sm:h-72 md:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
          <XAxis
            dataKey="department"
            stroke="#6b7280"
            fontSize={12}
            className="dark:stroke-gray-400"
          />
          <YAxis stroke="#6b7280" fontSize={12} className="dark:stroke-gray-400" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend />
          <Bar dataKey="Total" fill="#3b82f6" radius={[2, 2, 0, 0]} />
          <Bar dataKey="Completed" fill="#10b981" radius={[2, 2, 0, 0]} />
          <Bar dataKey="Pending" fill="#f59e0b" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentChart;