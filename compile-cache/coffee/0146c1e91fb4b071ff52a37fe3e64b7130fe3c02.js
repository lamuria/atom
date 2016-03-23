(function() {
  var BootRunner, DEFAULT_PROJECT_PATH, EXIT_CMD, LeinRunner, LocalReplProcess, NReplConnection, Task, fs, path;

  Task = require('atom').Task;

  LeinRunner = require.resolve('./lein-runner');

  BootRunner = require.resolve('./boot-runner');

  path = require('path');

  fs = require('fs');

  NReplConnection = require('./nrepl-connection');

  EXIT_CMD = "(System/exit 0)";

  DEFAULT_PROJECT_PATH = "" + (atom.packages.getPackageDirPaths()[0]) + "/proto-repl/proto-no-proj";

  module.exports = LocalReplProcess = (function() {
    LocalReplProcess.prototype.appendText = null;

    LocalReplProcess.prototype.conn = new NReplConnection();

    LocalReplProcess.prototype.process = null;

    function LocalReplProcess(appendText) {
      this.appendText = appendText;
      null;
    }

    LocalReplProcess.prototype.getType = function() {
      return "Local";
    };

    LocalReplProcess.prototype.getRootProject = function(currentPath, limit) {
      var matches, parentDirectory;
      if (limit == null) {
        limit = 0;
      }
      if (currentPath.startsWith("atom://")) {
        return;
      }
      parentDirectory = path.resolve(currentPath, "..");
      if (currentPath !== parentDirectory && limit < 100) {
        matches = fs.readdirSync(currentPath).filter(function(f) {
          return f === "project.clj" || f === "build.boot";
        });
        if (currentPath && matches.length === 0) {
          return this.getRootProject(parentDirectory, limit + 1);
        } else {
          if (matches.length !== 0) {
            return currentPath;
          }
        }
      }
    };

    LocalReplProcess.prototype.start = function(projectPath, connOptions) {
      var bootFound, leinFound, replType;
      if (this.running()) {
        return;
      }
      if (projectPath == null) {
        projectPath = atom.project.getPaths()[0];
      }
      if (projectPath) {
        projectPath = this.getRootProject(projectPath);
      }
      bootFound = fs.existsSync(projectPath + "/build.boot");
      leinFound = fs.existsSync(projectPath + "/project.clj");
      if ((projectPath != null)) {
        if (bootFound && leinFound) {
          if (atom.config.get("proto-repl.preferLein")) {
            replType = "lein";
          } else {
            replType = "boot";
          }
        } else if (bootFound) {
          replType = "boot";
        } else if (leinFound) {
          replType = "lein";
        } else {
          replType = "lein";
          projectPath = DEFAULT_PROJECT_PATH;
        }
      } else {
        replType = "lein";
        projectPath = DEFAULT_PROJECT_PATH;
      }
      this.appendText("Starting REPL with " + replType + " in " + projectPath + "\n", true);
      switch (replType) {
        case "boot":
          this.process = Task.once(BootRunner, path.resolve(projectPath), atom.config.get('proto-repl.bootPath').replace("/boot", ""), atom.config.get('proto-repl.bootArgs').split(" "));
          break;
        default:
          this.process = Task.once(LeinRunner, path.resolve(projectPath), atom.config.get('proto-repl.leinPath').replace("/lein", ""), atom.config.get('proto-repl.leinArgs').split(" "));
      }
      this.process.on('proto-repl-process:data', (function(_this) {
        return function(data) {
          return _this.appendText(data);
        };
      })(this));
      this.process.on('proto-repl-process:nrepl-port', (function(_this) {
        return function(port) {
          connOptions.port = port;
          return _this.conn.start(connOptions);
        };
      })(this));
      return this.process.on('proto-repl-process:exit', (function(_this) {
        return function() {
          _this.appendText("\nREPL Closed\n");
          _this.process = null;
          return _this.conn.close();
        };
      })(this));
    };

    LocalReplProcess.prototype.running = function() {
      return this.process !== null && this.conn.connected();
    };

    LocalReplProcess.prototype.sendCommand = function(code, options, resultHandler) {
      return this.conn.sendCommand(code, options, resultHandler);
    };

    LocalReplProcess.prototype.getCurrentNs = function() {
      return this.conn.getCurrentNs();
    };

    LocalReplProcess.prototype.interrupt = function() {
      this.conn.interrupt();
      return this.appendText("Interrupting");
    };

    LocalReplProcess.prototype.stop = function() {
      var error, _ref;
      try {
        this.conn.sendCommand(EXIT_CMD, true, (function(_this) {
          return function() {};
        })(this));
        this.conn.close();
      } catch (_error) {
        error = _error;
        console.log("Error trying to send exit command to REPL.", error);
      }
      if ((_ref = this.process) != null) {
        _ref.send({
          event: 'kill'
        });
      }
      return this.process = null;
    };

    return LocalReplProcess;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL21hcmNvc2xhbXVyaWEvLmF0b20vcGFja2FnZXMvcHJvdG8tcmVwbC9saWIvcHJvY2Vzcy9sb2NhbC1yZXBsLXByb2Nlc3MuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlHQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsTUFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFPLENBQUMsT0FBUixDQUFnQixlQUFoQixDQURiLENBQUE7O0FBQUEsRUFFQSxVQUFBLEdBQWEsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsZUFBaEIsQ0FGYixDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUlBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQUpMLENBQUE7O0FBQUEsRUFLQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSxvQkFBUixDQUxsQixDQUFBOztBQUFBLEVBUUEsUUFBQSxHQUFTLGlCQVJULENBQUE7O0FBQUEsRUFXQSxvQkFBQSxHQUF1QixFQUFBLEdBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFkLENBQUEsQ0FBbUMsQ0FBQSxDQUFBLENBQXBDLENBQUYsR0FBeUMsMkJBWGhFLENBQUE7O0FBQUEsRUFhQSxNQUFNLENBQUMsT0FBUCxHQUVNO0FBR0osK0JBQUEsVUFBQSxHQUFZLElBQVosQ0FBQTs7QUFBQSwrQkFHQSxJQUFBLEdBQVUsSUFBQSxlQUFBLENBQUEsQ0FIVixDQUFBOztBQUFBLCtCQU1BLE9BQUEsR0FBUyxJQU5ULENBQUE7O0FBUWEsSUFBQSwwQkFBRSxVQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxhQUFBLFVBQ2IsQ0FBQTtBQUFBLE1BQUEsSUFBQSxDQURXO0lBQUEsQ0FSYjs7QUFB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

//# sourceURL=/Users/marcoslamuria/.atom/packages/proto-repl/lib/process/local-repl-process.coffee
