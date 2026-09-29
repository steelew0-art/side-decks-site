# Side Decks — Customer-Facing Website

A polished coastal North Carolina marketing site and project inquiry form for Side Decks.

## Included
- Responsive customer-facing homepage
- Our Work / design directions
- Deck Types
- About / Side Decks approach
- Four-step process
- Service Area: Pender, New Hanover and Brunswick counties
- FAQs
- Project inquiry form
- Photo, sketch, plan and PDF uploads (up to 8 files, 10 MB each)
- Email delivery to `sidedecks910@gmail.com` through Gmail SMTP
- Mobile navigation and accessible form controls

## Run locally
1. Install Node.js 18+.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Add the Gmail SMTP credentials described below.
5. Run `npm start`.
6. Open `http://localhost:3000`.

## Gmail setup
Use a Google account that is authorized to send the inquiries. For Gmail, use an App Password rather than your normal Google password. Set:

- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=465`
- `SMTP_SECURE=true`
- `SMTP_USER=your-sending-address@gmail.com`
- `SMTP_PASS=your-16-character-app-password`
- `MAIL_TO=sidedecks910@gmail.com`

The visitor's email is used as the Reply-To address so you can reply directly to the homeowner.

## Deployment
This is a standard Node/Express site and can be deployed to a Node-capable host such as Render, Railway, Fly.io, or a VPS. Configure the environment variables on the host rather than committing `.env` to source control.

## Content note
The “Our Work” cards are explicitly presented as design directions rather than claims of completed projects. Replace them with real project photography as the Side Decks portfolio grows.
