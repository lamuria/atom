(function() {
  var ClojureVersion, DEFAULT_NS, EditorUtils, NReplConnection, nrepl;

  nrepl = require('jg-nrepl-client');

  ClojureVersion = require('./clojure-version');

  EditorUtils = require('../editor-utils');

  DEFAULT_NS = "user";

  module.exports = NReplConnection = (function() {
    NReplConnection.prototype.conn = null;

    NReplConnection.prototype.session = null;

    NReplConnection.prototype.cmdSession = null;

    NReplConnection.prototype.clojureVersion = null;

    NReplConnection.prototype.currentNs = DEFAULT_NS;

    function NReplConnection() {
      null;
    }

    NReplConnection.prototype.start = function(_arg) {
      var host, messageHandler, messageHandlingStarted, port, startCallback;
      host = _arg.host, port = _arg.port, messageHandler = _arg.messageHandler, startCallback = _arg.startCallback;
      if (this.connected()) {
        this.close();
      }
      if (host == null) {
        host = "localhost";
      }
      this.conn = nrepl.connect({
        port: port,
        host: host,
        verbose: false
      });
      messageHandlingStarted = false;
      this.currentNs = DEFAULT_NS;
      return this.conn.once('connect', (function(_this) {
        return function() {
          _this.conn.on('error', function(err) {
            atom.notifications.addError("proto-repl: connection error", {
              detail: err,
              dismissable: true
            });
            return _this.conn = null;
          });
          _this.conn.on('finish', function() {
            return _this.conn = null;
          });
          return _this.conn.clone(function(err, messages) {
            _this.session = messages[0]["new-session"];
            _this.determineClojureVersion(function() {
              if (!messageHandlingStarted) {
                _this.startMessageHandling(messageHandler);
                return messageHandlingStarted = true;
              }
            });
            return _this.conn.clone(function(err, messages) {
              _this.cmdSession = messages[0]["new-session"];
              return startCallback();
            });
          });
        };
      })(this));
    };

    NReplConnection.prototype.determineClojureVersion = function(callback) {
      return this.conn["eval"]("*clojure-version*", "user", this.session, (function(_this) {
        return function(err, messages) {
          var msg, value;
          value = ((function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = messages.length; _i < _len; _i++) {
              msg = messages[_i];
              _results.push(msg.value);
            }
            return _results;
          })())[0];
          _this.clojureVersion = new ClojureVersion(protoRepl.parseEdn(value));
          if (!_this.clojureVersion.isSupportedVersion()) {
            atom.notifications.addWarning("WARNING: This version of Clojure is not supported by Proto REPL. You may experience issues.", {
              dismissable: true
            });
          }
          return callback();
        };
      })(this));
    };

    NReplConnection.prototype.startMessageHandling = function(messageHandler) {
      return this.conn.messageStream.on("messageSequence", (function(_this) {
        return function(id, messages) {
          var msg, _i, _len, _results;
          if (!_this.namespaceNotFound(messages)) {
            _results = [];
            for (_i = 0, _len = messages.length; _i < _len; _i++) {
              msg = messages[_i];
              if (msg.ns) {
                _this.currentNs = msg.ns;
              }
              if (msg.session === _this.session) {
                _results.push(messageHandler(msg));
              } else if (msg.session === _this.cmdSession && msg.out) {
                _results.push(messageHandler(msg));
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          }
        };
      })(this));
    };

    NReplConnection.prototype.connected = function() {
      return this.conn !== null;
    };

    NReplConnection.prototype.getCurrentNs = function() {
      return this.currentNs;
    };

    NReplConnection.prototype.codeMayContainReaderConditional = function(code) {
      return code.includes("#?");
    };

    NReplConnection.prototype.wrapCodeInReadEval = function(code) {
      var escapedStr, _ref;
      if (((_ref = this.clojureVersion) != null ? _ref.isReaderConditionalSupported() : void 0) && this.codeMayContainReaderConditional(code)) {
        escapedStr = EditorUtils.escapeClojureCodeInString(code);
        return "(eval (read-string {:read-cond :allow} " + escapedStr + "))";
      } else {
        return code;
      }
    };

    NReplConnection.prototype.namespaceNotFound = function(messages) {
      var msg, _i, _len, _ref;
      for (_i = 0, _len = messages.length; _i < _len; _i++) {
        msg = messages[_i];
        if (((_ref = msg.status) != null ? _ref.length : void 0) > 0) {
          if (msg.status[0] === "namespace-not-found") {
            return true;
          }
        }
      }
    };

    NReplConnection.prototype.sendCommand = function(code, options, resultHandler) {
      var ns, session, wrappedCode;
      if (!this.connected()) {
        return null;
      }
      if (options.displayInRepl === false) {
        session = this.cmdSession;
      } else {
        session = this.session;
      }
      wrappedCode = this.wrapCodeInReadEval(code);
      ns = options.ns || this.currentNs;
      return this.conn["eval"](wrappedCode, ns, session, (function(_this) {
        return function(err, messages) {
          var error, msg, _i, _len, _results;
          try {
            if (_this.namespaceNotFound(messages)) {
              if (!options.retrying) {
                options.retrying = true;
                options.ns = _this.currentNs;
                return _this.sendCommand(code, options, resultHandler);
              }
            } else {
              _results = [];
              for (_i = 0, _len = messages.length; _i < _len; _i++) {
                msg = messages[_i];
                if (msg.value) {
                  _results.push(resultHandler({
                    value: msg.value
                  }));
                } else if (msg.err) {
                  _results.push(resultHandler({
                    error: msg.err
                  }));
                } else {
                  _results.push(void 0);
                }
              }
              return _results;
            }
          } catch (_error) {
            error = _error;
            console.error;
            return atom.notifications.addError("Error in handler: " + error, {
              detail: error,
              dismissable: true
            });
          }
        };
      })(this));
    };

    NReplConnection.prototype.interrupt = function() {
      if (!this.connected()) {
        return null;
      }
      this.conn.interrupt(this.session, (function(_this) {
        return function(err, result) {
          return null;
        };
      })(this));
      return this.conn.interrupt(this.cmdSession, (function(_this) {
        return function(err, result) {
          return null;
        };
      })(this));
    };

    NReplConnection.prototype.close = function() {
      if (!this.connected()) {
        return null;
      }
      this.conn.close(this.session, (function(_this) {
        return function() {};
      })(this));
      this.conn.close(this.cmdSession, (function(_this) {
        return function() {};
      })(this));
      return this.conn = null;
    };

    return NReplConnection;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL21hcmNvc2xhbXVyaWEvLmF0b20vcGFja2FnZXMvcHJvdG8tcmVwbC9saWIvcHJvY2Vzcy9ucmVwbC1jb25uZWN0aW9uLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrREFBQTs7QUFBQSxFQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsaUJBQVIsQ0FBUixDQUFBOztBQUFBLEVBQ0EsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVIsQ0FEakIsQ0FBQTs7QUFBQSxFQUVBLFdBQUEsR0FBYyxPQUFBLENBQVEsaUJBQVIsQ0FGZCxDQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFhLE1BSmIsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBRU07QUFFSiw4QkFBQSxJQUFBLEdBQU0sSUFBTixDQUFBOztBQUFBLDhCQUdBLE9BQUEsR0FBUyxJQUhULENBQUE7O0FBQUEsOEJBT0EsVUFBQSxHQUFZLElBUFosQ0FBQTs7QUFBQSw4QkFTQSxjQUFBLEdBQWdCLElBVGhCLENBQUE7O0FBQUEsOEJBV0EsU0FBQSxHQUFXLFVBWFgsQ0FBQTs7QUFhYSxJQUFBLHlCQUFBLEdBQUE7QUFDWCxNQUFBLElBQUEsQ0FEVztJQUFBLENBYmI7O0FBQUEsOEJBaUJBLEtBQUEsR0FBTyxTQUFDLElBQUQsR0FBQTtBQUNMLFVBQUEsaUVBQUE7QUFBQSxNQURPLFlBQUEsTUFBTSxZQUFBLE1BQU0sc0JBQUEsZ0JBQWdCLHFCQUFBLGFBQ25DLENBQUE7QUFBQSxNQUFBLElBQUcsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUFIO0FBQ0UsUUFBQSxJQUFDLENBQUEsS0FBRCxDQUFBLENBQUEsQ0FERjtPQUFBOztRQUdBLE9BQVE7T0FIUjtBQUFBLE1BSUEsSUFBQyxDQUFBLElBQUQsR0FBUSxLQUFLLENBQUMsT0FBTixDQUFjO0FBQUEsUUFBQyxJQUFBLEVBQU0sSUFBUDtBQUFBLFFBQWEsSUFBQSxFQUFNLElBQW5CO0FBQUEsUUFBeUIsT0FBQSxFQUFTLEtBQWxDO09BQWQsQ0FKUixDQUFBO0FBQUEsTUFLQSxzQkFBQSxHQUF5QixLQUx6QixDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsU0FBRCxHQUFhLFVBTmIsQ0FBQTthQVFBLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixDQUFXLFNBQVgsRUFBc0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUdwQixVQUFBLEtBQUMsQ0FBQSxJQUFJLENBQUMsRUFBTixDQUFTLE9BQVQsRUFBa0IsU0FBQyxHQUFELEdBQUE7QUFDaEIsWUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQTRCLDhCQUE1QixFQUE0RDtBQUFBLGNBQUEsTUFBQSxFQUFRLEdBQVI7QUFBQSxjQUFhLFdBQUEsRUFBYSxJQUExQjthQUE1RCxDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLElBQUQsR0FBUSxLQUZRO1VBQUEsQ0FBbEIsQ0FBQSxDQUFBO0FBQUEsVUFLQSxLQUFDLENBQUEsSUFBSSxDQUFDLEVBQU4sQ0FBUyxRQUFULEVBQW1CLFNBQUEsR0FBQTttQkFDakIsS0FBQyxDQUFBLElBQUQsR0FBUSxLQURTO1VBQUEsQ0FBbkIsQ0FMQSxDQUFBO2lCQVNBLEtBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLFNBQUMsR0FBRCxFQUFNLFFBQU4sR0FBQTtBQUNWLFlBQUEsS0FBQyxDQUFBLE9BQUQsR0FBVyxRQUFTLENBQUEsQ0FBQSxDQUFHLENBQUEsYUFBQSxDQUF2QixDQUFBO0FBQUEsWUFHQSxLQUFDLENBQUEsdUJBQUQsQ0FBeUIsU0FBQSxHQUFBO0FBR3ZCLGNBQUEsSUFBQSxDQUFBLHNCQUFBO0FBQ0UsZ0JBQUEsS0FBQyxDQUFBLG9CQUFELENBQXNCLGNBQXRCLENBQUEsQ0FBQTt1QkFDQSxzQkFBQSxHQUF5QixLQUYzQjtlQUh1QjtZQUFBLENBQXpCLENBSEEsQ0FBQTttQkFZQSxLQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxTQUFDLEdBQUQsRUFBTSxRQUFOLEdBQUE7QUFDVixjQUFBLEtBQUMsQ0FBQSxVQUFELEdBQWMsUUFBUyxDQUFBLENBQUEsQ0FBRyxDQUFBLGFBQUEsQ0FBMUIsQ0FBQTtxQkFDQSxhQUFBLENBQUEsRUFGVTtZQUFBLENBQVosRUFiVTtVQUFBLENBQVosRUFab0I7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0QixFQVRLO0lBQUEsQ0FqQlAsQ0FBQTs7QUFBQSw4QkF1REEsdUJBQUEsR0FBeUIsU0FBQyxRQUFELEdBQUE7YUFDdkIsSUFBQyxDQUFBLElBQUksQ0FBQyxNQUFELENBQUwsQ0FBVyxtQkFBWCxFQUFnQyxNQUFoQyxFQUF3QyxJQUFDLENBQUEsT0FBekMsRUFBa0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsR0FBRCxFQUFNLFFBQU4sR0FBQTtBQUNoRCxjQUFBLFVBQUE7QUFBQSxVQUFBLEtBQUEsR0FBUTs7QUFBQztpQkFBQSwrQ0FBQTtpQ0FBQTtBQUFBLDRCQUFBLEdBQUcsQ0FBQyxNQUFKLENBQUE7QUFBQTs7Y0FBRCxDQUFnQyxDQUFBLENBQUEsQ0FBeEMsQ0FBQTtBQUFBLFVBQ0EsS0FBQyxDQUFBLGNBQUQsR0FBc0IsSUFBQSxjQUFBLENBQWUsU0FBUyxDQUFDLFFBQVYsQ0FBbUIsS0FBbkIsQ0FBZixDQUR0QixDQUFBO0FBRUEsVUFBQSxJQUFBLENBQUEsS0FBUSxDQUFBLGNBQWMsQ0FBQyxrQkFBaEIsQ0FBQSxDQUFQO0FBQ0UsWUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQW5CLENBQThCLDZGQUE5QixFQUNFO0FBQUEsY0FBQSxXQUFBLEVBQWEsSUFBYjthQURGLENBQUEsQ0FERjtXQUZBO2lCQUtBLFFBQUEsQ0FBQSxFQU5nRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxELEVBRHVCO0lBQUEsQ0F2RHpCLENBQUE7O0FBQUEsOEJBZ0VBLG9CQUFBLEdBQXNCLFNBQUMsY0FBRCxHQUFBO2FBRXBCLElBQUMsQ0FBQSxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQXBCLENBQXVCLGlCQUF2QixFQUEwQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxFQUFELEVBQUssUUFBTCxHQUFBO0FBRXhDLGNBQUEsdUJBQUE7QUFBQSxVQUFBLElBQUEsQ0FBQSxLQUFRLENBQUEsaUJBQUQsQ0FBbUIsUUFBbkIsQ0FBUDtBQUNFO2lCQUFBLCtDQUFBO2lDQUFBO0FBR0UsY0FBQSxJQUFHLEdBQUcsQ0FBQyxFQUFQO0FBQ0UsZ0JBQUEsS0FBQyxDQUFBLFNBQUQsR0FBYSxHQUFHLENBQUMsRUFBakIsQ0FERjtlQUFBO0FBR0EsY0FBQSxJQUFHLEdBQUcsQ0FBQyxPQUFKLEtBQWUsS0FBQyxDQUFBLE9BQW5COzhCQUNFLGNBQUEsQ0FBZSxHQUFmLEdBREY7ZUFBQSxNQUVLLElBQUcsR0FBRyxDQUFDLE9BQUosS0FBZSxLQUFDLENBQUEsVUFBaEIsSUFBOEIsR0FBRyxDQUFDLEdBQXJDOzhCQUlILGNBQUEsQ0FBZSxHQUFmLEdBSkc7ZUFBQSxNQUFBO3NDQUFBO2VBUlA7QUFBQTs0QkFERjtXQUZ3QztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFDLEVBRm9CO0lBQUEsQ0FoRXRCLENBQUE7O0FBQUEsOEJBb0ZBLFNBQUEsR0FBVyxTQUFBLEdBQUE7YUFDVCxJQUFDLENBQUEsSUFBRCxLQUFTLEtBREE7SUFBQSxDQXBGWCxDQUFBOztBQUFBLDhCQXVGQSxZQUFBLEdBQWMsU0FBQSxHQUFBO2FBQ1osSUFBQyxDQUFBLFVBRFc7SUFBQSxDQXZGZCxDQUFBOztBQUFBLDhCQTRGQSwrQkFBQSxHQUFpQyxTQUFDLElBQUQsR0FBQTthQUMvQixJQUFJLENBQUMsUUFBTCxDQUFjLElBQWQsRUFEK0I7SUFBQSxDQTVGakMsQ0FBQTs7QUFBQSw4QkFpR0Esa0JBQUEsR0FBb0IsU0FBQyxJQUFELEdBQUE7QUFDbEIsVUFBQSxnQkFBQTtBQUFBLE1BQUEsZ0RBQWtCLENBQUUsNEJBQWpCLENBQUEsV0FBQSxJQUFtRCxJQUFDLENBQUEsK0JBQUQsQ0FBaUMsSUFBakMsQ0FBdEQ7QUFDRSxRQUFBLFVBQUEsR0FBYSxXQUFXLENBQUMseUJBQVosQ0FBc0MsSUFBdEMsQ0FBYixDQUFBO2VBQ0MseUNBQUEsR0FBeUMsVUFBekMsR0FBb0QsS0FGdkQ7T0FBQSxNQUFBO2VBSUUsS0FKRjtPQURrQjtJQUFBLENBakdwQixDQUFBOztBQUFBLDhCQXlHQSxpQkFBQSxHQUFtQixTQUFDLFFBQUQsR0FBQTtBQUNqQixVQUFBLG1CQUFBO0FBQUEsV0FBQSwrQ0FBQTsyQkFBQTtBQUNFLFFBQUEsdUNBQWEsQ0FBRSxnQkFBWixHQUFxQixDQUF4QjtBQUNFLFVBQUEsSUFBZSxHQUFHLENBQUMsTUFBTyxDQUFBLENBQUEsQ0FBWCxLQUFpQixxQkFBaEM7QUFBQSxtQkFBTyxJQUFQLENBQUE7V0FERjtTQURGO0FBQUEsT0FEaUI7SUFBQSxDQXpHbkIsQ0FBQTs7QUFBQSw4QkFvSEEsV0FBQSxHQUFhLFNBQUMsSUFBRCxFQUFPLE9BQVAsRUFBZ0IsYUFBaEIsR0FBQTtBQUNYLFVBQUEsd0JBQUE7QUFBQSxNQUFBLElBQUEsQ0FBQSxJQUFvQixDQUFBLFNBQUQsQ0FBQSxDQUFuQjtBQUFBLGVBQU8sSUFBUCxDQUFBO09BQUE7QUFFQSxNQUFBLElBQUcsT0FBTyxDQUFDLGFBQVIsS0FBeUIsS0FBNUI7QUFDRSxRQUFBLE9BQUEsR0FBVSxJQUFDLENBQUEsVUFBWCxDQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsT0FBQSxHQUFVLElBQUMsQ0FBQSxPQUFYLENBSEY7T0FGQTtBQUFBLE1BUUEsV0FBQSxHQUFjLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixJQUFwQixDQVJkLENBQUE7QUFBQSxNQVNBLEVBQUEsR0FBSyxPQUFPLENBQUMsRUFBUixJQUFjLElBQUMsQ0FBQSxTQVRwQixDQUFBO2FBV0EsSUFBQyxDQUFBLElBQUksQ0FBQyxNQUFELENBQUwsQ0FBVyxXQUFYLEVBQXdCLEVBQXhCLEVBQTRCLE9BQTVCLEVBQXFDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEdBQUQsRUFBTSxRQUFOLEdBQUE7QUFDbkMsY0FBQSw4QkFBQTtBQUFBO0FBR0UsWUFBQSxJQUFHLEtBQUMsQ0FBQSxpQkFBRCxDQUFtQixRQUFuQixDQUFIO0FBQ0UsY0FBQSxJQUFBLENBQUEsT0FBYyxDQUFDLFFBQWY7QUFDRSxnQkFBQSxPQUFPLENBQUMsUUFBUixHQUFtQixJQUFuQixDQUFBO0FBQUEsZ0JBQ0EsT0FBTyxDQUFDLEVBQVIsR0FBYSxLQUFDLENBQUEsU0FEZCxDQUFBO3VCQUVBLEtBQUMsQ0FBQSxXQUFELENBQWEsSUFBYixFQUFtQixPQUFuQixFQUE0QixhQUE1QixFQUhGO2VBREY7YUFBQSxNQUFBO0FBTUU7bUJBQUEsK0NBQUE7bUNBQUE7QUFDRSxnQkFBQSxJQUFHLEdBQUcsQ0FBQyxLQUFQO2dDQUNFLGFBQUEsQ0FBYztBQUFBLG9CQUFBLEtBQUEsRUFBTyxHQUFHLENBQUMsS0FBWDttQkFBZCxHQURGO2lCQUFBLE1BRUssSUFBRyxHQUFHLENBQUMsR0FBUDtnQ0FDSCxhQUFBLENBQWM7QUFBQSxvQkFBQSxLQUFBLEVBQU8sR0FBRyxDQUFDLEdBQVg7bUJBQWQsR0FERztpQkFBQSxNQUFBO3dDQUFBO2lCQUhQO0FBQUE7OEJBTkY7YUFIRjtXQUFBLGNBQUE7QUFlRSxZQURJLGNBQ0osQ0FBQTtBQUFBLFlBQUEsT0FBTyxDQUFDLEtBQVIsQ0FBQTttQkFDQSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQTRCLG9CQUFBLEdBQXVCLEtBQW5ELEVBQ0U7QUFBQSxjQUFBLE1BQUEsRUFBUSxLQUFSO0FBQUEsY0FBZSxXQUFBLEVBQWEsSUFBNUI7YUFERixFQWhCRjtXQURtQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJDLEVBWlc7SUFBQSxDQXBIYixDQUFBOztBQUFBLDhCQXFKQSxTQUFBLEdBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxJQUFBLENBQUEsSUFBb0IsQ0FBQSxTQUFELENBQUEsQ0FBbkI7QUFBQSxlQUFPLElBQVAsQ0FBQTtPQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLFNBQU4sQ0FBZ0IsSUFBQyxDQUFBLE9BQWpCLEVBQTBCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEdBQUQsRUFBTSxNQUFOLEdBQUE7aUJBQ3hCLEtBRHdCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUIsQ0FEQSxDQUFBO2FBR0EsSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFOLENBQWdCLElBQUMsQ0FBQSxVQUFqQixFQUE2QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxHQUFELEVBQU0sTUFBTixHQUFBO2lCQUMzQixLQUQyQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTdCLEVBSlM7SUFBQSxDQXJKWCxDQUFBOztBQUFBLDhCQTRKQSxLQUFBLEdBQU8sU0FBQSxHQUFBO0FBQ0wsTUFBQSxJQUFBLENBQUEsSUFBb0IsQ0FBQSxTQUFELENBQUEsQ0FBbkI7QUFBQSxlQUFPLElBQVAsQ0FBQTtPQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxJQUFDLENBQUEsT0FBYixFQUFzQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRCLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksSUFBQyxDQUFBLFVBQWIsRUFBeUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QixDQUZBLENBQUE7YUFHQSxJQUFDLENBQUEsSUFBRCxHQUFRLEtBSkg7SUFBQSxDQTVKUCxDQUFBOzsyQkFBQTs7TUFWRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/marcoslamuria/.atom/packages/proto-repl/lib/process/nrepl-connection.coffee
