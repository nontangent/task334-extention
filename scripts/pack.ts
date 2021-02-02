import * as archiver from 'archiver';
import * as fs from 'fs';
import * as path from 'path';

async function pack() {
  const SRC_DIR = path.resolve(__dirname, '../dist');
  const MANIFEST_JSON_PATH = path.resolve(SRC_DIR, './manifest.json');
  const PACKAGE_JSON_PATH = path.resolve(__dirname, '../package.json');
  const manifestJson = JSON.parse(fs.readFileSync(MANIFEST_JSON_PATH).toString());
  const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH).toString());
  const name = packageJson['name'];
  const version = manifestJson['version'];
  const vendor = 'chrome';
  const filename = `${name}-${version}-${vendor}`;
  const DIST_DIR = path.join(__dirname, `../packages`);
  fs.mkdirSync(DIST_DIR, { recursive: true });
  const DIST_PATH = path.join(DIST_DIR, `${filename}.zip`);
  const output = fs.createWriteStream(DIST_PATH);

  const archive = archiver('zip', {zlib: {level: 9}});
  archive.pipe(output);
  archive.directory(SRC_DIR, false);
  await archive.finalize();
} 

pack();
