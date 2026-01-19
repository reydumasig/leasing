"use client";

import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { renewalPipeline, renewals } from '../../lib/mockData';

type Pipeline = typeof renewalPipeline;

type DragState = {
  from: keyof Pipeline;
  id: string;
} | null;

export default function RenewalsPage() {
  const [pipeline, setPipeline] = useState<Pipeline>(renewalPipeline);
  const [dragState, setDragState] = useState<DragState>(null);

  const handleDragStart = (from: keyof Pipeline, id: string) => {
    setDragState({ from, id });
  };

  const handleDrop = (to: keyof Pipeline) => {
    if (!dragState) return;

    const { from, id } = dragState;
    if (from === to) return;

    const item = pipeline[from].find((entry) => entry.id === id);
    if (!item) return;

    setPipeline((prev) => ({
      ...prev,
      [from]: prev[from].filter((entry) => entry.id !== id),
      [to]: [...prev[to], item],
    }));

    setDragState(null);
  };

  return (
    <section>
      <div className="section-title">
        <h1>Lease Renewals</h1>
        <Button variant="outline">Create Renewal Pipeline</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {Object.entries(pipeline).map(([column, items]) => (
          <Card
            key={column}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => handleDrop(column as keyof Pipeline)}
          >
            <CardHeader>
              <CardTitle>{column}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-border bg-background p-3 cursor-move"
                    draggable
                    onDragStart={() => handleDragStart(column as keyof Pipeline, item.id)}
                  >
                    <p className="text-sm font-medium">{item.tenant}</p>
                    <p className="text-xs text-muted-foreground">Unit {item.unit}</p>
                    <p className="text-xs text-muted-foreground">Expires {item.expires}</p>
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="text-xs text-muted-foreground">Drop here</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Renewal Pipeline (Table)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renewals.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.tenant}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.expires}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.action}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
