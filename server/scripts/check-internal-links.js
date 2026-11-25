import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

// 1. Collect all static route files
const routesDir = path.resolve(projectRoot, 'src/routes');
const knownStaticRoutes = new Set([
  '/',
  '/about',
  '/admin',
  '/auth',
  '/cad',
  '/clients',
  '/contact',
  '/faq',
  '/landed-cost',
  '/llms.txt',
  '/matrix',
  '/planner',
  '/portal',
  '/privacy',
  '/processing',
  '/quality',
  '/reset-password',
  '/rfq',
  '/rfq/confirmation',
  '/shortlist',
  '/sitemap.xml',
  '/stock',
  '/terms',
  '/tools',
  '/trade-desk',
  '/vendor-registration',
  '/industries',
  '/materials',
  '/products',
  '/technical',
]);

// 2. Load 26 valid industry slugs
const industriesFile = fs.readFileSync(path.resolve(projectRoot, 'src/data/industries.ts'), 'utf-8');
const industrySlugs = Array.from(industriesFile.matchAll(/slug:\s*"([^"]+)"/g)).map(m => m[1]);
const validIndustryPaths = new Set(industrySlugs.map(s => `/industries/${s}`));

// 3. Load valid product slugs
const productFiles = fs.readdirSync(path.resolve(projectRoot, 'src/data')).filter(f => f.startsWith('products.') && f.endsWith('.ts') && f !== 'products.types.ts');
const productSlugs = new Set();
for (const pf of productFiles) {
  const content = fs.readFileSync(path.resolve(projectRoot, 'src/data', pf), 'utf-8');
  const matches = Array.from(content.matchAll(/slug:\s*"([^"]+)"/g)).map(m => m[1]);
  matches.forEach(s => productSlugs.add(s));
}
const validProductPaths = new Set(Array.from(productSlugs).map(s => `/products/${s}`));

// 4. Scan all src/ files for internal links
function getAllFiles(dir, exts = ['.tsx', '.ts']) {
  let res = [];
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (item !== 'node_modules' && item !== '.git') {
        res = res.concat(getAllFiles(full, exts));
      }
    } else if (exts.includes(path.extname(item))) {
      res.push(full);
    }
  }
  return res;
}

const srcFiles = getAllFiles(path.resolve(projectRoot, 'src'));
let brokenLinks = [];

const internalLinkPattern = /(?:to|href)=["'](\/[a-zA-Z0-9_\-\/#.]*)["']/g;

for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const matches = Array.from(content.matchAll(internalLinkPattern));

  for (const match of matches) {
    let link = match[1];
    // Strip hash and query params
    const cleanLink = link.split('#')[0].split('?')[0].replace(/\/$/, '') || '/';

    // Skip api, assets, certificates, resources, images, brand
    if (
      cleanLink.startsWith('/api') ||
      cleanLink.startsWith('/assets') ||
      cleanLink.startsWith('/certificates') ||
      cleanLink.startsWith('/resources') ||
      cleanLink.startsWith('/images') ||
      cleanLink.startsWith('/brand') ||
      cleanLink.startsWith('/favicon') ||
      cleanLink.startsWith('/og-image')
    ) {
      continue;
    }

    // Check against known routes
    const isKnown =
      knownStaticRoutes.has(cleanLink) ||
      validIndustryPaths.has(cleanLink) ||
      validProductPaths.has(cleanLink) ||
      cleanLink.startsWith('/materials/') ||
      cleanLink.startsWith('/technical/') ||
      cleanLink === '/';

    if (!isKnown) {
      brokenLinks.push({ file: path.relative(projectRoot, file), link: cleanLink });
    }
  }
}

if (brokenLinks.length > 0) {
  console.error(`[Link Checker FAIL] Found ${brokenLinks.length} broken internal links:`);
  for (const b of brokenLinks) {
    console.error(`  - ${b.file} -> ${b.link}`);
  }
  process.exit(1);
} else {
  console.log(`[Link Checker PASS] All internal links verified across ${srcFiles.length} files. Zero broken links found.`);
  process.exit(0);
}
