from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class AnalysisResult(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'En attente'
        PROCESSING = 'processing', 'En cours'
        COMPLETED = 'completed', 'Terminé'
        FAILED = 'failed', 'Échec'

    class OperatorType(models.TextChoices):
        MASK = 'mask', 'Masquage'
        REPLACE = 'replace', 'Remplacement'
        REDACT = 'redact', 'Suppression'

    file_name = models.CharField(max_length=255, verbose_name="Nom du fichier")
    file_size = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
        verbose_name="Taille du fichier (octets)"
    )
    upload_date = models.DateTimeField(auto_now_add=True, verbose_name="Date d'upload")
    analysis_date = models.DateTimeField(auto_now=True, verbose_name="Date d'analyse")
    original_text = models.TextField(verbose_name="Texte original")
    anonymized_text = models.TextField(verbose_name="Texte anonymisé")
    analysis_status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        verbose_name="Statut de l'analyse"
    )
    operator_type = models.CharField(
        max_length=20,
        choices=OperatorType.choices,
        default=OperatorType.MASK,
        verbose_name="Type d'opérateur"
    )

    class Meta:
        verbose_name = "Résultat d'analyse"
        verbose_name_plural = "Résultats d'analyse"
        ordering = ['-analysis_date']

    def __str__(self):
        return f"{self.file_name} ({self.get_analysis_status_display()})"

class EntityStatistic(models.Model):
    analysis = models.ForeignKey(
        AnalysisResult,
        on_delete=models.CASCADE,
        related_name='entity_statistics',
        verbose_name="Analyse associée"
    )
    entity_type = models.CharField(max_length=50, verbose_name="Type d'entité")
    count = models.PositiveIntegerField(verbose_name="Nombre d'occurrences")
    percentage = models.FloatField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name="Pourcentage"
    )

    class Meta:
        verbose_name = "Statistique d'entité"
        verbose_name_plural = "Statistiques d'entités"
        unique_together = ('analysis', 'entity_type')

    def __str__(self):
        return f"{self.entity_type} - {self.count} ({self.percentage}%)"