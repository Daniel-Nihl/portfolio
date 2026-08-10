from django.contrib import admin

from parler.admin import TranslatableAdmin

from .models import (
    PortfolioConfig,
    Technology,
    Category,
    Project,
    ProjectMedia
)


class ProjectMediaInline(admin.TabularInline):
    model = ProjectMedia
    extra = 0


@admin.register(PortfolioConfig)
class PortfolioConfigAdmin(TranslatableAdmin):
    list_display = (
        "nombre",
        "rol",
    )


@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
    list_display = (
        "nombre",
        "orden",
        "nivel",
    )

    list_editable = (
        "orden",
        "nivel",
    )

    ordering = (
        "orden",
        "nombre",
    )

    search_fields = (
        "nombre",
    )


@admin.register(Category)
class CategoryAdmin(TranslatableAdmin):
    list_display = (
        "nombre",
        "orden",
    )

    list_editable = (
        "orden",
    )

    ordering = (
        "orden",
    )

    search_fields = (
        "nombre",
    )


@admin.register(Project)
class ProjectAdmin(TranslatableAdmin):
    list_display = (
        "titulo",
        "categoria",
        "orden",
    )

    list_editable = (
        "orden",
    )

    ordering = (
        "categoria__orden",
        "orden",
    )

    search_fields = (
        "titulo",
        "descripcion",
    )

    list_filter = (
        "categoria",
    )

    filter_horizontal = (
        "technologies",
    )

    inlines = [
        ProjectMediaInline,
    ]


@admin.register(ProjectMedia)
class ProjectMediaAdmin(admin.ModelAdmin):
    list_display = (
        "proyecto",
        "orden",
    )

    list_editable = (
        "orden",
    )

    ordering = (
        "proyecto",
        "orden",
    )