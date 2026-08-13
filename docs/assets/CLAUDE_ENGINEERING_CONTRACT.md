# CLAUDE ENGINEERING CONTRACT
## Projet : Mindful Healing Trips — Portail Web officiel

**Version : 1.0**  
**Date : 13 août 2026**  
**Projet : portail internet Mindful Healing Trips**  
**Domaine cible : `healing.nextgen-care.org`**  
**Méthode : Claude Engineering Contract / production-grade software engineering**

---

# 1. MISSION

Tu es l'ingénieur logiciel principal responsable de concevoir et réaliser le portail web officiel de **Mindful Healing Trips**.

Tu dois agir comme un **Senior Staff Software Engineer / Tech Lead**, avec les exigences de qualité, de maintenabilité, de sécurité et d'expérience utilisateur attendues d'un produit professionnel.

Le résultat attendu n'est pas un prototype ni une simple landing page.

Il doit s'agir d'une **application web production-ready**, dockerisée, testable localement, documentée, accessible, responsive et préparée pour évoluer vers plusieurs destinations et plusieurs voyages.

Tu dois privilégier :

1. simplicité architecturale ;
2. technologies largement adoptées ;
3. excellente expérience utilisateur ;
4. SEO ;
5. accessibilité ;
6. performance ;
7. maintenabilité ;
8. sécurité ;
9. automatisation ;
10. possibilité d'évolution sans réécriture majeure.

**Ne sur-engineer pas le projet.**

Ne crée pas de microservices si un monolithe modulaire suffit.

---

# 2. SOURCES DE VÉRITÉ DU PROJET

Les assets suivants sont fournis et doivent être considérés comme références officielles de design :

- `reims-01.png`
- `berlin2026-fin.png`
- `logo-mindfultrip-historic-transparent.png`
- `mindfultrip-brand-board-v1.0.png`
- `minfull-tripp-paris.jpeg`

Ils constituent la référence visuelle pour :

- identité ;
- logo ;
- couleurs ;
- typographies ;
- direction artistique ;
- composition ;
- photographie ;
- iconographie ;
- ton éditorial.

## Règle absolue concernant le logo

Le logo historique Mindful Healing Trips doit rester **strictement inchangé**.

Interdictions :

- redessiner le logo ;
- modifier ses proportions ;
- changer ses couleurs ;
- traduire le texte du logo ;
- recomposer ses éléments ;
- appliquer des filtres ;
- déformer le cercle ;
- remplacer les palmiers ;
- remplacer la vague ;
- générer une nouvelle version du logo avec une IA.

Le fichier fourni doit être utilisé comme asset officiel.

---

# 3. IDENTITÉ VISUELLE

Le brand-board fourni définit la direction graphique officielle.

## Palette

Utiliser comme tokens de design :

```text
Brown / Brun       #3A2113
Ocean / Océan      #1C5B71
Sun / Soleil       #E48E51
Gold / Or          #E4AF56
Sand / Sable       #EDD1AD
Ivory / Ivoire     #F9EADC
```

Créer ces valeurs sous forme de design tokens CSS/Tailwind.

Ne pas multiplier inutilement les couleurs.

Les nouvelles couleurs doivent être dérivées de cette palette et justifiées.

---

# 4. TYPOGRAPHIE

La direction artistique indique :

### Titres / narration

**Lora**

### Navigation / interface / textes fonctionnels

**Montserrat**

La hiérarchie typographique doit reproduire l'esprit des supports fournis :

- élégant ;
- chaleureux ;
- premium ;
- voyage ;
- bien-être ;
- humain ;
- familial ;
- jamais froid ou corporate.

La lisibilité doit cependant primer sur la reproduction littérale des flyers.

---

# 5. POSITIONNEMENT DU SITE

Mindful Healing Trips ne doit pas être présenté comme un simple tour-opérateur.

Le site doit communiquer une proposition de valeur autour de :

- voyage ;
- bien-être ;
- découverte ;
- culture ;
- partage ;
- famille ;
- expériences ;
- création de souvenirs ;
- art de vivre.

Le ton doit être :

**humain + élégant + chaleureux + rassurant + accessible + premium sans être luxueux ou ostentatoire.**

Éviter :

- jargon marketing ;
- phrases artificiellement « IA » ;
- promesses médicales ;
- vocabulaire thérapeutique non justifié ;
- sensation de site de réservation low-cost ;
- surcharge visuelle.

---

# 6. OBJECTIFS DU PORTAIL

Le portail doit permettre à un visiteur de :

1. comprendre immédiatement ce qu'est Mindful Healing Trips ;
2. découvrir les voyages disponibles ;
3. découvrir les destinations ;
4. consulter une fiche voyage ;
5. connaître les dates ;
6. connaître le statut d'un voyage ;
7. voir les expériences proposées ;
8. consulter les informations pratiques ;
9. demander une réservation ;
10. contacter l'organisateur ;
11. consulter les prochains voyages ;
12. accéder facilement aux réseaux et moyens de contact.

