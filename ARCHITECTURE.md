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

`Trip` et `Destination` (contrat §9) sont en base depuis la Phase 3, avec
l'enum `TripStatus` répliqué depuis `src/lib/trip-status.ts` (posé en
Phase 2). Les pages ne doivent jamais interroger Prisma directement -
elles passent par `src/features/trips/queries.ts` et
`src/features/destinations/queries.ts`, qui filtrent systématiquement sur
`published`/`publishedAt` (un brouillon ne doit jamais fuiter côté
visiteur). `prisma/seed.ts` peuple Paris/Berlin/Reims à partir du contenu
confirmé dans `docs/ENGINEERING_DISCOVERY.md` (section 9), avec
`NEEDS_CONFIRMATION` explicite pour toute donnée commerciale non certaine
(contrat §10/§68) - notamment le statut de Reims et tous les prix, qui
restent `null`.

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
- **Vitest ne charge pas `.env.local` automatiquement** (contrairement à
  Next.js et à la CLI Prisma) : `tests/setup-env.ts` le fait explicitement
  via `setupFiles`. Sans ça, `DATABASE_URL` est `undefined` dans les tests
  d'intégration, et le driver `pg` d'`@prisma/adapter-pg` échoue de façon
  trompeuse - la première requête sur le pool peut réussir avant qu'une
  requête suivante échoue avec `no PostgreSQL user name specified in
startup packet` (bug réel rencontré et corrigé pendant la Phase 3).
- **`node .next/standalone/server.js` (la sortie standalone) ne charge pas
  non plus `.env.local` tout seul**, contrairement à `next dev`/`next
build` - c'est le comportement documenté et attendu de la sortie
  standalone (pensée pour recevoir ses variables d'environnement du
  runtime conteneur, pas d'un fichier dotenv commité). C'est exactement ce
  que fait `compose.yaml` (`env_file`/`environment`) pour le développement
  local et ce qu'un vrai déploiement doit faire en production. Pour que
  `pnpm start` fonctionne aussi hors Docker (utilisé par le `webServer` de
  Playwright dans `task test:e2e`), le script `start` utilise le flag natif
  Node 22 `--env-file-if-exists=.env.local` (pas de dépendance
  supplémentaire) - silencieux si le fichier est absent (cas Docker/prod),
  charge la valeur s'il est présent (cas dev/test local). Bug réel
  rencontré et corrigé pendant la Phase 4 (une page `/voyages/[slug]`
  renvoyait une 500 "User was denied access on the database" en local sans
  cette variable exportée manuellement).

## Couverture de tests

Seuil de 90% (lignes, branches, fonctions, instructions), configuré dans
`vitest.config.mts` (`test.coverage`, provider v8) et appliqué dans
`task ci` via `pnpm test:coverage` (remplace `pnpm test` dans ce contexte -
même exécution de tests, instrumentation en plus, pas de suite dupliquée).

**Périmètre volontairement limité à `src/lib/**` et `src/features/**`** -
exactement la couche que le contrat §34 assigne aux tests unitaires/
d'intégration ("logique métier, helpers" / "accès DB, repositories/
services, formulaires, APIs"). `src/components/` et `src/app/` (pages,
Server/Client Components) en sont exclus : ils sont vérifiés par
Playwright (contrat §34, section E2E - parcours visiteur, navigation,
accessibilité), un outil différent dont l'instrumentation v8 de Vitest ne
peut pas voir l'exécution. Les y inclure aurait signifié soit introduire
tout un dispositif de tests de composants (React Testing Library + jsdom)
sans besoin unitaire réel derrière (contrat §65), soit afficher un chiffre
de couverture trompeur pour du code déjà vérifié, juste par un autre
outil.

`src/lib/db/prisma.ts` (singleton Prisma) est explicitement exclu du
calcul : c'est du câblage, pas de la logique à branches - exercé
indirectement par chaque test d'intégration, mais rien à unit-tester
isolément.

