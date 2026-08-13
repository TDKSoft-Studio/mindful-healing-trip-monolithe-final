# Contributing

## Contrat d'ingénierie

Avant toute modification significative, lire
[`docs/assets/CLAUDE_ENGINEERING_CONTRACT.md`](docs/assets/CLAUDE_ENGINEERING_CONTRACT.md) -
c'est la source de vérité du projet. En cas de contradiction entre le code
existant et le contrat, ne pas trancher silencieusement : signaler ce qui
existe, ce que demande le contrat, pourquoi il y a divergence, et une
recommandation.

## Stratégie de branches

Modèle à deux branches longues, comme dans la plupart des organisations tech
à l'échelle :

```text
main                    ← production. Protégée. Reçoit uniquement des PR
  ↑                       depuis develop (releases), jamais de push direct.
develop                  ← intégration. Protégée. Reçoit uniquement des PR
  ↑                        depuis des branches courtes, CI obligatoire.
feature/<sujet>            ← une branche par sujet de travail, courte durée
fix/<sujet>                   de vie, supprimée après merge.
chore/<sujet>
docs/<sujet>
```

Règles :

- **`main`** : toujours déployable. Aucun push direct - uniquement des PR
  `develop` → `main` au moment d'une release.
- **`develop`** : branche d'intégration continue. Aucun push direct -
  uniquement des PR depuis des branches courtes. C'est la base par défaut
  pour tout nouveau travail.
- **Branches courtes** (`feature/`, `fix/`, `chore/`, `docs/`) : créées
  depuis `develop`, une par sujet, fusionnées puis supprimées. Pas de
  branches longue durée en dehors de `main`/`develop`.
- **Protection de branche** (à configurer par un administrateur du
  repository - GitHub Settings → Branches, non automatisable depuis les
  outils disponibles à ce jour) :
  - `main` et `develop` : pull request obligatoire (pas de push direct, pas
    de force-push, pas de suppression) ; au moins une review approuvante ;
    le check `CI / ci` (`.github/workflows/ci.yml`) doit être vert ;
    branche à jour avec la base avant merge.
  - `main` : en plus, restreindre qui peut merger (ex. leads uniquement) si
    l'équipe le juge nécessaire.

## Workflow Git

```text
git checkout develop
git pull
git checkout -b feature/<sujet>
→ développement
→ task ci
→ commit
→ push
→ Pull Request vers develop
```

**Règle absolue : ne jamais ouvrir une Pull Request si `task ci` échoue
localement.** Le CI GitHub (identique à `task ci`) doit également être vert
avant tout merge - voir la protection de branche ci-dessus.

### Commits

Petits et cohérents, préfixés par convention (`feat:`, `fix:`, `chore:`,
`docs:`, `test:`, ...). Éviter les messages génériques (`fix everything`,
`update`, `final`).

## Avant de coder

1. Comprendre le contrat.
2. Comprendre le code existant concerné.
3. Modifier le minimum nécessaire.
4. Ajouter/adapter les tests pertinents.
5. Exécuter les validations ciblées, puis `task ci` en entier.
6. Ne considérer la tâche terminée que si `task ci` est vert.

## Dépendances

Avant d'ajouter une dépendance, se demander si elle est réellement
nécessaire. Préférer les APIs natives, React, ou Next.js à une librairie
pour une fonctionnalité de quelques lignes (contrat §65).

## Definition of Done

Une fonctionnalité n'est terminée que lorsque :

- [ ] code implémenté
- [ ] TypeScript strict valide (`task typecheck`)
- [ ] lint valide (`task lint`)
- [ ] format valide (`task format:check`)
- [ ] tests unitaires pertinents (`task test`)
- [ ] tests E2E pertinents (`task test:e2e`)
- [ ] responsive validé (desktop + mobile)
- [ ] accessibilité vérifiée
- [ ] SEO vérifié (quand applicable)
- [ ] aucun secret exposé
- [ ] Docker fonctionne (`task docker:build`)
- [ ] documentation mise à jour (README / ARCHITECTURE / ce fichier)
- [ ] `task ci` passe intégralement

## Données manquantes ou incertaines

Ne jamais inventer une information métier. Utiliser `TODO` ou
`NEEDS_CONFIRMATION` et continuer si cela ne bloque pas le développement ;
poser une question ciblée uniquement si cela bloque réellement une décision
d'architecture ou une information commerciale critique (contrat §68).