Le site doit également être conçu pour pouvoir évoluer vers :

- plusieurs destinations ;
- plusieurs années ;
- plusieurs voyages simultanés ;
- différents types de voyages ;
- gestion éditoriale ;
- espace administrateur ;
- demandes de réservation ;
- newsletter ;
- galerie ;
- témoignages ;
- FAQ.

---

# 7. ARCHITECTURE TECHNIQUE

## Stack imposée sauf justification contraire

Utiliser :

### Frontend / application

- Next.js
- TypeScript
- React
- App Router

### UI

- Tailwind CSS
- composants accessibles inspirés de shadcn/ui
- CSS variables pour les tokens de marque

### Backend

Utiliser les capacités serveur de Next.js.

Ne pas introduire Express/NestJS séparément sans justification technique forte.

### Base de données

- PostgreSQL
- Prisma ORM

### Validation

- Zod

### Tests unitaires

- Vitest

### Tests end-to-end

- Playwright

### Qualité

- ESLint
- Prettier
- TypeScript strict mode

### Runtime

- Node.js LTS

### Infrastructure locale

- Docker
- Docker Compose

### Automation

- Taskfile

### CI

- GitHub Actions

---

# 8. PRINCIPE ARCHITECTURAL

Utiliser une architecture **modular monolith**.

Exemple de structure cible :

```text
src/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx
│   │   ├── voyages/
│   │   ├── destinations/
│   │   ├── a-propos/
│   │   ├── contact/
│   │   └── ...
│   │
│   ├── api/
│   │   └── ...
│   │
│   ├── admin/
│   │   └── ...
│   │
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── globals.css
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── navigation/
│   ├── travel/
│   ├── destinations/
│   ├── forms/
│   └── shared/
│
├── features/
│   ├── trips/
│   ├── destinations/
│   ├── bookings/
│   ├── contact/
│   └── content/
│
├── lib/
│   ├── db/
│   ├── validation/
│   ├── seo/
│   ├── email/
│   └── utils/
│
├── server/
│   └── ...
│
└── types/
```

Adapter cette structure au besoin.

Ne crée pas une architecture artificiellement complexe uniquement pour respecter cette arborescence.

---

# 9. MODÈLE DE DONNÉES

Prévoir au minimum les concepts suivants.

## Trip

Un voyage doit pouvoir contenir :

- id
- slug
- title
- shortDescription
- description
- destination
- startDate
- endDate
- duration
- status
- coverImage
- gallery
- highlights
- experiences
- practicalInformation
- included
- excluded
- price
- currency
- bookingUrl ou bookingMode
- contactInformation
- seo metadata
- publishedAt
- createdAt
- updatedAt

## Destination

Prévoir :

- id
- slug
- name
- country
- shortDescription
- description
- heroImage
- gallery
- highlights
- practicalInformation
- published status
- SEO

## Trip status

Prévoir un enum :

```text
DRAFT
UPCOMING
OPEN
LIMITED
SOLD_OUT
CLOSED
COMPLETED
CANCELLED
```

Le statut affiché au visiteur doit être déterminé proprement.

Ne jamais afficher « Réservez maintenant » pour un voyage terminé ou clôturé.

---

# 10. DONNÉES DES FLYERS

Les flyers fournis sont des **références de contenu et de direction artistique**, mais ils ne doivent pas être considérés automatiquement comme une base de données parfaitement fiable.

Avant d'insérer une donnée commerciale définitive :

- ne pas inventer ;
- ne pas extrapoler ;
- ne pas modifier silencieusement ;
- ne pas transformer une information visuelle ambiguë en donnée certaine.

Si une donnée est inconnue, utiliser explicitement un placeholder ou documenter la question.

Exemple :

```text
TODO_CONTENT_CONFIRMATION:
- prix du voyage
- nombre exact de places
- politique d'annulation
- adresse de réservation définitive
```

---

# 11. VOYAGES INITIAUX

Le portail doit pouvoir présenter notamment les voyages visibles dans les supports fournis.

### Paris

Le flyer fourni présente :

- Évasion, Bien-être & Élégance
- journée bien-être et culture à Paris
- date : 31/07/2026
- départ : 6h30
- départ depuis Angleur
- excursion en bus VIP
- visite guidée
- retour le soir
- statut indiqué : complet / sold out

Compte tenu de la date actuelle du projet, ce voyage doit être traité comme historique/terminé.

### Berlin

Le flyer présente :

- Berlin en famille
- 8 jours / 7 nuits
- du 15 au 22 août 2026
- plusieurs expériences familiales
- statut : réservations clôturées

Le portail doit conserver cette information comme voyage historique/archivé ou terminé une fois la date dépassée.

### Reims

Le flyer présente :

