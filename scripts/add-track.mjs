import {access, copyFile, mkdir, readFile, stat, writeFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const ACTIVE_TRACK_TOKEN = '@active-track';
const AUDIO_EXTENSIONS = new Set([
  '.aac',
  '.flac',
  '.m4a',
  '.mp3',
  '.mp4',
  '.oga',
  '.ogg',
  '.opus',
  '.wav',
  '.webm',
]);

const sourceArgument = process.argv[2];

if (!sourceArgument) {
  console.error('Usage: npm run track:add -- /absolute/or/relative/path/to/song.mp3');
  process.exit(1);
}

const sourcePath = path.resolve(process.cwd(), sourceArgument);

try {
  const sourceStat = await stat(sourcePath);
  if (!sourceStat.isFile()) {
    throw new Error('The supplied path is not a file.');
  }
} catch (error) {
  console.error(`Could not read audio source: ${sourcePath}`);
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

const extension = path.extname(sourcePath).toLowerCase();

if (!AUDIO_EXTENSIONS.has(extension)) {
  console.error(`Unsupported audio extension: ${extension || '(none)'}`);
  process.exit(1);
}

const rawStem = path.basename(sourcePath, extension);
const safeStem =
  rawStem
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96) || 'track';
const tracksDirectory = path.join(process.cwd(), 'public', 'assets', 'tracks');

await mkdir(tracksDirectory, {recursive: true});

const pathExists = async (candidate) => {
  try {
    await access(candidate);
    return true;
  } catch {
    return false;
  }
};

let filename = `${safeStem}${extension}`;
let destinationPath = path.join(tracksDirectory, filename);
let suffix = 2;

while (
  path.resolve(destinationPath) !== path.resolve(sourcePath) &&
  (await pathExists(destinationPath))
) {
  filename = `${safeStem}-${suffix}${extension}`;
  destinationPath = path.join(tracksDirectory, filename);
  suffix += 1;
}

if (path.resolve(destinationPath) !== path.resolve(sourcePath)) {
  await copyFile(sourcePath, destinationPath);
}

const projectRelativePath = `assets/tracks/${filename}`;

await writeFile(
  path.join(tracksDirectory, 'active-track.json'),
  `${JSON.stringify({audioFile: projectRelativePath}, null, 2)}\n`,
);

const customPropsPath = path.join(process.cwd(), 'props', 'custom.json');
const customProps = JSON.parse(await readFile(customPropsPath, 'utf8'));
customProps.audioFile = ACTIVE_TRACK_TOKEN;
customProps.audioStartSeconds = 0;
customProps.audioEndTrimSeconds = 0;
customProps.outroPlacement = customProps.outroPlacement ?? 'over-track-end';
await writeFile(customPropsPath, `${JSON.stringify(customProps, null, 2)}\n`);

console.log(`Added: public/${projectRelativePath}`);
console.log('Activated it through public/assets/tracks/active-track.json.');
console.log(`props/custom.json now uses ${ACTIVE_TRACK_TOKEN}.`);
console.log('Render with: npm run render:custom');
