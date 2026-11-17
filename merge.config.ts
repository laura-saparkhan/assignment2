/**
 * Config used only by `npx playwright merge-reports`.
 *
 * The merge job in CI downloads the blob report of every shard and turns
 * them into one HTML report plus one combined JUnit file.
 */
export default {
  testDir: './tests',
  reporter: [
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'reports/junit-merged.xml' }],
  ],
};