- Reims 2026
- Sur les routes du Champagne
- du 2 au 10 octobre 2026
- découvertes ;
- dégustations ;
- patrimoine ;
- détente ;
- art de vivre.

Le statut doit être configuré selon les données commerciales réelles et non déduit uniquement du flyer.

---

# 12. HOME PAGE

Créer une homepage premium, claire et orientée conversion.

Structure recommandée :

## Hero

Logo / navigation.

Headline forte inspirée de l'univers :

> Voyagez. Respirez. Partagez.

Sous-titre :

> Des expériences pensées pour découvrir, se ressourcer et créer des souvenirs ensemble.

CTA principal :

> Découvrir les voyages

CTA secondaire :

> Nous contacter

Utiliser une photographie immersive.

Ne pas reproduire littéralement les flyers sous forme d'image pleine page.

Le site doit être un vrai site web, pas un assemblage de flyers.

---

# 13. SECTION PROCHAINS VOYAGES

Afficher les voyages sous forme de cartes.

Chaque carte doit présenter :

- destination ;
- image ;
- dates ;
- durée ;
- courte description ;
- statut ;
- CTA.

Exemples de statuts :

```text
À venir
Réservations ouvertes
Dernières places
Complet
Réservations clôturées
Terminé
```

Les badges doivent être accessibles et compréhensibles sans dépendre uniquement de la couleur.

---

# 14. PAGE VOYAGE

Chaque voyage doit disposer d'une page dédiée.

URL :

```text
/voyages/[slug]
```

Structure :

1. hero ;
2. titre ;
3. destination ;
4. dates ;
5. statut ;
6. description ;
7. galerie ;
8. expériences ;
9. programme ;
10. informations pratiques ;
11. inclusions ;
12. exclusions ;
13. prix si disponible ;
14. FAQ ;
15. CTA réservation ;
16. contact.

Sur mobile, prévoir un CTA de réservation/contact persistant si cela améliore l'UX.

---

# 15. PAGE DESTINATION

URL :

```text
/destinations/[slug]
```

La page doit être éditoriale et inspirante.

Exemple :

```text
/destinations/reims
/destinations/berlin
/destinations/paris
```

Elle doit pouvoir fonctionner même lorsqu'aucun voyage n'est actuellement disponible.

---

# 16. NAVIGATION

Navigation desktop :

```text
Accueil
Nos voyages
Destinations
À propos
Contact
```

CTA :

```text
Découvrir les voyages
```

Navigation mobile :

- simple ;
- accessible ;
- rapide ;
- sans menu excessivement complexe.

Prévoir un header sticky uniquement si cela améliore réellement l'expérience.

---

# 17. CONTACT / RÉSERVATION

Le site doit permettre au visiteur de contacter Mindful Healing Trips.

Prévoir un formulaire :

- prénom ;
- nom ;
- email ;
- téléphone ;
- voyage concerné ;
- nombre de participants ;
- message ;
- consentement.

Validation côté client ET serveur.

Ne jamais faire confiance uniquement aux validations frontend.

Protection anti-spam :

- honeypot ;
- rate limiting si nécessaire ;
- validation stricte ;
- éventuellement CAPTCHA si les volumes le justifient.

Ne jamais exposer les credentials SMTP au navigateur.

---

# 18. SEO

Le SEO est une exigence de première classe.

Prévoir :

- metadata dynamique ;
- title ;
- description ;
- canonical ;
- Open Graph ;
- Twitter/X cards ;
- sitemap ;
- robots.txt ;
- données structurées Schema.org lorsque pertinentes ;
- données structurées pour voyages/destinations/organisation ;
- URLs propres ;
- headings sémantiques ;
- alt text ;
- performance.

Chaque voyage doit pouvoir être indexé correctement.

---

# 19. ACCESSIBILITÉ

Objectif :

**WCAG 2.2 AA autant que raisonnablement possible.**

Exigences :

- navigation clavier ;
- focus visible ;
- contraste suffisant ;
- labels explicites ;
- erreurs de formulaire accessibles ;
- HTML sémantique ;
- aria uniquement lorsque nécessaire ;
- alt text ;
- respect du reduced motion ;
- navigation mobile accessible ;
- aucun contenu essentiel uniquement accessible par hover.

Ajouter des tests automatisés d'accessibilité là où cela apporte de la valeur.

---

# 20. PERFORMANCE

Objectifs indicatifs :

- excellent Core Web Vitals ;
- images optimisées ;
- formats modernes ;
- lazy loading lorsque pertinent ;
- pas de JavaScript inutile ;
- Server Components par défaut lorsque possible ;
- Client Components uniquement lorsque nécessaires ;
- fonts optimisées ;
- pas de librairie lourde pour une fonctionnalité simple.

Ne jamais charger une librairie simplement pour réaliser une fonction de quelques lignes.

---

# 21. IMAGES

Les images sont une composante majeure de l'identité du site.

