import * as path from 'path';
import * as fs from 'fs';

const MANIFEST_JSON_PATH = path.resolve(__dirname, '../src/manifest.json');
const MANIFEST_JSON_DIST_PATH = path.resolve(__dirname, '../dist/manifest.json');
const PACKAGE_JSON_PATH = path.resolve(__dirname, '../package.json');


const manifestJson = JSON.parse(fs.readFileSync(MANIFEST_JSON_PATH).toString('utf-8'));
const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH).toString('utf-8'));

const PACKAGE_VERSION = packageJson['version'];
manifestJson['version'] = PACKAGE_VERSION;

fs.writeFileSync(MANIFEST_JSON_DIST_PATH, JSON.stringify(manifestJson, undefined, '\t'));