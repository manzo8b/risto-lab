# RISTO-LAB — Progressive human review

Scope: all professional and teaching tools. Outputs should be traceable, correctable and progressively improved; never claim optimality without a defined benchmark and evidence.

1. Acquire source data and retain provenance.
2. Analyze without inventing missing data or confirming uncertain evidence.
3. Expose uncertainty, missing inputs, discrepancies and review priorities.
4. Human reviewer records decision, evidence and responsibility where supported.
5. Recompute after corrections; retain versions and invalidate affected decisions where applicable.

This UX sprint implements navigation and static review guidance, not a shared review engine, cross-app synchronization, or automatic validation. Review guidance is not a completion indicator. Preserve current app palettes and functional logic. Local files are not transferred automatically. Release requires browser QA and owner approval under MANZO AI Web Production v1.3.0. Matrix v2.5 is a separate draft PR; reconcile overlapping navigation changes before merging both.

## Human Review Intelligence v0.1
Four read-only rule adapters inspect current in-memory data, group issues by record, expose high priority and direct navigation to native editors, and export an internal JSON review report with optional reviewer/reference/observations. Notes are not approvals and are reset when analyzed data changes. No automatic confirmation, no accuracy score, no new storage, no transfer between tools. Rule coverage is finite; zero detected issues does not mean verified. Food Cost restores original inputs from saved run, and the local QA server now serves .mjs as JavaScript. Matrix v2.5 is integrated with the shared shell in this branch; no public deployment until coordinated QA and approval.

## Progressive Quality Intelligence v0.2
Explicit local snapshots use a versioned portable JSON contract. Same application, project code, rule version and exact stable record-ID scope are required for comparison; Matrix rows without source IDs and Food Cost without a completed run cannot be compared. Changes are counts of detected checks, not accuracy or validated resolutions. The user must use distinct project codes for unrelated datasets. Local history is shared across apps on the same origin, with manual JSON backup/restore, conflict rejection, explicit deletion and a 100-snapshot / 2-million-character cap. No raw recipe data or automatic saving; user-entered notes may contain confidential references. Local storage is not encrypted, authenticated, or a backup. A provider adapter can replace local storage later; no cloud synchronization or identity is implemented.
