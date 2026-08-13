# Architecture

Choix techniques et raisons. Source de vérité amont :
[`docs/assets/CLAUDE_ENGINEERING_CONTRACT.md`](docs/assets/CLAUDE_ENGINEERING_CONTRACT.md).
Cf. [`docs/ENGINEERING_DISCOVERY.md`](docs/ENGINEERING_DISCOVERY.md) pour
l'historique des décisions prises pendant la Phase 0/1.

## Vue d'ensemble

Monolithe modulaire Next.js (App Router), pas de microservices - le contrat
l'exclut explicitement tant qu'un monolithe suffit (§1, §8). Structure
(`src/app`, `src/lib`, etc.) alignée sur l'arborescence cible du contrat,
adaptée au fur et à mesure des besoins réels plutôt que créée en une fois
(contrat §66 : pas d'abstraction avant besoin réel).

## Choix technologiques

| Domaine            | Choix                                                           | Raison                                                                                                                                                                                                                  |
| ------------------ | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework          | Next.js 16 (App Router) + React 19                              | Imposé par le contrat §7 ; Server Components par défaut                                                                                                                                                                 |
| Langage            | TypeScript, `strict: true`                                      | Imposé §7                                                                                                                                                                                                               |
| Package manager    | pnpm                                                            | Non imposé par le contrat ; rapide, largement adopté, bon support du cache Docker par couches                                                                                                                           |
| Version TypeScript | 5.9.x (choix de `create-next-app`), pas 7.x                     | TS 7 (portage natif Go) vient de sortir en tag `latest` npm ; rester sur la ligne 5.x validée par l'équipe Next.js évite un risque d'écosystème immature - priorité contractuelle « novelty is never a priority » (§74) |
| Styles             | Tailwind CSS v4 (config CSS-first, pas de `tailwind.config.ts`) | Imposé §7 ; v4 détecte le contenu automatiquement, un fichier de config séparé n'apporte rien ici                                                                                                                       |
| ORM                | Prisma v7 + `@prisma/adapter-pg`                                | Imposé §7. **Prisma v7 exige un driver adapter explicite pour PostgreSQL** (changement majeur vs v6) - voir « Base de données » ci-dessous                                                                              |
| Validation         | Zod                                                             | Imposé §7                                                                                                                                                                                                               |
| Tests unitaires    | Vitest                                                          | Imposé §7                                                                                                                                                                                                               |
| Tests E2E          | Playwright (Desktop Chrome + Mobile Chrome)                     | Imposé §7 ; contrat §34 exige au minimum desktop + mobile                                                                                                                                                               |
| Automatisation     | Taskfile (go-task)                                              | Imposé §25                                                                                                                                                                                                              |
| Conteneurisation   | Docker multi-stage + Docker Compose                             | Imposé §23-24                                                                                                                                                                                                           |

## Flux de données

Phase 1 : aucune donnée métier - le schéma Prisma est volontairement vide
(connexion vérifiée, zéro modèle). Phase 3 introduira `Trip`, `Destination`
et l'enum de statut décrits au contrat §9, alimentés par
`prisma/seed.ts` à partir du contenu confirmé dans
`docs/ENGINEERING_DISCOVERY.md` (section 9), avec `NEEDS_CONFIRMATION`
explicite pour toute donnée commerciale non certaine (contrat §10/§68).

## Base de données

Prisma ORM v7 a changé de modèle de génération et de connexion :

- Le générateur `prisma-client` (pas `prisma-client-js`) écrit dans
  `src/generated/prisma` (jamais commité - régénéré par `postinstall` et à
  chaque changement de schéma).
- Prisma v7 ne se connecte plus nativement à PostgreSQL : un **driver
  adapter** (`@prisma/adapter-pg`, au-dessus de `pg`) est obligatoire. Voir
  `src/lib/db/prisma.ts` pour le singleton (mis en cache sur `globalThis` en
  dev pour survivre au Hot Module Reload de Next.js sans épuiser le pool de
  connexions).
- Prisma v7 ne charge plus automatiquement les fichiers `.env` : la config
  (`prisma.config.ts`) charge explicitement `.env.local` - c'est le fichier
  que Next.js lui-même utilise en développement local, pour n'avoir qu'une
  seule source de vérité pour les variables d'environnement locales.
- Les migrations et le seed (`prisma/seed.ts`, exécuté via `tsx`) sont
  déclenchés explicitement (`task db:migrate`, `task db:seed`) - Prisma v7 ne
  les enchaîne plus automatiquement.

## Sécurité

- Aucun secret commité : `.env`/`.env.local` sont ignorés par git,
  `.env.example` documente la forme attendue sans valeur sensible réelle
  (contrat §27/§36).
- Le healthcheck (`/api/health`) ne renvoie que `{ "status": "ok" }` - aucune
  information sur les dépendances internes (contrat §48).
- Le conteneur de production tourne en utilisateur non-root (`nextjs`,
  uid 1001) - voir `Dockerfile`.
- La validation Zod côté serveur (Phase 5, formulaire de contact) ne fera
  jamais confiance à la seule validation client (contrat §17/§36).

## Stratégie SEO

Phase 1 pose les bases : `metadataBase` dérivé de `NEXT_PUBLIC_SITE_URL`,
`lang="fr"`, titres templatés (`%s | Mindful Healing Trips`). Le travail
complet (sitemap, robots.txt, Open Graph, JSON-LD par voyage/destination) est
Phase 6 (contrat §18, §60) - ne pas le considérer optionnel.

## Stratégie images

`next/image` pour toute image (contrat §21). Le logo historique
(`public/brand/logo-mindfultrip-historic-transparent.png`) est l'asset
officiel fourni, utilisé tel quel - jamais retouché ni régénéré (contrat
§2). Les flyers/brand-board fournis ont été utilisés comme référence de
contenu et de palette (voir `docs/ENGINEERING_DISCOVERY.md` section 9) puis
retirés du repository une fois cette information capturée par écrit - ils ne
sont pas des assets que l'application sert (le contrat §12 interdit
explicitement de reproduire les flyers tels quels en pleine page).

