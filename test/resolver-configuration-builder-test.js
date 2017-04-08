'use strict';

const ResolverConfigurationBuilder = require('..');
const fs = require('fs');
const path = require('path');
const co = require('co');
const assert = require('assert');

const BroccoliTestHelper = require('broccoli-test-helper');
const buildOutput = BroccoliTestHelper.buildOutput;
const createTempDir = BroccoliTestHelper.createTempDir;

describe('resolver-configuration-builder', function() {
  let input, configContents;

  beforeEach(co.wrap(function* () {
    input = yield createTempDir();

    let configPath = path.join(__dirname, 'fixtures', 'config', 'environment.json');
    configContents = fs.readFileSync(configPath, { encoding: 'utf8' });
  }));

  afterEach(function() {
    return input.dispose();
  })

  it('can read a config file and log results (if requested)', co.wrap(function* () {
    input.write({
      'environment.json': configContents
    })
    let options = { configPath: 'environment.json', logResult: true };

    let configBuilder = new ResolverConfigurationBuilder(input.path(), options);

    yield buildOutput(configBuilder);

    assert.deepEqual(
      configBuilder.result,
      {
        "app": { "name": 'my-app', "rootName": 'my-app' },
        "types": {
          "application": { "definitiveCollection": "main" },
          "component": { "definitiveCollection": "components" },
          "renderer": { "definitiveCollection": "main" },
          "template": { "definitiveCollection": "components" },
          "util": { "definitiveCollection": "utils" }
        },
        "collections": {
          "main": {
                "types": ["application", "renderer"]
          },
          "components": {
            "group": "ui",
            "types": ["component", "template"],
            "defaultType": "component",
            "privateCollections": ["utils"]
          },
          "utils": {
            "unresolvable": true
          }
        }
      }
    );
  }));

  it('can use config options if no config file exists', co.wrap(function* () {
    let options = {
      defaultModulePrefix: 'my-app',
      defaultModuleConfiguration: {
        "types": {
          "application": { "definitiveCollection": "main" },
          "component": { "definitiveCollection": "components" },
          "renderer": { "definitiveCollection": "main" },
          "template": { "definitiveCollection": "components" },
          "util": { "definitiveCollection": "utils" }
        },
        "collections": {
          "main": {
            "types": ["application", "renderer"]
          },
          "components": {
            "group": "ui",
            "types": ["component", "template"],
            "defaultType": "component",
            "privateCollections": ["utils"]
          },
          "utils": {
            "unresolvable": true
          }
        }
      },
      configPath: 'DOES_NOT_EXIST.json',
      logResult: true
    };

    let configBuilder = new ResolverConfigurationBuilder(input.path(), options);

    yield buildOutput(configBuilder);

    assert.deepEqual(
      configBuilder.result,
      {
        "app": { "name": 'my-app', "rootName": 'my-app' },
        "types": {
          "application": { "definitiveCollection": "main" },
          "component": { "definitiveCollection": "components" },
          "renderer": { "definitiveCollection": "main" },
          "template": { "definitiveCollection": "components" },
          "util": { "definitiveCollection": "utils" }
        },
        "collections": {
          "main": {
            "types": ["application", "renderer"]
          },
          "components": {
            "group": "ui",
            "types": ["component", "template"],
            "defaultType": "component",
            "privateCollections": ["utils"]
          },
          "utils": {
            "unresolvable": true
          }
        }
      }
    );
  }));
});
