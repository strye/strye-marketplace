// symlink-cli.js
import SymlinkManager from './symlink-manager.js';
import fspromises from 'fs';
import path from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fs = fspromises.promises;

/**
 * CLI Handler for symlink operations
 */
class SymlinkCLI {
  constructor(configPath = './config/config.json') {
    this._symlinkManager = new SymlinkManager();
    this.config = this._loadConfig(configPath);
    this.commands = {
      setup: this.setupCommand.bind(this),
      create: this.createCommand.bind(this),
      remove: this.removeCommand.bind(this),
      check: this.checkCommand.bind(this),
      validate: this.validateCommand.bind(this),
      info: this.infoCommand.bind(this)
    };
  }

  /**
   * Load configuration from file
   * @param {string} configPath - Path to config file
   * @returns {object} Configuration object
   */
  _loadConfig(configPath) {
    try {
      const absolutePath = path.resolve(configPath);
      const configData = readFileSync(absolutePath, 'utf8');
      return JSON.parse(configData);
    } catch (error) {
      throw new Error(`Failed to load config from ${configPath}: ${error.message}`);
    }
  }

  /**
   * Parse command line arguments
   */
  parseArgs(args) {
    const parsed = {
      command: null,
      source: null,
      target: null,
      configPath: null,
    };

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      switch (arg) {
      case '--config':
      case '-c':
        parsed.configPath = args[++i];
        break;
      case '--source':
      case '-s':
        parsed.source = args[++i];
        break;
      case '--target':
      case '-t':
        parsed.target = args[++i];
        break;
      case '--help':
      case '-h':
        this.showHelp();
        process.exit(0);
        break;
      default:
        if (!parsed.command && !arg.startsWith('-')) {
          parsed.command = arg;
        } else if (!parsed.source && !arg.startsWith('-')) {
          parsed.source = arg;
        } else if (!parsed.target && !arg.startsWith('-')) {
          parsed.target = arg;
        }
      }
    }

