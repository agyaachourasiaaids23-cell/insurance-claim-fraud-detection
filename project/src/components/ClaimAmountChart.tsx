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
  data: {
    name: string;
    avgAmount: number;
    totalAmount: number;
    count: number;
  }[];
}

function formatCurrency(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v}`;
}

export function ClaimAmountChart({ data }: Props) {
  return (
    <ChartCard
      title="Claim Amount Analysis"
      subtitle="Average and total estimated claim amounts by fraud status"
      height={300}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 15, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={{ stroke: '#e2e8f0' }}
            tickFormatter={(v) => formatCurrency(v)}
          />
          <Tooltip
            formatter={(value, name) => {
              const num = Number(value) || 0;
              return [
                formatCurrency(num),
                name === 'avgAmount' ? 'Avg Amount' : 'Total Amount',
              ];
            }}
            labelFormatter={(label) => {
              const item = data.find((d) => d.name === label);
              return `${label} (${item ? item.count : 0} claims)`;
            }}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              fontSize: 12,
            }}
            cursor={{ fill: '#f8fafc' }}
          />
          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: 12 }}
            formatter={(value) => (value === 'avgAmount' ? 'Avg Amount' : 'Total Amount')}
          />
          <Bar dataKey="avgAmount" fill="#2c5282" radius={[4, 4, 0, 0]} />
          <Bar dataKey="totalAmount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
