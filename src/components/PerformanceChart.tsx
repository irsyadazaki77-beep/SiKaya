import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface PerformanceChartProps {
  period: '1W' | '1M' | '1Y' | 'ALL';
}

const datasets = {
  '1W': [
    { label: 'Sen', value: 124800 },
    { label: 'Sel', value: 124950 },
    { label: 'Rab', value: 124700 },
    { label: 'Kam', value: 125100 },
    { label: 'Jum', value: 125250 },
    { label: 'Sab', value: 125300 },
    { label: 'Min', value: 125400 },
  ],
  '1M': [
    { label: 'Wk 1', value: 121000 },
    { label: 'Wk 2', value: 122500 },
    { label: 'Wk 3', value: 124200 },
    { label: 'Wk 4', value: 125400 },
  ],
  '1Y': [
    { label: 'Jan', value: 85000 },
    { label: 'Feb', value: 89000 },
    { label: 'Mar', value: 94000 },
    { label: 'Apr', value: 98000 },
    { label: 'Mei', value: 102000 },
    { label: 'Jun', value: 105000 },
    { label: 'Jul', value: 110000 },
    { label: 'Ags', value: 112000 },
    { label: 'Sep', value: 116000 },
    { label: 'Okt', value: 119000 },
    { label: 'Nov', value: 122000 },
    { label: 'Des', value: 125400 },
  ],
  'ALL': [
    { label: '2022', value: 35000 },
    { label: '2023', value: 62000 },
    { label: '2024', value: 88000 },
    { label: '2025', value: 112000 },
    { label: '2026', value: 125400 },
  ],
};

export function PerformanceChart({ period }: PerformanceChartProps) {
  const currentData = datasets[period] || datasets['1Y'];

  return (
    <div className="h-full w-full min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={currentData}
          margin={{
            top: 5,
            right: 5,
            left: -15,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="label" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
            dy={8}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
            tickFormatter={(val) => `Rp${(val / 1000).toFixed(0)}jt`}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: '1px solid #e2e8f0', 
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)',
              backgroundColor: '#ffffff',
              padding: '10px 14px'
            }}
            labelStyle={{ fontWeight: 'bold', color: '#1e293b', fontSize: '11px', marginBottom: '4px' }}
            itemStyle={{ color: '#0d9488', fontSize: '12px', fontWeight: 'bold' }}
            formatter={(value: number) => [`Rp ${(value * 1000).toLocaleString('id-ID')}`, 'Nilai Portofolio']}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#0d9488" 
            strokeWidth={2.5}
            fillOpacity={1} 
            fill="url(#colorValue)" 
            activeDot={{ r: 6, strokeWidth: 0, fill: '#0d9488' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
