# SPCA website concept — demo

> **Independent concept by Mikhail Gorbunov — not affiliated with or endorsed by SPCA. No real payments or data.**

A clickable prototype for the **spca.nz replatform**, built alongside my application for the Website Project Manager role. It makes the three directions from my deck *“Replatforming spca.nz — an outside-in view”* concrete:

1. **Clear paths** — a home page built around what people come to do (Adopt · Give · Get help · Get involved), better adoption matching, and a report-cruelty flow that asks one question first.
2. **Giving that grows** — every amount maps to an outcome, a live campaign goal, one-tap wallets, and a Gifts in Wills page with one clear first step.
3. **Real life on the site** — a year calendar of campaigns and centre events, and a home page that changes with the season (“campaign mode”).

**Live demo:** https://spca-demo.vercel.app — private, password in my cover letter.

## ⚠️ Everything is mocked

- **Payments** — Apple Pay, Google Pay and card are simulated sheets. There are no card fields and nothing is charged.
- **Adopets** — the application step is a clearly labelled mock of the partner platform. The hand-off link uses a `.example` domain and is never opened.
- **CRM, email, forms** — nothing is sent anywhere. Every form resolves in the browser with a fake reference number.
- **Analytics** — events are listed in the Demo panel only; nothing goes to GA4 or any other service.
- **Data** — animals, people, phone numbers, opening hours, after-hours vets, events and campaign figures are invented. Centre names follow SPCA's public list; coordinates are approximate.
- **Call buttons never dial** — they explain what the live site would call, plus “In a real emergency call 111 or your local SPCA centre.”
- **No tracking, no third parties** — the only network requests are the site's own pages and static assets. Fonts are self-hosted.
- **Not indexed** — `noindex, nofollow` on every response (header and meta) and a `robots.txt` that disallows everything.

No SPCA logo, code, copy or photos are used: the wordmark is plain text and the palette is only inspired by the brand.

## Two-minute tour

1. **Home** — four goals, one tap each. Tap **Near me** (or *Use my location*) to pick your centre; opening hours, animals, events and phone numbers follow you across the site.
2. **Demo panel** (orange button in the top banner) — jump to *Clear the Shelters* and watch the home page lead with half-price adoption; try *Christmas appeal* or *Kitten season* too.
3. **Adopt** — filter by **energy level** and **experience needed** (new), sort by *nearest*, *newest* or *waiting longest*, save favourites, or take the **60-second match quiz**. Open a profile: photo first, sticky *Apply for {name}* bar, then the **Adopets hand-off** that carries the animal ID, centre and UTMs.
4. **Give** — pick an amount and see exactly what it does (custom amounts show the closest outcome), switch to monthly, pay with the simulated Apple Pay sheet, and see your slice of the campaign goal on the thank-you page. Then look at **Gifts in Wills**.
5. **Get help** — “Is an animal in danger right now?” Set the Demo panel to **After hours** and answer *Yes*: you get the nearest after-hours vet instead of a closed centre. *No* opens a short multi-step report.
6. **What's on** — the whole year on one calendar, filterable by centre and type, every event with a call to action.

## Run it locally

Requires Node.js 20+.

```bash
npm install
echo "DEMO_PASSWORD=choose-a-local-password" > .env.local
npm run dev
```

Open http://localhost:3000 and sign in with the password you chose. `.env*` files are git-ignored.

Other scripts: `npm run build`, `npm run lint`, and `npm run photos` (re-downloads the Unsplash photos and regenerates the resized WebP files and `lib/photos.generated.ts`).

### Deploying

The app runs on Vercel's free plan. Set one environment variable in the Vercel project — `DEMO_PASSWORD` — and deploy. There is no other secret, database or paid service.

## How it's built

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Vercel. Mobile-first at 375 px, WCAG 2.2 AA basics (labels, contrast, focus states, keyboard use, reduced motion).

- **Password gate** — `proxy.ts` checks a signed, httpOnly session cookie on every request (pages *and* images); without it you're redirected to `/password`. The cookie is an HMAC keyed by `DEMO_PASSWORD`, so changing the password signs everyone out.
- **Service adapters** — every integration is a typed module in `lib/services` over in-memory data in `lib/mocks`, so each can be swapped for a real one.
- **Fast photos** — photos are pre-sized WebP files (256–1440 px) served through `next/image` with a custom loader, responsive `sizes`, blur placeholders and a high-priority hero.
- **Demo state** — simulated date, time of day and location live in plain cookies, so the server renders the right campaign on first paint.

See **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** for the route map, the adapter layer and what a real implementation would look like.

Lighthouse (mobile, production, 27 Sep 2026): Performance 93–99 and Accessibility 100 on home, adopt listing, a profile and Give. SEO scores are low by design because every page is `noindex`.

## Photo credits

