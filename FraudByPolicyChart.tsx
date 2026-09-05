import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ChartCard } from './ChartCard';

interface Props {
  data: { name: string; fraud: number; genuine: number; total: number }[];
  onBarClick?: (name: string) => void;
}

export function FraudByPolicyChart({ data, onBarClick }: Props) {
  const displayData = data.slice(0, 9);
  return (
    <ChartCard
      title="Fraud by Policy Type"
      subtitle="Fraudulent vs genuine claims across policy types"
      height={320}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={displayData}
          layout="vertical"
          margin={{ top: 5, right: 15, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 10, fill: '#64748b' }}
            axisLine={{ stroke: '#e2e8f0' }}
            width={80}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              fontSize: 12,
            }}
            cursor={{ fill: '#f8fafc' }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          <Bar
            dataKey="genuine"
            stackId="a"
            fill="#1e6f5c"
            onClick={(entry) => onBarClick?.(entry.name ?? '')}
            style={{ cursor: onBarClick ? 'pointer' : 'default' }}
          />
          <Bar
            dataKey="fraud"
            stackId="a"
            fill="#c0392b"
            radius={[0, 4, 4, 0]}
            onClick={(entry) => onBarClick?.(entry.name ?? '')}
            style={{ cursor: onBarClick ? 'pointer' : 'default' }}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
