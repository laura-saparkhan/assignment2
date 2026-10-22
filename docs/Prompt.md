# Prompt.md 

## 1. AI Tool Information

- **AI tool:** ChatGPT
- **Model:** GPT-6
- **Framework:** Playwright Test
- **Programming language:** TypeScript

---

## 2. Understanding Playwright Fixtures

### Prompt

"What are fixtures in Playwright, and how do they work? Explain them with examples relevant to my test automation assignment."

---

## 3. Structuring the Project

### Prompt

"How should I structure my Playwright project for this assignment? I have separate test files, Page Objects, and a pages.fixture.ts file. Explain what belongs in each folder and how they should work together."

---

## 4. Deciding How Many Page Objects to Create

### Prompt

"Is it important to have a separate Page Object for every single spec file, or can multiple spec files use the same Page Object? Explain how I should decide."

---

## 5. Handling Out-of-Stock Products and Pagination

### Prompt

"Help me modify my PurchasePage so it checks whether a product is out of stock, skips unavailable products, and selects the next available product. If no suitable products remain on the current catalog page, it should move to the next page and continue searching until it finds one or reaches the end of the catalog. Keep the locators and logic inside the Page Object rather than the spec file."

---

## 6. Creating a New Test Account for Login and Purchase Tests

### Prompt

"Help me create a separate helper that registers a new account every time it is needed and then logs in using that same account. I want to reuse it in my successful login and purchase tests because I noticed accounts get blocked after several login attempts. Keep the helper reusable and compatible with my existing RegisterPage, LoginPage, and fixture structure."

---

## 7. Debugging Login and Registration

### Prompt

"My test remains on the login page and reports invalid email or password after registering a new account. Help me investigate whether registration completed successfully, whether the credentials were accepted, and what conditions I should assert instead of using fixed delays."

---

## 8. Debugging Product Selection

### Prompt

"My Playwright test times out while trying to get the href of the first product card. Help me identify why the product locator might be empty and make the catalog pagination logic more reliable."

---

## 9. Using Web-First Assertions Instead of Fixed Delays

### Prompt

"My teacher says not to use waitForTimeout anywhere and to use web-first assertions instead. Explain the difference and help me replace fixed waits with assertions that verify the actual expected state."


---

## 10. Translating and Structuring Prompts in English

### Prompt

"I communicated with the AI in Russian when asking questions about Playwright, project structure, fixtures, Page Objects, product availability, pagination, and creating helper functions. The AI helped me translate my questions into English and organize them into clear, structured prompts suitable for documentation."

---

