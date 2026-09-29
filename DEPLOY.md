# Side Decks — Render Deployment

This package is intentionally **root-level**: `package.json`, `server.js`, `public/`, and `render.yaml` all live in the repository root. Do not create an extra `side-decks-site/` folder around these files.

## Easiest deployment

1. Create a new GitHub repository, for example `side-decks-website`.
2. Upload **the contents of this folder**, not the folder itself. Your GitHub repository should show `package.json` and `server.js` at the top level.
3. In Render, choose **New → Blueprint** and connect the repository. Render will detect `render.yaml`.
4. If creating a Web Service manually, use:
   - Runtime: Node
   - Build command: `npm install`
   - Start command: `npm start`
   - Health check path: `/healthz`
5. Add these environment variables in Render:
   - `SMTP_USER` = `sidedecks910@gmail.com`
   - `SMTP_PASS` = your Google App Password
6. Deploy.

## If you already uploaded the earlier package

If your GitHub repository currently looks like this:

```text
side-decks-site/
  package.json
  server.js
  public/
```

then either move the contents of `side-decks-site` to the repository root, **or** set Render's Root Directory to `side-decks-site` and make sure the build/start commands run there.

## Test

Open your Render URL. The homepage should load at `/`.

Open `/healthz` and you should see JSON similar to:

```json
{"ok":true,"service":"side-decks-web"}
```

Then submit the project form and verify the email arrives at `sidedecks910@gmail.com`.

## Gmail

Use a Google App Password, not your normal Gmail password. Never commit `.env` or credentials to GitHub.