**`src/features/contact/actions.ts`** (le Server Action) était à 0% avant
cette passe - `next/headers` exige une portée de requête réelle que Vitest
n'a pas, ce qui avait jusqu'ici découragé de le tester directement (d'où
l'extraction de `mutations.ts`, testé séparément). Résolu en mockant
`next/headers` (`vi.mock`) plutôt qu'en évitant le fichier - une technique
de test standard, pas une nouvelle abstraction applicative. Les autres
dépendances d'`actions.ts` (`mutations.ts`, `rate-limit.ts`) sont mockées
dans son test pour isoler l'orchestration/le branchement propre à ce
fichier - leurs internals ont déjà leur propre couverture dédiée.

## Sécurité

- Aucun secret commité : `.env`/`.env.local` sont ignorés par git,
  `.env.example` documente la forme attendue sans valeur sensible réelle
  (contrat §27/§36).
- Le healthcheck (`/api/health`) ne renvoie que `{ "status": "ok" }` - aucune
  information sur les dépendances internes (contrat §48).
- Le conteneur de production tourne en utilisateur non-root (`nextjs`,
  uid 1001) - voir `Dockerfile`.
- La validation Zod côté serveur du formulaire de contact
  (`src/features/contact/schema.ts`) ne fait jamais confiance à la seule
  validation client (contrat §17/§36) : le Server Action revalide tout,
  même si le navigateur a déjà laissé passer la saisie.
- Identifiants SMTP jamais exposés au navigateur : `SmtpEmailService`
  n'existe que côté serveur (`"use server"` en amont dans la chaîne
  d'appel), lit ses identifiants depuis les variables d'environnement
  (contrat §17).

## Stratégie SEO

Phase 1 pose les bases : `metadataBase` dérivé de `NEXT_PUBLIC_SITE_URL`,
`lang="fr"`, titres templatés (`%s | Mindful Healing Trips`). Phase 4 ajoute
un titre/description par page, y compris dynamiques pour chaque voyage/
destination (`generateMetadata`, à partir de `seoTitle`/`seoDescription` ou
d'un repli sur le titre/résumé).

Phase 6 (contrat §18/§60) complète le reste :

- **`src/lib/seo/metadata.ts`** : `buildMetadata()` centralise canonical,
  Open Graph et Twitter card pour les neuf pages - construits une seule
  fois plutôt que recopiés à la main à chaque page (contrat §66 : besoin
  réel et partagé, pas une abstraction gratuite). Image de repli : le logo
  historique (seul asset photographique réel disponible tant qu'aucune
  vraie photo n'est fournie, `TODO_ASSET`) - jamais une image générée
  présentée comme une photo (contrat §45).
- **`src/lib/seo/json-ld.ts`** + **`src/components/shared/json-ld.tsx`** :
  données structurées Schema.org - `TravelAgency` (site entier, dans
  `layout.tsx`), `TouristTrip` (fiche voyage, avec `offers` uniquement si
  un prix est confirmé - jamais un prix inventé), `TouristDestination`
  (fiche destination). Uniquement des champs adossés à des données
  confirmées (contrat §68).
- **`src/app/sitemap.ts`** : généré depuis les mêmes repositories que les
  pages (`listPublishedTrips`/`listPublishedDestinations`) - un voyage
  publié y apparaît automatiquement, un brouillon jamais. Exclut
  volontairement `/mentions-legales` et `/politique-confidentialite`
  (`noindex`, contrat §37) : les lister enverrait un signal contradictoire.
- **`src/app/robots.ts`** : reste permissif (`Allow: /`) partout, y compris
  sur les pages `noindex` - un `Disallow` empêcherait les moteurs de
  recherche de même voir la balise `noindex`, ce qui peut paradoxalement
  laisser l'URL indexée sans extrait si elle est liée ailleurs. C'est la
  balise `noindex`, pas `robots.txt`, qui porte cette règle.

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
`ImageGallery`, `ContactForm`, `BookingCTA`, `Modal`. These needed real
`Trip`/`Destination` shapes (Phase 3) or a real form flow (Phase 5) to be
meaningful - building them then would have meant guessing a data shape and
reworking it later (contract §66: no abstraction before a real need). All
have since been built as their respective phases landed; `Modal` remains
unbuilt as no page has needed one yet.
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

## Content/Data (Phase 3)

`Trip` et `Destination` (contrat §9), plus l'enum `TripStatus` répliqué
depuis `src/lib/trip-status.ts` (Phase 2), sont maintenant dans
`prisma/schema.prisma` avec une migration
(`prisma/migrations/20260813134935_add_trip_destination_models`).

- **Couche repository** : `src/features/trips/queries.ts` et
  `src/features/destinations/queries.ts` sont le seul endroit qui appelle
  `prisma.trip`/`prisma.destination` - les pages doivent passer par elles,
  jamais par le client Prisma directement (contrat §38). Chaque requête
  filtre sur `published`/`publishedAt` pour qu'un brouillon ne fuite jamais
  côté visiteur.
- **Contenu du seed** (`prisma/seed.ts`) entièrement sourcé depuis
  `docs/ENGINEERING_DISCOVERY.md` section 9 - ce qui est littéralement
  confirmé sur les flyers officiels, rien d'extrapolé. Notamment : tous les
  `price` sont `null` (aucun n'a été confirmé), et le statut de Reims est
  `UPCOMING` avec un commentaire `NEEDS_CONFIRMATION` explicite - son flyer
  ne montre ni statut de réservation ni prix, contrairement à Paris/Berlin,
  et le contrat (§11) interdit explicitement d'en déduire un. Les statuts
  de Paris/Berlin (`COMPLETED`/`CLOSED`) découlent de la règle du contrat
  sur comment traiter un voyage passé/en clôture par rapport à la date
  actuelle du projet, pas d'une lecture littérale du flyer (celui de Paris
  dit littéralement "sold out", mais la date est passée, donc le contrat
  §11 impose `COMPLETED`).
- Le seed est idempotent (`upsert` sur `slug`) - `task db:seed` peut
  tourner autant de fois que nécessaire sans dupliquer de lignes.
- **Tests d'intégration** (`tests/integration/`) exécutent de vraies
  requêtes contre un Postgres migré + seedé (contrat §34). `task ci`/
  `ci.yml` exécutent maintenant `db:migrate:deploy` puis `db:seed` _avant_
  `test`, pour que ces tests aient de vraies données à vérifier - les
  tests unitaires qui ne touchent pas la DB cohabitent dans le même run
  Vitest.
- **Bug Vitest trouvé et corrigé** : contrairement à Next.js et à la CLI
  Prisma, Vitest ne charge pas `.env.local` automatiquement. Sans
  `tests/setup-env.ts` (branché via `setupFiles`), `DATABASE_URL` était
  `undefined` dans les tests, et le pool `pg` d'`@prisma/adapter-pg`
  échouait de façon trompeuse - la première requête sur une connexion
  fraîche pouvait réussir avant qu'une suivante échoue avec `no PostgreSQL
user name specified in startup packet`. Bug réel, visible uniquement en
  exécutant vraiment les tests d'intégration, pas via lint/typecheck.

## Public Website (Phase 4)

Pages publiques (contrat §41/§58) : `/`, `/voyages`, `/voyages/[slug]`,
`/destinations`, `/destinations/[slug]`, `/a-propos`, `/contact`,
`/mentions-legales`, `/politique-confidentialite`. Toutes lisent leurs
données via les repositories Phase 3, jamais de contenu codé en dur.

- **`TripCard`/`DestinationCard`/`BookingCTA`/`ImageGallery`** (déférés en
  Phase 2, contrat §22) construits maintenant que de vraies données
  existent pour les dimensionner. `ImageGallery` ne s'affiche pas encore
  (aucune vraie photo fournie, `gallery: []` partout) mais est câblé et
  prêt.
- **Sections conditionnelles** : chaque section d'une fiche voyage/
  destination (galerie, expériences, points forts, infos pratiques, inclus/
  exclus, prix) ne s'affiche que si la donnée existe - pas de bloc vide ou
  de placeholder trompeur pour du contenu non confirmé.
- **`BookingCTA` distingue _pourquoi_ la réservation n'est pas possible**
  (`src/lib/trip-status.ts#getBookingUnavailableMessage`) plutôt qu'un
  message générique "n'est plus ouvert" - faux pour un voyage `UPCOMING`
  qui n'a jamais été ouvert. Bug réel trouvé en relisant visuellement la
  page Reims (le seul voyage `UPCOMING` seedé), pas détectable par
  lint/typecheck/tests avant l'ajout du test de régression correspondant.
- **`/contact`** affiche les canaux de contact directs (email/WhatsApp) et
  le formulaire fonctionnel (Phase 5, voir section dédiée ci-dessous).
- **`/mentions-legales` et `/politique-confidentialite`** sont des
  placeholders `TODO_CONTENT_CONFIRMATION` explicites (contrat §37) -
  aucun texte juridique n'a été fourni, donc aucun n'est inventé ; `robots:
{ index: false }` tant que le contenu réel n'est pas en place.
- **Titres `<h1>` uniques par page** : `SectionHeading` génère un `<h2>`
  par défaut (pour labelliser une section sur une page qui a déjà son
  propre `<h1>`, comme le hero de la homepage) mais accepte `level={1}`
  pour les pages de listing (`/voyages`, `/destinations`, `/a-propos`,
  `/contact`) qui n'avaient sinon aucun `<h1>` - bug réel trouvé par le
  test E2E du parcours visiteur (`getByRole("heading", { level: 1 })` ne
  trouvait rien), pas par lint/typecheck.
- **Contraste réel cassé sur les cartes sans photo** : le texte du nom de
  destination affiché en `text-brand-brown/60` sur fond `bg-brand-sand`
  (`TripCard`/`DestinationCard` quand `coverImage`/`heroImage` est `null`)
  mesurait ~3.57:1, sous le seuil AA (4.5:1) - trouvé par le scan axe
  automatisé (`e2e/accessibility.spec.ts`) une fois étendu à ces pages,
  corrigé en repassant en `text-brand-brown` (opacité pleine).

## Formulaire de contact (Phase 5)

Contrat §17/§59. `src/features/contact/` regroupe toute la logique métier :

- **`schema.ts`** : `contactFormSchema` (Zod) valide prénom/nom/email/
  téléphone (optionnel)/voyage concerné (optionnel)/nombre de participants
  (optionnel)/message/consentement - source de vérité serveur, indépendante
  de ce que le navigateur a déjà vérifié. Le champ `website` est un
  honeypot anti-spam : délibérément laissé structurellement valide
  (`z.string().max(200).optional()`, pas `.max(0)`) pour qu'un bot qui le
  remplit obtienne un faux succès silencieux au lieu d'une erreur de
  validation qui lui indiquerait qu'il a été repéré -
  `isHoneypotTriggered()` fait la détection séparément, après le parsing.
- **`rate-limit.ts`** : fenêtre glissante en mémoire (5 soumissions / 10
  min / identifiant), documentée comme best-effort (par processus, ne
  survit pas à un redéploiement, pas de partage entre instances) - pas un
  Redis, mais suffisant pour le volume attendu de ce site.
- **`mutations.ts`** : `createContactRequest()` isole l'écriture Prisma
  pour rester testable en intégration sans dépendre de `next/headers`
  (portée de requête que `submitContactRequest` seul possède).
- **`actions.ts`** : `submitContactRequest`, le Server Action (`"use
server"`) branché sur `useActionState` côté client. Ordre : validation
  Zod → honeypot (faux succès silencieux) → rate limiting par IP → lookup
  du voyage concerné (si `tripSlug` fourni) → stockage `ContactRequest` →
  notifications email (best-effort, ne fait jamais échouer la soumission
  déjà stockée).

`src/lib/email/` : `EmailService` est une interface (`send()`) avec une
implémentation SMTP (`SmtpEmailService`, nodemailer) - remplaçable par un
autre fournisseur sans toucher `actions.ts`. Fonctionne avec Mailpit en
local (`compose.yaml`) et n'importe quel SMTP réel en production, via les
variables d'environnement `SMTP_*`/`CONTACT_EMAIL` (jamais de secret
exposé au navigateur, contrat §17).

`ContactRequest` (Prisma) stocke chaque soumission indépendamment du succès
de l'envoi d'email (contrat §59 "stockage si nécessaire") - une panne SMTP
ne perd jamais une demande de contact déjà reçue.

`ContactForm` (`src/components/forms/contact-form.tsx`) est un composant
client : `useActionState` pour l'état pending/erreurs/succès, formulaire
qui se dégrade proprement sans JS (le `<form action={...}>` poste toujours
vers le Server Action), erreurs de champ accessibles (`role="alert"`,
`aria-describedby`), pré-remplissage du voyage concerné depuis `?voyage=`
(utilisé par le lien de repli de `BookingCTA` pour un voyage réservable
sans URL de réservation encore fournie).

## CMS

Aucun CMS en Phase 1-3. Le contenu métier (voyages, destinations) vit en
base PostgreSQL via Prisma, séparé du code (contrat §38), ce qui permet
d'introduire un CMS plus tard sans réécrire l'interface si le besoin se
confirme. Aucun CMS n'est construit préventivement (contrat §39).

## Limites connues

- Statut de Reims et tous les prix `NEEDS_CONFIRMATION` - voir
  `prisma/seed.ts` et `docs/ENGINEERING_DISCOVERY.md` section 9.
- Rate limiting du formulaire de contact en mémoire par processus
  (`src/features/contact/rate-limit.ts`) - se réinitialise à chaque
  redéploiement et ne partage pas d'état entre plusieurs instances ; à
  remplacer par un store partagé (Redis) si le volume le justifie un jour.
- `/mentions-legales` et `/politique-confidentialite` sont des placeholders
  explicites - textes juridiques réels non fournis (contrat §37).
- Aucune vraie photographie (hero, voyages, destinations) - tout est
  `TODO_ASSET`, `ImageGallery` est câblé mais ne s'affiche jamais encore.
- Le build/run Docker n'a pas pu être exécuté dans l'environnement où ce
  code a été écrit (démon Docker indisponible dans ce bac à sable) ; la
  logique a été validée indirectement (`docker compose config`, et
  build/démarrage du serveur standalone exécutés hors conteneur avec les
  mêmes artefacts que le `Dockerfile` produit). À vérifier sur une machine
  avec un démon Docker fonctionnel avant la mise en production.
