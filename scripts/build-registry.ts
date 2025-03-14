import { existsSync, promises as fsPromises } from 'node:fs';
import { dirname, resolve } from 'node:path';

// Configuration constants
const REGISTRY_OUTPUT_DIR = 'apps/docs/public/registry';
const EXCLUDED_INTERNAL = ['tailwind-config', 'typescript-config'];
const IGNORED_DEPENDENCIES = ['react', 'react-dom'];
const IGNORED_DEV_DEPENDENCIES = [
  '@blankui/typescript-config',
  '@types/react',
  '@types/react-dom',
  'typescript',
];

const ensureDirectoryExists = async (directory: string): Promise<void> => {
  if (!existsSync(directory)) {
    await fsPromises.mkdir(directory, { recursive: true });
  }
};

async function saveJsonToFile(targetPath: string, data: unknown): Promise<void> {
  const directory = dirname(targetPath);
  await ensureDirectoryExists(directory);
  await fsPromises.writeFile(
    targetPath, 
    JSON.stringify(data, null, 2), 
    'utf-8'
  );
};

const extractDependencies = (content: string): string[] => {
  const dependencyRegex = /@\/components\/ui\/([a-z-]+)/g;
  const matches = content.match(dependencyRegex) || [];
  return matches
    .map(path => path.split('/').pop())
    .filter(Boolean) as string[];
};

const processComponentPackage = async (packageName: string): Promise<void> => {
  const rootDir = process.cwd();
  const packageDir = resolve(rootDir, 'packages', packageName);
  
  const packageConfig = await import(resolve(packageDir, 'package.json'));
  
  const requiredDependencies = Object.keys(packageConfig.dependencies || {})
    .filter(dep => !IGNORED_DEPENDENCIES.includes(dep));
    
  const requiredDevDependencies = Object.keys(packageConfig.devDependencies || {})
    .filter(dep => !IGNORED_DEV_DEPENDENCIES.includes(dep));
  
  const dirEntries = await fsPromises.readdir(packageDir, { withFileTypes: true });
  
  const componentFiles = await Promise.all(
    dirEntries
      .filter(entry => entry.isFile() && entry.name.endsWith('.tsx'))
      .map(async entry => {
        const filePath = resolve(packageDir, entry.name);
        const fileContent = await fsPromises.readFile(filePath, 'utf-8');
        
        return {
          type: 'registry:ui',
          path: entry.name,
          content: fileContent,
          target: `components/ui/blank-ui/${packageName}/${entry.name}`
        };
      })
  );
  
  const allContent = componentFiles.map(file => file.content).join('\n');
  const componentDependencies = extractDependencies(allContent);

  const registryData = {
    $schema: 'https://ui.useblank.com/schema/registry.json',
    homepage: `https://ui.useblank.com/${packageName}`,
    name: packageName,
    type: 'registry:ui',
    author: 'BlankUI <hello@blankui.com>',
    registryDependencies: componentDependencies,
    dependencies: requiredDependencies,
    devDependencies: requiredDevDependencies,
    files: componentFiles,
  };
  
  // Save registry file
  const outputPath = resolve(rootDir, REGISTRY_OUTPUT_DIR, `${packageName}.json`);
  await saveJsonToFile(outputPath, registryData);
};

const generateComponentRegistry = async (): Promise<void> => {
  try {
    const rootDir = process.cwd();
    const packagesDir = resolve(rootDir, 'packages');
    
    const entries = await fsPromises.readdir(packagesDir, { withFileTypes: true });
    
    const componentPackages = entries
      .filter(entry => 
        entry.isDirectory() && 
        !EXCLUDED_INTERNAL.includes(entry.name)
      )
      .map(entry => entry.name);
    
    for (const packageName of componentPackages) {
      await processComponentPackage(packageName);
    }
    
    console.log('Registry generation completed successfully');
  } catch (error) {
    console.error('Failed to generate registry:', error);
    process.exit(1);
  }
};

// Execute the main function
generateComponentRegistry();
