(function() {
  var DEFAULT_NS, SelfHostedProcess, allowUnsafeEval, allowUnsafeNewFunction, self_hosted_clj, _ref;

  self_hosted_clj = require('../proto_repl/proto_repl/self_hosted.js');

  _ref = require('loophole'), allowUnsafeEval = _ref.allowUnsafeEval, allowUnsafeNewFunction = _ref.allowUnsafeNewFunction;

  DEFAULT_NS = "cljs.user";

  module.exports = SelfHostedProcess = (function() {
    SelfHostedProcess.prototype.appendText = null;

    SelfHostedProcess.prototype.currentNs = DEFAULT_NS;

    function SelfHostedProcess(appendText) {
      this.appendText = appendText;
      null;
    }

    SelfHostedProcess.prototype.getType = function() {
      return "SelfHosted";
    };

    SelfHostedProcess.prototype.start = function(_arg) {
      var messageHandler, startCallback;
      messageHandler = _arg.messageHandler, startCallback = _arg.startCallback;
      if (this.running()) {
        return;
      }
      this.currentNs = DEFAULT_NS;
      this.messageHandler = messageHandler;
      this.startRedirectingConsoleOutput();
      return startCallback();
    };

    SelfHostedProcess.prototype["eval"] = function(code, successCb, errorCb) {
      return allowUnsafeEval((function(_this) {
        return function() {
          return allowUnsafeNewFunction(function() {
            return self_hosted_clj.eval_str(code, function(result) {
              var error, _ref1;
              if (result["success?"]) {
                return successCb(result.value);
              } else {
                error = ((_ref1 = result.error.cause) != null ? _ref1.toString() : void 0) || result.error.toString();
                return errorCb(error);
              }
            });
          });
        };
      })(this));
    };

    SelfHostedProcess.prototype.switchNs = function(ns, successCb, errorCb) {
      return this["eval"]("(in-ns '" + ns + ")", ((function(_this) {
        return function() {
          _this.currentNs = ns;
          return successCb();
        };
      })(this)), (function(error) {
        return errorCb(error);
      }));
    };

    SelfHostedProcess.prototype.getCurrentNs = function() {
      return this.currentNs;
    };

    SelfHostedProcess.prototype.sendCommand = function(code, options, resultHandler) {
      var errorHandler, successCb;
      successCb = (function(_this) {
        return function(value) {
          if (options.displayInRepl !== false) {
            _this.messageHandler({
              value: value
            });
          }
          return resultHandler({
            value: value
          });
        };
      })(this);
      errorHandler = (function(_this) {
        return function(error) {
          if (options.displayInRepl !== false) {
            _this.messageHandler({
              err: error
            });
          }
          return resultHandler({
            error: error
          });
        };
      })(this);
      if (options.ns) {
        return this.switchNs(options.ns, ((function(_this) {
          return function() {
            return _this["eval"](code, successCb, errorHandler);
          };
        })(this)), errorHandler);
      } else {
        return this["eval"](code, successCb, errorHandler);
      }
    };

    SelfHostedProcess.prototype.interrupt = function() {
      return null;
    };

    SelfHostedProcess.prototype.running = function() {
      return this.messageHandler != null;
    };

    SelfHostedProcess.prototype.stop = function(session) {
      if (!this.running()) {
        return;
      }
      this.stopRedirectingConsoleOutput();
      return this.appendText("Self hosted REPL stopped");
    };

    SelfHostedProcess.prototype.startRedirectingConsoleOutput = function() {
      var originalError, originalLog, originalWarn, protoLog;
      if (this.originalLog) {
        console.log("Already redirecting logging");
      } else {
        originalLog = console.log;
        this.originalLog = originalLog;
        originalWarn = console.warn;
        this.originalWarn = originalWarn;
        originalError = console.error;
        this.originalError = originalError;
        protoLog = this.appendText;
        console.log = function() {
          var args;
          args = Array.prototype.slice.call(arguments);
          protoLog(args.join(" "));
          return originalLog.apply(console, arguments);
        };
        console.warn = function() {
          var args;
          args = Array.prototype.slice.call(arguments);
          protoLog(args.join(" "));
          return originalWarn.apply(console, arguments);
        };
        return console.error = function() {
          var args;
          args = Array.prototype.slice.call(arguments);
          protoLog(args.join(" "));
          return originalError.apply(console, arguments);
        };
      }
    };

    SelfHostedProcess.prototype.stopRedirectingConsoleOutput = function() {
      if (!this.originalLog) {
        return;
      }
      console.log = this.originalLog;
      console.warn = this.originalWarn;
      return console.error = this.originalError;
    };

    return SelfHostedProcess;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL21hcmNvc2xhbXVyaWEvLmF0b20vcGFja2FnZXMvcHJvdG8tcmVwbC9saWIvcHJvY2Vzcy9zZWxmLWhvc3RlZC1wcm9jZXNzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw2RkFBQTs7QUFBQSxFQUFBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHlDQUFSLENBQWxCLENBQUE7O0FBQUEsRUFDQSxPQUE0QyxPQUFBLENBQVEsVUFBUixDQUE1QyxFQUFDLHVCQUFBLGVBQUQsRUFBa0IsOEJBQUEsc0JBRGxCLENBQUE7O0FBQUEsRUFHQSxVQUFBLEdBQWEsV0FIYixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FJTTtBQUdKLGdDQUFBLFVBQUEsR0FBWSxJQUFaLENBQUE7O0FBQUEsZ0NBRUEsU0FBQSxHQUFXLFVBRlgsQ0FBQTs7QUFJYSxJQUFBLDJCQUFFLFVBQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLGFBQUEsVUFDYixDQUFBO0FBQUEsTUFBQSxJQUFBLENBRFc7SUFBQSxDQUpiOztBQUFBLGdDQU9BLE9BQUEsR0FBUyxTQUFBLEdBQUE7YUFDUCxhQURPO0lBQUEsQ0FQVCxDQUFBOztBQUFBLGdDQVVBLEtBQUEsR0FBTyxTQUFDLElBQUQsR0FBQTtBQUNMLFVBQUEsNkJBQUE7QUFBQSxNQURPLHNCQUFBLGdCQUFnQixxQkFBQSxhQUN2QixDQUFBO0FBQUEsTUFBQSxJQUFVLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FBVjtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsU0FBRCxHQUFhLFVBRGIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLGNBQUQsR0FBa0IsY0FGbEIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLDZCQUFELENBQUEsQ0FIQSxDQUFBO2FBSUEsYUFB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

//# sourceURL=/Users/marcoslamuria/.atom/packages/proto-repl/lib/process/self-hosted-process.coffee
