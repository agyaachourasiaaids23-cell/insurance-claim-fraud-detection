import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
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

export function FraudByAgeGroupChart({ data, onBarClick }: Props) {
  return (
    <ChartCard
      title="Fraud by Age Group"
      subtitle="Fraudulent claims distributed across age groups"
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
          <Bar dataKey="genuine" stackId="a" fill="#1e6f5c" />
          <Bar
            dataKey="fraud"
            stackId="a"
            fill="#c0392b"
            radius={[4, 4, 0, 0]}
            onClick={(entry) => onBarClick?.(entry.name ?? '')}
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill="#c0392b"
                style={{ cursor: onBarClick ? 'pointer' : 'default' }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