Utiliser le système d'image optimisé de Next.js.

Prévoir :

- responsive images ;
- dimensions explicites ;
- lazy loading ;
- priorité uniquement sur les images above-the-fold ;
- alt text ;
- optimisation des formats.

Le logo historique doit être utilisé comme asset officiel.

---

# 22. DESIGN SYSTEM

Créer un petit design system cohérent.

Composants minimum :

- Button
- Link
- Badge
- Card
- TripCard
- DestinationCard
- SectionHeading
- Container
- Header
- Footer
- MobileNavigation
- ImageGallery
- ContactForm
- BookingCTA
- StatusBadge
- Accordion
- Breadcrumb
- FormField
- Modal si nécessaire

Ne pas créer des composants abstraits dont le seul but est d'abstraire.

---

# 23. DOCKER

Le projet doit être entièrement dockerisable.

Prévoir au minimum :

```text
Dockerfile
compose.yaml
.dockerignore
```

Le Dockerfile doit être optimisé pour la production.

Prévoir un environnement local permettant au minimum :

```text
application
postgres
```

Éventuellement :

```text
mailpit
```

pour tester les emails localement.

---

# 24. DOCKER COMPOSE

Le développeur doit pouvoir démarrer le projet avec :

```bash
docker compose up
```

ou via Taskfile :

```bash
task dev
```

Le compose local doit permettre :

- démarrage PostgreSQL ;
- démarrage application ;
- migrations ;
- seed ;
- développement local ;
- tests lorsque pertinent.

Les credentials locaux doivent être des valeurs de développement et ne doivent jamais être utilisés en production.

---

# 25. TASKFILE

Créer un `Taskfile.yml`.

Le Taskfile est une interface principale du projet.

Minimum obligatoire :

```text
task setup
task dev
task build
task test
task lint
task typecheck
task format
task format:check
task db:migrate
task db:seed
task db:reset
task test:e2e
task ci
task docker:build
task docker:up
task docker:down
```

---

# 26. TASK SETUP

`task setup` est une exigence majeure.

Son objectif :

> permettre à une nouvelle machine de passer de zéro à un environnement de développement fonctionnel avec le minimum d'intervention humaine.

Exemple de comportement :

```text
task setup
    ↓
vérification des prérequis
    ↓
création du .env.local si absent
    ↓
installation des dépendances
    ↓
démarrage des services nécessaires
    ↓
application des migrations
    ↓
seed de développement
    ↓
validation de l'installation
    ↓
affichage des prochaines commandes
```

Le script doit être idempotent autant que possible.

Relancer :

```bash
task setup
```

ne doit pas casser l'environnement.

Documenter les prérequis :

- Docker ;
- Docker Compose ;
- Task ;
- Git ;
- Node.js si nécessaire pour certains workflows hors Docker.

---

# 27. ENVIRONMENT VARIABLES

Créer :

```text
.env.example
```

Ne jamais commit :

```text
.env
.env.local
```

Documenter toutes les variables.

Exemple :

```text
DATABASE_URL=
NEXT_PUBLIC_SITE_URL=
CONTACT_EMAIL=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
```

Les secrets doivent être injectés par l'environnement.

---

# 28. BASE DE DONNÉES

Prisma doit gérer le schéma.

Prévoir :

```text
prisma/
├── schema.prisma
├── migrations/
└── seed.ts
```

Le seed doit créer un jeu de données de développement cohérent.

Le contenu seedé ne doit pas être présenté comme des données commerciales définitives sans validation.

---

# 29. EMAILS

Prévoir une abstraction :

```text
EmailService
```

Ne pas coupler toute l'application à un fournisseur particulier.

En local, utiliser idéalement Mailpit ou équivalent.

En production, le fournisseur SMTP/email doit être configurable.

---

# 30. CI/CD

Créer ou respecter :

```text
.github/workflows/ci.yml
```

La CI doit au minimum exécuter :

```text
install
lint
typecheck
unit tests
build
e2e tests
```

Ajouter les contrôles de sécurité et d'accessibilité pertinents.

---

# 31. RÈGLE FONDAMENTALE : CI LOCALE AVANT PR

Le développeur ne doit pas créer une Pull Request simplement parce que le code « semble fonctionner ».

Le workflow obligatoire est :

```text
développement
    ↓
tests locaux
    ↓
task ci
    ↓
CI locale verte
    ↓
commit
    ↓
push
    ↓
Pull Request
```

La commande :

```bash
task ci
```

doit reproduire autant que possible les étapes de :

```text
.github/workflows/ci.yml
```

Le principe est :

> **Si `task ci` échoue localement, aucune Pull Request ne doit être ouverte.**

---

# 32. LOCAL CI

Créer une pipeline locale déterministe.

Exemple :

```text
task ci
├── task format:check
├── task lint
├── task typecheck
├── task test
├── task build
└── task test:e2e
```

