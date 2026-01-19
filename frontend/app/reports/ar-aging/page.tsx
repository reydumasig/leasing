"use client";

import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../../components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { arAging, arAgingSummary } from '../../../lib/mockData';
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis } from 'recharts';

export default function ArAgingPage() {
  return (
    <section>
      <div className="section-title">
        <h1>AR Aging Report</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Aging Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                amount: { label: 'Amount', color: 'var(--primary)' },
              }}
            >
              <BarChart data={arAgingSummary} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="bucket" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="amount" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bucket Mix</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                amount: { label: 'Amount', color: 'var(--primary)' },
              }}
              className="aspect-square"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={arAgingSummary}
                  dataKey="amount"
                  nameKey="bucket"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  fill="var(--primary)"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Aging Buckets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Current</TableHead>
                <TableHead>0-30</TableHead>
                <TableHead>31-60</TableHead>
                <TableHead>61-90</TableHead>
                <TableHead>90+</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {arAging.map((row) => (
                <TableRow key={row.tenant}>
                  <TableCell className="font-medium">{row.tenant}</TableCell>
                  <TableCell>PHP {row.current.toLocaleString()}</TableCell>
                  <TableCell>PHP {row.days30.toLocaleString()}</TableCell>
                  <TableCell>PHP {row.days60.toLocaleString()}</TableCell>
                  <TableCell>PHP {row.days90.toLocaleString()}</TableCell>
                  <TableCell>PHP {row.days90plus.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
