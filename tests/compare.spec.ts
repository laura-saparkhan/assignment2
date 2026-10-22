
import { test, expect } from '../fixtures/pages.fixture';

test('customer can compare two unique products', async ({
  page,
  comparePage,
}) => {
  const first = await comparePage.openFirstProduct();
  await comparePage.addCurrentProductToComparison();

  const excludedHrefs = new Set([first.href]);
  const second = await comparePage.openFirstProductExcept(excludedHrefs);

  expect(second.href).not.toBe(first.href);

  await comparePage.addCurrentProductToComparison();

  await expect(comparePage.selectedProductsMessage).toBeVisible();
  await comparePage.openComparison();

  await expect(comparePage.comparedProductNames).toHaveCount(2);
  await expect(await comparePage.getComparedProductName(0)).toHaveText(first.name);
  await expect(await comparePage.getComparedProductName(1)).toHaveText(second.name);

  await expect(comparePage.getComparedPrice(first.price)).toBeVisible();
  await expect(comparePage.getComparedPrice(second.price)).toBeVisible();

  await comparePage.differencesCheckbox.check();
  await expect(comparePage.differencesCheckbox).toBeChecked();

  await comparePage.differencesCheckbox.uncheck();
  await expect(comparePage.differencesCheckbox).not.toBeChecked();

  await comparePage.clearComparison();
  await expect(comparePage.emptyComparisonMessage).toBeVisible();

  await comparePage.returnToCatalog();
  await expect(page).toHaveURL('/');
});
