# Symlink Manager CLI - Cross-platform symbolic link management tool

## USAGE:
  node symlink-cli.js <command> [options]
  node symlink-cli.js <command> <source> <target> [options]

## COMMANDS:
  create <source> <target>    Create a symbolic link
  remove <path>               Remove a symbolic link
  setup                       Creates and removes symbolic links based on configuration file
  check <path>                Check if path is a symlink and show target
  validate <path>             Validate if symlink target still exists
  info                        Show system information

## OPTIONS:
  --source, -s <path>         Source/target folder path
  --target, -t <path>         Symlink location path
  --help, -h                  Show this help message

## EXAMPLES:
### Create a symlink
node symlink-cli.js create ./my-folder ./link-to-folder
node symlink-cli.js create -s ./my-folder -t ./link-to-folder
node symlink-cli.js create -s "C:\Users\wills\Dropbox\0_Intake\FiloFax" -t "FiloFax"

node symlink-cli create -s "C:\Users\wills\Dropbox\0_Intake\FiloFax" -t "FiloFax"

node symlink-cli create -s "/Users/strye/Documents/0_PersonalZettle/ToBeReviewed" -t "ToBeReviewed"
npm run symlink:create -- -s "/Users/strye/Documents/0_PersonalZettle/ToBeReviewed" -t "ToBeReviewed"

### Remove a symlink
node symlink-cli.js remove ./link-to-folder
node symlink-cli remove "FiloFax"
npm run symlink:create -- "ToBeReviewed"

### Setup a symlinks
sudo node symlink-cli.js setup
sudo node symlink-cli setup

### Check if path is a symlink
node symlink-cli.js check ./link-to-folder

### Validate a symlink
node symlink-cli.js validate ./link-to-folder

### Show system info
node symlink-cli.js info
