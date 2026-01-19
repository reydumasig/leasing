import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { allocations } from '../../../lib/mockData';

export default function PaymentAllocationsPage() {
  return (
    <section>
      <div className="section-title">
        <h1>Payment Allocation</h1>
        <Button variant="outline">Allocate Payment</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Allocation Log</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Allocation</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allocations.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.paymentId}</TableCell>
                  <TableCell>{item.invoiceId}</TableCell>
                  <TableCell>PHP {item.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Applied</Badge>
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
