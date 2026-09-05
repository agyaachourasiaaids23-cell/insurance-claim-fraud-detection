import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ChartCard } from './ChartCard';

interface Props {
  data: { name: string; total: number; fraud: number; fraudRate: number }[];
  onPointClick?: (name: string) => void;
}

export function ClaimTrendChart({ data, onPointClick }: Props) {
  return (
    <ChartCard
      title="Claim Trend by Month"
      subtitle="Total claims and fraudulent claims over months"
      height={300}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 15, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2c5282" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2c5282" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#c0392b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#c0392b" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            cursor={{ stroke: '#94a3b8', strokeDasharray: '3 3' }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          <Area
            type="monotone"
            dataKey="total"
            name="Total Claims"
            stroke="#2c5282"
            strokeWidth={2}
            fill="url(#colorTotal)"
            onClick={(entry) => onPointClick?.(entry.name ?? '')}
            style={{ cursor: onPointClick ? 'pointer' : 'default' }}
          />
          <Area
            type="monotone"
            dataKey="fraud"
            name="Fraud Claims"
            stroke="#c0392b"
            strokeWidth={2}
            fill="url(#colorFraud)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