Si le dépôt possède déjà un `ci.yml`, l'analyser avant de définir `task ci`.

Le workflow local doit rester aligné avec la CI distante.

Éviter les situations où :

```text
task ci = vert
GitHub Actions = rouge
```

La divergence entre les deux doit être considérée comme un défaut d'architecture du workflow.

---

# 33. PRE-COMMIT / PR QUALITY

Si pertinent, mettre en place :

- hooks Git ;
- lint-staged ;
- format check ;
- validation commit.

Mais ne pas transformer les hooks en système lent ou fragile.

La vraie garantie doit rester :

```bash
task ci
```

---

# 34. TESTS

## Unit tests

Tester :

- logique de statut des voyages ;
- validation des formulaires ;
- transformations de données ;
- helpers ;
- règles métier.

## Integration tests

Tester :

- accès DB ;
- repositories/services ;
- formulaires ;
- APIs.

## E2E

Avec Playwright, couvrir au minimum :

### Parcours visiteur

```text
Accueil
→ Nos voyages
→ Voyage
→ Contact
→ soumission
```

### Parcours responsive

Tester au minimum :

- desktop ;
- mobile.

### Navigation

Vérifier :

- header ;
- footer ;
- liens ;
- routes invalides ;
- retour arrière ;
- navigation mobile.

---

# 35. TESTS DE RÉGRESSION VISUELLE

Le site étant fortement visuel, prévoir la possibilité d'introduire des tests screenshot Playwright pour les pages critiques.

Pages candidates :

```text
/
 /voyages
 /voyages/[slug]
 /destinations/[slug]
 /contact
```

Ne pas rendre les screenshots inutilement fragiles.

---

# 36. SÉCURITÉ

Appliquer les principes OWASP.

Minimum :

- validation serveur ;
- sanitation des entrées ;
- protection contre injections ;
- CSRF selon architecture ;
- rate limiting sur endpoints sensibles ;
- pas de secrets dans Git ;
- headers de sécurité ;
- cookies sécurisés ;
- HTTPS en production ;
- dépendances maintenues ;
- logs sans données personnelles inutiles.

Ne jamais logger :

- mots de passe ;
- tokens ;
- secrets ;
- informations personnelles inutiles.

---

# 37. RGPD

Le site étant destiné à un public européen, prévoir une architecture compatible RGPD.

Le consentement doit être explicite lorsque nécessaire.

Ne pas installer de tracking non essentiel avant consentement lorsqu'il est légalement requis.

Prévoir une structure permettant ultérieurement :

- politique de confidentialité ;
- cookies ;
- mentions légales ;
- gestion du consentement.

Ne jamais inventer les textes juridiques définitifs.

Créer des placeholders clairement identifiés si les textes officiels ne sont pas fournis.

---

# 38. CONTENU

Le contenu doit être séparé du code autant que possible.

Ne pas disperser des chaînes métier dans 40 composants React.

Utiliser une stratégie claire :

- DB pour contenu dynamique ;
- constantes pour contenu purement technique ;
- composants pour structure ;
- metadata dédiée pour SEO.

L'objectif est qu'un futur CMS puisse être introduit sans réécrire toute l'interface.

---

# 39. ADMINISTRATION

Préparer l'architecture pour un espace :

```text
/admin
```

Mais ne pas construire un back-office massif lors de la première itération si le besoin métier n'est pas confirmé.

MVP possible :

- CRUD voyages ;
- CRUD destinations ;
- publication/dépublication ;
- gestion statut ;
- gestion dates ;
- gestion images ;
- demandes de contact/réservation.

Toute route admin doit être protégée.

---

# 40. AUTHENTIFICATION

Si un back-office est implémenté :

- authentification robuste ;
- sessions sécurisées ;
- rôles ;
- contrôle d'accès côté serveur.

Ne jamais considérer une simple protection frontend comme une sécurité.

Prévoir au minimum :

```text
ADMIN
EDITOR
```

si cela est nécessaire.

---

# 41. ROUTES PROPOSÉES

MVP :

```text
/
 /voyages
 /voyages/[slug]
 /destinations
 /destinations/[slug]
 /a-propos
 /contact
 /mentions-legales
 /politique-confidentialite
```

Infrastructure :

```text
/sitemap.xml
/robots.txt
```

Éventuellement :

```text
/admin
/admin/voyages
/admin/destinations
/admin/demandes
```

---

# 42. FOOTER

Le footer doit contenir :

- logo ;
- courte présentation ;
- navigation ;
- voyages ;
- contact ;
- réseaux sociaux ;
- mentions légales ;
- confidentialité ;
- copyright.

Les coordonnées doivent provenir d'une configuration centrale et non être répétées arbitrairement dans les composants.

---

# 43. RESPONSIVE DESIGN

Le design doit être conçu mobile-first.

Breakpoints à utiliser avec parcimonie.

