import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, Clock, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types d'alertes
type AlertStatus = 'pending' | 'inProgress' | 'resolved';
type AlertPriority = 'critical' | 'high' | 'medium' | 'low';

interface Alert {
  id: number;
  type: string;
  source: string;
  detectedAt: string;
  status: AlertStatus;
  priority: AlertPriority;
  assignee?: string;
  lastUpdated: string;
}

const DUMMY_ALERTS: Alert[] = [
  {
    id: 1,
    type: 'Numéro de Carte de Crédit',
    source: 'factures/2023/novembre.pdf',
    detectedAt: '2023-11-23',
    status: 'pending',
    priority: 'critical',
    lastUpdated: '2023-11-23',
  },
  {
    id: 2,
    type: 'Email',
    source: 'base-clients.xlsx',
    detectedAt: '2023-11-22',
    status: 'inProgress',
    priority: 'medium',
    assignee: 'Mohammed A.',
    lastUpdated: '2023-11-23',
  },
  {
    id: 3,
    type: 'Numéro de Téléphone',
    source: 'api/contacts',
    detectedAt: '2023-11-21',
    status: 'resolved',
    priority: 'low',
    assignee: 'Fatima B.',
    lastUpdated: '2023-11-22',
  },
  {
    id: 4,
    type: 'Numéro de Sécurité Sociale',
    source: 'ressources-humaines/employees.docx',
    detectedAt: '2023-11-20',
    status: 'pending',
    priority: 'high',
    lastUpdated: '2023-11-20',
  },
  {
    id: 5,
    type: 'Carte de Crédit',
    source: 'achats/octobre.pdf',
    detectedAt: '2023-11-19',
    status: 'resolved',
    priority: 'critical',
    assignee: 'Youssef C.',
    lastUpdated: '2023-11-21',
  },
];

const AlertesManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [alerts, setAlerts] = useState<Alert[]>(DUMMY_ALERTS);

  const updateAlertStatus = (id: number, newStatus: AlertStatus) => {
    setAlerts(alerts.map(alert => 
      alert.id === id 
        ? { ...alert, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] } 
        : alert
    ));
  };

  const renderStatusBadge = (status: AlertStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">En attente</Badge>;
      case 'inProgress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">En cours</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Résolu</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const renderPriorityBadge = (priority: AlertPriority) => {
    switch (priority) {
      case 'critical':
        return <Badge className="bg-red-500">Critique</Badge>;
      case 'high':
        return <Badge className="bg-orange-500">Élevé</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Moyen</Badge>;
      case 'low':
        return <Badge className="bg-green-500">Faible</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestion des Alertes</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
              <Input
                placeholder="Rechercher..." 
                className="pl-8 w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4 grid w-full grid-cols-4">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="inProgress">En cours</TabsTrigger>
              <TabsTrigger value="resolved">Résolues</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Date de détection</TableHead>
                    <TableHead>Priorité</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Assigné à</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>{alert.type}</TableCell>
                      <TableCell className="font-mono text-sm">{alert.source}</TableCell>
                      <TableCell>{alert.detectedAt}</TableCell>
                      <TableCell>{renderPriorityBadge(alert.priority)}</TableCell>
                      <TableCell>{renderStatusBadge(alert.status)}</TableCell>
                      <TableCell>{alert.assignee || '—'}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {alert.status === 'pending' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateAlertStatus(alert.id, 'inProgress')}
                            >
                              <Clock className="h-4 w-4 mr-1" />
                              Prendre en charge
                            </Button>
                          )}
                          {alert.status === 'inProgress' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                              onClick={() => updateAlertStatus(alert.id, 'resolved')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Marquer comme résolu
                            </Button>
                          )}
                          {alert.status === 'resolved' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="bg-yellow-50 text-yellow-600 hover:bg-yellow-100 hover:text-yellow-700"
                              onClick={() => updateAlertStatus(alert.id, 'pending')}
                            >
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              Réouvrir
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="pending">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Date de détection</TableHead>
                    <TableHead>Priorité</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.filter(a => a.status === 'pending').map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>{alert.type}</TableCell>
                      <TableCell className="font-mono text-sm">{alert.source}</TableCell>
                      <TableCell>{alert.detectedAt}</TableCell>
                      <TableCell>{renderPriorityBadge(alert.priority)}</TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateAlertStatus(alert.id, 'inProgress')}
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          Prendre en charge
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="inProgress">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Date de détection</TableHead>
                    <TableHead>Priorité</TableHead>
                    <TableHead>Assigné à</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.filter(a => a.status === 'inProgress').map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>{alert.type}</TableCell>
                      <TableCell className="font-mono text-sm">{alert.source}</TableCell>
                      <TableCell>{alert.detectedAt}</TableCell>
                      <TableCell>{renderPriorityBadge(alert.priority)}</TableCell>
                      <TableCell>{alert.assignee || '—'}</TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                          onClick={() => updateAlertStatus(alert.id, 'resolved')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Marquer comme résolu
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="resolved">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Date de résolution</TableHead>
                    <TableHead>Priorité</TableHead>
                    <TableHead>Résolu par</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.filter(a => a.status === 'resolved').map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>{alert.type}</TableCell>
                      <TableCell className="font-mono text-sm">{alert.source}</TableCell>
                      <TableCell>{alert.lastUpdated}</TableCell>
                      <TableCell>{renderPriorityBadge(alert.priority)}</TableCell>
                      <TableCell>{alert.assignee || '—'}</TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="bg-yellow-50 text-yellow-600 hover:bg-yellow-100 hover:text-yellow-700"
                          onClick={() => updateAlertStatus(alert.id, 'pending')}
                        >
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Réouvrir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertesManagement;
