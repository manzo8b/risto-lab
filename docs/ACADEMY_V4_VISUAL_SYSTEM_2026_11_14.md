# Risto-Lab — Visual identity v4
Date: 14 November 2026

## Approved source of truth
The user selected the blue–violet–cyan Risto-Lab cloche/education logo and an Instructor dashboard reference with a white frame, deep navy type, strongly colored module headers, purposeful shadows, and dense but clear interaction.

## Implementation
- The user-provided logo is included as a reduced WebP **exactly derived from the supplied picture**, not an invented symbol. Wordmarks use dark navy with purple “Lab”.
- The visual system is in `src/styles/academy-v4.css` and is imported **after existing styles** by Public, Instructor, PRISMA and Aula layouts.
- Strong violet/blue/teal/orange cards; background of the page is always white.
- Instructor: fixed brand sidebar and top search on desktop; horizontal working navigation and full-width content on mobile.
- The active public platform retains Home, Formazione, Programmi, Risorse, Premium, Aziende, Chi siamo and Instructor.
- Dashboard statistics reflect **26 curriculum units, 178 cataloged resources and 5 free safety lessons**. No fabricated active students or course completion rates.
- Unit 06 remains `PARTIAL` and subscription/company workflows remain planned rather than advertised as live.
- Menu Engineering formerly used cream paper panels. The new lesson skin uses white/navy/violet with mobile single-column responsive rules.
- Static deck on mise en place uses the same blue/violet identity.

## Quality gate before publishing
1. `npm run check`, `npm test`, `npm run build`, `npm run publication:gate`.
2. End-to-end Playwright: homepage/risorse/instructor, usability on 390px screens and actual asset loading.
3. axe WCAG accessibility regression + 200% font reflow.
4. No merge while test runs are red. Preserve original educational content, session/localStorage behaviour, privacy/legal declarations.

## Scope boundary
This is a functional CSS/layout and Instructor dashboard redesign, not the creation of accounts, student databases, paid services or real attendance statistics. Review on iPhone and physical projection remains a human verification step.