## Stratégie de déploiement

`Dockerfile` multi-stage (`deps` → `builder` → `runner`) produit une image
minimale via la sortie Next.js `output: "standalone"`. Le script
`scripts/copy-standalone-assets.mjs` (déclenché par le hook npm
`postbuild`) copie `public/` et `.next/static` dans `.next/standalone` -
cette étape est nécessaire car Next.js ne le fait pas automatiquement, et
elle est partagée par le `Dockerfile` et par `pnpm start` local /
Playwright, pour n'avoir qu'un seul chemin de code plutôt qu'un cas
spécial Docker.

`compose.yaml` est un environnement de **développement local uniquement**
(hot reload via bind-mount, identifiants de dev) - il ne construit pas
l'image de production et ne doit jamais servir de référence pour la prod.

## Domaine et contact canoniques

Confirmés par le commanditaire le 2026-08-13 (résolvant l'ambiguïté notée en
`docs/ENGINEERING_DISCOVERY.md` entre les différentes variantes visibles sur
les flyers) :

- `NEXT_PUBLIC_SITE_URL` de production : `https://www.healingtrip-nextgencare.org`
- `CONTACT_EMAIL` : `info-healingtrip@nextgen-care.org`

Ces valeurs doivent être injectées par l'environnement de déploiement (build
arg / variable d'env), jamais codées en dur dans le code applicatif -
`.env.example` documente localhost comme valeur de développement.

## Design system (Phase 2)

Components built so far (contract §22), under `src/components/`:

- `ui/`: `Container`, `SectionHeading`, `Button`, `Link`, `Badge`,
  `StatusBadge`, `Card`, `Accordion`, `Breadcrumb`.
- `layout/`: `Header` (sticky, logo, desktop nav, CTA), `Footer` (nav,
  contact, social, legal, copyright - all from `src/lib/site-config.ts`).
- `navigation/`: `MobileNavigation` (accessible disclosure menu).
- `forms/`: `FormField` (label + input/textarea + error, accessible).

**Deliberately not built yet**: `TripCard`, `DestinationCard`,
`ImageGallery`, `ContactForm`, `BookingCTA`, `Modal`. These need real
`Trip`/`Destination` shapes (Phase 3) or a real form flow (Phase 5) to be
meaningful - building them now would mean guessing a data shape and
reworking it later (contract §66: no abstraction before a real need).
`StatusBadge` is the one exception: its input (`TripStatus`) is fully
specified by the contract itself (§9), so `src/lib/trip-status.ts` defines
it now, ahead of the Prisma model, with unit tests for the status-display
rules the contract mandates (§34) - Phase 3's Prisma `TripStatus` enum must
stay in sync with this file's values.

**`cn()` uses `tailwind-merge`+`clsx`** (not a plain string join): once
components started overriding each other's default classes (e.g. Header's
nav links overriding `Link`'s default `underline`), a plain join left both
the base and override utility class present, and which one wins is decided
by Tailwind's generated CSS order - not argument order. This silently broke
nav styling (visible only by actually rendering the page, not by lint or
typecheck) before the fix. See `tests/unit/cn.test.ts` for the regression
test and `src/lib/utils/cn.ts` for the explanation.

**Accessibility is enforced at the token level, not just per-component**:
`text-muted-foreground` and friends in `globals.css` are chosen and
comment-documented to meet WCAG AA contrast (≥4.5:1 for text, ≥3:1 for the
focus ring) - arbitrary opacity utilities like `text-brand-brown/50` are
not used for text, because they silently fail contrast (verified ~2.7:1,
see the token comments). `e2e/accessibility.spec.ts` runs an automated
axe scan (WCAG 2.0/2.1 A/AA) against the homepage on every `task ci` run.

## CMS

Aucun CMS en Phase 1-3. Le contenu métier (voyages, destinations) vit en
base PostgreSQL via Prisma, séparé du code (contrat §38), ce qui permet
d'introduire un CMS plus tard sans réécrire l'interface si le besoin se
confirme. Aucun CMS n'est construit préventivement (contrat §39).

## Limites connues (Phase 1)

- Aucun modèle métier (`Trip`, `Destination`) - Phase 3.
- Aucune page publique réelle - homepage actuelle est un placeholder de
  fondation (Phase 4).
- Aucun composant de design system (Button, Card, etc.) - Phase 2.
- Le build/run Docker n'a pas pu être exécuté dans l'environnement où ce
  code a été écrit (démon Docker indisponible dans ce bac à sable) ; la
  logique a été validée indirectement (`docker compose config`, et
  build/démarrage du serveur standalone exécutés hors conteneur avec les
  mêmes artefacts que le `Dockerfile` produit). À vérifier sur une machine
  avec un démon Docker fonctionnel avant la mise en production.
