
import React from 'react';
import { Card } from '@/components/ui/card';

interface ResultsDisplayProps {
  results: Record<string, string[]>;
  isMasked: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, isMasked }) => {
  const hasResults = Object.keys(results).length > 0;

  if (!hasResults) return null;

  return (
    <Card className="p-6 bg-white shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Données Sensibles Détectées</h3>
      <div className="space-y-4">
        {Object.entries(results).map(([type, matches]) => (
          <div key={type} className="border-b pb-3 last:border-b-0">
            <h4 className="text-lg font-medium text-blue-600 mb-2">
              {type}
            </h4>
            <ul className="space-y-2">
              {matches.map((match, index) => (
                <li key={index} className="bg-gray-50 p-2 rounded">
                  {isMasked ? '*'.repeat(match.length) : match}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ResultsDisplay;
