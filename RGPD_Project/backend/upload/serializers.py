import os
from rest_framework import serializers
from .models import AnalysisResult, EntityStatistic

class EntityStatisticSerializer(serializers.ModelSerializer):
    class Meta:
        model = EntityStatistic
        fields = ['entity_type', 'count', 'percentage']
        read_only_fields = ['entity_type', 'count', 'percentage']

class AnalysisResultSerializer(serializers.ModelSerializer):
    entities = EntityStatisticSerializer(many=True, read_only=True, source='entitystatistic_set')
    
    class Meta:
        model = AnalysisResult
        fields = [
            'id',
            'file_name',
            'file_size',
            'original_text',
            'anonymized_text',
            'analysis_date',
            'analysis_status',
            'operator_type',
            'entities'
        ]
        read_only_fields = [
            'id',
            'file_size',
            'analysis_date',
            'analysis_status',
            'entities'
        ]

class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField(required=True)
    operator = serializers.ChoiceField(
        choices=[
            ('mask', 'Masking'),
            ('remove', 'Removal'),
            ('replace', 'Replacement')
        ],
        required=False,
        default='mask'
    )

    def validate_file(self, value):
        """
        Validation personnalisée pour le fichier uploadé
        """
        # Vérification de la taille du fichier (ex: 10MB max)
        max_size = 10 * 1024 * 1024
        if value.size > max_size:
            raise serializers.ValidationError(f"File too large. Size should not exceed {max_size/1024/1024}MB.")
        
        # Vérification de l'extension
        valid_extensions = ['.pdf', '.doc', '.docx', '.txt']
        ext = os.path.splitext(value.name)[1]
        if ext.lower() not in valid_extensions:
            raise serializers.ValidationError(f"Unsupported file extension. Supported extensions: {', '.join(valid_extensions)}")
        
        return value