FROM python:3.13.2-alpine AS base

COPY --from=ghcr.io/astral-sh/uv:0.6.16 /uv /uvx /bin/

WORKDIR /project/backend

RUN apk update && \
    apk upgrade

COPY ./pyproject.toml ./uv.lock ./

# ================================= #
#           DEVELOPMENT             #
# ================================= #
FROM base AS development

RUN uv sync --frozen --no-install-project

COPY . .

CMD ["sh", "-c", "uv run manage.py migrate && uv run manage.py runserver 0.0.0.0:8000"]
