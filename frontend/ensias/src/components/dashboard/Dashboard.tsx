import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, AlertTriangle, CheckCircle, FileText, Loader2, RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getDashboardData } from '@/services/api';

// Types
interface Entity {
  type: string;
  count: number;
  percentage: number;
}

interface Analysis {
  id: number;
  file_name: string;
  file_size: number;
  analysis_date: string;
  entities: Entity[];
}

interface DashboardData {
  total_analyses: number;
  sensitive_data_count: number;
  compliance_rate: number;
  active_alerts: number;
  recent_analyses: Analysis[];
  entity_stats: Entity[];
}

// Composant principal
const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDashboardData();
      setData(response.data);
    } catch (err) {
      setError('Échec du chargement des données. Veuillez réessayer.');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorDisplay error={error} onRetry={fetchData} />;
  if (!data) return <NoDataDisplay onRetry={fetchData} />;

  // Préparation des données
  const entityData = data.entity_stats.map(item => ({
    name: formatEntityType(item.type),
    value: item.count,
    color: getColorForEntity(item.type),
  }));

  const riskData = [
    { name: 'Élevé', value: data.entity_stats.filter(e => e.percentage > 10).length },
    { name: 'Moyen', value: data.entity_stats.filter(e => e.percentage > 5 && e.percentage <= 10).length },
    { name: 'Faible', value: data.entity_stats.filter(e => e.percentage <= 5).length },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tableau de bord RGPD</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Cartes de statistiques */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Analyses effectuées" 
            value={data.total_analyses} 
            icon={<FileText className="text-blue-500" />}
            trend={{ value: 12, direction: 'up' }}
          />
          <StatCard 
            title="Données sensibles" 
            value={data.sensitive_data_count} 
            icon={<Shield className="text-green-500" />}
          />
          <StatCard 
            title="Taux de conformité" 
            value={`${data.compliance_rate}%`} 
            icon={<CheckCircle className="text-emerald-500" />}
          />
          <StatCard 
            title="Alertes actives" 
            value={data.active_alerts} 
            icon={<AlertTriangle className="text-amber-500" />}
          />
        </div>

        {/* Graphiques */}
        <div className="grid gap-4 md:grid-cols-2">
          <ChartCard title="Types de données sensibles">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={entityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {entityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  content={<CustomTooltip active={undefined} payload={undefined} label={undefined} />}
                  formatter={(value: number) => [`${value} occurrences`, '']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Niveaux de risque">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip active={undefined} payload={undefined} label={undefined} />} />
                <Bar 
                  dataKey="value" 
                  name="Nombre de types" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Dernières analyses */}
        <Card>
          <CardHeader>
            <CardTitle>Dernières analyses</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Fichier</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Données sensibles</TableHead>
                  <TableHead className="text-right">Taille</TableHead>
                  <TableHead>Risque</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.recent_analyses.map((analysis) => (
                  <TableRow key={analysis.id}>
                    <TableCell className="font-medium truncate max-w-[200px]">
                      {analysis.file_name}
                    </TableCell>
                    <TableCell>
                      {new Date(analysis.analysis_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {analysis.entities.slice(0, 3).map((entity, i) => (
                          <span 
                            key={i}
                            className="text-xs px-2 py-1 rounded-full"
                            style={{ 
                              backgroundColor: `${getColorForEntity(entity.type)}20`,
                              color: getColorForEntity(entity.type)
                            }}
                          >
                            {formatEntityType(entity.type)}
                          </span>
                        ))}
                        {analysis.entities.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{analysis.entities.length - 3}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {(analysis.file_size / 1024).toFixed(2)} KB
                    </TableCell>
                    <TableCell>
                      <RiskBadge risk={getRiskLevel(analysis.entities)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Composants utilitaires
const StatCard = ({ 
  title, 
  value, 
  icon,
  trend 
}: { 
  title: string; 
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; direction: 'up' | 'down' };
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <div className="flex flex-col items-end">
          <div className="p-3 rounded-full bg-primary/10">{icon}</div>
          {trend && (
            <span className={`text-xs mt-1 ${
              trend.direction === 'up' ? 'text-green-500' : 'text-red-500'
            }`}>
              {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
            </span>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const RiskBadge = ({ risk }: { risk: string }) => {
  const riskClasses = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800',
  };

  return (
    <span className={cn(
      "px-2 py-1 rounded-full text-xs font-medium",
      riskClasses[risk as keyof typeof riskClasses] || 'bg-gray-100'
    )}>
      {risk.charAt(0).toUpperCase() + risk.slice(1)}
    </span>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white p-4 border rounded-lg shadow-sm">
      <p className="font-medium">{label}</p>
      <p className="text-sm">
        <span className="text-muted-foreground">Valeur :</span> {payload[0].value}
      </p>
      {payload[0].payload.percentage && (
        <p className="text-sm">
          <span className="text-muted-foreground">Pourcentage :</span> {payload[0].payload.percentage.toFixed(1)}%
        </p>
      )}
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="space-y-6 p-6">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6 h-[100px] animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      {[...Array(2)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </CardHeader>
          <CardContent className="h-[300px] animate-pulse">
            <div className="h-full bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      ))}
    </div>
    <Card>
      <CardHeader>
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] bg-gray-200 rounded animate-pulse"></div>
      </CardContent>
    </Card>
  </div>
);

const ErrorDisplay = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center h-64 space-y-4">
    <AlertTriangle className="h-12 w-12 text-red-500" />
    <p className="text-red-500 text-center max-w-md">{error}</p>
    <Button variant="outline" onClick={onRetry}>
      Réessayer
    </Button>
  </div>
);

const NoDataDisplay = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center h-64 space-y-4">
    <FileText className="h-12 w-12 text-gray-400" />
    <p className="text-gray-500 text-center">Aucune donnée disponible</p>
    <Button variant="outline" onClick={onRetry}>
      Actualiser
    </Button>
  </div>
);

// Utilitaires
const formatEntityType = (type: string): string => {
  const types: Record<string, string> = {
    'CREDIT_CARD': 'Carte bancaire',
    'EMAIL': 'Email',
    'PHONE_NUMBER': 'Téléphone',
    'US_SSN': 'Numéro SSN',
    'IBAN_CODE': 'IBAN',
    'PERSON': 'Personne',
    'LOCATION': 'Localisation',
  };
  return types[type] || type;
};

const getColorForEntity = (type: string): string => {
  const colors: Record<string, string> = {
    'CREDIT_CARD': '#ef4444',
    'EMAIL': '#3b82f6',
    'PHONE_NUMBER': '#10b981',
    'US_SSN': '#f59e0b',
    'IBAN_CODE': '#6366f1',
    'PERSON': '#8b5cf6',
    'LOCATION': '#ec4899',
  };
  return colors[type] || '#9ca3af';
};

const getRiskLevel = (entities: Entity[]): string => {
  const maxPercentage = Math.max(...entities.map(e => e.percentage));
  if (maxPercentage > 10) return 'high';
  if (maxPercentage > 5) return 'medium';
  return 'low';
};

export default Dashboard;