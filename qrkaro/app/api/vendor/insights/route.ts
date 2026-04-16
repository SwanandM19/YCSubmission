import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';
import PrintJob from '@/lib/models/PrintJob';
import Vendor from '@/lib/models/Vendor';

const fmtHour = (h: number) =>
  h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`;

const sumAmount = (arr: any[]) =>
  arr.reduce((s, r) => s + (r.totalAmount || 0), 0);

const countPages = (jobs: any[]) =>
  jobs.reduce((s, j) => s + (j.pageCount || 0) * (j.copies || 1), 0);

const buildDailyTrend = (records: any[], now: Date, countField: 'jobs' | 'orders') => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const dayEnd   = dayStart + 86400000;
    const dayItems = records.filter(r => {
      const t = new Date(r.createdAt).getTime();
      return t >= dayStart && t < dayEnd;
    });
    const entry: any = {
      label:   d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
      revenue: sumAmount(dayItems),
      [countField]: dayItems.length,
    };
    if (countField === 'jobs') entry.pages = countPages(dayItems);
    return entry;
  });
};

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const vendorId = new URL(req.url).searchParams.get('vendorId');
    if (!vendorId)
      return NextResponse.json({ error: 'Vendor ID required' }, { status: 400 });

    const vendor = await Vendor.findOne({ vendorId });
    if (!vendor)
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

    const shopType: string = vendor.shopType;
    const now        = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart  = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // ─────────────────────────────────────────────────────────────────
    // XEROX SHOP
    // ─────────────────────────────────────────────────────────────────
    if (shopType === 'Xerox Shop') {
      const all  = await PrintJob.find({ vendorId }).sort({ createdAt: -1 });
      const paid = all.filter(j => j.paymentStatus === 'paid');

      const inRange = (jobs: any[], from: Date) =>
        jobs.filter(j => new Date(j.createdAt) >= from);

      const todayPaid = inRange(paid, todayStart);
      const weekPaid  = inRange(paid, weekStart);
      const monthPaid = inRange(paid, monthStart);

      // Revenue
      const todayRevenue = sumAmount(todayPaid);
      const weekRevenue  = sumAmount(weekPaid);
      const monthRevenue = sumAmount(monthPaid);
      const avgJobValue  = paid.length > 0 ? sumAmount(paid) / paid.length : 0;

      // Job status counts
      const jobsByStatus = {
        queued:    all.filter(j => j.printStatus === 'queued').length,
        printing:  all.filter(j => j.printStatus === 'printing').length,
        done:      all.filter(j => j.printStatus === 'done').length,
        cancelled: all.filter(j => j.printStatus === 'cancelled').length,
      };

      // Color mode split
      const colorModeSplit = { bw: 0, color: 0, grayscale: 0 };
      paid.forEach(j => {
        const m = j.colorMode || (j.printType === 'color' ? 'color' : 'bw');
        if (m === 'color') colorModeSplit.color++;
        else if (m === 'grayscale') colorModeSplit.grayscale++;
        else colorModeSplit.bw++;
      });

      // Pages
      const pagesToday = countPages(todayPaid);
      const pagesWeek  = countPages(weekPaid);
      const pagesMonth = countPages(monthPaid);
      const avgPages   = paid.length > 0
        ? paid.reduce((s, j) => s + (j.pageCount || 0), 0) / paid.length
        : 0;

      // Double-sided rate
      const doublesidedRate = paid.length > 0
        ? Math.round((paid.filter(j => j.doubleSided).length / paid.length) * 100)
        : 0;

      // Paper size split
      const paperSizeSplit: Record<string, number> = {};
      paid.forEach(j => {
        const s = j.paperSize || 'A4';
        paperSizeSplit[s] = (paperSizeSplit[s] || 0) + 1;
      });

      // Top customers
      const xeroxCustMap: Record<string, { count: number; spent: number }> = {};
      paid.forEach(j => {
        const name = j.customerName || 'Walk-in';
        if (!xeroxCustMap[name]) xeroxCustMap[name] = { count: 0, spent: 0 };
        xeroxCustMap[name].count++;
        xeroxCustMap[name].spent += j.totalAmount || 0;
      });
      const topCustomers = Object.entries(xeroxCustMap)
        .map(([name, d]) => ({ name, ...d }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Revenue by hour
      const xeroxRevenueByHour = Array.from({ length: 24 }, (_, h) => ({
        hour: h,
        revenue: 0,
        jobs: 0,
      }));
      paid.forEach(j => {
        const h = new Date(j.createdAt).getHours();
        xeroxRevenueByHour[h].revenue += j.totalAmount || 0;
        xeroxRevenueByHour[h].jobs++;
      });

      // Peak hours
      const peakHours = [...xeroxRevenueByHour]
        .filter(h => h.revenue > 0)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 3)
        .map(h => fmtHour(h.hour));

      // Completion rate
      const completionRate = all.length > 0
        ? Math.round((jobsByStatus.done / all.length) * 100)
        : 0;

      // 7-day trend
      const dailyTrend = buildDailyTrend(paid, now, 'jobs');

      return NextResponse.json({
        shopType,
        shopName:      vendor.shopName,
        todayRevenue,  weekRevenue,   monthRevenue,
        todayJobs:     todayPaid.length,
        weekJobs:      weekPaid.length,
        monthJobs:     monthPaid.length,
        totalPaidJobs: paid.length,
        avgJobValue,   avgPages,      doublesidedRate,
        pagesToday,    pagesWeek,     pagesMonth,
        colorModeSplit, jobsByStatus, paperSizeSplit,
        topCustomers,
        revenueByHour: xeroxRevenueByHour,
        peakHours,     dailyTrend,   completionRate,
        pendingJobs:   jobsByStatus.queued + jobsByStatus.printing,
        staplingCount: paid.filter(j => j.stapling).length,
        bindingCount:  paid.filter(j => j.binding).length,
      });
    }

    // ─────────────────────────────────────────────────────────────────
    // FOOD STALL & GROCERY — both use Order model
    // ─────────────────────────────────────────────────────────────────
    const all    = await Order.find({ vendorId }).sort({ createdAt: -1 });
    const active = all.filter(o => o.status !== 'cancelled');

    const inRange = (orders: any[], from: Date) =>
      orders.filter(o => new Date(o.createdAt) >= from);

    const todayActive = inRange(active, todayStart);
    const weekActive  = inRange(active, weekStart);
    const monthActive = inRange(active, monthStart);

    const todayRevenue  = sumAmount(todayActive);
    const weekRevenue   = sumAmount(weekActive);
    const monthRevenue  = sumAmount(monthActive);
    const avgOrderValue = active.length > 0 ? sumAmount(active) / active.length : 0;

    // Top selling items
    const itemMap: Record<string, { quantity: number; revenue: number }> = {};
    active.forEach(order => {
      (order.items || []).forEach((item: any) => {
        if (!itemMap[item.name]) itemMap[item.name] = { quantity: 0, revenue: 0 };
        itemMap[item.name].quantity += item.quantity;
        itemMap[item.name].revenue  += item.quantity * item.price;
      });
    });
    const topSellingItems = Object.entries(itemMap)
      .map(([name, d]) => ({ name, ...d }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    // Revenue by hour
    const revenueByHour = Array.from({ length: 24 }, (_, h) => ({
      hour: h,
      revenue: 0,
      orders: 0,
    }));
    active.forEach(o => {
      const h = new Date(o.createdAt).getHours();
      revenueByHour[h].revenue += o.totalAmount || 0;
      revenueByHour[h].orders++;
    });

    // Peak hours
    const peakHours = [...revenueByHour]
      .filter(h => h.revenue > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3)
      .map(h => fmtHour(h.hour));

    // 7-day trend
    const dailyTrend = buildDailyTrend(active, now, 'orders');

    // Completion rate
    const completedCount = all.filter(o => o.status === 'completed').length;
    const completionRate = all.length > 0
      ? Math.round((completedCount / all.length) * 100)
      : 0;

    // Pending orders
    const pendingOrders = all.filter(o =>
      o.status === 'pending' || o.status === 'preparing'
    ).length;

    // ── FOOD — return early ─────────────────────────────────────────
    if (shopType !== 'Grocery Store') {
      return NextResponse.json({
        shopType,
        shopName: vendor.shopName,
        todayRevenue,  weekRevenue,  monthRevenue,
        todayOrders:   todayActive.length,
        weekOrders:    weekActive.length,
        monthOrders:   monthActive.length,
        avgOrderValue, topSellingItems,
        revenueByHour, peakHours,   dailyTrend,
        completionRate, pendingOrders,
      });
    }

    // ── GROCERY EXTRAS ──────────────────────────────────────────────

    // Avg basket size
    const avgBasketItems = active.length > 0
      ? active.reduce((s, o) => s + (o.items?.length || 0), 0) / active.length
      : 0;

    // Repeat customer rate by phone
    const phoneCounts: Record<string, number> = {};
    active.forEach(o => {
      if (o.customerPhone) {
        phoneCounts[o.customerPhone] = (phoneCounts[o.customerPhone] || 0) + 1;
      }
    });
    const uniquePhones       = Object.keys(phoneCounts).length;
    const repeatPhones       = Object.values(phoneCounts).filter(c => c > 1).length;
    const repeatCustomerRate = uniquePhones > 0
      ? Math.round((repeatPhones / uniquePhones) * 100)
      : 0;

    // Top spending customers by name
    const groceryCustMap: Record<string, { count: number; spent: number }> = {};
    active.forEach(o => {
      const name = o.customerName;
      if (!name) return;
      if (!groceryCustMap[name]) groceryCustMap[name] = { count: 0, spent: 0 };
      groceryCustMap[name].count++;
      groceryCustMap[name].spent += o.totalAmount || 0;
    });
    const topSpendingCustomers = Object.entries(groceryCustMap)
      .map(([name, d]) => ({ name, ...d }))
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 5);

    // Order value distribution buckets
    const valueBuckets = {
      'Under ₹100':  active.filter(o => o.totalAmount < 100).length,
      '₹100–₹300':  active.filter(o => o.totalAmount >= 100 && o.totalAmount < 300).length,
      '₹300–₹500':  active.filter(o => o.totalAmount >= 300 && o.totalAmount < 500).length,
      'Above ₹500': active.filter(o => o.totalAmount >= 500).length,
    };

    return NextResponse.json({
      shopType,
      shopName: vendor.shopName,
      todayRevenue,  weekRevenue,  monthRevenue,
      todayOrders:   todayActive.length,
      weekOrders:    weekActive.length,
      monthOrders:   monthActive.length,
      avgOrderValue, topSellingItems,
      revenueByHour, peakHours,   dailyTrend,
      completionRate, pendingOrders,
      avgBasketItems,
      repeatCustomerRate,
      topSpendingCustomers,
      valueBuckets,
    });

  } catch (error: any) {
    console.error('❌ Insights API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}