import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url for path resolution in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importing registries dynamically since we're in Node
import { ModelsRegistry } from '../src/data/assets/models_registry.js';
import { TexturesRegistry } from '../src/data/assets/textures_registry.js';
import { AudioRegistry } from '../src/data/assets/audio_registry.js';

const publicDir = path.resolve(__dirname, '../public');

// Create base public dir if it doesn't exist
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

const ensureDir = (filePath) => {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const createFile = (filePath, content = 'dummy content') => {
    // Normalizing the path since registry paths start with /assets/
    const normalizedPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
    const fullPath = path.join(publicDir, normalizedPath);

    ensureDir(fullPath);

    if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, content);
        console.log(`[CREATED] ${normalizedPath}`);
    } else {
        // console.log(`[EXISTS ] ${normalizedPath}`);
    }
};

let totalScaffolded = 0;

console.log('--- Scaffolding Models ---');
Object.values(ModelsRegistry).forEach(category => {
    category.forEach(item => {
        createFile(item.path, 'glTF dummy content');
        totalScaffolded++;
    });
});

console.log('\n--- Scaffolding Textures ---');
Object.values(TexturesRegistry).forEach(category => {
    category.forEach(item => {
        createFile(item.path, 'image dummy content');
        totalScaffolded++;
    });
});

console.log('\n--- Scaffolding Audio ---');
Object.values(AudioRegistry).forEach(category => {
    category.forEach(item => {
        // Dummy format string just enough to pass a 200 HTTP response.
        createFile(item.path, 'audio dummy content');
        totalScaffolded++;
    });
});

console.log(`\n✅ Scaffold Script Complete: ${totalScaffolded} total assets structured!`);
