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
  data: { name: string; fraudRate: number; fraud: number; total: number }[];
  onBarClick?: (name: string) => void;
}

export function FraudByIncidentTypeChart({ data, onBarClick }: Props) {
  return (
    <ChartCard
      title="Fraud Rate by Accident Area"
      subtitle="Percentage of fraudulent claims by accident area"
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
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            formatter={(value, _name, props) => {
              const num = Number(value) || 0;
              const payload = props?.payload as { fraud: number; total: number };
              return [
                `${num.toFixed(2)}% (${payload?.fraud ?? 0}/${payload?.total ?? 0})`,
                'Fraud Rate',
              ];
            }}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              fontSize: 12,
            }}
            cursor={{ fill: '#f8fafc' }}
          />
          <Bar dataKey="fraudRate" radius={[4, 4, 0, 0]} onClick={(entry) => onBarClick?.(entry.name ?? '')}>
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={entry.fraudRate > 10 ? '#c0392b' : entry.fraudRate > 5 ? '#e67e22' : '#2c5282'}
                style={{ cursor: onBarClick ? 'pointer' : 'default' }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
