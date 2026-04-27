You are a senior Next.js (App Router) engineer.

Refactor the existing project to implement a clean and minimal URL-based i18n system using locale routes (`/th`, `/en`) with a focus on simplicity, stability, and maintainability for a kiosk-style application.

## 🎯 Goals

* Support 2 languages: `th` (default), `en`
* Locale must be controlled by URL: `/th/...`, `/en/...`
* Root `/` must redirect to `/th`
* Language switch must keep the current page (e.g. `/th/blow` → `/en/blow`)
* All UI text must be translatable via a simple `t()` helper
* Avoid over-engineering (no middleware, no external i18n libraries)

---

## 📁 Target Architecture

/app
/[locale]
layout.js
page.js
/blow/page.js
/analyze/page.js
/result/page.js
page.js (redirect to `/th`)

/i18n
th.js
en.js
index.js (getDictionary)

/context
LocaleContext.js (optional, minimal)

---

## ⚙️ Implementation Rules

### 1. Routing

* Move all existing pages into `/app/[locale]/...`
* Create `/app/page.js` that redirects to `/th`
* Supported locales: `['th', 'en']`
* If invalid locale → fallback to `th`

---

### 2. Dictionary System

* Create separate files:

  * `/i18n/th.js`
  * `/i18n/en.js`
* Export plain objects only (no logic inside)
* Example structure:

```js
export default {
  kiosk: {
    start: "เริ่ม",
    blow: "เป่า",
  }
}
```

* Create `/i18n/index.js`:

```js
import th from './th'
import en from './en'

export const dictionaries = { th, en }

export function getDictionary(locale) {
  return dictionaries[locale] || dictionaries.th
}
```

---

### 3. Locale Layout

In `/app/[locale]/layout.js`:

* Extract `locale` from params
* Load dictionary using `getDictionary(locale)`
* Set `<html lang={locale}>`
* Provide dictionary via React Context OR simple prop drilling

---

### 4. Translation Helper

Create a simple hook:

```js
const t = (path) => {
  return path.split('.').reduce((obj, key) => obj?.[key], dictionary) || path
}
```

Usage:

```js
t('kiosk.start')
```

---

### 5. Navigation नियम (IMPORTANT)

* NEVER hardcode routes like `/blow`
* ALWAYS prefix with locale

Example:

```js
router.push(`/${locale}/blow`)
```

---

### 6. Language Switch (KioskPanel.js)

* Use:

  * `usePathname()`
  * `useRouter()`

* Replace only the locale segment:

Example:

```js
const pathname = usePathname()
// /th/blow → /en/blow
const newPath = pathname.replace(/^\/(th|en)/, `/${newLocale}`)
router.push(newPath)
```

---

### 7. Text Refactoring

* Replace ALL hardcoded Thai text with `t()` calls in:

  * KioskPanel.js
  * InstructionPanel.js
  * BlowPanel.js
  * AnalyzePanel.js
  * ResultPanel.js
  * ModeOverlay.js (if needed)

---

### 8. Keep It Simple

* ❌ No middleware
* ❌ No localStorage for locale
* ❌ No SSR complexity beyond layout
* ❌ No dynamic imports unless necessary

---

## ✅ Acceptance Criteria

* `/` redirects to `/th`
* `/th/blow`, `/en/blow` work correctly
* Language switch preserves current route
* All UI text changes based on locale
* No broken navigation paths
* Kiosk flow remains intact:
  start → blow → analyze → result → reset

---

## 💡 Notes

* This is a kiosk-first implementation: prioritize stability over flexibility
* Code must be easy to read and easy to extend to more languages later
* Avoid unnecessary abstractions

---

Refactor the codebase accordingly.
