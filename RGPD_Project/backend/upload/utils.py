
from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine
from presidio_anonymizer.entities import OperatorConfig

def analyze_and_anonymize(text, operator_type='mask'):
    # Initialisation des engines
    analyzer = AnalyzerEngine()
    anonymizer = AnonymizerEngine()

    # Analyse du texte
    results = analyzer.analyze(text=text, language='en')

    # Configuration de l'anonymisation
    operator_config = OperatorConfig(operator_type)
    
    # Anonymisation
    anonymized_result = anonymizer.anonymize(
        text=text,
        analyzer_results=results,
        operators={"DEFAULT": operator_config}
    )

    return anonymized_result.text