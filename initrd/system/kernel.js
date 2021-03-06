// Copyright 2014 Runtime.JS project authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

isolate.log('Loading system...');

function Injector() {
    "use strict";

    var modules = new Map();

    function getModule(name) {
        if (modules.has(name)) {
            return modules.get(name);
        }

        var d = {
            name: name,
            resolve: null,
            reject: null,
            promise: null,
        };

        d.promise = new Promise(function(resolve, reject) {
            d.resolve = resolve;
            d.reject = reject;
        });

        modules.set(name, d);
        return d;
    }

    this.set = function(name, inject, fn) {
        if ('string' !== typeof name) {
            throw new Error('invalid module name');
        }

        if (!Array.isArray(inject)) {
            throw new Error('invalid module dependency list');
        }

        Promise.all(inject.map(function(depName) {
            if ('string' !== typeof depName) {
                throw new Error('invalid dependency service name');
            }

            return getModule(depName).promise;
        })).then(function(deps) {
            getModule(name).resolve(fn.apply(null, deps));
        }).catch(function(err) {
            isolate.log(err.stack);
        });
    };

    this.get = function(value) {
        if (Array.isArray(value)) {
            return Promise.all(value.map(function(name) {
                return getModule(name).promise;
            }));
        }

        if ('string' !== typeof value) {
            throw new Error('invalid module name');
        }

        return getModule(value).promise;
    };
}

// Global define function
var define;

(function() {
    "use strict";

    /**
     * Create DI injector
     */
    var injector = new Injector();

    /**
     * Pretend this is an AMD loader
     */
    define = injector.set;
    define.amd = {};

    /**
     * Component provides access to kernel resources
     */
    define('resources', [],
    function() {
        return isolate.data();
    });

    /**
     * Kernel bootstrap component. This loads kernel loader,
     * because it can't load itself
     */
    define('bootstrap', ['resources'],
    function(resources) {
        resources.loader('/system/kernel-loader.js');
    });

    /**
     * Main kernel component
     */
    define('kernel', ['resources', 'vga', 'keyboard', 'vfs'],
    function(resources, vga, keyboard, vfs) {

        vfs.getInitrdRoot()({
            action: 'spawn',
            path: '/app/terminal.js',
            env: {
                textVideo: vga.client,
                keyboard: keyboard.client,
            }
        }).catch(function(err) {
            isolate.log(err.stack);
        });

        return {};
    });
})();
