# Review.md

## 1.

During this assignment I used ChatGPT to help me understand Playwright concepts organize my test automation project implement Page Objects and troubleshoot problems encountered while running automated tests.

I did not simply copy the AI-generated code without checking it. I reviewed the suggestions applied them to my project ran the tests and modified the implementation when the results did not match the expected behavior. I also communicated my questions in Russian and ChatGPT helped translate and organize them into English prompts for documentation.

The following sections describe the AI contributions how I reviewed them and the decisions I made.

---

## 2. Understanding Playwright Fixtures

**AI contribution**

ChatGPT explained what fixtures are in Playwright, how they provide setup for tests and how custom fixtures can provide Page Objects to test cases.

**My review and modifications**

I applied this concept by using a custom `pages.fixture.ts` file to create and provide the Page Objects required by my tests. This allowed the specification files to import the customized `test` object and access the Page Objects through test parameters.

**Justification**

I chose this approach because fixtures reduce repeated setup code and make dependencies explicit. They also make the project easier to maintain because changes to Page Object initialization can be handled in one place than repeated across multiple test files.

---

## 3. Structuring the Project

**AI contribution**

ChatGPT suggested organizing the project into folders and files for Page Objects, fixtures, test specifications and documentation.

**My review and modifications**

I organized my project around the following responsibilities:

- `pages/` contains Page Objects and their locators and methods.

- `fixtures/pages.fixture.ts` initializes. Provides the Page Objects to tests.

- `tests/` contains the Playwright specification files.

- `tests/helpers/` contains helper functions, such as creating and logging in with a test account.

- `Description.md` describes the planned test cases.

- `Prompt.md` documents the prompts used during AI assistance.

- `Review.md` explains how I evaluated and modified the AI-generated suggestions.

I checked that the imports between the test files, fixtures and Page Objects matched this structure.

**Justification**

Separating responsibilities makes the project easier to understand, debug and extend. It also helps distinguish test scenarios from browser interactions and project configuration.

---

## 4. Deciding How Many Page Objects to Create

**AI contribution**

ChatGPT explained that a separate Page Object is not required for every specification file. A Page Object can be reused by tests whenever those tests interact with the same page or functionality.

**My review and modifications**

I used Page Objects based on the functionality being tested than creating a new one for every test file. For example `LoginPage` contains login-related locators and actions while `PurchasePage` contains product selection and checkout operations.

I also used fixtures to provide the Page Objects to the specification files that needed them.

**Justification**

This approach avoids duplication. If a locator or interaction changes I can update the corresponding Page Object without modifying every test that uses it. It also keeps the Page Objects focused on functionality.

However I recognized that shared Page Objects should remain cohesive. I would create another Page Object when a different page or a distinct set of responsibilities justified it.

---

## 5. Handling Out-of-Stock Products and Pagination

**AI contribution**

ChatGPT helped me design product-selection logic that checks product availability skips out-of-stock products and searches for another product. If no suitable product is found on the catalog page the logic proceeds to the next page.

**My review and modifications**

I incorporated the product-selection logic into `PurchasePage` than putting all the browser interactions directly into the specification file.

The implementation examines the product cards skips products that have already been selected or are marked as out of stock and selects a suitable product. When it needs another product it can continue searching through catalog pages.

I also reviewed the pagination logic after encountering a timeout while trying to retrieve a products `href`. This showed me that a locator may not immediately identify an element and that pagination must be synchronized with actual changes in the page.

I used Playwright assertions to verify that products were visible and that the catalog had changed after navigating to another page.

**Justification**

Product availability can vary, so relying on a fixed product or assuming every product is available would make the test fragile. Searching dynamically makes the purchase test more adaptable to the catalog.

Keeping this behavior inside `PurchasePage` also improves maintainability by centralizing product-selection logic. Using assertions to verify page state makes the test more reliable than relying on delays.

---

## 6. Creating a New Test Account for Login and Purchase Tests

**AI contribution**

ChatGPT helped me create a helper function that registers a new account and then attempts to log in using the same credentials. The goal was to reuse this setup in login and purchase tests instead of repeating registration and login steps in multiple test files.

**My review and modifications**

I created a helper in `tests/helpers/create-test-account.ts`. It generates an email address uses the registration and login Page Objects and returns the credentials after completing the account-creation and login steps.

I added assertions to verify that the test had navigated away from the login page and reached the expected account page. These checks help identify whether registration or login has failed of allowing the test to continue under an incorrect assumption.

I also treated my observation that repeated login attempts appeared to cause account-related problems as a reason to investigate account reuse than assuming that account blocking was definitely the cause.

**Justification**

