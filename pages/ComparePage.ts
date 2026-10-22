import { type Page, type Locator, expect } from '@playwright/test';

export class ComparePage {
    readonly page: Page;
    readonly compareLink: Locator;
    readonly selectedProductsMessage: Locator;
    readonly comparedProductNames: Locator;
    readonly differencesCheckbox: Locator;
    readonly clearComparisonButton: Locator;
    readonly emptyComparisonMessage: Locator;
    readonly browseProductsLink: Locator;
    readonly products: Locator;
    readonly nextPageButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.compareLink = page.locator('[data-test="compare-link"]');
        this.selectedProductsMessage = page.getByText('2 product(s) selected');
        this.comparedProductNames = page.locator('[data-test="product-name"]');
        this.differencesCheckbox = page.locator('[data-test="show-differences"]');
        this.clearComparisonButton = page.locator('[data-test="clear-comparison"]');
        this.emptyComparisonMessage = page.getByText('No products selected for');
        this.browseProductsLink = page.getByRole('link', {
            name: 'Browse Products',
        });
        this.products = page.locator('a[data-test^="product-"]');
        this.nextPageButton = page.locator('[data-test="pagination-next"]');
    }



    async openFirstProduct(): Promise<{ name: string; price: string; href: string }> {
        await this.page.goto('/');

        await expect(this.products.first()).toBeVisible();

        const product = this.products.first();
        const href = await product.getAttribute('href');

        if (!href) {
            throw new Error('The first product has no href.');
        }

        const name = (
            await product.locator('[data-test="product-name"]').innerText()
        ).trim();

        await product.click();

        await expect(
            this.page.locator('[data-test="add-to-compare"]')
        ).toBeVisible();

        const price = (
            await this.page.locator('[data-test="unit-price"]').innerText()
        ).trim();

        return { name, price, href };
    }


    async openFirstProductExcept(
        excludedHrefs: Set<string>
    ): Promise<{ name: string; price: string; href: string }> {
        await this.page.goto('/');

        while (true) {
            await expect(this.products.first()).toBeVisible();

            const count = await this.products.count();

            for (let i = 0; i < count; i++) {
                const product = this.products.nth(i);
                const href = await product.getAttribute('href');

                if (!href || excludedHrefs.has(href)) {
                    continue;
                }

                const name = (
                    await product.locator('[data-test="product-name"]').innerText()
                ).trim();

                await product.click();

                await expect(
                    this.page.locator('[data-test="add-to-compare"]')
                ).toBeVisible();

                const price = (
                    await this.page.locator('[data-test="unit-price"]').innerText()
                ).trim();

                return { name, price, href };
            }

            if (!(await this.nextPageButton.isEnabled())) {
                throw new Error('Could not find a second unique product.');
            }

            const firstHref = await this.products.first().getAttribute('href');

            await this.nextPageButton.click();

            await expect
                .poll(async () => this.products.first().getAttribute('href'))
                .not.toBe(firstHref);
        }
    }

    async getProductName(): Promise<string> {
        return (await this.page.locator('h1').innerText()).trim();
    }

    async getProductPrice(): Promise<string> {
        return (await this.page.locator('[data-test="unit-price"]').innerText()).trim();
    }

    async addCurrentProductToComparison() {
        await this.page.locator('[data-test="add-to-compare"]').click();
    }

    async openComparison() {
        await this.compareLink.click();
    }

    async getComparedProductName(index: number): Promise<Locator> {
        return this.comparedProductNames.nth(index);
    }

    getComparedPrice(price: string): Locator {
        const normalizedPrice = price.trim().startsWith('$')
            ? price.trim()
            : `$${price.trim()}`;

        return this.page.getByText(normalizedPrice, { exact: true });
    }

    async clearComparison() {
        await this.clearComparisonButton.click();
    }

    async returnToCatalog() {
        await this.browseProductsLink.click();
    }
}
