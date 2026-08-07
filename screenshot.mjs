import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] ? `-${process.argv[3]}` : '';
const outputDir = join(process.cwd(), 'temporary screenshots');
mkdirSync(outputDir, { recursive: true });
const outputPath = join(outputDir, `screenshot-${Date.now()}${label}.png`);

try {
  execFileSync(
    'google-chrome',
    [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--window-size=1600,1200',
      `--screenshot=${outputPath}`,
      url
    ],
    { stdio: 'inherit' }
  );
  console.log(`Screenshot saved to ${outputPath}`);
} catch (error) {
  console.error('Failed to capture screenshot.');
  console.error(error.message);
  process.exit(1);
}
