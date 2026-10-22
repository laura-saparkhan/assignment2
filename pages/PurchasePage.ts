
import { type Page, type Locator, expect } from '@playwright/test';

export class PurchasePage {
    readonly page: Page;
    readonly homeLink: Locator;
    readonly products: Locator;
    readonly nextPageButton: Locator;
    readonly cartAlert: Locator;
    readonly checkoutStep1: Locator;
    readonly checkoutStep2: Locator;
    readonly checkoutStep3: Locator;
    readonly paymentMethod: Locator;
    readonly finishButton: Locator;
    readonly successMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        this.homeLink = page.locator('[data-test="nav-home"]');
        this.products = page.locator('a[data-test^="product-"]');
        this.nextPageButton = page.locator('[data-test="pagination-next"]');
        this.cartAlert = page.getByRole('alert');

        this.checkoutStep1 = page.locator('[data-test="proceed-1"]');
        this.checkoutStep2 = page.locator('[data-test="proceed-2"]');
        this.checkoutStep3 = page.locator('[data-test="proceed-3"]');
        this.paymentMethod = page.locator('[data-test="payment-method"]');
        this.finishButton = page.locator('[data-test="finish"]');
        this.successMessage = page.getByText(/Payment was successful/i);
    }

    async openHome() {
        await this.homeLink.click();
    }


    async addAvailableProduct(
        excludedHrefs: Set<string>,
        quantity: number
    ): Promise<{ name: string; href: string }> {
        while (true) {
            // Wait for the catalog to contain products
            await expect(this.products.first()).toBeVisible({
                timeout: 10000,
            });

            const productCount = await this.products.count();

            for (let i = 0; i < productCount; i++) {
                const product = this.products.nth(i);
                const href = await product.getAttribute('href');

                if (!href || excludedHrefs.has(href)) {
                    continue;
                }

                if (
                    await product.locator('[data-test="out-of-stock"]').count() > 0
                ) {
                    continue;
                }

                const name = (
                    await product.locator('[data-test="product-name"]').innerText()
                ).trim();

                await product.click();

                // Wait until the product detail page is ready
                await expect(
                    this.page.locator('[data-test="add-to-cart"]')
                ).toBeVisible();

                for (let j = 1; j < quantity; j++) {
                    await this.page.locator('[data-test="increase-quantity"]').click();
                }

                await this.page.locator('[data-test="add-to-cart"]').click();

                await expect(this.cartAlert).toContainText(
                    /added to shopping cart/i
                );

                excludedHrefs.add(href);

                // Return to the catalog before selecting another product
                await this.page.goto('/');
                await expect(this.products.first()).toBeVisible();

                return { name, href };
            }

            // No suitable product on this page; try the next catalog page
            const productCountAfterSearch = await this.products.count();

            if (productCountAfterSearch === 0) {
                throw new Error('No product cards found on the catalog page.');
            }

            if (!(await this.nextPageButton.isEnabled())) {
                throw new Error(
                    'Reached the last catalog page without finding another available product.'
                );
            }

            const firstHref = await this.products.first().getAttribute('href');

            await this.nextPageButton.click();

            // Wait until pagination changes the displayed products
            await expect
                .poll(async () => this.products.first().getAttribute('href'))
                .not.toBe(firstHref);

            await expect(this.products.first()).toBeVisible();
        }
    }


    async openCheckout() {
        await this.page.goto('/checkout');
        await expect(this.page).toHaveURL(/\/checkout/);
        await expect(this.checkoutStep1).toBeVisible();
    }

    async proceedToBilling() {
        await this.checkoutStep1.click();
        await this.checkoutStep2.click();
    }

    async fillBillingAddress() {
        await this.page.locator('[data-test="country"]').selectOption('KZ');
        await this.page.locator('[data-test="postal_code"]').fill('050000');
        await this.page.locator('[data-test="house_number"]').fill('18');

        await this.page.locator('[data-test="street"]').fill('Abay Avenue');
        await this.page.locator('[data-test="city"]').fill('Almaty');
        await this.page.locator('[data-test="state"]').fill('Almaty');

        await expect(this.checkoutStep3).toBeEnabled({ timeout: 10000 });
        await this.checkoutStep3.click();
    }

    async finishCashOnDeliveryOrder() {
        await this.paymentMethod.selectOption('cash-on-delivery');
        await this.finishButton.click();
    }
}
