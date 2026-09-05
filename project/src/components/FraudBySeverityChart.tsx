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
  data: { name: string; Fraud: number; Genuine: number }[];
  onBarClick?: (name: string) => void;
}

export function FraudBySeverityChart({ data, onBarClick }: Props) {
  return (
    <ChartCard
      title="Fraud by Fault Type"
      subtitle="Fraudulent vs genuine claims by fault category"
      height={300}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 15, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={{ stroke: '#e2e8f0' }}
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
            dataKey="Genuine"
            stackId="a"
            fill="#1e6f5c"
            radius={[0, 0, 0, 0]}
            onClick={(entry) => onBarClick?.(entry.name ?? '')}
            style={{ cursor: onBarClick ? 'pointer' : 'default' }}
          />
          <Bar
            dataKey="Fraud"
            stackId="a"
            fill="#c0392b"
            radius={[4, 4, 0, 0]}
            onClick={(entry) => onBarClick?.(entry.name ?? '')}
            style={{ cursor: onBarClick ? 'pointer' : 'default' }}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
