import { notFound } from 'next/navigation';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { leases } from '../../../lib/mockData';

export default function LeaseDetailPage({ params }: { params: { id: string } }) {
  const lease = leases.find((item) => item.id === params.id);

  if (!lease) {
    return notFound();
  }

  return (
    <section>
      <div className="section-title">
        <h1>Lease Detail</h1>
        <Button variant="outline">Amend Lease</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{lease.tenant}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Unit</p>
              <p className="text-lg font-medium">{lease.unit}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge>{lease.status}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p>{lease.start}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">End Date</p>
              <p>{lease.end}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Rent</p>
              <p>PHP {lease.rent.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
