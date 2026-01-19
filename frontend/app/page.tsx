"use client";

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../components/ui/chart';
import { dashboard, revenueSeries } from '../lib/mockData';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

export default function Home() {
  return (
    <section>
      <div className="section-title">
        <h1>Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Occupancy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{dashboard.occupancy}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">PHP {dashboard.revenueThisMonth.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">PHP {dashboard.overdue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Leases Expiring</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{dashboard.leasesExpiring}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mt-8 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: { label: 'Revenue', color: 'var(--primary)' },
              }}
            >
              <AreaChart data={revenueSeries} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="revenue" stroke="var(--primary)" fill="var(--accent)" fillOpacity={0.5} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Focus Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>Renewals due within 90 days</li>
              <li>Partial payments to collect</li>
              <li>Available units for leasing</li>
              <li>Tenant compliance status</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