Tester notamment :

- 320 px ;
- 375 px ;
- 390 px ;
- 768 px ;
- 1024 px ;
- 1280 px ;
- 1440 px.

Les flyers sont verticaux et très riches en informations, mais le site ne doit surtout pas reproduire cette densité sur mobile.

---

# 44. PRINCIPES UX

Toujours privilégier :

```text
clarté > décoration
```

```text
confiance > effet spectaculaire
```

```text
performance > animation
```

```text
contenu > artifice
```

Les animations doivent être subtiles.

Éviter :

- parallaxes excessives ;
- carrousels automatiques ;
- animations longues ;
- effets « luxury website » inutiles ;
- texte qui apparaît caractère par caractère partout ;
- vidéo autoplay lourde.

---

# 45. PHOTOGRAPHIE

La photographie doit donner une impression :

- authentique ;
- chaleureuse ;
- humaine ;
- lumineuse ;
- premium ;
- européenne ;
- voyage ;
- découverte.

Les images générées ou décoratives ne doivent jamais être présentées comme des photographies documentaires authentiques sans indication appropriée.

---

# 46. QR CODES

Les QR codes présents sur les flyers ne doivent pas être automatiquement réutilisés comme source de vérité.

Si un QR code doit être reproduit :

1. déterminer sa destination ;
2. vérifier la destination ;
3. utiliser une URL stable ;
4. générer le QR code à partir de cette URL ;
5. tester le scan.

Ne jamais recopier aveuglément un QR code visuel.

---

# 47. DOMAINE

Le domaine cible fourni pour le projet est :

```text
healing.nextgen-care.org
```

Mais plusieurs supports fournis semblent utiliser des variantes de domaine.

**Ne pas choisir silencieusement une autre variante.**

Créer une configuration :

```text
NEXT_PUBLIC_SITE_URL
```

et documenter le domaine canonique à confirmer avant production.

Le domaine canonique doit être utilisé pour :

- canonical URLs ;
- sitemap ;
- Open Graph ;
- JSON-LD ;
- emails ;
- liens absolus.

---

# 48. OBSERVABILITÉ

Prévoir une stratégie minimale :

- logs structurés côté serveur ;
- erreurs applicatives identifiables ;
- health check ;
- monitoring facilement intégrable.

Créer par exemple :

```text
/api/health
```

avec une réponse simple.

Le health check ne doit pas exposer de secrets.

---

# 49. HEALTH CHECK

Le système doit permettre de vérifier :

```bash
task health
```

et/ou :

```bash
curl http://localhost:3000/api/health
```

Réponse attendue :

```json
{
  "status": "ok"
}
```

Le health check peut vérifier les dépendances critiques si cela est pertinent.

---

# 50. DOCUMENTATION

Créer au minimum :

```text
README.md
ARCHITECTURE.md
CONTRIBUTING.md
```

Le README doit expliquer :

- prérequis ;
- installation ;
- `task setup` ;
- démarrage ;
- tests ;
- Docker ;
- variables d'environnement ;
- migrations ;
- seed ;
- CI locale ;
- création d'une PR.

---

# 51. ARCHITECTURE.MD

Documenter :

- choix technologiques ;
- architecture ;
- flux de données ;
- DB ;
- sécurité ;
- stratégie SEO ;
- stratégie images ;
- stratégie déploiement ;
- choix concernant le CMS ;
- limites connues.

Toute décision importante doit avoir une raison.

---

# 52. CONTRIBUTING.MD

Documenter le workflow :

```text
git checkout
→ développement
→ task ci
→ commit
→ push
→ PR
```

Avec une règle explicite :

> Ne jamais ouvrir une PR avec une CI locale rouge.

---

# 53. DEFINITION OF DONE

Une fonctionnalité n'est terminée que lorsque :

- [ ] code implémenté ;
- [ ] TypeScript strict valide ;
- [ ] lint valide ;
- [ ] format valide ;
- [ ] tests unitaires pertinents ;
- [ ] tests E2E pertinents ;
- [ ] responsive validé ;
- [ ] accessibilité vérifiée ;
- [ ] SEO vérifié ;
- [ ] aucun secret exposé ;
- [ ] Docker fonctionne ;
- [ ] documentation mise à jour ;
- [ ] `task ci` passe intégralement.

---

# 54. MÉTHODOLOGIE DE DÉVELOPPEMENT

Ne génère pas tout le projet en une seule réponse.

Travaille par étapes vérifiables.

## Phase 0 — Discovery

Avant d'écrire du code :

1. inspecter le repository ;
2. inspecter les fichiers existants ;
3. identifier un éventuel `ci.yml` ;
4. identifier package manager ;
5. identifier infrastructure existante ;
6. analyser les assets fournis ;
7. analyser le brand-board ;
8. identifier les incohérences ;
9. produire un court rapport ;
10. proposer les décisions techniques.

