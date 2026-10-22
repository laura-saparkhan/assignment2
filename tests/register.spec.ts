
import { test, expect } from '../fixtures/pages.fixture';

test('a new customer can register', async ({ page, registerPage }) => {
  const email = `testing.${new Date().getTime()}@gmail.com`;
//   const email = `lauratesting3@gmail.com`;

  await registerPage.open();

  await registerPage.register(
    'Test',
    'Account',
    '2005-09-08',
    email,
    'Daredevil7965$'
  );

  await expect(page).toHaveURL(/\/auth\/login/);
});
