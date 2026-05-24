# npm Trusted Publishing

How to publish `@espresso-ui/cli` from GitHub Actions using **npm Trusted Publishing** (OIDC) instead of a long-lived `NPM_TOKEN` secret.

Trusted publishing uses short-lived tokens from GitHub Actions. npm verifies the workflow identity against a trusted publisher config on the package — no secret rotation, no leaked automation tokens.

**Related files:**

- Release workflow: [`.github/workflows/release.yml`](../.github/workflows/release.yml)
- CLI package: [`packages/cli/package.json`](../packages/cli/package.json)
- Publish readiness plan: [`docs/superpowers/plans/2026-05-24-npm-publish-readiness.md`](./superpowers/plans/2026-05-24-npm-publish-readiness.md)

> **Note:** The bare name `espresso-ui` is a npm security holding package and cannot be published. This project publishes as **`@espresso-ui/cli`**.

---

## Prerequisites

- npm org **`@espresso-ui`** created at [npmjs.com/org/create](https://www.npmjs.com/org/create)
- Package **`@espresso-ui/cli`** exists on npm (see [First publish](#first-publish) below)
- GitHub repo: `harshtandiya/espresso-ui`
- Release workflow filename: **`release.yml`** (must match npm config exactly, including `.yml`)
- GitHub-hosted runners (self-hosted runners are not supported for trusted publishing)

---

## First publish

Trusted publishing is configured **per package on npm**. The package must exist before you can link a trusted publisher.

If `@espresso-ui/cli` is not on npm yet, publish once manually:

```bash
cd packages/cli
pnpm build
npm login
npm publish --access public
```

After that, CI can handle all subsequent releases via trusted publishing.

---

## 1. Configure trusted publisher on npm

1. Open [npmjs.com/package/@espresso-ui/cli/access](https://www.npmjs.com/package/@espresso-ui/cli/access)  
   (or your package page → **Settings** → **Publishing access**)
2. Under **Trusted Publishers**, click **Add** → **GitHub Actions**
3. Fill in exactly (case-sensitive):

| Field                    | Value                                            |
| ------------------------ | ------------------------------------------------ |
| **Organization or user** | `harshtandiya`                                   |
| **Repository**           | `espresso-ui`                                    |
| **Workflow filename**    | `release.yml`                                    |
| **Environment**          | leave blank (unless you use GitHub Environments) |

4. Save

The workflow filename must match `.github/workflows/release.yml` → configure as **`release.yml`**.

---

## 2. Update the release workflow

Remove the `NPM_TOKEN` secret from the workflow. Keep OIDC permissions and provenance.

Required permissions (already present):

```yaml
permissions:
  contents: read
  id-token: write # required for OIDC
```

Example publish steps:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: "22"
    registry-url: https://registry.npmjs.org

# Trusted publishing requires npm CLI 11.5.1+
- run: npm install -g npm@latest

# Avoid setup-node writing an empty _authToken (see gotcha below)
- run: npm config delete //registry.npmjs.org/:_authToken --location=user || true

- run: npm publish --provenance --access public
  working-directory: packages/cli
  # no NODE_AUTH_TOKEN / NPM_TOKEN
```

Then delete the **`NPM_TOKEN`** repository secret from GitHub — it is no longer needed.

---

## 3. Known gotcha: `setup-node` + empty token

`actions/setup-node` with `registry-url` writes this to `.npmrc`:

```ini
//registry.npmjs.org/:_authToken=${NODE_AUTH_TOKEN}
```

When `NODE_AUTH_TOKEN` is unset (the expected state for trusted publishing), npm may try classic auth with an empty token instead of OIDC, failing with `ENEEDAUTH` or `404`.

**Fix:** delete that line before publish (see workflow example above), or omit `registry-url` on `setup-node` if your npm version supports OIDC without it.

Reference: [npm/documentation#1960](https://github.com/npm/documentation/issues/1960)

---

## 4. Cut a release

```bash
pnpm release              # bump version, commit, tag (e.g. v0.1.0)
git push --follow-tags    # triggers .github/workflows/release.yml
```

The workflow runs checks, builds the CLI + bundled registry, and publishes. npm validates the OIDC token against your trusted publisher config.

Verify on npm: https://www.npmjs.com/package/@espresso-ui/cli

---

## Checklist

- [ ] npm org `@espresso-ui` created
- [ ] Package exists on npm (one manual publish if needed)
- [ ] Trusted publisher configured: `harshtandiya` / `espresso-ui` / `release.yml`
- [ ] `id-token: write` in release workflow
- [ ] `NPM_TOKEN` removed from workflow and GitHub secrets
- [ ] npm CLI ≥ 11.5.1 in the publish job
- [ ] `repository` field in `packages/cli/package.json` points at this GitHub repo
- [ ] Smoke test after first CI publish:

  ```bash
  npm install -g @espresso-ui/cli
  espresso-ui init
  espresso-ui add button
  ```

---

## Fallback: classic `NPM_TOKEN`

If trusted publishing is not set up yet, the release workflow can use a classic automation token instead:

1. npm → **Access Tokens** → **Generate New Token** → **Automation**
2. GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
3. Name: **`NPM_TOKEN`**
4. Workflow env:

   ```yaml
   env:
     NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
   ```

Prefer trusted publishing for production — no long-lived secrets to rotate or leak.

---

## References

- [npm: Trusted publishing for npm packages](https://docs.npmjs.com/trusted-publishers/)
- [GitHub: OpenID Connect in Actions](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