    return parsed;
  }

  /**
   * Setup configured symlinks command
   * Synchronizes symlinks in the project directory with those defined in the config file
   * - Removes symlinks that exist but are not in config
   * - Creates symlinks that are in config but don't exist in the directory
   */
  async setupCommand() {
    const results = {
      added: [],
      removed: [],
      errors: [],
      skipped: []
    };
    
    // Get directory path from config
    const directoryPath = path.resolve(this.config.projectDir, `${this.config.linkTarget}`);

    // Build a map of configured symlinks for easy lookup
    const configuredLinks = {};
    this.config.symLinks.forEach(link => {
      configuredLinks[link.target] = link.source;
    });

    // Map to track existing symlinks
    const existingLinks = {};
    
    // Phase 1: Scan directory for existing symlinks
    try {
      console.log('\nScanning for existing symlinks...');
      const entries = await fs.readdir(directoryPath, { withFileTypes: true });
      const symlinks = entries.filter(dirent => dirent.isSymbolicLink());
      
      // Build map of existing symlinks
      for (const symlink of symlinks) {
        try {
          const targetPath = await fs.readlink(path.join(directoryPath, symlink.name));
          existingLinks[symlink.name] = targetPath;
          console.log(`Found symlink: ${symlink.name} -> ${targetPath}`);
        } catch (err) {
          results.errors.push(`Error reading symlink ${symlink.name}: ${err.message}`);
        }
      }
    } catch (err) {
      console.error('Error scanning directory:', err);
      results.errors.push(`Directory scan failed: ${err.message}`);
      return {
        success: false,
        message: 'Failed to read directory for symlinks',
        data: results
      };
    }

    // Phase 2: Remove symlinks that are not in the config
    console.log('\nRemoving obsolete symlinks...');
    for (const [name, targetPath] of Object.entries(existingLinks)) {
      if (!configuredLinks.hasOwnProperty(name)) {
        try {
          const linkPath = path.join(directoryPath, name);
          await this._symlinkManager.removeLink(linkPath);
          results.removed.push({ name, targetPath });
          console.log(`✓ Removed symlink: ${name} -> ${targetPath}`);
        } catch (err) {
          results.errors.push(`Failed to remove symlink ${name}: ${err.message}`);
          console.error(`✗ Error removing symlink ${name}:`, err.message);
        }
      } else {
        console.log(`Keeping symlink: ${name}`);
      }
    }

    // Phase 3: Create missing symlinks from config
    console.log('\nCreating new symlinks...');
    for (const link of this.config.symLinks) {
      const { source, target } = link;
      
      // Skip if symlink already exists with correct target
      if (existingLinks[target] && existingLinks[target] === source) {
        results.skipped.push({ target, source, reason: 'Already exists' });
        console.log(`Skipped: ${target} already points to ${source}`);
        continue;
      }
      
      // Create the symlink
      try {
        // Check if source exists
        try {
          await fs.access(source);
        } catch (err) {
          results.errors.push(`Source directory not found: ${source}`);
          console.error(`✗ Source not found for ${target}: ${source}`);
          continue;
        }
        
        // Create the symlink
        const linkPath = path.join(directoryPath, target);
        await this._symlinkManager.createLink(source, linkPath, { force: true });
        results.added.push({ target, source });
        console.log(`✓ Created symlink: ${target} -> ${source}`);
      } catch (err) {
        results.errors.push(`Failed to create symlink ${target}: ${err.message}`);
        console.error(`✗ Error creating symlink ${target}:`, err.message);
      }
    }

    // Generate summary for return data
    const summary = [
      `${results.added.length} symlinks added`,
      `${results.removed.length} symlinks removed`,
      `${results.skipped.length} symlinks unchanged`,
      `${results.errors.length} errors occurred`
    ];
    
    return {
      success: results.errors.length === 0,
      message: `Setup complete: ${summary.join(', ')}`,
      data: results
    };
  }

  /**
   * Create symlink command
   */
  async createCommand(source, target) {
    if (!source || !target) {
      throw new Error('Both source and target are required for create command');
    }

    // const absLink = path.resolve(this.config.projectDir,`${this.config.linkTarget}FiloFax`);
    const linkName = path.resolve(this.config.projectDir,`${this.config.linkTarget}${target}`);

    const result = await this._symlinkManager.createLink(source, linkName);

    return {
      success: true,
      message: '✓ Symlink created successfully',
      data: result
    };
  }

  /**
   * Remove symlink command
   */
  async removeCommand(source, target) {
    const linkPath = target || source;
    
    if (!linkPath) {
      throw new Error('Link path is required for remove command');
    }
    const linkName = path.resolve(this.config.projectDir,`${this.config.linkTarget}${linkPath}`);

    const result = await this._symlinkManager.removeLink(linkName);

    return {
      success: true,
      message: '✓ Symlink removed successfully',
      data: result
    };
  }

  /**
   * Check if path is symlink
   */
  async checkCommand(source, target) {
    const checkPath = source || target;
    
    if (!checkPath) {
      throw new Error('Path is required for check command');
    }

    const isSymlink = await this._symlinkManager.isSymlink(checkPath);
    
    if (isSymlink) {
      const targetInfo = await this._symlinkManager.getTarget(checkPath);
      return {
        success: true,
        message: 'Path is a symlink',
        data: {
          path: checkPath,
          isSymlink: true,
          ...targetInfo
        }
      };
    } else {
      return {
        success: true,
        message: 'Path is not a symlink',
        data: {
          path: checkPath,
          isSymlink: false
        }
      };
    }
  }

  /**
   * Validate symlink
   */
  async validateCommand(source, target) {
    const checkPath = source || target;
    
    if (!checkPath) {
      throw new Error('Path is required for validate command');
    }

    const validation = await this._symlinkManager.validateSymlink(checkPath);

    return {
      success: true,
      message: validation.isValid ? '✓ Symlink is valid' : '✗ Symlink is invalid or broken',
      data: validation
    };
  }

  /**
   * Get system info
   */
  async infoCommand() {
    const info = this._symlinkManager.getSystemInfo();
    
    return {
      success: true,
      message: 'System information',
      data: info
    };
  }

  /**
   * Execute a command
   */
  async execute(command, source, target, options = {}) {
    if (!command) {
      throw new Error('Command is required. Use --help for usage information.');
    }

    const handler = this.commands[command.toLowerCase()];
    
    if (!handler) {
      throw new Error(`Unknown command: ${command}. Available commands: ${Object.keys(this.commands).join(', ')}`);
    }

    return await handler(source, target, options);
  }

  /**
   * Show help information
   */
  showHelp() {
    console.log(`
Symlink Manager CLI - Cross-platform symbolic link management tool

USAGE:
  node symlink-cli.js <command> [options]
  node symlink-cli.js <command> <source> <target> [options]

COMMANDS:
  create <source> <target>    Create a symbolic link
  remove <path>               Remove a symbolic link
  setup                       Creates and removes symbolic links based on configuration file
  check <path>                Check if path is a symlink and show target
  validate <path>             Validate if symlink target still exists
  info                        Show system information

OPTIONS:
  --config, -c <path>         Path to config file (default: ./config/config.json)
  --source, -s <path>         Source/target folder path
  --target, -t <path>         Symlink location path
  --help, -h                  Show this help message

EXAMPLES:
  # Create a symlink
  node symlink-cli.js create ./my-folder ./link-to-folder
  node symlink-cli.js create -s ./my-folder -t ./link-to-folder
  node symlink-cli.js create -s "C:\\Users\\wills\\Dropbox\\0_Intake\\FiloFax" -t "FiloFax"
  node symlink-cli create -s "C:\\Users\\wills\\Dropbox\\0_Intake\\FiloFax" -t "FiloFax"

  # Remove a symlink
  node symlink-cli.js remove ./link-to-folder
  node symlink-cli remove "FiloFax"

  # Setup symlinks from config
  node symlink-cli.js setup
  node symlink-cli.js setup --config ./config/config.json
  node symlink-cli.js setup -c test-env/config/test.config.json

  # Check if path is a symlink
  node symlink-cli.js check ./link-to-folder

  # Validate a symlink
  node symlink-cli.js validate ./link-to-folder

  # Show system info
  node symlink-cli.js info
    `);
    const absTarget = path.resolve('C:\\\\Users\\\\wills\\\\Dropbox\\\\0_Intake\\\\FiloFax');
    const absLink = path.resolve(this.config.projectDir,`${this.config.linkTarget}FiloFax`);
	
    console.log(absLink);
  }

  /**
   * Run as CLI
   */
  async runCLI(args) {
    try {
      const parsed = this.parseArgs(args);

      // Reload config if --config flag was provided
      if (parsed.configPath) {
        this.config = this._loadConfig(parsed.configPath);
      }

	  const result = await this.execute(
        parsed.command,
        parsed.source,
        parsed.target,
        {
          force: parsed.force,
          createParent: parsed.createParent
        }
      );

      console.log('', result.message);
      console.log(JSON.stringify(result.data, null, 2));
      process.exit(0);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      console.error('\nUse --help for usage information');
      process.exit(1);
    }
  }
}

// Run CLI if executed directly
const cli = new SymlinkCLI();
await cli.runCLI(process.argv.slice(2));
