"use client";

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { unitMapByFloor } from '../../../lib/mockData';

const statusStyles: Record<string, string> = {
  Available: 'bg-green-100 text-green-800 border-green-200',
  Leased: 'bg-blue-100 text-blue-800 border-blue-200',
  Reserved: 'bg-amber-100 text-amber-800 border-amber-200',
};

const floors = ['Ground', 'Second', 'Third'];
const statuses = ['All', 'Available', 'Leased', 'Reserved'] as const;

type StatusFilter = (typeof statuses)[number];

export default function UnitMapPage() {
  const [activeFloor, setActiveFloor] = useState<string>('Ground');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const units = useMemo(() => {
    const list = unitMapByFloor[activeFloor] || [];
    if (statusFilter === 'All') return list;
    return list.filter((unit) => unit.status === statusFilter);
  }, [activeFloor, statusFilter]);

  return (
    <section>
      <div className="section-title">
        <h1>Unit Availability Map</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Floor View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {floors.map((floor) => (
              <Button
                key={floor}
                variant={activeFloor === floor ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFloor(floor)}
              >
                {floor}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {statuses.map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mb-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className={`inline-block h-3 w-3 rounded-full border ${statusStyles.Available}`} />
              Available
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-block h-3 w-3 rounded-full border ${statusStyles.Leased}`} />
              Leased
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-block h-3 w-3 rounded-full border ${statusStyles.Reserved}`} />
              Reserved
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {units.map((unit) => (
              <div key={unit.id} className="border border-border rounded-lg p-3">
                <p className="text-sm font-medium">{unit.id}</p>
                <Badge className={statusStyles[unit.status]}>{unit.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
