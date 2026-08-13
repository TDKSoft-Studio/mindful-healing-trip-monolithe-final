# Engineering Discovery Report — Mindful Healing Trips

**Date :** 2026-08-13
**Auteur :** Claude (Senior Staff Software Engineer / Tech Lead role, per `CLAUDE_ENGINEERING_CONTRACT.md`)
**Contrat de référence :** `docs/assets/CLAUDE_ENGINEERING_CONTRACT.md`
**Portée :** Phase 0 — Discovery uniquement. Aucun code applicatif n'a été écrit ou modifié.

---

## 0. Contradiction signalée avant toute chose

**Ce qui existe actuellement :** le fichier `CLAUDE_ENGINEERING_CONTRACT.md` référencé par la consigne de tâche se trouve en réalité à `docs/assets/CLAUDE_ENGINEERING_CONTRACT.md`, et non à la racine du repository.

**Ce que demande le contrat :** le contrat ne prescrit lui-même aucun emplacement obligatoire pour son propre fichier — il ne figure pas dans l'arborescence « livrable final » de la section 70 (celle-ci liste `.github/`, `prisma/`, `public/`, `src/`, `tests/`, `e2e/`, les fichiers de config, `README.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md`, mais pas lui-même).

**Pourquoi il y a divergence :** la consigne de tâche (hors contrat) mentionne `CLAUDE_ENGINEERING_CONTRACT.md` sans préciser de chemin, ce qui a pu laisser supposer un emplacement racine. Le fichier réel a été committé sous `docs/assets/`.

**Recommandation :** ce n'est pas un défaut du contrat lui-même, seulement une ambiguïté de nommage/emplacement. Je recommande de **laisser le fichier où il est** (`docs/assets/CLAUDE_ENGINEERING_CONTRACT.md`) car il est déjà versionné à cet endroit et le déplacer serait une modification non sollicitée à ce stade. Si l'équipe souhaite un emplacement racine plus visible (convention courante pour ce type de document de gouvernance), ce sera une décision explicite à prendre séparément — je ne le fais pas silencieusement ici.

---

## 1. Current State

Le repository est un **projet neuf, essentiellement vide**. Un seul commit existe sur `main` (`3c85149 — docs: establish Mindful Healing Trips engineering foundation`), et la branche de travail `claude/mindful-healing-setup-90evmu` pointe sur le même commit.

Contenu intégral du repository à ce jour :

```text
.
└── docs/
    └── assets/
        └── CLAUDE_ENGINEERING_CONTRACT.md
```

Détail par domaine :

