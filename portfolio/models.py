from django.db import models
from django.core.files.storage import default_storage
from django.db.models.signals import post_delete
from django.dispatch import receiver
from parler.models import TranslatableModel, TranslatedFields


class PortfolioConfig(TranslatableModel):
    translations = TranslatedFields(
        nombre=models.CharField(max_length=100),
        rol=models.CharField(max_length=100),
        texto_presentacion=models.TextField(),
        sobre_mi_parrafo_1=models.TextField(),
        sobre_mi_parrafo_2=models.TextField(),
    )

    foto = models.ImageField(
        upload_to="portfolio/profile/",
        blank=True,
        null=True
    )

    video_hero = models.FileField(
        upload_to="portfolio/hero/",
        blank=True,
        null=True,
    )

    video_hero_mobile = models.FileField(
        upload_to="portfolio/hero/",
        blank=True,
        null=True,
    )

    class Meta:
        verbose_name = "Configuración del portfolio"
        verbose_name_plural = "Configuración del portfolio"

    def __str__(self):
        return self.safe_translation_getter(
            "nombre",
            any_language=True
        ) or "Portfolio"


class Technology(models.Model):
    LEVEL_CHOICES = [
        ("Básico", "Básico"),
        ("Intermedio", "Intermedio"),
        ("Avanzado", "Avanzado"),
    ]

    nombre = models.CharField(max_length=100)

    icono = models.ImageField(
        upload_to="portfolio/technologies/"
    )

    nivel = models.CharField(
        max_length=20,
        choices=LEVEL_CHOICES
    )

    orden = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["orden", "nombre"]
        verbose_name = "Tecnología"
        verbose_name_plural = "Tecnologías"

    def __str__(self):
        return self.nombre


class Category(TranslatableModel):
    translations = TranslatedFields(
        nombre=models.CharField(
            max_length=100,
            unique=True
        )
    )

    orden = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["orden"]
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"

    def __str__(self):
        return self.safe_translation_getter(
            "nombre",
            any_language=True
        ) or "Categoría"


class Project(TranslatableModel):
    categoria = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="projects"
    )

    translations = TranslatedFields(
        titulo=models.CharField(max_length=200),
        descripcion=models.TextField(),
    )

    miniatura = models.ImageField(
        upload_to="portfolio/projects/thumbnails/"
    )

    demo = models.URLField(
        blank=True
    )

    repositorio = models.URLField(
        blank=True
    )

    orden = models.PositiveIntegerField(default=0)

    technologies = models.ManyToManyField(
        Technology,
        related_name="projects",
        blank=True
    )

    class Meta:
        ordering = ["categoria__orden", "orden"]
        verbose_name = "Proyecto"
        verbose_name_plural = "Proyectos"

    def __str__(self):
        return self.safe_translation_getter(
            "titulo",
            any_language=True
        ) or "Proyecto"


class ProjectMedia(models.Model):
    proyecto = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="media"
    )

    archivo = models.FileField(
        upload_to="portfolio/projects/media/"
    )

    miniatura = models.ImageField(
        upload_to="portfolio/projects/video_thumbnails/",
        blank=True,
        null=True
    )

    orden = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["orden", "id"]
        verbose_name = "Archivo multimedia"
        verbose_name_plural = "Archivos multimedia"

    def __str__(self):
        return f"{self.proyecto} ({self.orden})"

    def save(self, *args, **kwargs):

        old_archivo = None
        old_miniatura = None

        if self.pk:

            try:
                old = ProjectMedia.objects.get(pk=self.pk)

                if old.archivo:
                    old_archivo = old.archivo.name

                if old.miniatura:
                    old_miniatura = old.miniatura.name

            except ProjectMedia.DoesNotExist:
                pass

        super().save(*args, **kwargs)

        # ----------------------------------------------
        # ELIMINAR ARCHIVO PRINCIPAL SUSTITUIDO
        # ----------------------------------------------

        if (
                old_archivo
                and old_archivo != self.archivo.name
        ):
            if not ProjectMedia.objects.filter(
                    archivo=old_archivo
            ).exclude(pk=self.pk).exists():
                default_storage.delete(old_archivo)

        # ----------------------------------------------
        # ELIMINAR MINIATURA SUSTITUIDA
        # ----------------------------------------------

        if (
                old_miniatura
                and old_miniatura != (
                self.miniatura.name
                if self.miniatura
                else None
        )
        ):
            if not ProjectMedia.objects.filter(
                    miniatura=old_miniatura
            ).exclude(pk=self.pk).exists():
                default_storage.delete(old_miniatura)


# ==================================================
# DELETE FILES WHEN PROJECT MEDIA IS DELETED
# ==================================================

@receiver(post_delete, sender=ProjectMedia)
def delete_project_media_files(
        sender,
        instance,
        **kwargs
):
    if instance.archivo:

        archivo = instance.archivo.name

        if not sender.objects.filter(
                archivo=archivo
        ).exists():
            default_storage.delete(archivo)

    if instance.miniatura:

        miniatura = instance.miniatura.name

        if not sender.objects.filter(
                miniatura=miniatura
        ).exists():
            default_storage.delete(miniatura)