All photos are from [Unsplash](https://unsplash.com) under the [Unsplash Licence](https://unsplash.com/license), stored locally in `public/photos` (resized). Animal names and stories are invented and have nothing to do with the animals pictured.

| Key | Photo | Photographer | Source |
|---|---|---|---|
| `dog-tui` | A tan, long-coated dog sitting by a wooden fence | Laula Co | https://unsplash.com/photos/ufPziMiRqU8 |
| `dog-moana` | A brown dog with a red collar sitting indoors | Devin H | https://unsplash.com/photos/tGXl4gAvUwU |
| `dog-pip` | A black and white border collie with a red collar outdoors | Katie Bernotsky | https://unsplash.com/photos/bP10_VqLnnw |
| `dog-kiri` | A young tricolour dog looking up from the grass | Austin Kirk | https://unsplash.com/photos/QZenflkkwt0 |
| `dog-honey` | A golden puppy with a red collar looking to the side | Berkay Gumustekin | https://unsplash.com/photos/ngqyo2AYYnE |
| `dog-nana` | An older golden dog resting its head on the floor | Linoleum Creative Collective | https://unsplash.com/photos/ZQu-3viOINA |
| `dog-bruno` | A large chocolate-brown dog with soft eyes | Michael | https://unsplash.com/photos/PVlnNm5RHSM |
| `dog-scruff` | A scruffy black and grey dog lying on a blue sofa | Loren Cutler | https://unsplash.com/photos/-H5KIjcVxwI |
| `dog-sunny` | A cream Labrador smiling in a sunny field | Daniel Hering | https://unsplash.com/photos/0_ole_Z2pV8 |
| `dog-rangi` | A German shepherd lying in green grass | AcidFern | https://unsplash.com/photos/pbjcPSXUI2M |
| `dog-jazz` | A small black, white and tan dog against a pink wall | Victor G | https://unsplash.com/photos/N04FIfHhv_k |
| `dog-biscuit` | A corgi puppy lying down with its tongue out | fatty corgi | https://unsplash.com/photos/1QsQRkxnU6I |
| `cat-oreo` | A fluffy black and white cat on a dark background | Paul Hanaoka | https://unsplash.com/photos/o6RbK3y7mK4 |
| `cat-maple` | A close-up of a tortoiseshell cat's face | Tatyana Eremina | https://unsplash.com/photos/cQDu1G6lmRM |
| `cat-tigger` | A wide-eyed tabby cat | Anton Darius | https://unsplash.com/photos/fP3NaY3VUPM |
| `cat-luna` | A Siamese-cross cat with blue eyes lying down | Felix Mittermeier | https://unsplash.com/photos/X_rJfNo0CdQ |
| `cat-mr-fluff` | A long-haired tabby cat relaxing outdoors | Bee Felten-Leidel | https://unsplash.com/photos/DkYlK2vyuZg |
| `cat-patches` | A white, tan and black cat looking at the camera | Sandy Millar | https://unsplash.com/photos/DrfFgts5sUA |
| `cat-smokey` | A grey cat asleep on someone's lap | Paul Stollery | https://unsplash.com/photos/0Y2jGnBKdEU |
| `cat-pumpkin` | An orange tabby kitten walking through grass | Andriyko Podilnyk | https://unsplash.com/photos/RCfi7vgJjUY |
| `cat-pebble` | A small grey and white kitten on a bed | Kote Puerto | https://unsplash.com/photos/so5nsYDOdxw |
| `cat-salt-pepper` | Two tabby and white kittens cuddled in a basket | Amy Baugess | https://unsplash.com/photos/MNju0A6EeE0 |
| `cat-kowhai` | A brown tabby cat with green eyes | Lloyd Henneman | https://unsplash.com/photos/mBRfYA0dYYE |
| `rabbit-clover` | A lop-eared fawn rabbit sitting on grass | Waranya Mooldee | https://unsplash.com/photos/Efj0HGPdPKs |
| `rabbit-snow` | A white rabbit on green grass | Pablo Martinez | https://unsplash.com/photos/AdagxtVKRWE |
| `rabbit-duo` | Two small rabbits snuggled together | Lorna Ladril | https://unsplash.com/photos/3MSQtgCvyWg |
| `gp-duo` | Two guinea pigs sharing grated carrot | Bonnie Kittle | https://unsplash.com/photos/MUcxe_wDurE |
| `hero-hug` | A woman hugging a happy black dog in a field | Wade Austin Ellis | https://unsplash.com/photos/FtuJIuBbUhI |
| `hero-friends` | A white dog and a grey cat cuddling on the grass | Krista Mangulsone | https://unsplash.com/photos/9gz3wfHr65U |
| `hero-cuddle` | A woman laughing as she hugs a brown and white dog | Helena Lopes | https://unsplash.com/photos/WhBGINtjuwc |
| `hero-lap-cat` | An orange and white cat resting on someone's lap | Helena Lopes | https://unsplash.com/photos/ZpMkK7nji-w |
| `hero-run` | Two small dogs running happily down a dirt road | Alvan Nee | https://unsplash.com/photos/T-0EW-SEbsE |
| `hero-cupcakes` | A row of cupcakes with teal icing and sprinkles | Brooke Lark | https://unsplash.com/photos/pGM4sjt_BdQ |
| `hero-play` | A smiling woman holding up a small dog outdoors | Manuel Meza | https://unsplash.com/photos/KvKop_a_EXw |
| `hero-pat` | A hand gently patting a scruffy grey dog | Simone Dalmeri | https://unsplash.com/photos/FUR242Eu_z4 |
| `hero-bed` | A dog curled up in a soft grey dog bed with a blanket | Jamie Street | https://unsplash.com/photos/s9Tf1eBDFqw |
| `hero-kittens` | A basket full of kittens | The Lucky Neko | https://unsplash.com/photos/2JcixB1Ky3I |

---

Made by Mikhail Gorbunov, September 2026.