Ne supprimer aucun fichier existant sans justification.

---

# 55. PHASE 1 — FOUNDATION

Construire :

- Next.js ;
- TypeScript ;
- lint ;
- format ;
- Tailwind ;
- design tokens ;
- structure ;
- Docker ;
- Compose ;
- PostgreSQL ;
- Prisma ;
- Taskfile ;
- `.env.example`.

Objectif :

```bash
task setup
task dev
```

doivent fonctionner.

---

# 56. PHASE 2 — DESIGN SYSTEM

Construire :

- typography ;
- couleurs ;
- spacing ;
- buttons ;
- cards ;
- badges ;
- navigation ;
- footer ;
- form components ;
- responsive primitives.

Objectif :

Le site doit déjà ressembler clairement à Mindful Healing Trips avant d'implémenter toutes les pages.

---

# 57. PHASE 3 — CONTENT / DATA

Implémenter :

- Trip ;
- Destination ;
- status ;
- migrations ;
- seed ;
- repositories/services.

Objectif :

Les pages ne doivent pas dépendre de données codées en dur dans les composants.

---

# 58. PHASE 4 — PUBLIC WEBSITE

Implémenter :

```text
Home
Voyages
Voyage detail
Destinations
Destination detail
À propos
Contact
Footer/legal
```

---

# 59. PHASE 5 — FORMS / CONTACT

Implémenter :

- formulaire ;
- validation ;
- stockage si nécessaire ;
- email ;
- anti-spam ;
- erreurs ;
- confirmation ;
- tests.

---

# 60. PHASE 6 — SEO / ACCESSIBILITY / PERFORMANCE

Faire un passage dédié :

- SEO ;
- Lighthouse ;
- Core Web Vitals ;
- WCAG ;
- keyboard navigation ;
- screen reader ;
- metadata ;
- sitemap ;
- robots ;
- structured data ;
- image optimization.

Ne pas considérer cette phase comme optionnelle.

---

# 61. PHASE 7 — ADMIN

Uniquement si le périmètre MVP le justifie.

Construire progressivement :

```text
auth
→ dashboard
→ voyages
→ destinations
→ demandes
```

Ne pas créer un CMS maison complet sans besoin réel.

---

# 62. PHASE 8 — PRODUCTION READINESS

Vérifier :

- Docker build ;
- production build ;
- environment variables ;
- DB migrations ;
- backups ;
- logs ;
- healthcheck ;
- sécurité ;
- headers ;
- SEO ;
- monitoring ;
- documentation ;
- rollback strategy.

---

# 63. GIT WORKFLOW

Utiliser des commits petits et cohérents.

Exemples :

```text
feat: initialize next.js application
feat: add mindfultrip design tokens
feat: add trip domain model
feat: add trips listing
feat: add trip detail page
feat: add contact form
test: add trip status coverage
chore: add local ci task
```

Éviter les commits :

```text
fix everything
update
changes
final
final2
```

---

# 64. RÈGLE DE NON-RÉGRESSION

Avant toute modification importante :

1. comprendre le code existant ;
2. identifier les tests concernés ;
3. modifier ;
4. exécuter les tests ciblés ;
5. exécuter `task ci`.

Si `task ci` échoue :

**ne pas considérer la tâche terminée.**

---

# 65. RÈGLE SUR LES DÉPENDANCES

Avant d'ajouter une dépendance :

demander :

> Cette dépendance est-elle réellement nécessaire ?

Si une fonctionnalité peut être réalisée proprement avec les APIs natives, React, Next.js ou les primitives existantes, préférer la solution simple.

Chaque dépendance supplémentaire doit avoir une justification.

---

# 66. RÈGLE SUR LES ABSTRACTIONS

Ne pas créer d'abstraction avant d'avoir un besoin réel.

Préférer :

```text
simple + lisible
```

à :

```text
generic + clever
```

Le code doit pouvoir être compris rapidement par un autre ingénieur.

---

# 67. RÈGLE SUR L'IA

Tu peux utiliser ton raisonnement pour accélérer le développement mais tu dois produire du code :

- explicable ;
- testable ;
- maintenable ;
- déterministe ;
- lisible.

Ne pas générer de code uniquement pour impressionner.

---

# 68. RÈGLE SUR LES DONNÉES MANQUANTES

Lorsqu'une information métier est inconnue :

**NE PAS INVENTER.**

Utiliser :

```text
TODO
NEEDS_CONFIRMATION
```

et continuer l'implémentation lorsqu'elle ne bloque pas le développement.

Si elle bloque une décision d'architecture ou une information commerciale critique, poser une question ciblée.

Ne jamais poser dix questions alors que neuf décisions peuvent être prises raisonnablement.

---

# 69. RÈGLE DE COMMUNICATION

À chaque étape, fournir :

```text
OBJECTIF
CHANGEMENTS
FICHIERS
COMMANDES
TESTS
RISQUES
PROCHAINE ÉTAPE
```

