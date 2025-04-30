import chardet
import pandas as pd
from PyPDF2 import PdfReader
from collections import Counter
from typing import Dict, List, Union
import logging
from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine
from presidio_anonymizer.entities import OperatorConfig

# Configuration du logger
logger = logging.getLogger(__name__)

# Initialisation des moteurs
analyzer = AnalyzerEngine()
anonymizer = AnonymizerEngine()

SUPPORTED_FILE_TYPES = {
    '.pdf': 'application/pdf',
    '.csv': 'text/csv',
    '.txt': 'text/plain'
}

def extract_text(file_path: str) -> str:
    """Extrait le texte d'un fichier PDF, CSV ou TXT."""
    try:
        if file_path.endswith('.pdf'):
            with open(file_path, 'rb') as f:
                reader = PdfReader(f)
                text = "\n".join(
                    page.extract_text() or '' 
                    for page in reader.pages
                )
        elif file_path.endswith('.csv'):
            df = pd.read_csv(file_path)
            text = df.to_string(index=False)
        elif file_path.endswith('.txt'):
            with open(file_path, 'rb') as f:
                raw_data = f.read()
                result = chardet.detect(raw_data)
                encoding = result['encoding'] or 'utf-8'
                text = raw_data.decode(encoding)
        else:
            raise ValueError(f"Format de fichier non supporté. Formats acceptés: {', '.join(SUPPORTED_FILE_TYPES.keys())}")
        
        if not text.strip():
            raise ValueError("Le fichier ne contient pas de texte lisible")
            
        return text
    
    except Exception as e:
        logger.error(f"Erreur lors de l'extraction du texte: {str(e)}")
        raise

def analyze_and_anonymize(file_path: str, operator: str = "mask") -> Dict[str, Union[str, List[Dict]]]:
    """
    Analyse et anonymise un fichier en utilisant Presidio.
    
    Args:
        file_path: Chemin vers le fichier à analyser
        operator: Type d'anonymisation ('mask', 'replace' ou 'redact')
    
    Returns:
        Dictionnaire contenant:
        - original_text: Texte original
        - anonymized_text: Texte anonymisé
        - entities: Liste des entités sensibles détectées
    """
    try:
        # Extraction du texte
        text = extract_text(file_path)
        
        # Analyse des entités sensibles
        analyzer_results = analyzer.analyze(
            text=text,
            language='fr',  # Modifié pour le français
            entities=["CREDIT_CARD", "EMAIL", "PHONE_NUMBER", "PERSON", "LOCATION"]
        )
        
        # Configuration de l'anonymisation
        operator_configs = {
            "mask": OperatorConfig(
                operator_name="mask",
                params={"masking_char": "*", "chars_to_mask": 4, "from_end": False}
            ),
            "replace": OperatorConfig(
                operator_name="replace",
                params={"new_value": "<SENSITIVE_DATA>"}
            ),
            "redact": OperatorConfig(operator_name="redact")
        }
        
        if operator not in operator_configs:
            raise ValueError(f"Opérateur invalide: {operator}. Options valides: mask, replace, redact")
        
        # Anonymisation
        anonymized_result = anonymizer.anonymize(
            text=text,
            analyzer_results=analyzer_results,
            operators={"DEFAULT": operator_configs[operator]}
        )
        
        # Génération des statistiques
        entity_counter = Counter(entity.entity_type for entity in analyzer_results)
        total_entities = sum(entity_counter.values())
        
        entities_stats = [
            {
                "entity_type": entity_type,
                "count": count,
                "percentage": (count / total_entities * 100) if total_entities > 0 else 0
            }
            for entity_type, count in entity_counter.items()
        ]
        
        return {
            "original_text": text,
            "anonymized_text": anonymized_result.text,
            "entities": entities_stats
        }
        
    except Exception as e:
        logger.error(f"Erreur lors de l'analyse/anonymisation: {str(e)}")
        raise