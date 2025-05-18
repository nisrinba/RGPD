
import React, { useState } from 'react';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { scanForSensitiveData } from '../utils/scanner';
import ResultsDisplay from './ResultsDisplay';

const DataScanner = () => {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState<Record<string, string[]>>({});
  const [isMasked, setIsMasked] = useState(true);

  const handleScan = () => {
    const scanResults = scanForSensitiveData(inputText);
    setResults(scanResults);
  };

  const toggleMask = () => {
    setIsMasked(!isMasked);
  };

  const copyToClipboard = () => {
    let textToCopy = inputText;
    if (isMasked) {
      Object.values(results).flat().forEach(match => {
        textToCopy = textToCopy.replace(match, '*'.repeat(match.length));
      });
    }
    navigator.clipboard.writeText(textToCopy);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="p-6 bg-white shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold">Analyse Rapide</h2>
        </div>
        
        <div className="space-y-4">
          <Textarea
            placeholder="Collez votre texte ici pour l'analyser..."
            className="min-h-[200px] p-4 text-lg"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          
          <div className="flex gap-4">
            <Button 
              onClick={handleScan}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Analyser le Texte
            </Button>
            
            <Button
              onClick={toggleMask}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isMasked ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {isMasked ? 'Afficher' : 'Masquer'}
            </Button>
            
            <Button
              onClick={copyToClipboard}
              variant="outline"
            >
              Copier le Texte {isMasked ? 'Masqué' : 'Original'}
            </Button>
          </div>
        </div>
      </Card>

      <ResultsDisplay results={results} isMasked={isMasked} />
    </div>
  );
};

export default DataScanner;