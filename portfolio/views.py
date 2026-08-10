from django.shortcuts import render

from .models import Category, PortfolioConfig, Technology


def home(request):
    portfolio_config = (
        PortfolioConfig.objects
        .prefetch_related("translations")
        .first()
    )

    categories = (
        Category.objects
        .prefetch_related(
            "translations",
            "projects__translations",
            "projects__technologies",
            "projects__media",
        )
        .all()
    )

    projects_data = {}

    for category in categories:
        for project in category.projects.all():
            projects_data[project.id] = {
                "id": project.id,
                "title": project.titulo,
                "description": project.descripcion,
                "demo": project.demo,
                "repository": project.repositorio,

                "technologies": [
                    {
                        "name": technology.nombre,
                        "icon": technology.icono.url if technology.icono else ""
                    }
                    for technology in project.technologies.all()
                ],

                "media": [
                    {
                        "type": (
                            "video"
                            if media.archivo.name.lower().endswith(
                                (".mp4", ".webm", ".ogg")
                            )
                            else "image"
                        ),
                        "url": media.archivo.url,
                        "thumbnail": (media.miniatura.url if media.miniatura else media.archivo.url),
                    }
                    for media in project.media.all()
                ]
            }

    context = {
        "portfolio_config": portfolio_config,
        "categories": categories,
        "projects_json": projects_data,
    }

    return render(request, "portfolio/index.html", context)


def about(request):
    portfolio_config = PortfolioConfig.objects.prefetch_related("translations").first()

    technologies = Technology.objects.all()

    context = {
        "portfolio_config": portfolio_config,
        "technologies": technologies,
    }

    return render(request, "portfolio/about.html", context)


def contact(request):
    return render(request, "portfolio/contact.html")