The helper reduces duplicated setup. Allows tests to use a consistent account-creation process. Generating an email address also reduces conflicts between test runs.

The assertions are important because a helper should not silently report success when registration or login has failed. I also learned that creating an account for every test depends on the website accepting the registration details and allowing the account to log in successfully.

---

## 7. Debugging Login and Registration

**AI contribution**

ChatGPT helped me investigate why a test remained on the login page. Displayed an invalid email or password message after registration.

**My review and modifications**

of assuming that the account had been created successfully I examined the registration and login flow and added checks for the expected page and URL. I also reviewed whether the login form was available before interacting with its fields.

This debugging process helped identify the importance of checking each stage of a -step workflow. If registration fails the login test cannot succeed simply because the helper proceeds to the login page.

I avoided treating a click or form submission as proof that the operation had succeeded. The test needs to verify the resulting application state.

**Justification**

Explicit assertions make failures easier to diagnose and prevent misleading test results. They also distinguish problems with registration, login, navigation and element selection of reporting every problem as a generic timeout.

---

## 8. Debugging Product Selection

**AI contribution**

ChatGPT helped me investigate why Playwright timed out while trying to retrieve the `href` of the product card. The suggestions focused on whether the locator matched any elements whether the catalog had loaded and whether pagination had changed the displayed products.

**My review and modifications**

I reviewed how the product locator was defined and added checks for product visibility before attempting to interact with product cards. I also adjusted the pagination logic to verify that the products `href` changed after moving to another catalog page.

This helped the test wait for a change in the application rather than assuming navigation had completed simply because the pagination button had been clicked.

**Justification**

A locator can be valid syntactically. Still match no elements in the current page state. Checking visibility and verifying changes after navigation helps make the test more robust and makes failures easier to investigate.

---

## 9. Using Web-First Assertions of Fixed Delays

**AI contribution**

ChatGPT explained the difference between fixed delays and web-first assertions and helped me identify ways to wait for expected application states.

**My review and modifications**

I followed my teachers requirement not to use `waitForTimeout` in the project. Instead I used Playwright assertions such as:

- `toBeVisible()` to verify that an element is displayed.

- `toBeEnabled()` to verify that an element can be interacted with.

- `toHaveURL()` to verify navigation.

- `toContainText()` to verify messages displayed by the application.

- `expect.poll()` to verify that a value, such as a product URL changes after pagination.

I reviewed the waiting logic to ensure that the assertions checked the actual expected result rather than merely delaying execution.

**Justification**

Fixed delays make tests slower and can still be unreliable: a delay may be too short on a run and unnecessarily long on a fast run. Web-first assertions retry until the expected condition is satisfied or the timeout is reached.

This approach follows the assignment requirements. Provides more meaningful failure messages.

---

## 10.. Structuring Prompts, in English

**AI contribution**

I talked about my questions in Russian when I needed help with Playwright concepts setting up the project choosing how to use Page Objects dealing with product availability and building helper functions that I could use again.

ChatGPT helped turn my questions into English and set them up as organized prompts for `Prompt.md`.

**My review and changes**

I looked at the version to make sure every prompt showed the problem I was trying to solve and the situation of my assignment. I put the prompts together by topic so the documentation matched the way I worked on the project from learning basics to adding features and fixing errors.

**Reasons why I did it this way**

This method let me talk about problems in the language I like while still having clear English documentation. Grouping the prompts by topic also made it easier to see how the AIs help connected to the work I did in the project.

---

## 11. General Opinion on AI Suggestions

During the assignment I used ChatGPT as a helper for learning and fixing problems not as something that was always right.

I checked the suggestions by trying them in my project running the Playwright tests looking at error messages and making sure the real browser actions matched what I expected. When a test didn't work I used that to look into the code and make it better.

The main good parts of using AI were:

- **Learning:** understanding fixtures, Page Objects, locators and web-first assertions.

- **Reusing code:** making Page Objects, fixtures and helper functions that I could use again.

- **Fixing problems:** looking into failed logins missing product parts and time delays in pages.

- **Keeping things clean:** separating what the browser does from the test steps.

- **Writing notes:** organizing my thoughts and explaining why I made choices.

I also saw that AI code might depend on guesses, about how the website works, what selectors to use, how to sign up and what productsre there. So I had to check those guesses by running the tests instead of just trusting what the AI said.

## 12. Final Thoughts

Using ChatGPT helped me learn Playwright and build an organized test automation project.. The final version needed my own check, testing and choices.

I made sure the code was easy to read had parts I could use again had checks and followed what the teacher wanted. This process taught me not how to make automated tests but also how to look at AI code carefully and make it better when it didn't work the way I expected.