import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatCard from './StatCard';
import { Shield, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const typesData = [
  { name: 'Cartes de Crédit', value: 35, color: '#3b82f6' },
  { name: 'Emails', value: 25, color: '#10b981' },
  { name: 'Téléphones', value: 20, color: '#f59e0b' },
  { name: 'Séc. Sociale', value: 15, color: '#6366f1' },
  { name: 'Autres', value: 5, color: '#d1d5db' },
];

const risksData = [
  { category: 'Critique', value: 12 },
  { category: 'Élevé', value: 23 },
  { category: 'Moyen', value: 34 },
  { category: 'Faible', value: 45 },
];

const recentDetectionsData = [
  { id: 1, type: "Numéro de Carte de Crédit", source: "facture-2023.pdf", date: "2023-11-24", risk: "Critique" },
  { id: 2, type: "Email", source: "clients.xlsx", date: "2023-11-23", risk: "Moyen" },
  { id: 3, type: "Numéro de Téléphone", source: "contacts.csv", date: "2023-11-22", risk: "Faible" },
  { id: 4, type: "Sécurité Sociale", source: "employés.docx", date: "2023-11-21", risk: "Élevé" },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Données Sensibles" 
          value="324" 
          description="Détectées ce mois" 
          icon={<Shield className="h-6 w-6 text-blue-600" />}
          trend={{ value: 12, isPositive: false }}
        />
        <StatCard 
          title="Taux de Conformité" 
          value="76%" 
          description="RGPD et Loi 08-09" 
          icon={<CheckCircle className="h-6 w-6 text-green-600" />}
          trend={{ value: 4, isPositive: true }}
        />
        <StatCard 
          title="Alertes Actives" 
          value="18" 
          description="Nécessitant une action" 
          icon={<AlertTriangle className="h-6 w-6 text-amber-500" />}
        />
        <StatCard 
          title="Rapports Générés" 
          value="7" 
          description="Durant ce mois" 
          icon={<FileText className="h-6 w-6 text-indigo-600" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Types de Données Sensibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {typesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Niveau de Risque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={risksData}>
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Nombre de Détections" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détections Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Niveau de Risque</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentDetectionsData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.source}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      {
                        "bg-red-100 text-red-800": item.risk === "Critique",
                        "bg-orange-100 text-orange-800": item.risk === "Élevé",
                        "bg-yellow-100 text-yellow-800": item.risk === "Moyen",
                        "bg-green-100 text-green-800": item.risk === "Faible",
                      }
                    )}>
                      {item.risk}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
