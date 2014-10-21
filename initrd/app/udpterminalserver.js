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

(function() {
    "use strict";

    var udpSocketApi = isolate.system.udpSocket;
    var udpSocket = null;

    var version = kernel.version();


    function onMessage(data) {

    var shellEnv = {
        stdout: function(text, opts) {
          var buf = runtime.toBuffer(text);
          udpSocketApi.send(udpSocket, data.address, data.port, buf);
        },
        stderr: function(text, opts) {
          var buf = runtime.toBuffer(text);
          udpSocketApi.send(udpSocket, data.address, data.port, buf);
        },
        stdin: function(opts) {
        isolate.env.stdin(opts);
        }
    };


        var str = runtime.bufferToString(data.buf);

        if (str === "clientattached") {
	isolate.env.stdout("Client logged in. \n");
        var buf = runtime.toBuffer("serverattached");
        udpSocketApi.send(udpSocket, data.address, data.port, buf);

        }

        else if (str.length > 1) {
        //isolate.env.stdout(str);

	if ( str === "EXIT" ) {
        var buf = runtime.toBuffer("Goodbye.");
        udpSocketApi.send(udpSocket, data.address, data.port, buf);
	isolate.env.stdout("Client disconnected. \n");

	}

        var args = str.split(" ");
	  
        isolate.system.fs.current({
            action: 'spawn',
            path: '/' + args[0] + '.js',
            data: {
                command: args[1]
            },
            env: shellEnv,
            onExit: function(result) {
          var buf = runtime.toBuffer("#: ");
          udpSocketApi.send(udpSocket, data.address, data.port, buf);

            }
        }).then(function() {}, function(err) {
		if (err) {
          var buf = runtime.toBuffer("#: ");
          udpSocketApi.send(udpSocket, data.address, data.port, buf);
			//isolate.env.stdout(err);
		}
        });

}

    }

    function onError() {
        isolate.log('error')
    }

    udpSocketApi.createSocket(onMessage, onError)
        .then(function(socket) {
            udpSocket = socket;
            return udpSocketApi.bindSocket(socket, 9000);
        })
        .then(function(socket) {
            isolate.env.stdout('listening to UDP port 9000\n', {fg: 'lightgreen'});
            return socket;
        })
        .catch(function(err) {
            isolate.log(err.stack);
        });
})();
