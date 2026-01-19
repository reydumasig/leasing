import { notFound } from 'next/navigation';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { tenantComplianceTimeline, tenantDocuments, tenants } from '../../../lib/mockData';

export default function TenantDetailPage({ params }: { params: { id: string } }) {
  const tenant = tenants.find((item) => item.id === params.id);

  if (!tenant) {
    return notFound();
  }

  const documents = tenantDocuments[tenant.id] || [];
  const timeline = tenantComplianceTimeline[tenant.id] || [];

  return (
    <section>
      <div className="section-title">
        <h1>Tenant Profile</h1>
        <Button variant="outline">Edit Tenant</Button>
      </div>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{tenant.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">VAT Profile</p>
                <Badge>{tenant.vat}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Industry</p>
                <p>{tenant.industry}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact Email</p>
                <p>{tenant.contact}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p>{tenant.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Document Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.name} className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-sm">{doc.name}</span>
                  <Badge
                    variant={doc.status === 'Complete' ? 'default' : doc.status === 'Pending' ? 'secondary' : 'outline'}
                  >
                    {doc.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Compliance Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timeline.map((event) => (
              <div key={event.title} className="flex gap-4">
                <div className="mt-1 h-3 w-3 rounded-full bg-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                  <p className="font-medium">{event.title}</p>
                  <Badge variant={event.status === 'Done' ? 'default' : 'secondary'}>{event.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
