# Scholarship Atlas

Scholarship Atlas is a static, official-source directory for Master's and PhD funding in Data, AI, machine learning and related fields.

## Architecture

- **Framework:** Vinext App Router with `output: 'export'`.
- **Hosting:** GitHub Pages through GitHub Actions.
- **Data:** version-controlled JSON at `data/scholarship_library.json`.
- **Routes:** static home, directory, legal and scholarship detail pages. Every public scholarship is prerendered at build time.
- **Search:** client-side search, filters, sorting and controlled load-more on the directory page. URL parameters make directory searches shareable.

The build emits only static HTML, CSS, JavaScript, RSC payloads, metadata files and the public scholarship data bundled into the build. It uses no runtime API, database, server process or secrets.

## Local development

```bash
npm ci
npm run dev
```

Run checks before committing:

```bash
npm run lint
npm run validate:data
npm run build:pages
```

`build:pages` validates public records, statically exports every route, converts route files into GitHub Pages directory URLs, generates `robots.txt` and `sitemap.xml`, and checks the artifact.

## Scholarship data

Public records live in `data/scholarship_library.json`. The application excludes `REJECTED_INVALID` and `STALE` opportunities from the public directory.

When adding or updating a record, preserve:

- a unique `opportunity_id` and `canonical_key`;
- provider, title and official sources;
- structured programme, funding, requirement and cycle fields where known;
- `Unknown` where evidence is missing rather than inferred data;
- a current `last_verified` date.

`npm run validate:data` rejects duplicate IDs, duplicate canonical keys, missing public identity fields and invalid official-source URLs.

## GitHub Pages deployment

The workflow at `.github/workflows/deploy-pages.yml` runs on pushes to `main`:

1. installs dependencies with `npm ci`;
2. runs lint and data validation;
3. builds the static GitHub Pages artifact;
4. deploys `dist/client` with GitHub's official Pages actions.

In the repository settings, open **Pages** and choose **GitHub Actions** as the publishing source. The project URL is:

`https://hadibudhy.github.io/scholarship-atlas/`

The root user-site URL, `https://hadibudhy.github.io/`, belongs to the separate `hadibudhy.github.io` repository. Do not overwrite that repository to host this project.

## Custom domains

To add a custom domain later, configure it in repository **Settings → Pages**, then add the required DNS records at the domain provider. Update the canonical base URL in `app/layout.tsx`, `app/robots.ts` and `app/sitemap.ts` after the domain is active.

## Troubleshooting

- **Pages workflow fails:** run `npm ci`, `npm run lint`, `npm run validate:data` and `npm run build:pages` locally.
- **A detail page is missing:** confirm its ID is unique, it is not stale/rejected, and it has an official source URL.
- **Asset paths are wrong:** confirm the workflow deploys `dist/client`; the preparation script rewrites internal paths for the `/scholarship-atlas/` project base.
