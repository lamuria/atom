(function() {
  var Emitter, LocalReplProcess, RemoteReplProcess, Repl, ReplHistory, ReplTextEditor, SelfHostedProcess, Task, replHelpText, _ref,
    __slice = [].slice;

  _ref = require('atom'), Task = _ref.Task, Emitter = _ref.Emitter;

  ReplTextEditor = require('./repl-text-editor');

  ReplHistory = require('./repl-history');

  LocalReplProcess = require('./process/local-repl-process');

  RemoteReplProcess = require('./process/remote-repl-process');

  SelfHostedProcess = require('./process/self-hosted-process');

  replHelpText = ";; This Clojure REPL is divided into two areas, top and bottom, delimited by a line of dashes. The top area shows code that's been executed in the REPL, standard out from running code, and the results of executed expressions. The bottom area allows Clojure code to be entered. The code can be executed by pressing shift+enter.\n\n;; Try it now by typing (+ 1 1) in the bottom section and pressing shift+enter.\n\n;; Working in another Clojure file and sending forms to the REPL is the most efficient way to work. Use the following key bindings to send code to the REPL. See the settings for more keybindings.\n\n;; ctrl-, then b - execute block. Finds the block of Clojure code your cursor is in and executes that.\n\n;; Try it now. Put your cursor inside this block and press ctrl and comma together,\n;; release, then press b.\n(+ 2 3)\n\n;; ctrl-, s - Executes the selection. Sends the selected text to the REPL.\n\n;; Try it now. Select these three lines and press ctrl and comma together, \n;; release, then press s.\n(println \"hello 1\")\n(println \"hello 2\")\n(println \"hello 3\")\n\n;; You can disable this help text in the settings.\n";

  module.exports = Repl = (function() {
    Repl.prototype.emitter = null;

    Repl.prototype.process = null;

    Repl.prototype.replTextEditor = null;

    Repl.prototype.replHistory = null;

    Repl.prototype.codeExecutionExtensions = null;

    function Repl(codeExecutionExtensions) {
      this.codeExecutionExtensions = codeExecutionExtensions;
      this.emitter = new Emitter;
      this.replTextEditor = new ReplTextEditor();
      this.replHistory = new ReplHistory();
      this.replTextEditor.onHistoryBack((function(_this) {
        return function() {
          if (_this.running()) {
            _this.replHistory.setCurrentText(_this.replTextEditor.enteredText());
            return _this.replTextEditor.setEnteredText(_this.replHistory.back());
          }
        };
      })(this));
      this.replTextEditor.onHistoryForward((function(_this) {
        return function() {
          if (_this.running()) {
            _this.replHistory.setCurrentText(_this.replTextEditor.enteredText());
            return _this.replTextEditor.setEnteredText(_this.replHistory.forward());
          }
        };
      })(this));
      this.replTextEditor.onDidOpen((function(_this) {
        return function() {
          if (atom.config.get("proto-repl.displayHelpText")) {
            return _this.appendText(replHelpText);
          }
        };
      })(this));
      this.replTextEditor.onDidClose((function(_this) {
        return function() {
          var error, _ref1;
          try {
            if ((_ref1 = _this.process) != null) {
              _ref1.stop(_this.session);
            }
            _this.replTextEditor = null;
            return _this.emitter.emit('proto-repl-repl:close');
          } catch (_error) {
            error = _error;
            return console.log("Warning error while closing: " + error);
          }
        };
      })(this));
    }

    Repl.prototype.onDidStart = function(callback) {
      return this.emitter.on('proto-repl-repl:start', callback);
    };

    Repl.prototype.running = function() {
      var _ref1;
      return (_ref1 = this.process) != null ? _ref1.running() : void 0;
    };

    Repl.prototype.getType = function() {
      var _ref1;
      return (_ref1 = this.process) != null ? _ref1.getType() : void 0;
    };

    Repl.prototype.isSelfHosted = function() {
      return this.getType() === "SelfHosted";
    };

    Repl.prototype.handleReplStarted = function() {
      this.appendText(this.process.getCurrentNs() + "=>", true);
      return this.emitter.emit('proto-repl-repl:start');
    };

    Repl.prototype.startProcessIfNotRunning = function(projectPath) {
      if (this.running()) {
        return this.appendText("REPL already running");
      } else {
        this.process = new LocalReplProcess((function(_this) {
          return function(text, waitUntilOpen) {
            if (waitUntilOpen == null) {
              waitUntilOpen = false;
            }
            return _this.appendText(text, waitUntilOpen);
          };
        })(this));
        return this.process.start(projectPath, {
          messageHandler: (function(_this) {
            return function(msg) {
              return _this.handleConnectionMessage(msg);
            };
          })(this),
          startCallback: (function(_this) {
            return function() {
              return _this.handleReplStarted();
            };
          })(this)
        });
      }
    };

    Repl.prototype.startRemoteReplConnection = function(_arg) {
      var connOptions, host, port;
      host = _arg.host, port = _arg.port;
      if (this.running()) {
        return this.appendText("REPL already running");
      } else {
        this.process = new RemoteReplProcess((function(_this) {
          return function(text, waitUntilOpen) {
            if (waitUntilOpen == null) {
              waitUntilOpen = false;
            }
            return _this.appendText(text, waitUntilOpen);
          };
        })(this));
        this.appendText("Starting remote REPL connection on " + host + ":" + port, true);
        connOptions = {
          host: host,
          port: port,
          messageHandler: ((function(_this) {
            return function(msg) {
              return _this.handleConnectionMessage(msg);
            };
          })(this)),
          startCallback: (function(_this) {
            return function() {
              return _this.handleReplStarted();
            };
          })(this)
        };
        return this.process.start(connOptions);
      }
    };

    Repl.prototype.startSelfHostedConnection = function() {
      var connOptions;
      if (this.running()) {
        return this.appendText("REPL already running");
      } else {
        this.process = new SelfHostedProcess((function(_this) {
          return function(text, waitUntilOpen) {
            if (waitUntilOpen == null) {
              waitUntilOpen = false;
            }
            return _this.appendText(text, waitUntilOpen);
          };
        })(this));
        connOptions = {
          messageHandler: ((function(_this) {
            return function(msg) {
              return _this.handleConnectionMessage(msg);
            };
          })(this)),
          startCallback: (function(_this) {
            return function() {
              _this.appendText("Self Hosted REPL Started!", true);
              return _this.handleReplStarted();
            };
          })(this)
        };
        return this.process.start(connOptions);
      }
    };

    Repl.prototype.handleConnectionMessage = function(msg) {
      if (msg.out) {
        return this.appendText(msg.out);
      } else {
        if (msg.err) {
          return this.appendText(this.process.getCurrentNs() + "=> " + msg.err);
        } else if (msg.value) {
          if (atom.config.get("proto-repl.autoPrettyPrint")) {
            return this.appendText(this.process.getCurrentNs() + "=>\n" + protoRepl.prettyEdn(msg.value));
          } else {
            return this.appendText(this.process.getCurrentNs() + "=> " + msg.value);
          }
        }
      }
    };

    Repl.prototype.onDidClose = function(callback) {
      return this.emitter.on('proto-repl-repl:close', callback);
    };

    Repl.prototype.appendText = function(text, waitUntilOpen) {
      var _ref1;
      if (waitUntilOpen == null) {
        waitUntilOpen = false;
      }
      return (_ref1 = this.replTextEditor) != null ? _ref1.appendText(text, waitUntilOpen) : void 0;
    };

    Repl.prototype.displayInline = function(editor, range, tree) {
      var end, r, recurseTree, view;
      end = range.end.row;
      this.ink.Result.removeLines(editor, end, end);
      recurseTree = (function(_this) {
        return function(_arg) {
          var childViews, children, head, view;
          head = _arg[0], children = 2 <= _arg.length ? __slice.call(_arg, 1) : [];
          if (children && children.length > 0) {
            childViews = children.map(function(x) {
              var view;
              if (x instanceof Array) {
                return recurseTree(x);
              } else {
                view = document.createElement('div');
                view.appendChild(new Text(x));
                return view;
              }
            });
            return _this.ink.tree.treeView(head, childViews, {});
          } else {
            view = document.createElement('div');
            view.appendChild(new Text(head));
            return view;
          }
        };
      })(this);
      view = recurseTree(tree);
      r = new this.ink.Result(editor, [end, end], {
        content: view
      });
      return r.view.classList.add('proto-repl');
    };

    Repl.prototype.makeInlineHandler = function(editor, range, valueToTreeFn) {
      return (function(_this) {
        return function(result) {
          var tree;
          if (result.value) {
            tree = valueToTreeFn(result.value);
          } else {
            tree = [result.error];
          }
          return _this.displayInline(editor, range, tree);
        };
      })(this);
    };

    Repl.prototype.inlineResultHandler = function(result, options) {
      var handler, io;
      if (this.ink && options.inlineOptions && atom.config.get('proto-repl.showInlineResults')) {
        io = options.inlineOptions;
        handler = this.makeInlineHandler(io.editor, io.range, function(value) {
          return protoRepl.ednToDisplayTree(value);
        });
        return handler(result);
      }
    };

    Repl.prototype.normalResultHandler = function(result, options) {
      return this.inlineResultHandler(result, options);
    };

    Repl.prototype.executeCode = function(code, options) {
      var handler, resultHandler;
      if (options == null) {
        options = {};
      }
      if (!this.running()) {
        return null;
      }
      resultHandler = options != null ? options.resultHandler : void 0;
      handler = (function(_this) {
        return function(result) {
          if (resultHandler) {
            return resultHandler(result, options);
          } else {
            return _this.normalResultHandler(result, options);
          }
        };
      })(this);
      if (options.displayCode && atom.config.get('proto-repl.displayExecutedCodeInRepl')) {
        this.appendText(options.displayCode);
      }
      return this.process.sendCommand(code, options, (function(_this) {
        return function(result) {
          var data, extensionCallback, extensionName, parsed;
          if (result.value && result.value.match(/\[\s*:proto-repl-code-execution-extension/)) {
            parsed = window.protoRepl.parseEdn(result.value);
            extensionName = parsed[1];
            data = parsed[2];
            extensionCallback = _this.codeExecutionExtensions[extensionName];
            if (extensionCallback) {
              return extensionCallback(data);
            } else {
              return handler(result);
            }
          } else {
            return handler(result);
          }
        };
      })(this));
    };

    Repl.prototype.executeEnteredText = function() {
      var code, editor;
      if (!this.running()) {
        return null;
      }
      if (editor = atom.workspace.getActiveTextEditor()) {
        if (editor === this.replTextEditor.textEditor) {
          code = this.replTextEditor.enteredText();
          this.replTextEditor.clearEnteredText();
          this.replHistory.setLastTextAndAddNewEntry(code);
          return this.executeCode("(do " + code + ")", {
            displayCode: code
          });
        }
      }
    };

    Repl.prototype.exit = function() {
      if (!this.running()) {
        return null;
      }
      this.appendText("Stopping REPL");
      this.process.stop();
      return this.process = null;
    };

    Repl.prototype.interrupt = function() {
      return this.process.interrupt();
    };

    Repl.prototype.clear = function() {
      return this.replTextEditor.clear();
    };

    return Repl;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL21hcmNvc2xhbXVyaWEvLmF0b20vcGFja2FnZXMvcHJvdG8tcmVwbC9saWIvcmVwbC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNEhBQUE7SUFBQSxrQkFBQTs7QUFBQSxFQUFBLE9BQWtCLE9BQUEsQ0FBUSxNQUFSLENBQWxCLEVBQUMsWUFBQSxJQUFELEVBQU8sZUFBQSxPQUFQLENBQUE7O0FBQUEsRUFFQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxvQkFBUixDQUZqQixDQUFBOztBQUFBLEVBR0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQUhkLENBQUE7O0FBQUEsRUFJQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsOEJBQVIsQ0FKbkIsQ0FBQTs7QUFBQSxFQUtBLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSwrQkFBUixDQUxwQixDQUFBOztBQUFBLEVBTUEsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLCtCQUFSLENBTnBCLENBQUE7O0FBQUEsRUFPQSxZQUFBLEdBQWUsNG5DQVBmLENBQUE7O0FBQUEsRUFTQSxNQUFNLENBQUMsT0FBUCxHQUtNO0FBQ0osbUJBQUEsT0FBQSxHQUFTLElBQVQsQ0FBQTs7QUFBQSxtQkFHQSxPQUFBLEdBQVMsSUFIVCxDQUFBOztBQUFBLG1CQU1BLGNBQUEsR0FBZ0IsSUFOaEIsQ0FBQTs7QUFBQSxtQkFTQSxXQUFBLEdBQWEsSUFUYixDQUFBOztBQUFBLG1CQVlBLHVCQUFBLEdBQXlCLElBWnpCLENBQUE7O0FBY2EsSUFBQSxjQUFFLHVCQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSwwQkFBQSx1QkFDYixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQUFYLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxjQUFELEdBQXNCLElBQUEs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

//# sourceURL=/Users/marcoslamuria/.atom/packages/proto-repl/lib/repl.coffee
