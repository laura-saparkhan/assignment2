
import { test, expect } from '../fixtures/pages.fixture';
import { createAndLoginAccount } from './helpers/create-test-account';

test('user can purchase two different products', async ({
  page,
  purchasePage,
}) => {
  await createAndLoginAccount(page);

  // Continue with your existing purchase flow
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
