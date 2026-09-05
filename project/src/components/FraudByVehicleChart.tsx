import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ChartCard } from './ChartCard';

interface Props {
  data: {
    name: string;
    fraud: number;
    genuine: number;
    fraudRate: number;
    total: number;
  }[];
  onBarClick?: (name: string) => void;
}

export function FraudByVehicleChart({ data, onBarClick }: Props) {
  const displayData = data.slice(0, 12);
  return (
    <ChartCard
      title="Fraud by Vehicle Make"
      subtitle="Number of fraudulent claims by vehicle manufacturer"
      height={320}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={displayData}
          margin={{ top: 5, right: 15, left: 0, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: '#64748b' }}
            axisLine={{ stroke: '#e2e8f0' }}
            angle={-40}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <Tooltip
            formatter={(value) => [Number(value) || 0, 'Fraud Claims']}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              fontSize: 12,
            }}
            cursor={{ fill: '#f8fafc' }}
          />
          <Bar dataKey="fraud" radius={[4, 4, 0, 0]} onClick={(entry) => onBarClick?.(entry.name ?? '')}>
            {displayData.map((entry) => (
              <Cell
                key={entry.name}
                fill={entry.fraudRate > 8 ? '#c0392b' : '#2c5282'}
                style={{ cursor: onBarClick ? 'pointer' : 'default' }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
