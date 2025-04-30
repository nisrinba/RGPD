import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Loader2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import { uploadFile } from '@/services/api';

interface UploadedFile {
  file: File;
  preview: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
}

const UploadAnalyse: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [operator, setOperator] = useState<'mask' | 'replace' | 'redact'>('mask');
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'pending' as const
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    const uploadPromises = files.map(async (fileObj, index) => {
      try {
        setFiles(prev => {
          const updated = [...prev];
          updated[index] = { ...updated[index], status: 'uploading' };
          return updated;
        });

        // Simulation de progression (à remplacer par la vraie progression si votre API la supporte)
        for (let progress = 0; progress <= 90; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setFiles(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], progress };
            return updated;
          });
        }

        // Upload réel vers le backend
        const response = await uploadFile(fileObj.file, operator);
        
        setFiles(prev => {
          const updated = [...prev];
          updated[index] = { 
            ...updated[index], 
            progress: 100, 
            status: 'completed'
          };
          return updated;
        });

        return response.data;
      } catch (error) {
        setFiles(prev => {
          const updated = [...prev];
          updated[index] = { ...updated[index], status: 'error' };
          return updated;
        });
        throw error;
      }
    });

    try {
      await Promise.all(uploadPromises);
      toast({
        title: "Upload réussi",
        description: "Tous les fichiers ont été analysés avec succès",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erreur d'upload",
        description: "Certains fichiers n'ont pas pu être analysés",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Nettoyage des URLs de prévisualisation
  React.useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analyse de fichiers</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center">
              <Upload className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {isDragActive ? 'Déposez vos fichiers ici' : 'Glissez-déposez vos fichiers ou cliquez pour sélectionner'}
              </h3>
              <p className="text-sm text-muted-foreground">
                Formats supportés: PDF, DOC, DOCX, XLS, XLSX, CSV, TXT
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Taille maximale: 10MB par fichier
              </p>
            </div>
          </div>

          {files.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Fichiers sélectionnés ({files.length})</h4>
                <select
                  value={operator}
                  onChange={(e) => setOperator(e.target.value as 'mask' | 'replace' | 'redact')}
                  className="border rounded-md p-2 text-sm"
                  disabled={isUploading}
                >
                  <option value="mask">Masquage (****)</option>
                  <option value="replace">Remplacement (&lt;SENSITIVE_DATA&gt;)</option>
                  <option value="redact">Suppression complète</option>
                </select>
              </div>

              <div className="space-y-3">
                {files.map((fileObj, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium truncate max-w-[200px]">
                            {fileObj.file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        disabled={isUploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          {fileObj.status === 'completed' ? 'Analyse terminée' :
                           fileObj.status === 'uploading' ? 'Analyse en cours...' :
                           fileObj.status === 'error' ? 'Erreur' : 'En attente'}
                        </span>
                        <span>{fileObj.progress}%</span>
                      </div>
                      <Progress value={fileObj.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setFiles([])}
            disabled={files.length === 0 || isUploading}
          >
            Tout effacer
          </Button>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Analyser les fichiers
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UploadAnalyse;