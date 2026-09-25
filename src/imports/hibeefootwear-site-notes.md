# Hibeefootwear — Website Notes

## Brand summary
Hibeefootwear is a Lagos, Nigeria-based handmade leather footwear brand. Products are made **bespoke / pre-order only** — shoes, sandals, and "palm slippers" — cut and stitched to order rather than sold as ready stock. Registered business: **RC 2375499**.

## Confirmed contact details
- WhatsApp: 0809 744 4087 (+234 809 744 4087)
- WhatsApp (secondary, from X profile): +234 817 158 3601
- Email: hibeefootwear@gmail.com
- Instagram: [@hibeefootwear](https://www.instagram.com/hibeefootwear)
- Facebook: [/hibeefootwear](https://www.facebook.com/hibeefootwear) — 1,293 likes
- Old/legacy site referenced on X: hibeewearsonline.com (not currently active)

## Design direction used
- **Palette:** cream/parchment background (#F1E8D9), espresso brown (#3B2A1E), hide tan (#C99A66), rust accent (#A84B2A), ink (#221610) — leather-workshop tones, not a generic SaaS palette.
- **Type:** Fraunces (serif, for headings — has craft/warmth) + Work Sans (body).
- **Layout motifs:** a dashed "stitch line" divider (nods to leather stitching), a numbered 4-step process section (used because the ordering process really is sequential — ask → confirm → make → deliver), a plain two-column contact list rather than a form (since orders go through WhatsApp/DM, not a web form).

## Site sections (as built)
1. **Hero** — headline, one-line pitch, "Shop the range" + WhatsApp CTA, RC number as trust signal.
2. **About** — three short cards: bespoke-only, genuine leather, Lagos-made.
3. **How it's made** — the 4-step ordering process (ask → confirm size/details → handmade → delivered).
4. **Shop (product grid)** — filterable by Shoes / Sandals / Palm slippers, each with an "Add to cart" button. No account or login required.
5. **Cart drawer** — slides in from the right: shows items, quantity +/− controls, remove, running subtotal. Persists between visits (stored in the browser only, per device).
6. **Checkout → WhatsApp** — "Order via WhatsApp" opens WhatsApp with a pre-filled message listing every item, quantity and estimated line total, plus a note that final price/sizing is confirmed by the workshop. No payment is taken on-site — this is a lead-in to the existing WhatsApp ordering flow, not a payment gateway.
7. **Contact** — WhatsApp CTA, both phone numbers, email, Instagram, Facebook, location.

## Product catalogue — placeholder data
The 9 products, names, and prices (₦9,000–₦32,000) currently on the site are **placeholders I wrote** so the cart has something real to demonstrate — they are not confirmed items or prices from the owner. Before this goes live, replace `products` array in the `<script>` block (near the bottom of the file) with:
- Real product names and photos
- Real starting prices (or remove prices if he'd rather quote everything privately)
- Real category groupings if they differ from Shoes / Sandals / Palm Slippers

## How the cart technically works
- Pure front-end, no backend, no account/login — anyone can add/remove items immediately.
- Cart state is saved in the visitor's browser (localStorage) so it survives a page refresh, but is private to that device/browser.
- "Order via WhatsApp" builds a text message from the cart contents and opens `wa.me` with it pre-filled — the customer still has to hit send, and the owner completes the order the same way he does today.

## Open items / things to get from the owner before launch
- Real product photos for each item (currently a styled icon stands in per category — shoe / sandal / slipper).
- Real product list, names and prices to replace the placeholder catalogue above.
- Confirm which WhatsApp number should receive orders (site currently sends to 0809 744 4087).
- Any specific past customers, testimonials, or press mentions to add credibility.
- Whether hibeewearsonline.com should be revived/redirected or retired in favor of the new site.
- Logo/wordmark — the site currently uses a text wordmark ("Hibeefootwear") styled in Fraunces; a real logo can replace this.

## File delivered
- `hibeefootwear.html` — single self-contained page, published as a link the owner can open on any device.
