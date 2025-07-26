import fs from 'fs';
import path from 'path';
import solc from 'solc';

const __dirname = path.resolve(path.dirname(''));
const CONTRACTS_DIR = path.resolve(__dirname, 'src', 'contract');
const BUILD_DIR = path.resolve(__dirname, 'src', 'contract', 'build');

// Create build directory if it doesn't exist
if (!fs.existsSync(BUILD_DIR)) {
  fs.mkdirSync(BUILD_DIR, { recursive: true });
}

function findImports(importPath) {
    // For this simple case, we'll handle OpenZeppelin imports,
    // as they are the most common dependency.
    try {
        const fullPath = path.resolve(__dirname, 'node_modules', importPath);
        const source = fs.readFileSync(fullPath, 'utf8');
        return { contents: source };
    } catch (error) {
        console.error(`Error reading import ${importPath}:`, error);
        return { error: 'File not found' };
    }
}


function compileContracts() {
    console.log('Searching for contracts in', CONTRACTS_DIR);
    const contractFiles = fs.readdirSync(CONTRACTS_DIR).filter(file => file.endsWith('.sol'));

    if (contractFiles.length === 0) {
        console.log('No solidity contracts found.');
        return;
    }

    console.log(`Found ${contractFiles.length} contracts:`, contractFiles.join(', '));
    
    const sources = contractFiles.reduce((acc, file) => {
        const filePath = path.resolve(CONTRACTS_DIR, file);
        acc[file] = {
            content: fs.readFileSync(filePath, 'utf8'),
        };
        return acc;
    }, {});

    const input = {
        language: 'Solidity',
        sources: sources,
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*'],
                },
            },
        },
    };

    console.log('Compiling contracts...');
    // The 'findImports' function is passed as a callback to handle import statements in the contracts.
    const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));
    
    if (output.errors) {
        console.error('Compilation errors:');
        let hasError = false;
        output.errors.forEach(err => {
            if (err.severity === 'error') {
                console.error(err.formattedMessage);
                hasError = true;
            } else {
                console.warn(err.formattedMessage);
            }
        });
        if (hasError) {
            process.exit(1);
        }
    }

    console.log('Compilation successful. Writing output to build directory...');

    for (const contractFile in output.contracts) {
        for (const contractName in output.contracts[contractFile]) {
            const artifact = {
                contractName,
                abi: output.contracts[contractFile][contractName].abi,
                bytecode: output.contracts[contractFile][contractName].evm.bytecode.object,
            };

            const artifactPath = path.resolve(BUILD_DIR, `${contractName}.json`);
            fs.writeFileSync(artifactPath, JSON.stringify(artifact, null, 2));
            console.log(`  -> Wrote artifact to ${artifactPath}`);
        }
    }
}

try {
    compileContracts();
    console.log('\n✅ Compilation finished successfully!');
} catch (e) {
    console.error('\n❌ Compilation failed:', e);
    process.exit(1);
} 