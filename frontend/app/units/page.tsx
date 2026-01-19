import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { units } from '../../lib/mockData';

export default function UnitsPage() {
  return (
    <section>
      <div className="section-title">
        <h1>Units</h1>
        <Link href="/units/map" className="text-sm text-primary">
          View Unit Map
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Unit Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Area (sqm)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="font-medium">{unit.code}</TableCell>
                  <TableCell>{unit.floor}</TableCell>
                  <TableCell>{unit.type}</TableCell>
                  <TableCell>
                    <Badge variant={unit.status === 'Leased' ? 'default' : 'secondary'}>{unit.status}</Badge>
                  </TableCell>
                  <TableCell>{unit.area}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
