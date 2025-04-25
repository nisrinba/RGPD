import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, Database, File, FileText, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const UploadAnalyse: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState('');

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const removeFile = (fileToRemove: File) => {
    setFiles(files.filter(file => file !== fileToRemove));
  };

  const startAnalysis = () => {
    setAnalyzing(true);
    setEstimatedTime('environ 2 minutes');
    
    // Simulate progress for demonstration
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setAnalysisProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setAnalyzing(false);
      }
    }, 150);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="fichiers">
        <TabsList className="mb-4">
          <TabsTrigger value="fichiers">Fichiers</TabsTrigger>
          <TabsTrigger value="base-de-donnees">Base de Données</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>
        
        <TabsContent value="fichiers">
          <Card>
            <CardHeader>
              <CardTitle>Téléchargement des Fichiers</CardTitle>
            </CardHeader>
            <CardContent>
              {!analyzing ? (
                <>
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors",
                      isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary",
                      files.length > 0 && "border-primary/30"
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      onChange={handleFileInput}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center">
                      <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                      <h3 className="text-lg font-medium mb-1">
                        Glissez-déposez vos fichiers ici
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        ou cliquez pour sélectionner des fichiers
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Formats supportés: PDF, DOC, DOCX, XLS, XLSX, CSV, TXT
                      </p>
                    </div>
                  </div>

                  {files.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Fichiers Sélectionnés ({files.length})</h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 text-blue-600 mr-2" />
                              <div>
                                <p className="text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeFile(file)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium">Analyse en cours...</p>
                      <span className="text-sm font-medium">{analysisProgress}%</span>
                    </div>
                    <Progress value={analysisProgress} className="h-2" />
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-md">
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        <File className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-900">Traitement des fichiers</p>
                        <p className="text-sm text-blue-700">
                          {files.length} fichiers en cours d'analyse
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Temps estimé restant: {estimatedTime}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Annuler</Button>
              <Button 
                onClick={startAnalysis} 
                disabled={files.length === 0 || analyzing}
              >
                {analyzing ? 'Analyse en cours...' : 'Démarrer l\'analyse'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="base-de-donnees">
          <Card>
            <CardHeader>
              <CardTitle>Connexion à une Base de Données</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <Database className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-1">Configure une connexion de base de données</h3>
                  <p className="text-sm text-muted-foreground">
                    Connectez-vous à MySQL, PostgreSQL, MongoDB et plus
                  </p>
                  <Button className="mt-4">Configurer la connexion</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default UploadAnalyse;
