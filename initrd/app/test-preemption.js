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

(function(args) {
    "use strict";

    if (args.data.number) {
        for (;;) args.env.stdout(1 === args.data.number ? '*' : '@');
        runtime.exit();
    }

    for (var i = 0; i < 2; ++i) {
        args.system.fs.current({
            action: 'spawn',
            data: {
                number: i + 1
            },
            path: '/test-preemption.js',
            env: args.env
        });
    }

    runtime.exit();
})(runtime.args());