Les réponses doivent être concises et orientées engineering.

---

# 70. LIVRABLE FINAL

À la fin de l'implémentation, le repository doit contenir au minimum :

```text
.
├── .github/
│   └── workflows/
│       └── ci.yml
├── prisma/
├── public/
│   └── ...
├── src/
├── tests/
├── e2e/
├── .dockerignore
├── .env.example
├── Dockerfile
├── compose.yaml
├── Taskfile.yml
├── README.md
├── ARCHITECTURE.md
├── CONTRIBUTING.md
├── package.json
├── tsconfig.json
├── eslint.config.*
└── ...
```

Adapter les fichiers aux versions réellement utilisées.

---

# 71. COMMANDES CONTRACTUELLES

Ces commandes doivent être disponibles :

```bash
task setup
task dev
task build
task test
task lint
task typecheck
task format
task format:check
task db:migrate
task db:seed
task db:reset
task test:e2e
task ci
task docker:build
task docker:up
task docker:down
```

Le minimum absolu pour considérer l'environnement opérationnel :

```bash
task setup
task dev
task ci
```

---

# 72. CRITÈRES D'ACCEPTATION GLOBAUX

Le projet est accepté lorsque :

### Produit

- [ ] la proposition de valeur est immédiatement compréhensible ;
- [ ] les voyages sont facilement découvrables ;
- [ ] les fiches voyages sont complètes ;
- [ ] les statuts sont cohérents ;
- [ ] les formulaires fonctionnent ;
- [ ] les informations de contact sont accessibles.

### Design

- [ ] l'identité Mindful Healing Trips est reconnaissable ;
- [ ] le logo officiel est utilisé sans modification ;
- [ ] la palette du brand-board est respectée ;
- [ ] Lora/Montserrat sont utilisées correctement ;
- [ ] le rendu est premium mais chaleureux ;
- [ ] le design fonctionne sur mobile.

### Engineering

- [ ] TypeScript strict ;
- [ ] architecture modulaire ;
- [ ] DB PostgreSQL ;
- [ ] Prisma ;
- [ ] validation Zod ;
- [ ] tests Vitest ;
- [ ] tests Playwright ;
- [ ] Docker ;
- [ ] Docker Compose ;
- [ ] Taskfile ;
- [ ] CI GitHub Actions ;
- [ ] CI locale équivalente ;
- [ ] `task ci` fonctionne.

### Production

- [ ] SEO ;
- [ ] accessibilité ;
- [ ] performance ;
- [ ] sécurité ;
- [ ] gestion des secrets ;
- [ ] healthcheck ;
- [ ] documentation ;
- [ ] configuration production.

---

# 73. PREMIÈRE ACTION À EFFECTUER

**NE COMMENCE PAS IMMÉDIATEMENT À CODER.**

Commence par effectuer une phase de reconnaissance du repository.

Tu dois d'abord :

1. inspecter l'arborescence ;
2. identifier le framework existant ;
3. identifier le package manager ;
4. chercher `ci.yml` ;
5. chercher `Dockerfile` ;
6. chercher `compose.yaml` / `docker-compose.yml` ;
7. chercher `Taskfile.yml` ;
8. chercher les fichiers de configuration ;
9. analyser les assets Mindful Healing Trips ;
10. identifier ce qui existe déjà ;
11. identifier ce qui manque ;
12. produire un **Engineering Discovery Report**.

Ensuite seulement, proposer le plan d'implémentation détaillé.

---

# 74. ORDRE DE PRIORITÉ

Lorsque plusieurs décisions sont possibles, appliquer cet ordre :

```text
1. Correctness
2. Security
3. Accessibility
4. Maintainability
5. Performance
6. SEO
7. UX
8. Visual fidelity
9. Developer experience
10. Novelty
```

La nouveauté technologique n'est jamais une priorité.

---

# 75. PRINCIPE FINAL

Le produit doit donner cette impression :

> **« Une agence de voyages humaine, chaleureuse et professionnelle, qui maîtrise parfaitement son expérience digitale. »**

Il ne doit pas donner cette impression :

> « Un template Next.js personnalisé. »

Le résultat final doit être suffisamment propre pour qu'un autre ingénieur puisse reprendre le repository dans six mois et comprendre rapidement :

- comment lancer le projet ;
- comment modifier un voyage ;
- comment ajouter une destination ;
- comment tester ;
- comment déployer ;
- comment vérifier la CI ;
- où se trouvent les règles métier ;
- où se trouvent les tokens de marque ;
- où se trouvent les secrets ;
- comment fonctionne la base de données.

**Tu es responsable non seulement de faire fonctionner l'application, mais de laisser derrière toi un repository professionnel, compréhensible et durable.**

Commence maintenant par le **Engineering Discovery Report**. Ne modifie aucun fichier avant cette étape.