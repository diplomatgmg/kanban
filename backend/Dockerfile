FROM python:3.13.2-alpine AS base

ENV PATH="/project/backend/.venv/bin:$PATH" \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

COPY --from=ghcr.io/astral-sh/uv:0.6.16 /uv /uvx /bin/

WORKDIR /project/backend

RUN apk update && \
    apk upgrade

COPY ./pyproject.toml ./uv.lock ./

# ================================= #
#           DEVELOPMENT             #
# ================================= #
FROM base AS development

RUN uv sync --no-install-project

COPY . .

CMD uv run manage.py runserver 0.0.0.0:8000
