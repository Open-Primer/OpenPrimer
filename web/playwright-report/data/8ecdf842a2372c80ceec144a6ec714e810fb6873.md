# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin_governance.spec.ts >> OpenPrimer Curriculum Autonomy and Governance Suite >> AI Badge Icon Agent: enforces strict parameter validation, real-time translations, and badge creation
- Location: tests\admin_governance.spec.ts:595:7

# Error details

```
Test timeout of 90000ms exceeded.
```

```
Error: page.click: Test timeout of 90000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Create New Achievement Badge"), button:has-text("Créer un Badge")')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - img [ref=e4]
  - heading "This page couldn’t load" [level=1] [ref=e6]
  - paragraph [ref=e7]: Reload to try again, or go back.
  - generic [ref=e8]:
    - button "Reload" [ref=e10] [cursor=pointer]
    - button "Back" [ref=e11] [cursor=pointer]
```

# Test source

```ts
      |                ^ Error: page.click: Test timeout of 90000ms exceeded.
```