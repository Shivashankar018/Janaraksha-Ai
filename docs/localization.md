# Localization (English and Kannada)

The interface works in **English** and **Kannada (ಕನ್ನಡ)**. The switch is in the top bar of every page and on the login page. The choice is saved in the browser.

## What is translated and what is not

| Translated | Not translated (by design) |
| --- | --- |
| Labels, buttons, menus, headings, help text, toasts, notifications | Records written by people: complaint text, names, places, officer notes |
| Status and stage names, counts, dates (month names) | Codes and numbers: complaint codes, FIR numbers, phone numbers, vehicle numbers |
| Screen-reader labels, placeholders, tooltips | Law section numbers (BNS and IPC references) |

Records stay in the language they were written in, so that what the citizen or officer wrote is never changed.

## How it works

The views are written in English. After each render, `trDOM()` in `src/js/i18n/i18n.js`:

1. Walks every text node and the `placeholder`, `title`, `aria-label` and `alt` attributes.
2. Looks up the exact text in the `KN` dictionary.
3. If there is no exact match, tries the `KN_PAT` patterns (regular expressions) for text with numbers or names, for example `Pending for 23 days.`
4. Splits text joined with ` · ` and translates each part.

Elements inside `data-notr`, `.mono`, `textarea` and `script` are skipped. Use `data-notr` on anything that shows user-written data.

Some text is built directly in Kannada when the sentence order differs a lot, for example the Raksha "case does not exist" message. Those places use `isKn()`.

## Dictionary files

| File | Covers |
| --- | --- |
| `src/js/i18n/kn-dictionary.js` | Officer workspace: Direct Entry, Scanner, Case Connections, workspace, audit, metrics |
| `src/js/i18n/kn-dictionary-portal.js` | Login, citizen portal, online complaints, escalations, laws, acknowledgment, Commissioner phase, Raksha |

## Add or change text

1. Write the English text in the view as one complete sentence in one text node (do not split a sentence across tags if it must be translated).
2. Add the Kannada text to the right dictionary file:

   ```js
   Object.assign(KN, {
     "Send instruction": "ಸೂಚನೆ ಕಳುಹಿಸಿ",
   });
   ```

3. For text that contains a number or a name, add a pattern:

   ```js
   KN_PAT.unshift([/^Pending for (\d+) days\.$/, "$1 ದಿನಗಳಿಂದ ಬಾಕಿ."]);
   ```

4. Build, switch to ಕನ್ನಡ and check the screen. The end-to-end test `test_kannada_switch_translates_the_interface` checks that the switch works.

## Style for Kannada text

- Use simple, everyday Kannada that a citizen at a police station counter would use.
- Keep common terms that people already use in English letters where that is normal: FIR, OTP, PIN, ID, SHO, PSI.
- Ask a native speaker to review new text before a public release.
