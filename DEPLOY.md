# Side Decks — Render Deployment Guide

This package is configured specifically for Render as a Node/Express web service.

## 1. Create the GitHub repository

Create a new GitHub repository (for example, `side-decks-website`) and upload the **contents of this folder**. Do not upload `.env` or any Gmail password.

The repository should contain `package.json`, `server.js`, `render.yaml`, and `public/` at its root.

## 2. Deploy with Render Blueprint

1. Sign in to Render.
2. Choose **New → Blueprint**.
3. Connect the GitHub repository.
4. Render will detect `render.yaml`.
5. Confirm the service named `side-decks` and create/deploy it.

The included Blueprint uses Render's Free web service plan. Free services can sleep when idle. For a business site, you can change the service to a paid always-on plan later.

## 3. Add Gmail credentials

In the Render service, open **Environment** and enter:

- `SMTP_USER` = `sidedecks910@gmail.com`
- `SMTP_PASS` = your Google **App Password**

The Blueprint already supplies:

- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=465`
- `SMTP_SECURE=true`
- `MAIL_TO=sidedecks910@gmail.com`

Use a Google App Password, not the normal Gmail password. The Google account must have 2-Step Verification enabled before an App Password can be created.

## 4. Test the deployed site

Open the Render URL and submit a test inquiry with one small JPG or PNG. Confirm that the message arrives at `sidedecks910@gmail.com` and that the uploaded file is attached.

The health endpoint is:

`/healthz`

It should return a small JSON response showing `ok: true`.

## 5. Connect the custom domain

In Render, open the service and choose **Settings → Custom Domains**. Add the Side Decks domain and follow Render's DNS instructions at your domain registrar.

After DNS propagates, confirm the site loads over HTTPS and submit another test inquiry.

## 6. Before advertising the site

- Replace design-direction cards with real project photos as projects are completed.
- Add a business phone number and click-to-call link if desired.
- Add a privacy policy and any required business/legal disclosures.
- Verify the service area and project types.
- Test the form from a phone as well as a desktop.
- Consider upgrading from Render Free to an always-on paid instance for a customer-facing production site.

## Troubleshooting

### Email does not arrive

Check Render → Environment for `SMTP_USER` and `SMTP_PASS`. Make sure the password is a Google App Password, not the normal Gmail password. Then review the Render service logs.

### The site works but uploads fail

The form accepts up to 8 files, with a maximum of 10 MB per file. Supported types are JPG, PNG, WEBP and PDF.

### Render says the service is unhealthy

Open `/healthz`. If it does not return `ok: true`, check the Render logs for a startup error.
