// symlink-manager.js
import fspromises from "fs";
import path from "path";
import os from "os";
// const fs = require('fs').promises;
// const path = require('path');
// const os = require('os');
const fs = fspromises.promises;
/**
 * Comprehensive cross-platform symbolic link manager for folders
 * Works on Windows 11 and macOS with full error handling and validation
 */
class SymlinkManager {
  constructor() {
    this.platform = os.platform();
    this.isWindows = this.platform === 'win32';
  }

  /**
   * Creates a symbolic link to a folder with validation
   * @param {string} targetPath - The folder to link to (must exist)
   * @param {string} linkPath - Where to create the symbolic link
   * @param {Object} options - Configuration options
   * @param {boolean} options.force - Overwrite existing link (default: false)
   * @param {boolean} options.createParent - Create parent directories if needed (default: false)
   * @returns {Promise<{success: boolean, linkPath: string, targetPath: string}>}
   */
  async createLink(targetPath, linkPath, options = {}) {
    const { force = false, createParent = false } = options;
    
    try {
      // Validate inputs
      if (!targetPath || typeof targetPath !== 'string') {
        throw new Error('Target path must be a non-empty string');
      }
      if (!linkPath || typeof linkPath !== 'string') {
        throw new Error('Link path must be a non-empty string');
      }

      // Convert to absolute paths
      const absTarget = path.resolve(targetPath);
      const absLink = path.resolve(linkPath);
	  console.log(absTarget, absLink)

      // Prevent linking to self
      if (absTarget === absLink) {
        throw new Error('Target and link paths cannot be the same');
      }

      // Verify target exists and is a directory
      let targetStats;
      try {
        targetStats = await fs.stat(absTarget);
      } catch (error) {
        if (error.code === 'ENOENT') {
          throw new Error(`Target directory does not exist: ${absTarget}`);
        }
        throw new Error(`Cannot access target directory: ${error.message}`);
      }

      if (!targetStats.isDirectory()) {
        throw new Error(`Target is not a directory: ${absTarget}`);
      }

      // Check if link already exists
      let linkExists = false;
      let existingIsSymlink = false;
      
      try {
        const linkStats = await fs.lstat(absLink);
        linkExists = true;
        existingIsSymlink = linkStats.isSymbolicLink();
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw new Error(`Cannot check link path: ${error.message}`);
        }
      }

      // Handle existing link/file
      if (linkExists) {
        if (!force) {
          if (existingIsSymlink) {
            const existingTarget = await fs.readlink(absLink);
            throw new Error(
              `Symlink already exists at ${absLink} (points to: ${existingTarget}). Use force:true to overwrite.`
            );
          } else {
            throw new Error(
              `Path already exists and is not a symlink: ${absLink}. Use force:true to overwrite.`
            );
          }
        }
        
        // Remove existing link/file if force is true
        await fs.unlink(absLink);
      }

      // Create parent directories if needed
      if (createParent) {
        const parentDir = path.dirname(absLink);
        try {
          await fs.mkdir(parentDir, { recursive: true });
        } catch (error) {
          throw new Error(`Cannot create parent directory: ${error.message}`);
        }
      }

      // Check if parent directory exists
      const parentDir = path.dirname(absLink);
      try {
        await fs.access(parentDir);
      } catch (error) {
        throw new Error(
          `Parent directory does not exist: ${parentDir}. Use createParent:true to create it.`
        );
      }

      // Create symlink with platform-specific handling
      try {
        await fs.symlink(absTarget, absLink, 'dir');
      } catch (error) {
        if (error.code === 'EPERM' && this.isWindows) {
          throw new Error(
            'Permission denied. On Windows, you need Administrator privileges or Developer Mode enabled to create symlinks.'
          );
        }
        throw new Error(`Failed to create symlink: ${error.message}`);
      }

      return {
        success: true,
        linkPath: absLink,
        targetPath: absTarget
      };
    } catch (error) {
      error.operation = 'createLink';
      throw error;
    }
  }

  /**
   * Removes a symbolic link with validation
   * @param {string} linkPath - Path to the symbolic link to remove
   * @param {Object} options - Configuration options
   * @param {boolean} options.validateSymlink - Ensure path is a symlink before removing (default: true)
   * @returns {Promise<{success: boolean, linkPath: string}>}
   */
  async removeLink(linkPath, options = {}) {
    const { validateSymlink = true } = options;
    
    try {
      // Validate input
      if (!linkPath || typeof linkPath !== 'string') {
        throw new Error('Link path must be a non-empty string');
      }

      const absLink = path.resolve(linkPath);
      
      // Check if path exists
      let stats;
      try {
        stats = await fs.lstat(absLink);
      } catch (error) {
        if (error.code === 'ENOENT') {
          throw new Error(`Symlink not found: ${absLink}`);
        }
        throw new Error(`Cannot access path: ${error.message}`);
      }

      // Verify it's a symlink if validation is enabled
      if (validateSymlink && !stats.isSymbolicLink()) {
        throw new Error(
          `Path is not a symbolic link: ${absLink}. Use validateSymlink:false to remove anyway.`
        );
      }

      // Remove the symlink
      try {
        await fs.unlink(absLink);
      } catch (error) {
        if (error.code === 'EPERM') {
          throw new Error(`Permission denied when removing: ${absLink}`);
        }
        throw new Error(`Failed to remove symlink: ${error.message}`);
      }

      return {
        success: true,
        linkPath: absLink
      };
    } catch (error) {
      error.operation = 'removeLink';
      throw error;
    }
  }

  /**
   * Checks if a path is a symbolic link
   * @param {string} linkPath - Path to check
   * @returns {Promise<boolean>}
   */
  async isSymlink(linkPath) {
    try {
      if (!linkPath || typeof linkPath !== 'string') {
        return false;
      }
      const stats = await fs.lstat(path.resolve(linkPath));
      return stats.isSymbolicLink();
    } catch (error) {
      return false;
    }
  }

  /**
   * Gets the target path that a symlink points to
   * @param {string} linkPath - Path to the symbolic link
   * @returns {Promise<{isSymlink: boolean, targetPath: string|null, absoluteTargetPath: string|null}>}
   */
  async getTarget(linkPath) {
    try {
      if (!linkPath || typeof linkPath !== 'string') {
        throw new Error('Link path must be a non-empty string');
      }

      const absLink = path.resolve(linkPath);
      
      // Check if it's a symlink
      const stats = await fs.lstat(absLink);
      if (!stats.isSymbolicLink()) {
        return {
          isSymlink: false,
          targetPath: null,
          absoluteTargetPath: null
        };
      }

      // Read the symlink target
      const targetPath = await fs.readlink(absLink);
      
      // Resolve to absolute path
      const absoluteTargetPath = path.isAbsolute(targetPath)
        ? targetPath
        : path.resolve(path.dirname(absLink), targetPath);

      return {
        isSymlink: true,
        targetPath,
        absoluteTargetPath
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`Path not found: ${linkPath}`);
      }
      throw new Error(`Cannot read symlink: ${error.message}`);
    }
  }

  /**
   * Validates if a symlink is still valid (target exists)
   * @param {string} linkPath - Path to the symbolic link
   * @returns {Promise<{isValid: boolean, exists: boolean, isSymlink: boolean, targetExists: boolean, targetPath: string|null}>}
   */
  async validateSymlink(linkPath) {
    try {
      const absLink = path.resolve(linkPath);
      
      // Check if link exists
      let linkExists = false;
      let isSymlink = false;
      
      try {
        const stats = await fs.lstat(absLink);
        linkExists = true;
        isSymlink = stats.isSymbolicLink();
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw error;
        }
      }

      if (!linkExists) {
        return {
          isValid: false,
          exists: false,
          isSymlink: false,
          targetExists: false,
          targetPath: null
        };
      }

      if (!isSymlink) {
        return {
          isValid: false,
          exists: true,
          isSymlink: false,
          targetExists: false,
          targetPath: null
        };
      }

      // Get target and check if it exists
      const targetInfo = await this.getTarget(linkPath);
      let targetExists = false;
      
      try {
        await fs.access(targetInfo.absoluteTargetPath);
        targetExists = true;
      } catch (error) {
        // Target doesn't exist
      }

      return {
        isValid: isSymlink && targetExists,
        exists: true,
        isSymlink: true,
        targetExists,
        targetPath: targetInfo.absoluteTargetPath
      };
    } catch (error) {
      throw new Error(`Cannot validate symlink: ${error.message}`);
    }
  }

  /**
   * Gets system information about symlink support
   * @returns {Object}
   */
  getSystemInfo() {
    return {
      platform: this.platform,
      isWindows: this.isWindows,
      requiresElevation: this.isWindows,
      note: this.isWindows 
        ? 'Windows requires Administrator privileges or Developer Mode for creating symlinks'
        : 'Unix-based systems allow symlinks for all users'
    };
  }
}

export default SymlinkManager;
// module.exports = new SymlinkManager();