# Mindful Healing Trips

Portail web officiel de Mindful Healing Trips - voyages bien-être, culture et
famille. Voir [`docs/assets/CLAUDE_ENGINEERING_CONTRACT.md`](docs/assets/CLAUDE_ENGINEERING_CONTRACT.md)
pour le contrat d'ingénierie de référence du projet, et
[`docs/ENGINEERING_DISCOVERY.md`](docs/ENGINEERING_DISCOVERY.md) pour l'état
des lieux initial du repository.

> **Statut** : Phase 1 (Foundation). Le stack technique, Docker, la base de
> données et la CI sont en place ; le design system complet et les pages
> publiques arrivent en Phase 2+.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript strict + React
- [Tailwind CSS](https://tailwindcss.com) (design tokens en `src/app/globals.css`)
- [Prisma ORM](https://www.prisma.io) v7 + PostgreSQL (driver adapter `@prisma/adapter-pg`)
- [Zod](https://zod.dev) pour la validation
- [Vitest](https://vitest.dev) (tests unitaires) + [Playwright](https://playwright.dev) (E2E)
- Docker / Docker Compose + [Taskfile](https://taskfile.dev)
- pnpm comme gestionnaire de paquets

## Prérequis

- [Docker](https://docs.docker.com/get-docker/) + Docker Compose
- [Task](https://taskfile.dev/installation/)
- [Node.js](https://nodejs.org) 22 LTS et [pnpm](https://pnpm.io/installation) (nécessaires uniquement pour les workflows exécutés hors conteneur, ex. `task lint` en local)

## Démarrage rapide

```bash
task setup   # installe les dépendances, démarre postgres+mailpit, migre, seed
task dev     # démarre l'app + postgres + mailpit (http://localhost:3000)
```

`task setup` est idempotent : le relancer ne casse pas l'environnement. Il
crée `.env.local` depuis `.env.example` s'il n'existe pas encore - voir ce
fichier pour la liste et la documentation de toutes les variables
d'environnement (aucun secret n'y est commité, voir `.gitignore`).

## Commandes disponibles

```bash
task setup            # environnement de zéro à fonctionnel
task dev               # démarrage local (app + postgres + mailpit)
task build              # build de production
task test                # tests unitaires (Vitest)
task lint                 # ESLint
task typecheck             # TypeScript strict (tsc --noEmit)
task format                # Prettier (écrit)
task format:check           # Prettier (vérifie sans écrire)
task db:migrate              # nouvelle migration Prisma (dev)
task db:seed                  # seed de la base de développement
task db:reset                  # reset complet de la base
task test:e2e                   # tests end-to-end (Playwright)
task ci                          # pipeline complète - doit être verte avant toute PR
task docker:build                  # build de l'image Docker de production
task docker:up                      # démarre la stack complète via Docker Compose
task docker:down                     # arrête la stack Docker Compose
task health                          # vérifie /api/health sur une instance démarrée
```

`task --list` affiche la liste à jour avec description.

## Tests

- **Unitaires** (`tests/unit/`) : logique métier, helpers - `task test`.
- **End-to-end** (`e2e/`) : parcours utilisateur avec Playwright, couvrant
  desktop et mobile - `task test:e2e` (build une version de production
  d'abord, puis lance le serveur standalone).

## Base de données

Le schéma est géré par Prisma (`prisma/schema.prisma`). Prisma ORM v7 exige
un driver adapter explicite pour PostgreSQL (`@prisma/adapter-pg`) - voir
[`ARCHITECTURE.md`](ARCHITECTURE.md) pour le détail. Le client généré
(`src/generated/prisma`) n'est jamais commité ; il est régénéré
automatiquement à l'installation (`postinstall`) et après chaque changement
de schéma.

```bash
task db:migrate   # créer/appliquer une migration en dev
task db:seed       # peupler la base de développement
task db:reset        # tout réinitialiser
```

## Docker

```bash
task docker:build   # image de production (multi-stage, sortie standalone)
task docker:up        # stack complète (app + postgres + mailpit)
task docker:down        # arrêt
```

`compose.yaml` est pour le développement local uniquement (hot reload,
identifiants de dev) - il ne construit pas l'image de production. Le
`Dockerfile` est celui utilisé pour un déploiement réel.

## CI locale avant toute Pull Request

```bash
task ci
```

reproduit exactement les étapes de
[`.github/workflows/ci.yml`](.github/workflows/ci.yml) : format, lint,
typecheck, tests unitaires, migrations, build, tests E2E. **Une Pull Request
ne doit jamais être ouverte si `task ci` échoue** - voir
[`CONTRIBUTING.md`](CONTRIBUTING.md).

## Documentation complémentaire

- [`ARCHITECTURE.md`](ARCHITECTURE.md) - choix techniques et raisons
- [`CONTRIBUTING.md`](CONTRIBUTING.md) - workflow Git et Definition of Done
- [`docs/assets/CLAUDE_ENGINEERING_CONTRACT.md`](docs/assets/CLAUDE_ENGINEERING_CONTRACT.md) - contrat d'ingénierie (source de vérité)
- [`docs/ENGINEERING_DISCOVERY.md`](docs/ENGINEERING_DISCOVERY.md) - état des lieux Phase 0
