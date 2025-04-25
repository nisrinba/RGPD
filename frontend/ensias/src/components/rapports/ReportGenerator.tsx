import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Calendar, Clock, FileCheck, Send } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ReportGenerator: React.FC = () => {
  const [selectedReportType, setSelectedReportType] = useState<string>('rgpd');
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf');
  
  const [sections, setSections] = useState({
    summary: true,
    detailedFindings: true,
    riskAnalysis: true,
    recommendations: true,
    complianceStatus: true,
    technicalDetails: false
  });

  const handleSectionToggle = (section: keyof typeof sections) => {
    setSections({
      ...sections,
      [section]: !sections[section]
    });
  };

  const generateReport = () => {
    console.log('Générer rapport:', {
      type: selectedReportType,
      format: selectedFormat,
      sections
    });
    // Ici, on pourrait implémenter la génération réelle du rapport
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Générateur de Rapports</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="generation">
            <TabsList className="mb-4 grid w-full grid-cols-2">
              <TabsTrigger value="generation">Générer un Rapport</TabsTrigger>
              <TabsTrigger value="schedule">Rapports Planifiés</TabsTrigger>
            </TabsList>
            
            <TabsContent value="generation">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="report-type">Type de Rapport</Label>
                  <Select
                    value={selectedReportType}
                    onValueChange={setSelectedReportType}
                  >
                    <SelectTrigger id="report-type">
                      <SelectValue placeholder="Sélectionnez un type de rapport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rgpd">Rapport de Conformité RGPD</SelectItem>
                      <SelectItem value="loi-08-09">Rapport Loi 08-09</SelectItem>
                      <SelectItem value="security">Rapport de Sécurité des Données</SelectItem>
                      <SelectItem value="executive">Rapport Exécutif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="report-format">Format de Sortie</Label>
                  <Select
                    value={selectedFormat}
                    onValueChange={setSelectedFormat}
                  >
                    <SelectTrigger id="report-format">
                      <SelectValue placeholder="Sélectionnez un format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="docx">Word (DOCX)</SelectItem>
                      <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label>Sections à Inclure</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="summary"
                        checked={sections.summary}
                        onCheckedChange={() => handleSectionToggle('summary')}
                      />
                      <Label htmlFor="summary">Résumé Exécutif</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="detailedFindings"
                        checked={sections.detailedFindings}
                        onCheckedChange={() => handleSectionToggle('detailedFindings')}
                      />
                      <Label htmlFor="detailedFindings">Résultats Détaillés</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="riskAnalysis"
                        checked={sections.riskAnalysis}
                        onCheckedChange={() => handleSectionToggle('riskAnalysis')}
                      />
                      <Label htmlFor="riskAnalysis">Analyse des Risques</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="recommendations"
                        checked={sections.recommendations}
                        onCheckedChange={() => handleSectionToggle('recommendations')}
                      />
                      <Label htmlFor="recommendations">Recommandations</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="complianceStatus"
                        checked={sections.complianceStatus}
                        onCheckedChange={() => handleSectionToggle('complianceStatus')}
                      />
                      <Label htmlFor="complianceStatus">Statut de Conformité</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="technicalDetails"
                        checked={sections.technicalDetails}
                        onCheckedChange={() => handleSectionToggle('technicalDetails')}
                      />
                      <Label htmlFor="technicalDetails">Détails Techniques</Label>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md">
                  <div className="flex items-start">
                    <FileText className="text-blue-600 h-5 w-5 mr-2 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900">Aperçu du Rapport</h4>
                      <p className="text-sm text-blue-700">
                        Le rapport inclura les données sensibles détectées dans les derniers scans, 
                        avec une analyse comparative et des recommandations personnalisées.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="schedule">
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="text-blue-600 h-5 w-5 mr-2" />
                        <div>
                          <h4 className="text-sm font-medium">Rapport Hebdomadaire RGPD</h4>
                          <p className="text-xs text-muted-foreground">Tous les lundis à 8:00</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">Modifier</Button>
                        <Button size="sm" variant="destructive">Supprimer</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar className="text-blue-600 h-5 w-5 mr-2" />
                        <div>
                          <h4 className="text-sm font-medium">Rapport Mensuel de Sécurité</h4>
                          <p className="text-xs text-muted-foreground">Le premier du mois à 9:00</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">Modifier</Button>
                        <Button size="sm" variant="destructive">Supprimer</Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-4">
                  <Clock className="mr-2 h-4 w-4" />
                  Planifier un Nouveau Rapport
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Annuler</Button>
          <div className="flex space-x-2">
            <Button variant="outline">
              <FileCheck className="mr-2 h-4 w-4" />
              Prévisualiser
            </Button>
            <Button variant="default" onClick={generateReport}>
              <Download className="mr-2 h-4 w-4" />
              Générer le Rapport
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ReportGenerator;
