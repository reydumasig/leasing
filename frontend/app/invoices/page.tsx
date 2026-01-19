import Link from 'next/link';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { invoices } from '../../lib/mockData';

export default function InvoicesPage() {
  return (
    <section>
      <div className="section-title">
        <h1>Invoices</h1>
        <Button variant="outline">Generate Invoice</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Monthly Billing</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.tenant}</TableCell>
                  <TableCell>{invoice.period}</TableCell>
                  <TableCell>PHP {invoice.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={invoice.status === 'Issued' ? 'default' : 'secondary'}>{invoice.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/invoices/${invoice.id}`} className="text-primary text-sm">
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
