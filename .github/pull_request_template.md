<!--
Title should follow Conventional Commits, e.g. feat(procurements): add supplier recap page
-->

## Summary

<!-- What this changes and why, in a few sentences. -->

## AI attribution

<!--
Required. If any part of this change was written by an AI model, name the model here —
the same name used in the commit's Co-Authored-By trailer, e.g. "Claude Opus 5".
Name every model if more than one was used. Write "None" if written entirely by hand.
-->

## Changes

<!-- One bullet per file or area touched, with a short note on what changed there. -->

-

## Verification

<!-- What you actually ran, and what it said. Note anything that could not be run here. -->

- [ ] `npm run lint`
- [ ] `npx tsc --noEmit`
- [ ] `npm run build`
- [ ] Checked in the browser (`npm run dev`)

## Notes

<!-- Delete the lines that do not apply. -->

- **Roles**: new or changed access rules in `proxy.ts` (`allowedRoles`), `lib/navigation.ts`, or in-component role checks — and which of ADMIN / STAFF / RESELLER / GUEST are affected.
- **Backend**: depends on a VMEDIS (`vmedis-proxy-api`) or HRIS (`apotek-hris`) change — link the PR and say whether it is already deployed.
- **Screenshots**: for user-visible changes, before/after.
