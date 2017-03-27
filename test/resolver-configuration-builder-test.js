'use strict';

const ResolverConfigurationBuilder = require('..');
const { build } = require('broccoli-fixture');
const path = require('path');
const assert = require('assert');

describe('resolver-configuration-builder', function() {
  it('can read a config file and log results (if requested)', function() {
    let config = path.join(process.cwd(), 'test', 'fixtures', 'config');
    let options = { configPath: 'environment.json', logResult: true };

    let configBuilder = new ResolverConfigurationBuilder(config, options);

    return build(configBuilder)
      .then(result => {
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
      });
  });

  it('can use config options if no config file exists', function() {
    let src = path.join(process.cwd(), 'test', 'fixtures', 'src');
    let config = path.join(process.cwd(), 'test', 'fixtures', 'config');
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

    let configBuilder = new ResolverConfigurationBuilder(config, options);

    return build(configBuilder)
      .then(result => {
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
      });
  });
});
