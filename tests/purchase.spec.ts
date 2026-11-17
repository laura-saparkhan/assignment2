
import { test, expect } from '../fixtures/pages.fixture';
import { createAccountAndSignInViaApi } from './helpers/create-test-account';

test('user can purchase two different products', async ({
  page,
  purchasePage,
}) => {
  // Account created and signed in through the API: this test is about
  // purchasing, and the login form is covered by login.spec.ts.
  await createAccountAndSignInViaApi(page);

  await purchasePage.openHome();

  const excludedHrefs = new Set<string>();

  const firstProduct = await purchasePage.addAvailableProduct(
    excludedHrefs,
    2
  );

  const secondProduct = await purchasePage.addAvailableProduct(
    excludedHrefs,
    1
  );

  expect(firstProduct.href).not.toBe(secondProduct.href);

  await purchasePage.openCheckout();
  await purchasePage.proceedToBilling();
  await purchasePage.fillBillingAddress();
  await purchasePage.finishCashOnDeliveryOrder();

  await expect(purchasePage.successMessage).toBeVisible();
});
