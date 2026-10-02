# talaltech.thequreshico.ca

TalalTech's app website, served by GitHub Pages from this repo's root.

- Edit text in `content/apps.mjs` (apps, FAQs, how-to, store links) and the
  policies in `content/policies/`, or page layouts in `build.mjs`.
- Run `node build.mjs` and commit the regenerated `.html` files.
- When an app goes live in a store, put its link in `stores.play.url` or
  `stores.appStore.url` — the "Coming soon" button becomes a real link.

Privacy policy URLs for store listings:
- https://talaltech.thequreshico.ca/calamus3/privacy/
- https://talaltech.thequreshico.ca/adaptiveplanner/privacy/

The Calamus3 policy comes from the Calamus3 repo (`npm run privacy:export`);
AdaptivePlanner's from its `docs/privacy-policy.html`. Re-copy them when the
apps' policies change.
