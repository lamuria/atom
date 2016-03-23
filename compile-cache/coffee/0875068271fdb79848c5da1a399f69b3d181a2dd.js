(function() {
  var childProcess, filteredEnv, fs, path, _;

  childProcess = require('child_process');

  path = require('path');

  fs = require('fs');

  _ = require('underscore');

  filteredEnv = _.omit(process.env, 'ATOM_HOME', 'ATOM_SHELL_INTERNAL_RUN_AS_NODE', 'GOOGLE_API_KEY', 'NODE_ENV', 'NODE_PATH', 'userAgent', 'taskPath');

  module.exports = function(currentWorkingDir, leinPath, args) {
    var callback, envPath, error, leinExec, portFound, processData, replProcess;
    callback = this.async();
    try {
      if (process.platform === "win32") {
        if (leinPath.endsWith("lein.bat")) {
          leinExec = leinPath;
        } else {
          leinExec = path.join(leinPath, "lein.bat");
        }
        envPath = filteredEnv["Path"] || "";
        filteredEnv["Path"] = envPath + path.delimiter + leinPath;
      } else {
        leinExec = "lein";
        envPath = filteredEnv["PATH"] || "";
        filteredEnv["PATH"] = envPath + path.delimiter + leinPath;
      }
      replProcess = childProcess.spawn(leinExec, args, {
        cwd: currentWorkingDir,
        env: filteredEnv
      });
      replProcess.on('error', function(error) {
        return processData("Error starting repl: " + error + "\nYou may need to configure the lein path in proto-repl settings\n");
      });
      portFound = false;
      processData = function(data) {
        var dataStr, match, port;
        dataStr = data.toString();
        if (!portFound) {
          if (match = dataStr.match(/.*nREPL.*port (\d+)/)) {
            portFound = true;
            port = Number(match[1]);
            emit('proto-repl-process:nrepl-port', port);
          }
        }
        return emit('proto-repl-process:data', dataStr);
      };
      replProcess.stdout.on('data', processData);
      replProcess.stderr.on('data', processData);
      replProcess.on('close', function(code) {
        emit('proto-repl-process:exit');
        return callback();
      });
    } catch (_error) {
      error = _error;
      processData("Error starting repl: " + error);
    }
    return process.on('message', function(_arg) {
      var event, text, _ref;
      _ref = _arg != null ? _arg : {}, event = _ref.event, text = _ref.text;
      try {
        switch (event) {
          case 'input':
            return replProcess.stdin.write(text);
          case 'kill':
            return replProcess.kill("SIGKILL");
        }
      } catch (_error) {
        error = _error;
        return console.error(error);
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL21hcmNvc2xhbXVyaWEvLmF0b20vcGFja2FnZXMvcHJvdG8tcmVwbC9saWIvcHJvY2Vzcy9sZWluLXJ1bm5lci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0NBQUE7O0FBQUEsRUFBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGVBQVIsQ0FBZixDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUZMLENBQUE7O0FBQUEsRUFHQSxDQUFBLEdBQUksT0FBQSxDQUFRLFlBQVIsQ0FISixDQUFBOztBQUFBLEVBS0EsV0FBQSxHQUFjLENBQUMsQ0FBQyxJQUFGLENBQU8sT0FBTyxDQUFDLEdBQWYsRUFBb0IsV0FBcEIsRUFBaUMsaUNBQWpDLEVBQW9FLGdCQUFwRSxFQUFzRixVQUF0RixFQUFrRyxXQUFsRyxFQUErRyxXQUEvRyxFQUE0SCxVQUE1SCxDQUxkLENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLGlCQUFELEVBQW9CLFFBQXBCLEVBQThCLElBQTlCLEdBQUE7QUFDZixRQUFBLHVFQUFBO0FBQUEsSUFBQSxRQUFBLEdBQVcsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQUFYLENBQUE7QUFDQTtBQUNFLE1BQUEsSUFBRyxPQUFPLENBQUMsUUFBUixLQUFvQixPQUF2QjtBQUVFLFFBQUEsSUFBRyxRQUFRLENBQUMsUUFBVCxDQUFrQixVQUFsQixDQUFIO0FBQ0UsVUFBQSxRQUFBLEdBQVcsUUFBWCxDQURGO1NBQUEsTUFBQTtBQUdFLFVBQUEsUUFBQSxHQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsUUFBVixFQUFvQixVQUFwQixDQUFYLENBSEY7U0FBQTtBQUFBLFFBSUEsT0FB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

//# sourceURL=/Users/marcoslamuria/.atom/packages/proto-repl/lib/process/lein-runner.coffee
