'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// ─── Types ────────────────────────────────────────────────────────────────────
interface DailyTrend {
  label: string; revenue: number; orders?: number; jobs?: number; pages?: number;
}
interface HourData {
  hour: number; revenue: number; orders?: number; jobs?: number;
}
interface TopItem    { name: string; quantity: number; revenue: number; }
interface TopCustomer { name: string; count: number; spent: number; }
interface ColorSplit  { bw: number; color: number; grayscale: number; }
interface JobStatus   { queued: number; printing: number; done: number; cancelled: number; }

interface BaseInsights {
  shopType: string; shopName: string;
  todayRevenue: number; weekRevenue: number; monthRevenue: number;
  peakHours: string[];
  revenueByHour: HourData[];
  dailyTrend: DailyTrend[];
}
interface FoodInsights extends BaseInsights {
  todayOrders: number; weekOrders: number; monthOrders: number;
  avgOrderValue: number; completionRate: number; pendingOrders: number;
  topSellingItems: TopItem[];
}
interface GroceryInsights extends FoodInsights {
  avgBasketItems: number; repeatCustomerRate: number;
  topSpendingCustomers: TopCustomer[];
  valueBuckets: Record<string, number>;
}
interface XeroxInsights extends BaseInsights {
  todayJobs: number; weekJobs: number; monthJobs: number; totalPaidJobs: number;
  avgJobValue: number; avgPages: number; doublesidedRate: number;
  completionRate: number; pendingJobs: number;
  pagesToday: number; pagesWeek: number; pagesMonth: number;
  colorModeSplit: ColorSplit;
  jobsByStatus: JobStatus;
  paperSizeSplit: Record<string, number>;
  topCustomers: TopCustomer[];
  staplingCount: number; bindingCount: number;
}
type InsightsData = FoodInsights | GroceryInsights | XeroxInsights;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fc  = (n: number) => `₹${Number.isInteger(n) ? n : n.toFixed(2)}`;
const pct = (a: number, b: number) => (b === 0 ? 0 : Math.round((a / b) * 100));
const fmtHour = (h: number) =>
  h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`;

// ─── UI Atoms ─────────────────────────────────────────────────────────────────
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 ${className}`}>
      {children}
    </div>
  );
}

function SectionHeader({ emoji, title }: { emoji: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-base">{emoji}</span>
      <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">{title}</h3>
    </div>
  );
}

function StatCard({
  emoji, label, value, sub, colorClass = 'bg-orange-50 border-orange-100 text-orange-600',
}: { emoji: string; label: string; value: string | number; sub?: string; colorClass?: string; }) {
  return (
    <div className={`rounded-2xl border-2 p-5 ${colorClass}`}>
      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-lg">{emoji}</span>
        <p className="text-[10px] font-black uppercase tracking-wider opacity-60">{label}</p>
      </div>
      <p className="text-3xl font-black leading-none">{value}</p>
      {sub && <p className="text-xs mt-2 opacity-60 font-semibold">{sub}</p>}
    </div>
  );
}

