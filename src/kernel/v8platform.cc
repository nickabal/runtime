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

#include "v8platform.h"
#include <stdio.h>

namespace rt {

V8Platform::V8Platform() {

}

V8Platform::~V8Platform() {

}

void V8Platform::CallOnBackgroundThread(v8::Task* task, v8::Platform::ExpectedRuntime expected_runtime) {
    RT_ASSERT(task);

    printf("[V8 Platform] call on background\n");

    // TODO: do not run task immediately here
    // TODO: ensure locking works correctly (implement samaphores)
    task->Run();
}

void V8Platform::CallOnForegroundThread(v8::Isolate* isolate, v8::Task* task) {
    RT_ASSERT(isolate);
    RT_ASSERT(task);

    printf("[V8 Platform] call on foreground\n");

    // TODO: do not run task immediately here
    // TODO: ensure locking works correctly (implement samaphores)
    task->Run();
}

} // namespace rt
