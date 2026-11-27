# Sprint 5 — International Quality Assurance, 27 November 2026

Scope: internal educational beta only, no consumer-facing food safety claims or legal certification. Audit baseline db9527c23320885bf2253357cfe6f5af5782cfe9: four workflows passed; Matrix gate 17 passed, 1 private fixture skipped. Regression 36 synthetic recipes/504 binary cells (55 positive, 449 negative) passed; not an independent population estimate. GI 0.8.1-draft, 209 concepts; seven GKB compound concepts with thirteen illustrative variants. Actual recipe/product composition requires human review.

| Dimension | Evidence / result | Remaining gate |
|---|---|---|
| Gastronomic | 36 closed-composition synthetic recipes; nested bread and sauces; conservative unresolved references | independent multilingual menus and actual preparation validation |
| Linguistic | 42 new representative terms, 14 groups x IT/ES/EN; earlier alternatives, pepper/pepperoni, yeast and claim/trace cases | dialect/variant coverage and nontrivial independent holdout |
| Regulatory | EU Annex II screening only, national guidance references and scope visible in UI/reports | operator-specific legal assessment; individual cereal/nut identities, exemptions, finished-food sulphite calculations, packaging/PPDS, national procedure |
| Documentary | versioned source references, SKU, trace versus presence; new final-state guard for pilot/unresolved links | actual original files, review per allergen, source authenticity/expiry, HACCP/cross-contact procedures |
| Data | IndexedDB CAS, stable recipe ingredient IDs, pinned dependency revisions, tests for transitive changes | full recovery/retention, cross-device/auth, actual product/recipe identity reconciliation |
| UX/accessibility | baseline browser route/mobile/axe serious-critical checks, general UX gate; new localised guidance and separate trace summary | manual keyboard/screen reader, device and export visual review, full WCAG assessment |

## Sources and interpretation
- EU 1169/2011: https://eur-lex.europa.eu/eli/reg/2011/1169/oj
- EU 2021/382: https://eur-lex.europa.eu/eli/reg/2021/382/oj
- IT D.Lgs. 231/2017: https://www.normattiva.it/eli/stato/DECRETO_LEGISLATIVO/2017/12/15/231/CONSOLIDATED
- ES RD 126/2015: https://www.boe.es/buscar/act.php?id=BOE-A-2015-2293
- England: https://www.legislation.gov.uk/uksi/2014/1855/contents
- Wales: https://www.legislation.gov.uk/wsi/2014/2303/contents
- Scotland: https://www.legislation.gov.uk/ssi/2014/312/contents
- Northern Ireland: https://www.legislation.gov.uk/nisr/2014/223/contents
- FSA guidance: https://www.food.gov.uk/business-guidance/allergen-guidance-for-food-businesses
- Food Standards Scotland: https://www.foodstandards.gov.scot/business-guidance/running-a-food-business/managing-allergens
Italy Article 19(8): food-specific information before service; written record available even if customer directed to staff. Additional official reference: https://portale-etichettatura.lab-to.camcom.it/somministrazione/ . Spain Article 6(5): oral route subject to accessible written/electronic information and signposting; Article 10 language. UK territorial rules distinct; 2025 FSA written guidance is best practice for non-prepacked food, not blanket statutory written-menu rule. PPDS is distinct. EU 2021/382 hygiene practices do not turn a software matrix into a HACCP plan. Sulphites strict >10 mg/kg or mg/l total SO2 ready for consumption; threshold remains a manual check, no guessed concentration. Empty cells and unchecked supplier lists do not establish absence. Trace codes separate from ingredient-presence codes, including in summary/export. No automatic confirmations. No change of regulatory engine when interface language changes. Final manual states blocked for unresolved or pilot-linked dishes; all export action handlers enforce acknowledgement; output remains internal only.

## Decision
NO-GO for consumer-facing or professional compliance certification. Candidate internal beta only after all updated CI passes, manual acceptance, review of remaining limitations and explicit owner approval. Do not merge automatically. No invented aggregate quality rating. 