function BarRow({
  label, value, max, sub, color = '#FF5A00',
}: { label: string; value: number; max: number; sub?: string; color?: string; }) {
  const w = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="font-semibold text-gray-700 truncate pr-2">{label}</span>
        {sub && <span className="text-gray-400 font-medium whitespace-nowrap flex-shrink-0">{sub}</span>}
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${w}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function SplitBar({ segments }: {
  segments: { label: string; value: number; color: string }[];
}) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  if (total === 0) return <p className="text-sm text-gray-400">No data yet</p>;
  return (
    <div className="space-y-3">
      <div className="flex rounded-xl overflow-hidden h-5 gap-0.5">
        {segments.map(seg => {
          const w = (seg.value / total) * 100;
          return w > 0 ? (
            <div key={seg.label} className="h-full rounded-sm transition-all"
              style={{ width: `${w}%`, backgroundColor: seg.color }} />
          ) : null;
        })}
      </div>
      <div className="flex flex-wrap gap-4">
        {segments.map(seg => (
          <div key={seg.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-sm font-semibold text-gray-700">
              {seg.label}
              <span className="text-gray-400 font-normal ml-1.5">
                {seg.value} · {total > 0 ? `${pct(seg.value, total)}%` : '0%'}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RankedList({ items, valueKey, subKey, valueFormat = String }: {
  items: Record<string, any>[];
  valueKey: string;
  subKey?: string;
  valueFormat?: (v: number) => string;
}) {
  const COLORS = [
    'from-orange-400 to-orange-600', 'from-gray-400 to-gray-500',
    'from-amber-400 to-amber-600',   'from-blue-400 to-blue-500',
    'from-purple-400 to-purple-500', 'from-green-400 to-green-500',
    'from-pink-400 to-pink-500',
  ];
  const maxVal = Math.max(...items.map(i => i[valueKey]));
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${COLORS[i] || COLORS[0]} flex items-center justify-center text-white font-black text-sm flex-shrink-0`}>
            {i + 1}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-bold text-gray-900 truncate pr-3">{item.name}</p>
              <span className="text-sm font-black text-green-600 flex-shrink-0">
                {valueFormat(item[valueKey])}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-orange-400 rounded-full"
                style={{ width: `${pct(item[valueKey], maxVal)}%` }} />
            </div>
            {subKey && <p className="text-xs text-gray-400 mt-1">{item[subKey]}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

function SmartTips({ tips }: { tips: { icon: string; title: string; body: string }[] }) {
  if (!tips.length) return null;
  return (
    <Card>
      <SectionHeader emoji="🧠" title="Smart Insights" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tips.map((t, i) => (
          <div key={i} className="flex gap-3 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <span className="text-xl flex-shrink-0">{t.icon}</span>
            <div>
              <p className="text-sm font-black text-indigo-900">{t.title}</p>
              <p className="text-sm text-indigo-700 mt-0.5 leading-relaxed">{t.body}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function HourChart({ data, color }: { data: HourData[]; color: string }) {
  const active = [...data].filter(h => h.revenue > 0).sort((a, b) => b.revenue - a.revenue).slice(0, 8);
  const max    = Math.max(...active.map(h => h.revenue));
  if (!active.length) return <p className="text-sm text-gray-400">No data yet</p>;
  const count  = (h: HourData) => h.jobs ?? h.orders ?? 0;
  const unit   = active[0]?.jobs !== undefined ? 'jobs' : 'orders';
  return (
    <div className="space-y-3">
      {active.map((h, i) => (
        <BarRow key={i} label={fmtHour(h.hour)} value={h.revenue} max={max}
          sub={`${fc(h.revenue)} · ${count(h)} ${unit}`} color={color} />
      ))}
    </div>
  );
}

function DailyChart({ data, color, countLabel }: {
  data: DailyTrend[]; color: string; countLabel: 'orders' | 'jobs';
}) {
  const max   = Math.max(...data.map(d => d.revenue));
  const count = (d: DailyTrend) => d.jobs ?? d.orders ?? 0;
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <BarRow key={i} label={d.label} value={d.revenue} max={max}
          sub={`${fc(d.revenue)} · ${count(d)} ${countLabel}`} color={color} />
      ))}
    </div>
  );
}

// ─── XEROX VIEW ───────────────────────────────────────────────────────────────
function XeroxView({ d, range }: { d: XeroxInsights; range: 'today' | 'week' | 'month' }) {
  const revenue = range === 'today' ? d.todayRevenue : range === 'week' ? d.weekRevenue : d.monthRevenue;
  const jobs    = range === 'today' ? d.todayJobs    : range === 'week' ? d.weekJobs    : d.monthJobs;
  const pages   = range === 'today' ? d.pagesToday   : range === 'week' ? d.pagesWeek   : d.pagesMonth;
  const totalAll = Object.values(d.jobsByStatus).reduce((s, v) => s + v, 0);

  const tips: { icon: string; title: string; body: string }[] = [];
  if (d.completionRate >= 90)
    tips.push({ icon: '🎯', title: 'Excellent Completion', body: `${d.completionRate}% jobs completed — customers love your speed.` });
  if (d.doublesidedRate > 40)
    tips.push({ icon: '♻️', title: 'Eco Usage High', body: `${d.doublesidedRate}% of jobs are double-sided. Great for cost-conscious customers.` });
  if (d.colorModeSplit.color > d.colorModeSplit.bw)
    tips.push({ icon: '🌈', title: 'Color Demand Dominant', body: 'Color is your top print type. Keep ink cartridges topped up.' });
  if (d.pendingJobs > 3)
    tips.push({ icon: '⚡', title: 'Queue Building Up', body: `${d.pendingJobs} jobs waiting. Process them to maintain satisfaction.` });
  if (d.avgJobValue > 0 && d.avgJobValue < 30)
    tips.push({ icon: '📈', title: 'Upsell Opportunity', body: `Avg job is ${fc(d.avgJobValue)}. Promote color or binding to increase value.` });
  if (d.topCustomers.length > 0 && d.topCustomers[0].count >= 3)
    tips.push({ icon: '⭐', title: 'Loyal Customer', body: `${d.topCustomers[0].name} placed ${d.topCustomers[0].count} jobs. Consider a loyalty discount.` });

  return (
    <div className="space-y-6">

      {/* KPI Row */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard emoji="💰" label="Revenue" value={fc(revenue)}
          sub={range === 'today' ? 'Today' : range === 'week' ? 'This Week' : 'This Month'}
          colorClass="bg-green-50 border-green-200 text-green-700" />
        <StatCard emoji="🖨️" label="Jobs Completed" value={jobs}
          sub={`Avg value ${fc(d.avgJobValue)}`}
          colorClass="bg-orange-50 border-orange-200 text-orange-600" />
        <StatCard emoji="📄" label="Pages Printed" value={pages}
          sub={`${d.avgPages.toFixed(1)} avg per job`}
          colorClass="bg-blue-50 border-blue-200 text-blue-600" />
      </div>

      {/* Job Status Board */}
      <Card>
        <SectionHeader emoji="📋" title="Job Status Board" />
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Queued',    value: d.jobsByStatus.queued,    c: 'bg-amber-50  border-amber-200  text-amber-700'  },
            { label: 'Printing',  value: d.jobsByStatus.printing,  c: 'bg-blue-50   border-blue-200   text-blue-700'   },
            { label: 'Done',      value: d.jobsByStatus.done,      c: 'bg-green-50  border-green-200  text-green-700'  },
            { label: 'Cancelled', value: d.jobsByStatus.cancelled, c: 'bg-red-50    border-red-200    text-red-700'    },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl border-2 py-5 text-center ${s.c}`}>
              <p className="text-4xl font-black">{s.value}</p>
              <p className="text-xs font-bold uppercase tracking-wider mt-2 opacity-70">{s.label}</p>
            </div>
          ))}
        </div>
        {totalAll > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl px-4 py-3 flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-500">Completion Rate</span>
              <span className="text-base font-black text-green-600">{d.completionRate}%</span>
            </div>
            <div className="bg-gray-50 rounded-xl px-4 py-3 flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-500">Total Paid Jobs</span>
              <span className="text-base font-black text-gray-800">{d.totalPaidJobs}</span>
            </div>
          </div>
        )}
      </Card>

      {/* Two-column: Color Split + Paper Size */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <SectionHeader emoji="🎨" title="Color Mode Split" />
          <SplitBar segments={[
            { label: 'B&W',       value: d.colorModeSplit.bw,        color: '#374151' },
            { label: 'Grayscale', value: d.colorModeSplit.grayscale, color: '#9CA3AF' },
            { label: 'Color',     value: d.colorModeSplit.color,     color: '#FF5A00' },
          ]} />
        </Card>
        {Object.keys(d.paperSizeSplit).length > 0 && (
          <Card>
            <SectionHeader emoji="📐" title="Paper Size Breakdown" />
            <div className="space-y-3">
              {Object.entries(d.paperSizeSplit).sort((a, b) => b[1] - a[1]).map(([size, count]) => (
                <BarRow key={size} label={size} value={count}
                  max={Math.max(...Object.values(d.paperSizeSplit))}
                  sub={`${count} jobs · ${pct(count, d.totalPaidJobs)}%`}
                  color="#6366F1" />
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Extra Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard emoji="🔄" label="Double-Sided"   value={`${d.doublesidedRate}%`}
          sub="of all jobs"         colorClass="bg-teal-50   border-teal-200   text-teal-700"   />
        <StatCard emoji="📌" label="Stapling Jobs"  value={d.staplingCount}
          sub="requests"           colorClass="bg-purple-50 border-purple-200 text-purple-600" />
        <StatCard emoji="📚" label="Binding Jobs"   value={d.bindingCount}
          sub="requests"           colorClass="bg-pink-50   border-pink-200   text-pink-600"   />
        <StatCard emoji="⏳" label="Pending Now"    value={d.pendingJobs}
          sub="queued + printing"  colorClass="bg-amber-50  border-amber-200  text-amber-700"  />
      </div>

      {/* Two-column: Daily Trend + Hourly */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <SectionHeader emoji="📈" title="7-Day Revenue Trend" />
          <DailyChart data={d.dailyTrend} color="#FF5A00" countLabel="jobs" />
        </Card>
        <Card>
          <SectionHeader emoji="⏰" title="Revenue by Hour" />
          <HourChart data={d.revenueByHour} color="#3B82F6" />
          {d.peakHours.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {d.peakHours.map((hr, i) => (
                <span key={i} className="px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-lg text-sm font-black text-orange-700">
                  🔥 {hr}
                </span>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Top Customers */}
      {d.topCustomers.length > 0 && (
        <Card>
          <SectionHeader emoji="👥" title="Top Customers" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {d.topCustomers.map((c, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.count} jobs placed</p>
                </div>
                <span className="text-base font-black text-green-600 flex-shrink-0">{fc(c.spent)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <SmartTips tips={tips} />
    </div>
  );
}

// ─── GROCERY VIEW ─────────────────────────────────────────────────────────────
function GroceryView({ d, range }: { d: GroceryInsights; range: 'today' | 'week' | 'month' }) {
  const revenue = range === 'today' ? d.todayRevenue : range === 'week' ? d.weekRevenue : d.monthRevenue;
  const orders  = range === 'today' ? d.todayOrders  : range === 'week' ? d.weekOrders  : d.monthOrders;

  const tips: { icon: string; title: string; body: string }[] = [];
  if (d.topSellingItems.length > 0)
    tips.push({ icon: '⭐', title: 'Best Seller', body: `${d.topSellingItems[0].name} leads with ${d.topSellingItems[0].quantity} units sold.` });
  if (d.avgBasketItems > 0 && d.avgBasketItems < 3)
    tips.push({ icon: '🛒', title: 'Basket Size Low', body: `Avg ${d.avgBasketItems.toFixed(1)} items/order. Try bundle deals.` });
  if (d.repeatCustomerRate > 20)
    tips.push({ icon: '💪', title: 'Strong Retention', body: `${d.repeatCustomerRate}% of customers are repeat buyers.` });
  if (d.completionRate < 80)
    tips.push({ icon: '⚠️', title: 'Completion Needs Work', body: `${d.completionRate}% orders completed. Review cancellation reasons.` });

  const bucketMax = Math.max(...Object.values(d.valueBuckets || {}));

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard emoji="💰" label="Revenue"     value={fc(revenue)}
          sub={range === 'today' ? 'Today' : range === 'week' ? 'This Week' : 'This Month'}
          colorClass="bg-green-50 border-green-200 text-green-700" />
        <StatCard emoji="🛒" label="Orders"      value={orders}
          sub={`Avg ${fc(d.avgOrderValue)}`}
          colorClass="bg-orange-50 border-orange-200 text-orange-600" />
        <StatCard emoji="✅" label="Success Rate" value={`${d.completionRate}%`}
          sub="orders completed"
          colorClass="bg-purple-50 border-purple-200 text-purple-600" />
        <StatCard emoji="🔁" label="Repeat Buyers" value={`${d.repeatCustomerRate}%`}
          sub={`Avg ${d.avgBasketItems.toFixed(1)} items/basket`}
          colorClass="bg-blue-50 border-blue-200 text-blue-600" />
      </div>

      {/* Two-column: Top Items + Revenue by Item */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {d.topSellingItems.length > 0 && (
          <Card>
            <SectionHeader emoji="🏆" title="Top Selling Items (by units)" />
            <RankedList
              items={d.topSellingItems.slice(0, 6).map(i => ({
                ...i, sub: `${i.quantity} units · ${fc(i.revenue)}`,
              }))}
              valueKey="quantity"
              subKey="sub"
              valueFormat={(v) => `${v} units`}
            />
          </Card>
        )}
        {d.topSellingItems.length > 0 && (
          <Card>
            <SectionHeader emoji="💵" title="Top Items by Revenue" />
            <div className="space-y-3">
              {[...d.topSellingItems].sort((a, b) => b.revenue - a.revenue).slice(0, 6).map((item, i) => (
                <BarRow key={i} label={item.name}
                  value={item.revenue}
                  max={Math.max(...d.topSellingItems.map(x => x.revenue))}
                  sub={fc(item.revenue)}
                  color={['#FF5A00','#10B981','#6366F1','#F59E0B','#EC4899','#14B8A6'][i % 6]} />
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Order Value Distribution */}
      {d.valueBuckets && (
        <Card>
          <SectionHeader emoji="💳" title="Order Value Distribution" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.entries(d.valueBuckets).map(([label, count]) => (
              <div key={label} className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-black text-gray-900">{count}</p>
                <p className="text-xs font-semibold text-gray-500 mt-1">{label}</p>
                <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#FF5A00] rounded-full"
                    style={{ width: `${bucketMax > 0 ? (count / bucketMax) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Top Customers */}
      {d.topSpendingCustomers?.length > 0 && (
        <Card>
          <SectionHeader emoji="👥" title="Top Spending Customers" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {d.topSpendingCustomers.map((c, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.count} orders</p>
                </div>
                <span className="text-base font-black text-green-600 flex-shrink-0">{fc(c.spent)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Two-column: Trend + Hourly */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <SectionHeader emoji="📈" title="7-Day Revenue Trend" />
          <DailyChart data={d.dailyTrend} color="#10B981" countLabel="orders" />
        </Card>
        <Card>
          <SectionHeader emoji="⏰" title="Busiest Hours" />
          <HourChart data={d.revenueByHour} color="#3B82F6" />
          {d.peakHours.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {d.peakHours.map((hr, i) => (
                <span key={i} className="px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-sm font-black text-green-700">
                  🔥 {hr}
                </span>
              ))}
            </div>
          )}
        </Card>
      </div>

      <SmartTips tips={tips} />
    </div>
  );
}

// ─── FOOD VIEW ────────────────────────────────────────────────────────────────
function FoodView({ d, range }: { d: FoodInsights; range: 'today' | 'week' | 'month' }) {
  const revenue = range === 'today' ? d.todayRevenue : range === 'week' ? d.weekRevenue : d.monthRevenue;
  const orders  = range === 'today' ? d.todayOrders  : range === 'week' ? d.weekOrders  : d.monthOrders;

  const tips: { icon: string; title: string; body: string }[] = [];
  if (d.completionRate >= 90)
    tips.push({ icon: '🎯', title: 'Excellent Completion', body: `${d.completionRate}% of orders fulfilled. Great kitchen efficiency!` });
  if (d.avgOrderValue > 0 && d.avgOrderValue < 100)
    tips.push({ icon: '📈', title: 'Combo Opportunity', body: `Avg order is ${fc(d.avgOrderValue)}. Bundle popular items to increase it.` });
  if (d.topSellingItems.length > 0)
    tips.push({ icon: '⭐', title: 'Bestseller Alert', body: `${d.topSellingItems[0].name} ordered ${d.topSellingItems[0].quantity} times. Always keep it available.` });
  if (d.pendingOrders > 5)
    tips.push({ icon: '⚠️', title: 'High Pending', body: `${d.pendingOrders} orders waiting. Peak hours may need extra staff.` });
  if (d.peakHours.length > 0)
    tips.push({ icon: '🔥', title: 'Prep Before Peak', body: `Busiest at ${d.peakHours[0]}. Pre-prep bestsellers before this hour.` });

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard emoji="💰" label="Revenue"     value={fc(revenue)}
          sub={range === 'today' ? 'Today' : range === 'week' ? 'This Week' : 'This Month'}
          colorClass="bg-green-50 border-green-200 text-green-700" />
        <StatCard emoji="🍽️" label="Orders"      value={orders}
          sub={`Avg ${fc(d.avgOrderValue)}`}
          colorClass="bg-orange-50 border-orange-200 text-orange-600" />
        <StatCard emoji="✅" label="Success Rate" value={`${d.completionRate}%`}
          sub="orders completed"
          colorClass="bg-purple-50 border-purple-200 text-purple-600" />
        <StatCard emoji="⏳" label="Pending Now"  value={d.pendingOrders}
          sub="active orders"
          colorClass="bg-amber-50 border-amber-200 text-amber-600" />
      </div>

      {/* Top Selling */}
      {d.topSellingItems.length > 0 && (
        <Card>
          <SectionHeader emoji="🏆" title="Top Selling Items" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
            {d.topSellingItems.slice(0, 8).map((item, i) => {
              const maxQ = Math.max(...d.topSellingItems.map(x => x.quantity));
              return (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0 bg-gradient-to-br ${
                    i === 0 ? 'from-orange-400 to-orange-600' :
                    i === 1 ? 'from-gray-400 to-gray-500' :
                    i === 2 ? 'from-amber-400 to-amber-600' : 'from-blue-400 to-blue-500'
                  }`}>{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-bold text-gray-900 truncate pr-2">{item.name}</p>
                      <span className="text-sm font-black text-green-600 flex-shrink-0">{fc(item.revenue)}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-orange-400 rounded-full"
                        style={{ width: `${pct(item.quantity, maxQ)}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{item.quantity} orders</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Two-column: Trend + Hourly */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <SectionHeader emoji="📈" title="7-Day Revenue Trend" />
          <DailyChart data={d.dailyTrend} color="#FF5A00" countLabel="orders" />
        </Card>
        <Card>
          <SectionHeader emoji="⏰" title="Busiest Hours" />
          <HourChart data={d.revenueByHour} color="#3B82F6" />
          {d.peakHours.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {d.peakHours.map((hr, i) => (
                <span key={i} className="px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-lg text-sm font-black text-orange-700">
                  🔥 {hr}
                </span>
              ))}
            </div>
          )}
        </Card>
      </div>

      <SmartTips tips={tips} />
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function InsightsPage() {
  const router = useRouter();
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [loading, setLoading]   = useState(true);
  const [vendorId, setVendorId] = useState('');
  const [range, setRange]       = useState<'today' | 'week' | 'month'>('today');

  useEffect(() => {
    const vid = localStorage.getItem('vendorId');
    if (!vid) { router.push('/vendor/dashboard'); return; }
    setVendorId(vid);
    fetchInsights(vid);
  }, []);

  const fetchInsights = async (vid: string) => {
    setLoading(true);
    try {
      const res  = await fetch(`/api/vendor/insights?vendorId=${vid}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setInsights(data);
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const META: Record<string, { emoji: string; label: string; grad: string }> = {
    'Xerox Shop':    { emoji: '🖨️', label: 'Print Analytics',  grad: 'from-[#FF5A00] to-orange-500' },
    'Grocery Store': { emoji: '🛒', label: 'Store Analytics',   grad: 'from-green-500 to-emerald-600' },
  };
  const meta = insights
    ? (META[insights.shopType] ?? { emoji: '🍽️', label: 'Sales Insights', grad: 'from-[#FF5A00] to-orange-500' })
    : { emoji: '📊', label: 'Analytics', grad: 'from-[#FF5A00] to-orange-500' };

  if (loading) return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 border-4 border-[#FF5A00] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 font-semibold">Loading analytics...</p>
      </div>
    </div>
  );

  if (!insights) return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <div className="text-6xl mb-5">📊</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data Yet</h2>
        <p className="text-gray-500 mb-8">Start processing orders to see analytics here.</p>
        <button onClick={() => router.push('/vendor/dashboard')}
          className="px-8 py-3 bg-[#FF5A00] text-white rounded-xl font-bold hover:bg-orange-600 transition text-base">
          Back to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans">

      {/* ── Sticky Header ── */}
      <div className={`bg-gradient-to-r ${meta.grad} text-white sticky top-0 z-50 shadow-lg`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-xl transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="text-center">
              <p className="text-xs font-semibold opacity-70">{insights.shopName}</p>
              <h1 className="text-xl font-black">{meta.emoji} {meta.label}</h1>
            </div>
            <button onClick={() => fetchInsights(vendorId)}
              className="w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-xl transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          {/* Range selector */}
          <div className="flex gap-2 bg-white/20 rounded-xl p-1 max-w-xs mx-auto">
            {(['today', 'week', 'month'] as const).map(r => (
              <button key={r} onClick={() => setRange(r)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${
                  range === r ? 'bg-white text-[#FF5A00]' : 'text-white hover:bg-white/10'
                }`}>
                {r === 'today' ? 'Today' : r === 'week' ? 'Week' : 'Month'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content — full width with max-w-7xl ── */}
      <div className="max-w-7xl mx-auto px-6 py-8 pb-16">
        {insights.shopType === 'Xerox Shop' ? (
          <XeroxView  d={insights as XeroxInsights}  range={range} />
        ) : insights.shopType === 'Grocery Store' ? (
          <GroceryView d={insights as GroceryInsights} range={range} />
        ) : (
          <FoodView   d={insights as FoodInsights}   range={range} />
        )}
      </div>
    </div>
  );
}