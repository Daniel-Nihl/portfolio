from django.db import models

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