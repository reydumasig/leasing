import { notFound } from 'next/navigation';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { invoices } from '../../../lib/mockData';

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const invoice = invoices.find((item) => item.id === params.id);

  if (!invoice) {
    return notFound();
  }

  return (
    <section>
      <div className="section-title">
        <h1>Invoice Detail</h1>
        <Button variant="outline">Download PDF</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{invoice.id}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Tenant</p>
              <p className="text-lg font-medium">{invoice.tenant}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge>{invoice.status}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Period</p>
              <p>{invoice.period}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p>PHP {invoice.total.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
