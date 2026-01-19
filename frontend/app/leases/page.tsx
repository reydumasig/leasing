import Link from 'next/link';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { leases } from '../../lib/mockData';

export default function LeasesPage() {
  return (
    <section>
      <div className="section-title">
        <h1>Leases</h1>
        <Button variant="outline">Create Lease</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Active Leases</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leases.map((lease) => (
                <TableRow key={lease.id}>
                  <TableCell className="font-medium">{lease.tenant}</TableCell>
                  <TableCell>{lease.unit}</TableCell>
                  <TableCell>{lease.start}</TableCell>
                  <TableCell>{lease.end}</TableCell>
                  <TableCell>
                    <Badge>{lease.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/leases/${lease.id}`} className="text-primary text-sm">
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
