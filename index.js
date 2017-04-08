"use strict";

const Plugin = require('broccoli-plugin');
const fs = require('fs');
const path = require('path');
const INTERFACE = `
import { ResolverConfiguration } from '@glimmer/resolver';
declare let config: ResolverConfiguration;
export default config;
`;

class ResolverConfigurationBuilder extends Plugin {
  constructor(config, options) {
    options = options || {};
    super([config], {
      annotation: options.annotation
    });
    this.options = options;
  }

  build() {
    // Attempt to read config file
    let configPath = path.join(this.inputPaths[0], this.options.configPath);
    let config;
    if (fs.existsSync(configPath)) {
      let configContents = fs.readFileSync(configPath, { encoding: 'utf8' });
      config = JSON.parse(configContents);
    } else {
      config = {};
    }

    let moduleConfig = config.moduleConfiguration || this.options.defaultModuleConfiguration;
    if (!moduleConfig) {
      throw new Error(`The module configuration could not be found. Please add a config file to '${configPath}' and export an object with a 'moduleConfiguration' member.`);
    }

    let modulePrefix = config.modulePrefix || this.options.defaultModulePrefix;
    if (!modulePrefix) {
      throw new Error(`The module prefix could not be found. Add a config file to '${configPath}' and export an object with a 'modulePrefix' member.`);
    }

    let rootName = modulePrefix;
    let name = this.options.name || modulePrefix;

    let resolverConfiguration = {
      app: { name, rootName },
      types: moduleConfig.types,
      collections: moduleConfig.collections
    }

    if (this.options.logResult) {
      this.result = resolverConfiguration;
    }

    let destPath = path.join(this.outputPath, 'config');
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath);
    }

    let contents = "export default " + JSON.stringify(resolverConfiguration) + ";" + '\n';

    fs.writeFileSync(path.join(this.outputPath, 'config', 'resolver-configuration.js'), contents, { encoding: 'utf8' });
    fs.writeFileSync(path.join(this.outputPath, 'config', 'resolver-configuration.d.ts'), INTERFACE, { encoding: 'utf8' });
  }
}

module.exports = ResolverConfigurationBuilder;
