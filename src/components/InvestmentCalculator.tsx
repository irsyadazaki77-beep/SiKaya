import { useState } from 'react';
import { HelpCircle, Sparkles, TrendingUp, DollarSign, Calendar, AlertTriangle, Coins } from 'lucide-react';

export function InvestmentCalculator() {
  const [initialAmount, setInitialAmount] = useState(10000000);
  const [monthlyContribution, setMonthlyContribution] = useState(500000); // Update 11: Monthly Contribution
  const [years, setYears] = useState(5);
  const [interestRate, setInterestRate] = useState(0.12); // Update 12: Custom interest rate
  const [isCompound, setIsCompound] = useState(true);
  const [adjustInflation, setAdjustInflation] = useState(false); // Update 14: Inflation adjuster
  const [applyFees, setApplyFees] = useState(true); // Update 13: Tax & Transaction fee (0.5%)

  // Preset values for quick input
  const amountPresets = [
    { label: '5 Jt', value: 5000000 },
    { label: '25 Jt', value: 25000000 },
    { label: '100 Jt', value: 100000000 },
  ];

  const ratePresets = [
    { label: '3% Deposito', value: 0.03 },
    { label: '6% Obligasi', value: 0.06 },
    { label: '12% Reksa Dana', value: 0.12 },
    { label: '20% Saham Agresif', value: 0.20 },
  ];

  const yearPresets = [1, 3, 5, 10, 20];

  const calculateReturn = () => {
    // Effective rate adjusts for annual inflation if checked (average IDR inflation ~3.5%)
    const rateToUse = adjustInflation ? (interestRate - 0.035) : interestRate;
    const r = rateToUse;
    
    let total = initialAmount;
    
    if (isCompound) {
      // Annual compounding with monthly contributions
      for (let i = 1; i <= years; i++) {
        // Compound the existing balance for the year
        total = total * (1 + r);
        // Add 12 months of contributions at the end of each year
        total += (monthlyContribution * 12) * (1 + r / 2); // simplified average compound for mid-year deposits
      }
    } else {
      // Simple interest formula for initial + contributions
      const principalSum = initialAmount + (monthlyContribution * 12 * years);
      total = principalSum * (1 + r * years);
    }

    // Apply estimated taxes & transaction spread (e.g., 0.5% standard fee) - Update 13
    if (applyFees && total > initialAmount) {
      const estimatedProfit = total - (initialAmount + (monthlyContribution * 12 * years));
      if (estimatedProfit > 0) {
        total -= estimatedProfit * 0.005; // 0.5% deduction on earnings for tax/fees
      }
    }

    return Math.max(0, total);
  };

  const totalInvested = initialAmount + (monthlyContribution * 12 * years);
  const finalAmount = calculateReturn();
  const totalProfit = Math.max(0, finalAmount - totalInvested);
  
  // Percent yield of original investment
  const percentageGrowth = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

  // Dynamic Insight Box based on rate - Update 15
  const getDynamicInsight = () => {
    if (interestRate <= 0.04) {
      return {
        text: 'Sangat Aman. Cocok untuk dana darurat & jangka pendek. Nilai stabil, namun berisiko tergerus inflasi jika tidak dipindahkan ke instrumen produktif.',
        color: 'text-blue-800 bg-blue-50 border-blue-200'
      };
    } else if (interestRate <= 0.08) {
      return {
        text: 'Risiko Rendah-Sedang. Obligasi Negara (SBN) atau Reksa Dana Pendapatan Tetap membantu mengalahkan inflasi dengan pembagian kupon rutin.',
        color: 'text-teal-800 bg-teal-50 border-teal-200'
      };
    } else if (interestRate <= 0.13) {
      return {
        text: 'Risiko Sedang-Tinggi. Reksa Dana Saham berpotensi tumbuh tinggi dalam jangka panjang (5-10 tahun), namun siap-siap mengalami fluktuasi harian.',
        color: 'text-amber-800 bg-amber-50 border-amber-200'
      };
    } else {
      return {
        text: '⚠️ Risiko Sangat Tinggi! Saham individual atau kripto menawarkan imbal hasil eksplosif tapi berisiko kehilangan modal hingga 100%. Jangan pakai uang dapur!',
        color: 'text-rose-800 bg-rose-50 border-rose-200'
      };
    }
  };

  const insight = getDynamicInsight();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Top Accent Gradient Header */}
      <div className="bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-transparent p-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-0.5">
          <div className="p-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-display">Kalkulator Proyeksi Cerdas</h3>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
          Simulasikan investasi rutin dengan efek bunga majemuk, inflasi, dan pajak rill.
        </p>
      </div>

      <div className="p-4 space-y-4 flex-1 text-xs">
        {/* Toggle Compound vs Simple */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
              Metode Hitung
            </label>
            <div className="grid grid-cols-2 gap-0.5 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
              <button
                onClick={() => setIsCompound(true)}
                className={`py-1 px-2 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  isCompound ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-2xs' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Majemuk
              </button>
              <button
                onClick={() => setIsCompound(false)}
                className={`py-1 px-2 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  !isCompound ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-2xs' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Sederhana
              </button>
            </div>
          </div>

          {/* Rate preset selector - Update 12 */}
          <div>
            <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
              Instrumen & Bunga p.a.
            </label>
            <select
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full py-1.5 px-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-teal-500"
            >
              {ratePresets.map((preset) => (
                <option key={preset.value} value={preset.value}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Modal Awal Slider & Input */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-0.5">
              <DollarSign className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              Modal Awal Sekali Bayar
            </label>
            <span className="text-[10px] font-extrabold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-100 dark:border-teal-900/50">
              Rp {initialAmount.toLocaleString('id-ID')}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="150000000"
            step="1000000"
            value={initialAmount}
            onChange={(e) => setInitialAmount(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-600 mb-1"
          />

          {/* Quick Amount Presets */}
          <div className="flex gap-1">
            {amountPresets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => setInitialAmount(preset.value)}
                className={`text-[9px] px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                  initialAmount === preset.value
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Investasi Bulanan Rutin Slider - Update 11 */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-0.5">
              <Coins className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              Investasi Rutin Bulanan
            </label>
            <span className="text-[10px] font-extrabold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-100 dark:border-teal-900/50">
              Rp {monthlyContribution.toLocaleString('id-ID')} /bln
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="15000000"
            step="100000"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-600 mb-1"
          />

          <div className="flex gap-1 text-[9px] text-slate-400 dark:text-slate-500 font-medium">
            <span>DCA (Dollar-Cost Averaging) menyerap fluktuasi pasar.</span>
          </div>
        </div>

        {/* Periode Slider & Input */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-0.5">
              <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              Durasi Menabung
            </label>
            <span className="text-[10px] font-extrabold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-100 dark:border-teal-900/50">
              {years} Tahun
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="25"
            step="1"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-600 mb-1"
          />

          {/* Quick Year Presets */}
          <div className="flex gap-1">
            {yearPresets.map((presetY) => (
              <button
                key={presetY}
                onClick={() => setYears(presetY)}
                className={`text-[9px] px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                  years === presetY
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {presetY} Thn
              </button>
            ))}
          </div>
        </div>

        {/* Real-World Adjustments: Inflation & Fees - Update 13 & 14 */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={adjustInflation}
              onChange={(e) => setAdjustInflation(e.target.checked)}
              className="accent-teal-600 w-3.5 h-3.5 rounded"
            />
            <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400 select-none">
              Kurangi Inflasi (3.5%)
            </span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={applyFees}
              onChange={(e) => setApplyFees(e.target.checked)}
              className="accent-teal-600 w-3.5 h-3.5 rounded"
            />
            <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400 select-none">
              Pajak & Biaya (0.5%)
            </span>
          </label>
        </div>
      </div>

      {/* Numerical and visual breakdown results */}
      <div className="p-4 bg-slate-50/80 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 space-y-3">
        {/* Visual Progress Bar - Update 16 */}
        <div className="space-y-1">
          <div className="flex justify-between text-[9px] font-bold text-slate-400 dark:text-slate-500">
            <span>Modal Pokok (Rp {(totalInvested).toLocaleString('id-ID')})</span>
            <span>Est. Keuntungan</span>
          </div>
          <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full flex overflow-hidden">
            <div 
              style={{ width: `${Math.max(15, Math.min(85, (totalInvested / Math.max(1, finalAmount)) * 100))}%` }} 
              className="bg-slate-400 dark:bg-slate-600 h-full transition-all duration-300"
            />
            <div 
              style={{ width: `${Math.max(15, Math.min(85, (totalProfit / Math.max(1, finalAmount)) * 100))}%` }} 
              className="bg-emerald-500 h-full transition-all duration-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div>
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Total Modal</span>
            <p className="font-extrabold text-slate-800 dark:text-slate-200 font-mono">
              Rp {totalInvested.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase flex items-center justify-end gap-0.5 font-mono">
              <TrendingUp className="w-3 h-3" />
              Profit ({percentageGrowth.toFixed(0)}%)
            </span>
            <p className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              + Rp {totalProfit.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        {/* Dynamic OJK Warning Insight Box - Update 15 */}
        <div className={`p-2.5 rounded-xl border text-[9px] leading-relaxed font-semibold transition-all duration-300 ${insight.color}`}>
          {insight.text}
        </div>

        <div className="p-3.5 bg-gradient-to-br from-teal-900 via-teal-950 to-slate-950 rounded-xl text-center shadow-md border border-teal-800/40">
          <p className="text-[8px] font-black text-teal-300 uppercase tracking-widest mb-0.5 font-mono">
            ESTIMASI TOTAL SALDO AKHIR
          </p>
          <p className="text-lg sm:text-xl font-black text-white font-mono">
            Rp {finalAmount.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-[8px] text-teal-300/80 mt-0.5">
            {adjustInflation ? '*Disesuaikan daya beli masa kini (riil)' : '*Nilai nominal masa depan'}
          </p>
        </div>
      </div>
    </div>
  );
}

