import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ChartDataPoint {
  date: string;
  crypto: number;
  card: number;
  xmtp: number;
}

interface TipChartProps {
  data: ChartDataPoint[];
  title: string;
}

export const TipChart: React.FC<TipChartProps> = ({ data, title }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">{title}</h3>
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#6B7280' }}
              tickLine={{ stroke: '#6B7280' }}
            />
            <YAxis
              tick={{ fill: '#6B7280' }}
              tickLine={{ stroke: '#6B7280' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '0.375rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="crypto"
              name="Crypto"
              stroke="#4F46E5"
              strokeWidth={2}
              dot={{ fill: '#4F46E5' }}
            />
            <Line
              type="monotone"
              dataKey="card"
              name="Card"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: '#10B981' }}
            />
            <Line
              type="monotone"
              dataKey="xmtp"
              name="XMTP"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={{ fill: '#F59E0B' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 