| Domaine | Constat |
|---|---|
| Framework | **Aucun** — pas de Next.js, pas de `package.json`, pas de `src/` |
| Version Node/Next | **Non définie** — aucun `.nvmrc`, `engines`, ou lockfile |
| Package manager | **Non défini** — aucun lockfile (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`) |
| Structure | Aucune arborescence applicative. Seul `docs/assets/` existe |
| Database | Aucune — pas de `prisma/`, pas de `schema.prisma`, pas de config PostgreSQL |
| Tests | Aucun — pas de `tests/`, `e2e/`, config Vitest ou Playwright |
| CI | Aucune — pas de `.github/workflows/` |
| Docker | Aucun `Dockerfile`, `compose.yaml`, `docker-compose.yml`, `.dockerignore` |
| Taskfile | Aucun `Taskfile.yml` |
| Assets graphiques | **Aucun fichier présent** dans le repository ni ailleurs sur le système de fichiers de cette session (voir §3) |
| README / docs | Aucun `README.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md` |
| Variables d'env | Aucun `.env.example` |
| État général | Projet au stade **pré-Phase 0** : uniquement le contrat d'ingénierie est en place. Tout le reste (Phase 1 à 8 du contrat) reste à construire. |

---

## 2. Contract Compliance

| Requirement | Current State | Status | Action |
|---|---|---|---|
| Next.js (App Router) | Absent | ❌ Manquant | Initialiser en Phase 1 |
| TypeScript (strict) | Absent | ❌ Manquant | Initialiser avec `strict: true` |
| PostgreSQL | Absent | ❌ Manquant | À provisionner via Docker Compose |
| Prisma | Absent | ❌ Manquant | `prisma/schema.prisma`, migrations, seed à créer |
| Zod | Absent | ❌ Manquant | À ajouter comme dépendance de validation |
| Vitest | Absent | ❌ Manquant | À configurer avec les premiers tests unitaires |
| Playwright | Absent | ❌ Manquant | À configurer avec les premiers parcours E2E |
| Docker | Absent | ❌ Manquant | `Dockerfile` multi-stage + `.dockerignore` |
| Docker Compose | Absent | ❌ Manquant | `compose.yaml` (app + postgres, mailpit optionnel) |
| Taskfile | Absent | ❌ Manquant | `Taskfile.yml` avec les 17 tâches contractuelles |
| Local CI (`task ci`) | Absent | ❌ Manquant | À construire en miroir de `ci.yml` |
| GitHub Actions | Absent | ❌ Manquant | `.github/workflows/ci.yml` |
| SEO | Absent | ❌ Manquant | Metadata dynamique, sitemap, robots.txt — Phase 6 |
| Accessibility | Absent | ❌ Manquant | WCAG 2.2 AA — intégré dès le design system, vérifié Phase 6 |
| Design system | Absent | ❌ Manquant | Tokens de marque + composants — Phase 2, **bloqué par assets manquants** (voir §3) |

Aucun élément du contrat n'est actuellement respecté, ce qui est cohérent avec un repository neuf en Phase 0. Il n'y a **aucune divergence technique à arbitrer** à ce stade puisqu'il n'existe encore aucune décision technique prise dans le repository qui contredirait le contrat.

---

## 3. Analyse des assets

Le contrat (section 2) désigne comme références officielles :

- `reims-01.png`
- `berlin2026-fin.png`
- `logo-mindfultrip-historic-transparent.png`
- `mindfultrip-brand-board-v1.0.png`
- `minfull-tripp-paris.jpeg`

**Constat : aucun de ces fichiers n'est présent dans le repository, ni ailleurs sur le système de fichiers accessible à cette session.** Une recherche exhaustive (repository entier, hors `.git`, et recherche par nom sur le disque) ne retourne aucun résultat.

Conséquences :

- Le **logo historique** ne peut pas être utilisé tant qu'il n'est pas fourni — conformément au contrat, il est hors de question de le recréer, de le régénérer par IA, ou de produire un logo de substitution.
- Le **brand board** (palette, typographies, direction artistique détaillée) n'est pas disponible sous forme de fichier, mais le contrat retranscrit déjà la palette exacte (§3) et les polices (Lora / Montserrat, §4) en texte — ces valeurs textuelles suffisent pour démarrer les tokens de design (Phase 2) sans avoir besoin du fichier image.
- Les **flyers** (Reims, Berlin, Paris) ne sont pas disponibles en fichier, mais leur contenu textuel pertinent est déjà retranscrit dans le contrat (§11) avec l'avertissement explicite que ce sont des informations à confirmer, pas des données commerciales définitives. Le seed de données pourra donc démarrer avec ce contenu texte, marqué `NEEDS_CONFIRMATION` où pertinent, sans avoir besoin des images.

**Action recommandée :** ne pas bloquer l'ensemble du projet sur ce manque. Le code, l'infrastructure, le modèle de données et le contenu textuel peuvent avancer (Phases 0–1 et une partie de la Phase 3) avec des placeholders d'image clairement identifiés. En revanche, **le logo officiel et les visuels finaux ne pourront être intégrés qu'une fois les fichiers fournis** — voir question bloquante en §6.

Emplacement cible une fois fournis : le contrat ne définissant pas d'emplacement dédié pour les assets sources bruts, je recommande `public/brand/` pour les assets finaux consommés par Next.js (logo, images optimisées) et éventuellement un dossier hors `public/` (ex. `docs/assets/brand-source/`) pour conserver les fichiers sources fournis tels quels, non retravaillés.

---

## 4. Analyse CI existante

Aucun fichier `.github/workflows/*` n'existe. Il n'y a donc **aucune logique de validation existante à respecter ou à ne pas contredire** — la CI GitHub Actions et la CI locale (`task ci`) seront créées ensemble, en miroir strict l'une de l'autre, dès la Phase 1/6, conformément au principe :

```text
task ci
├── task format:check
├── task lint
├── task typecheck
├── task test
├── task build
└── task test:e2e
```

Ce point ne présente aucun risque de divergence à ce stade puisqu'il n'y a rien d'existant à concilier.

---

## 5. Gaps

- Aucune application Next.js/TypeScript initialisée.
- Aucune configuration ESLint / Prettier / Tailwind.
- Aucun schéma de base de données (Prisma).
- Aucune infrastructure Docker locale.
- Aucun Taskfile, donc aucune des 17 commandes contractuelles n'existe.
- Aucune CI GitHub Actions ni CI locale.
- Aucun test (unitaire, intégration, E2E).
- **Aucun asset graphique officiel présent** (logo, flyers, brand board) — bloquant uniquement pour l'intégration visuelle finale, pas pour la fondation technique.
- Aucune documentation (`README.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md`).
- Aucune donnée de contenu (voyages/destinations) saisie, même en seed.

---

## 6. Risks

| Risque | Impact | Mitigation proposée |
|---|---|---|
| Assets de marque officiels absents du repository | Impossible de livrer une identité visuelle finale conforme sans les fichiers réels | Démarrer la Phase 1/2 avec tokens texte (palette + typographies déjà documentées) et placeholders explicites ; demander les fichiers avant la Phase 2 finale / Phase 4 |
| Données commerciales des voyages non confirmées (prix, places, statut Reims notamment) | Risque d'afficher une information erronée à un visiteur réel | Utiliser systématiquement `NEEDS_CONFIRMATION` en seed, ne jamais extrapoler depuis les flyers texte |
| Domaine canonique ambigu (`healing.nextgen-care.org` vs variantes) | Risque d'URLs canoniques/SEO/Open Graph incorrectes en production | Centraliser dans `NEXT_PUBLIC_SITE_URL`, documenter comme à confirmer avant mise en production |
| Absence totale d'historique technique | Aucune dette technique existante, mais aucune décision arbitrable non plus — tout est à construire, donc risque de sur-ingénierie si on ne suit pas strictement le contrat | Suivre strictement l'ordre des phases du contrat (§54–62), livrer par étapes vérifiables avec `task ci` vert à chaque étape |
| Package manager et version Node non spécifiés par le contrat | Risque d'incohérence d'outillage si choisi arbitrairement puis remis en cause plus tard | Fixer dès la Phase 1 : Node.js LTS + pnpm (rapide, largement adopté, bon support monorepo/Docker layer caching), documenté dans README et `.nvmrc`/`packageManager` |

---

## 7. Proposed Implementation Plan

Ordre recommandé, aligné sur les phases du contrat (§54–62) :

1. **Phase 1 — Foundation** : initialiser Next.js (App Router) + TypeScript strict, ESLint, Prettier, Tailwind, structure modulaire (`src/app`, `src/components`, `src/features`, `src/lib`, `src/server`, `src/types`), Dockerfile + compose.yaml (app + postgres), Prisma (schéma vide + connexion), Taskfile avec les 17 tâches contractuelles, `.env.example`. Objectif de sortie : `task setup && task dev` fonctionnent.
2. **Phase 1bis — CI** : `.github/workflows/ci.yml` et `task ci` créés ensemble et alignés (format, lint, typecheck, test, build, e2e), dès que l'app compile, pour éviter toute divergence future entre CI locale et distante.
3. **Phase 2 — Design System** : tokens CSS/Tailwind depuis la palette et les polices déjà documentées dans le contrat (sans dépendre des fichiers image manquants), composants de base (Button, Card, Badge, Header, Footer, etc.), placeholders explicites pour le logo tant qu'il n'est pas fourni.
4. **Phase 3 — Content/Data** : modèle Prisma `Trip`/`Destination`/`TripStatus`, migrations, seed avec les données textuelles du contrat marquées `NEEDS_CONFIRMATION` où pertinent, repositories/services.
5. **Phase 4 — Public Website** : Home, `/voyages`, `/voyages/[slug]`, `/destinations`, `/destinations/[slug]`, `/a-propos`, `/contact`, footer/legal.
6. **Phase 5 — Forms/Contact** : formulaire de contact avec validation Zod client + serveur, anti-spam (honeypot), EmailService abstrait + Mailpit en local.
7. **Phase 6 — SEO/Accessibilité/Performance** : metadata dynamique, sitemap, robots.txt, JSON-LD, audit WCAG 2.2 AA, Core Web Vitals.
8. **Phase 7 — Admin (si confirmé nécessaire)** : à ne démarrer qu'après validation explicite du besoin métier, non couvert par ce plan initial.
9. **Phase 8 — Production Readiness** : vérification Docker build, variables d'env, healthcheck, sécurité, documentation finale (README, ARCHITECTURE.md, CONTRIBUTING.md).

Intégration des assets réels (logo, flyers, brand board) dès réception, en Phase 2/4, sans attendre la fin du projet pour ne pas accumuler de dette visuelle.

---

## 8. Open Questions

Une seule question bloque réellement une décision (le reste peut être tranché raisonnablement en tant qu'ingénieur et sera documenté via `NEEDS_CONFIRMATION` dans le code) :

1. **Assets de marque officiels manquants** : `logo-mindfultrip-historic-transparent.png`, `reims-01.png`, `berlin2026-fin.png`, `minfull-tripp-paris.jpeg`, `mindfultrip-brand-board-v1.0.png` ne sont présents ni dans le repository ni ailleurs sur le système accessible à cette session. Merci de les fournir (upload dans le repository, ex. sous `public/brand/` et/ou `docs/assets/brand-source/`) avant que la Phase 2 (Design System) et la Phase 4 (intégration visuelle finale) ne puissent être considérées comme terminées. La fondation technique (Phase 1) et une bonne partie du contenu (Phase 3) peuvent démarrer sans ces fichiers.

Aucune autre question n'est bloquante : package manager, version Node, emplacement du contrat, statut définitif de Reims, domaine canonique final, et périmètre de l'admin sont toutes des décisions que je peux prendre raisonnablement (documentées ci-dessus) ou différer proprement via des placeholders `NEEDS_CONFIRMATION`, conformément à la règle §68 du contrat.
