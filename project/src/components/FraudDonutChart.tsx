import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartCard } from './ChartCard';

interface Props {
  data: { name: string; value: number; color: string }[];
  onSegmentClick?: (name: string) => void;
}

export function FraudDonutChart({ data, onSegmentClick }: Props) {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <ChartCard
      title="Fraud vs Genuine Claims"
      subtitle="Distribution of fraudulent and genuine claims"
      height={300}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={2}
            dataKey="value"
            onClick={(entry) => onSegmentClick?.(entry.name ?? '')}
            style={{ cursor: onSegmentClick ? 'pointer' : 'default' }}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} stroke="#fff" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => {
              const num = Number(value) || 0;
              return [
                `${num.toLocaleString()} (${total > 0 ? ((num / total) * 100).toFixed(1) : 0}%)`,
                'Claims',
              ];
            }}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              fontSize: 12,
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
