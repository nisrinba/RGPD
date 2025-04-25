
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings, Shield, Lock, Bell, Database } from 'lucide-react';

const ConfigurationSettings: React.FC = () => {
  // Types de données sensibles
  const [dataTypes, setDataTypes] = useState({
    creditCard: true,
    email: true,
    phone: true,
    ssn: true,
    passport: false,
    address: false,
    name: false,
    bankAccount: true,
    ipAddress: false,
    medicalId: false
  });

  // Paramètres de notification
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    dashboardAlerts: true,
    criticalOnly: false,
    frequency: 'immediate' // 'immediate', 'daily', 'weekly'
  });

  // Paramètres du scanner
  const [scannerSettings, setScannnerSettings] = useState({
    scanDeep: true,
    scanArchives: true,
    scanImages: false,
    sensitivityLevel: 70 // 0 to 100
  });

  const handleDataTypeChange = (type: keyof typeof dataTypes) => {
    setDataTypes({
      ...dataTypes,
      [type]: !dataTypes[type]
    });
  };

  const handleNotificationChange = (setting: keyof typeof notificationSettings, value: unknown) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: value
    });
  };

  const handleScannerSettingChange = (setting: keyof typeof scannerSettings, value: unknown) => {
    setScannnerSettings({
      ...scannerSettings,
      [setting]: value
    });
  };

  const saveSettings = () => {
    console.log('Save settings:', {
      dataTypes,
      notificationSettings,
      scannerSettings
    });
    // Ici, on pourrait enregistrer les paramètres réels
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="detection">
            <TabsList className="mb-4 grid w-full grid-cols-3">
              <TabsTrigger value="detection">Types de Données</TabsTrigger>
              <TabsTrigger value="scanner">Paramètres du Scanner</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="detection">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Types de Données à Détecter</h3>
                <p className="text-sm text-muted-foreground">
                  Sélectionnez les types de données sensibles à rechercher lors de l'analyse.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="creditCard"
                      checked={dataTypes.creditCard}
                      onCheckedChange={() => handleDataTypeChange('creditCard')}
                    />
                    <Label htmlFor="creditCard">Numéros de Carte de Crédit</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="email"
                      checked={dataTypes.email}
                      onCheckedChange={() => handleDataTypeChange('email')}
                    />
                    <Label htmlFor="email">Adresses Email</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="phone"
                      checked={dataTypes.phone}
                      onCheckedChange={() => handleDataTypeChange('phone')}
                    />
                    <Label htmlFor="phone">Numéros de Téléphone</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ssn"
                      checked={dataTypes.ssn}
                      onCheckedChange={() => handleDataTypeChange('ssn')}
                    />
                    <Label htmlFor="ssn">Numéros de Sécurité Sociale</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="passport"
                      checked={dataTypes.passport}
                      onCheckedChange={() => handleDataTypeChange('passport')}
                    />
                    <Label htmlFor="passport">Numéros de Passeport</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="address"
                      checked={dataTypes.address}
                      onCheckedChange={() => handleDataTypeChange('address')}
                    />
                    <Label htmlFor="address">Adresses Postales</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="name"
                      checked={dataTypes.name}
                      onCheckedChange={() => handleDataTypeChange('name')}
                    />
                    <Label htmlFor="name">Noms et Prénoms</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="bankAccount"
                      checked={dataTypes.bankAccount}
                      onCheckedChange={() => handleDataTypeChange('bankAccount')}
                    />
                    <Label htmlFor="bankAccount">Coordonnées Bancaires</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ipAddress"
                      checked={dataTypes.ipAddress}
                      onCheckedChange={() => handleDataTypeChange('ipAddress')}
                    />
                    <Label htmlFor="ipAddress">Adresses IP</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="medicalId"
                      checked={dataTypes.medicalId}
                      onCheckedChange={() => handleDataTypeChange('medicalId')}
                    />
                    <Label htmlFor="medicalId">Identifiants Médicaux</Label>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline">
                    Ajouter un Type Personnalisé
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="scanner">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Paramètres du Scanner</h3>
                  <p className="text-sm text-muted-foreground">
                    Configurez les paramètres d'analyse pour optimiser les performances et la précision.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="scanDeep">Analyse Approfondie</Label>
                      <p className="text-sm text-muted-foreground">
                        Analyse le contenu des fichiers en profondeur (plus lent)
                      </p>
                    </div>
                    <Switch
                      id="scanDeep"
                      checked={scannerSettings.scanDeep}
                      onCheckedChange={(checked) => 
                        handleScannerSettingChange('scanDeep', checked)
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="scanArchives">Analyser les Archives</Label>
                      <p className="text-sm text-muted-foreground">
                        Décompresse et analyse les fichiers ZIP, RAR, etc.
                      </p>
                    </div>
                    <Switch
                      id="scanArchives"
                      checked={scannerSettings.scanArchives}
                      onCheckedChange={(checked) => 
                        handleScannerSettingChange('scanArchives', checked)
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="scanImages">OCR des Images</Label>
                      <p className="text-sm text-muted-foreground">
                        Utilise la reconnaissance de texte sur les images (lent)
                      </p>
                    </div>
                    <Switch
                      id="scanImages"
                      checked={scannerSettings.scanImages}
                      onCheckedChange={(checked) => 
                        handleScannerSettingChange('scanImages', checked)
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="sensitivity">Niveau de Sensibilité</Label>
                      <span className="text-sm">{scannerSettings.sensitivityLevel}%</span>
                    </div>
                    <Slider
                      id="sensitivity"
                      min={0}
                      max={100}
                      step={5}
                      value={[scannerSettings.sensitivityLevel]}
                      onValueChange={(value) => 
                        handleScannerSettingChange('sensitivityLevel', value[0])
                      }
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Moins de faux positifs</span>
                      <span>Détection maximale</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Paramètres de Notification</h3>
                  <p className="text-sm text-muted-foreground">
                    Configurez quand et comment vous souhaitez être notifié des données sensibles détectées.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailAlerts">Alertes par Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevoir des notifications par email
                      </p>
                    </div>
                    <Switch
                      id="emailAlerts"
                      checked={notificationSettings.emailAlerts}
                      onCheckedChange={(checked) => 
                        handleNotificationChange('emailAlerts', checked)
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dashboardAlerts">Alertes sur le Tableau de Bord</Label>
                      <p className="text-sm text-muted-foreground">
                        Afficher les notifications dans l'interface
                      </p>
                    </div>
                    <Switch
                      id="dashboardAlerts"
                      checked={notificationSettings.dashboardAlerts}
                      onCheckedChange={(checked) => 
                        handleNotificationChange('dashboardAlerts', checked)
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="criticalOnly">Alertes Critiques Uniquement</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifier uniquement pour les risques élevés
                      </p>
                    </div>
                    <Switch
                      id="criticalOnly"
                      checked={notificationSettings.criticalOnly}
                      onCheckedChange={(checked) => 
                        handleNotificationChange('criticalOnly', checked)
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Fréquence des Rapports</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={notificationSettings.frequency === 'immediate' ? 'default' : 'outline'}
                        className="w-full"
                        onClick={() => handleNotificationChange('frequency', 'immediate')}
                      >
                        Immédiat
                      </Button>
                      <Button
                        variant={notificationSettings.frequency === 'daily' ? 'default' : 'outline'}
                        className="w-full"
                        onClick={() => handleNotificationChange('frequency', 'daily')}
                      >
                        Quotidien
                      </Button>
                      <Button
                        variant={notificationSettings.frequency === 'weekly' ? 'default' : 'outline'}
                        className="w-full"
                        onClick={() => handleNotificationChange('frequency', 'weekly')}
                      >
                        Hebdomadaire
                      </Button>
                    </div>
                  </div>
                  
                  {notificationSettings.emailAlerts && (
                    <div className="space-y-2">
                      <Label htmlFor="email-recipients">Destinataires des Emails</Label>
                      <Input
                        id="email-recipients"
                        placeholder="email@exemple.com, autre@exemple.com"
                      />
                      <p className="text-xs text-muted-foreground">
                        Séparez plusieurs adresses email par des virgules
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Annuler</Button>
          <Button onClick={saveSettings}>Enregistrer les Modifications</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ConfigurationSettings;
