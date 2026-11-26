# Matrice Allergeni 2.8 — Ingredient Intelligence & Recipe Decomposition

Status: design specification, not implemented.

## Data contract

- Stable ingredient/component IDs; versioned recipe or supplier product references; distinguish product, ingredient and subrecipe.
- Explicit composition entries, quantity/unit optional for qualitative analysis; supplier identity, specification version/date, source, status, reviewer and cross-contact declarations separately recorded.
- Three knowledge levels: lexical match; culinary hypothesis (state 2 only); documented product or internal subrecipe (documentary evidence for human review, never automatic confirmation).
- Linked component graph supports reusable preparations such as bread, pesto, sauces. User explicitly chooses which actual product or recipe is used; never resolve by name alone. Missing/ambiguous references remain unresolved. No automatic inference of absence.
- Detect cycles, invalid references, stale specifications and excessive nesting; fail visibly rather than silently dropping components. Changes invalidate prior review for affected dishes. Preserve source evidence path and component versions in session/export. No vendor claims substituted for actual label.
- Keep EU 14 groups separate from supplemental allergens and cross-contact. Keep sulphite threshold review separate from ingredient-name detection; no automatic declaration of absence or presence.

## Delivery sequence

1. Define canonical versioned graph and fixtures with nested bread, alternatives, missing references and cycles.
2. Add read-only import of explicitly selected recipe/supplier archives after validating actual schemas; no silent sync.
3. Display composition tree and evidence origin, support explicit selection and review.
4. Export path, version and unresolved components to Excel/Word/Markdown/PDF/JSON; preserve existing safety gates and visual system.
5. Benchmark on closed-composition synthetic recipes; test both generic bread and explicit wheat/rice variants. Independently validate real recipes with OSA. No rollout until gates pass.
