# Design tokens

Source of truth for the visual system as it is used in the app. Values below are the ones defined or repeated in code. Tailwind's default scale supplies the spacing, type size, radius, and breakpoint numbers unless a file sets its own.

Defined in `src/app/globals.css` (`@theme inline`) and loaded from `src/app/layout.tsx`.

## Color

| Token | Value | Use |
| --- | --- | --- |
| `navy` | `#10243e` | Titles, header and footer background, some buttons. Class `text-navy`, `bg-navy`, `border-navy`, `hover:border-navy`. |
| `navy-2` | `#1a3d66` | Defined in `globals.css`. No component uses it. |
| `crimson` | `#8e1b2a` | The 4px bar at the top of the header, links, the signup button, focus ring, veto badge. |
| `cream` | `#f4f0e8` | Page background (`body`) and topic chips (`bg-cream`). |
| `paper` | `#fffcf8` | Cards, header, form panels (`bg-paper`). |
| `ink` | `#1a2330` | Default text color. |
| `muted` | `#5c6b7a` | Secondary text (`text-muted`). |
| `line` | `#e3dcd0` | Borders and dividers (`border-line`, `divide-line`). |
| `white` | CSS white | Text on navy and crimson. Footer copy uses `text-white/80`. The sponsor close control uses `text-white/90` and `hover:bg-white/10`. |
| Form fields | `bg-white` | Inputs and selects. |

`color-scheme` is `light`. Focus visible is a 2px crimson outline, offset 2px.

## Type

Fonts, in `src/app/layout.tsx` via `next/font/google`, subsets `latin`:

- Source Sans 3 is the body font (`--font-source-sans`). The CSS fallback is `"Source Sans 3", sans-serif`.
- Source Serif 4 is used for `h1`, `h2`, `h3`, and `.font-serif` (`--font-source-serif`). The CSS fallback is `"Source Serif 4", Georgia, serif`.

Weights in components are regular and `font-semibold`. The app does not use `font-bold`.

Sizes are Tailwind's default scale. What the pages actually use:

| Class | Typical role |
| --- | --- |
| `text-xs` | Eyebrows, meta, source notes. Often uppercase. |
| `text-sm` | Nav, secondary copy, form labels, footer. |
| `text-base` | Bill summary and form fields. |
| `text-lg` | Landing lede and the footer site name. |
| `text-xl` | A hot-topic card title. |
| `text-2xl` | Site title in the header, and section headings. |
| `text-3xl` | Page titles on inner pages. |
| `text-4xl` | State landing title, Hot Topics title, and a bill title from the `sm` breakpoint up. |

Line height: `leading-none` on the site title, `leading-tight` on large titles, `leading-snug` on the sponsor bar, `leading-relaxed` on long copy. Letter spacing: `tracking-wide` on small labels, and `tracking-[0.16em]` on the crimson eyebrows (Hot Topics, legislature name).

## Spacing

Tailwind's default spacing (1 unit = 0.25rem). The page column is `max-w-5xl` with `px-4`. Reading measure on long text is `max-w-2xl`. The header is `py-4`; the footer is `py-8`; `<main>` is `py-6`.

Repeated gaps: `gap-3` and `space-y-6` between home sections and cards, `space-y-4` on index pages, `space-y-8` between Hot Topics states, `gap-8` on the contact and sponsor two-column layouts, `gap-x-4 gap-y-1` in the header nav. Cards use `p-4`. Form controls use `min-h-11`, `px-3` or `px-4`. The header's crimson bar is `h-1`.

## Radius

| Class | Where |
| --- | --- |
| `rounded-lg` | Cards, panels, the signup form. |
| `rounded-md` | Inputs, small list rows, legislator photos, primary buttons. |
| `rounded-full` | Topic chips and the veto badge. |
| `rounded` | Sponsor-bar close button only. |

## Shadow

No component sets a `shadow-*` class. Cards are separated with a `border-line` border on `bg-paper`, not a drop shadow.

## Breakpoints

Only two Tailwind breakpoints appear in components. Tailwind's defaults apply: `sm` is 40rem (640px), `lg` is 64rem (1024px). `md`, `xl`, and `2xl` are not used.

| Breakpoint | What changes |
| --- | --- |
| `sm` | Home state cards become three columns. State landing links become two columns. Bill titles step from `text-3xl` to `text-4xl`. Several forms and definition lists become two columns. Bill search becomes a row. The footer becomes two columns. |
| `lg` | Contact and sponsor pages become two columns (`lg:grid-cols-2`). |
