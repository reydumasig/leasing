import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { malls } from '../../lib/mockData';

export default function MallsPage() {
  return (
    <section>
      <div className="section-title">
        <h1>Malls</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Occupancy</TableHead>
                <TableHead>Total Units</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {malls.map((mall) => (
                <TableRow key={mall.id}>
                  <TableCell className="font-medium">{mall.name}</TableCell>
                  <TableCell>{mall.address}</TableCell>
                  <TableCell>{mall.occupancy}%</TableCell>
                  <TableCell>{mall.totalUnits}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
