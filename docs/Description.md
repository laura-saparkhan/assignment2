# Test Automation Project Description

## 1. Project Overview

This project automates functional tests for [Practice Software Testing](https://practicesoftwaretesting.com/), a web application that simulates an online shopping experience.

The goal is to verify important user workflows, including account registration, authentication, password recovery, product comparison, and purchasing products.

## 2. Tools and Technologies

- **Programming language:** TypeScript
- **Automation framework:** Playwright Test
- **Design pattern:** Page Object Model (POM)
- **Test runner:** Playwright Test
- **Browsers:** Chromium, Firefox, and WebKit
- **AI assistance:** ChatGPT (GPT-6)

## 3. Automated Test Suites

### TC01 — User Registration
Verify that a new customer can register using valid personal information and unique account credentials.

### TC02 — Successful and Invalid Login
Verify successful authentication with valid credentials and validation messages when invalid or missing credentials are submitted.

### TC03 — Forgot Password
Verify the password recovery form, including valid-looking email submission, invalid email input, and required-field validation.

### TC04 — Product Comparison
Select two distinct products, add them to the comparison list, verify their names and prices, test the differences-only option, and clear the comparison.

### TC05 — Product Purchase
Register a new customer, log in, add two different available products to the cart, provide billing information, select cash on delivery, and verify the order confirmation.

## 4. Test Design and Architecture

Page Object Model is used to separate page-specific locators and actions from test scenarios. A shared fixture provides the relevant page objects to tests.

Assertions verify observable application behavior, such as URL changes, visibility of messages, product details, enabled controls, and order confirmation.

Unique email addresses are generated where new accounts are required to reduce conflicts with previously created accounts.

## 5. Expected Outcome

The tests should run from a clean project checkout after dependencies are installed. The test results should identify successful scenarios and failures that require investigation.
