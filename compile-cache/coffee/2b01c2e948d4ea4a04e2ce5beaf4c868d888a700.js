(function() {
  module.exports = {
    config: {
      javaExecutablePath: {
        type: 'string',
        "default": 'java'
      },
      clojureExecutablePath: {
        type: 'string',
        "default": 'clojure-x.x.x.jar'
      }
    },
    activate: function() {
      return require('atom-package-deps').install();
    },
    provideLinter: function() {
      var helpers, provider, regex;
      helpers = require('atom-linter');
      regex = 'RuntimeException:(?<message>.*), compiling:(.*):(?<line>\\d+):(?<col>\\d+)';
      return provider = {
        grammarScopes: ['source.clojure', 'source.clojurescript'],
        scope: 'file',
        lintOnFly: true,
        lint: (function(_this) {
          return function(textEditor) {
            var command, filePath, parameters;
            filePath = textEditor.getPath();
            command = atom.config.get('linter-clojure.javaExecutablePath') || 'java';
            parameters = ['-jar', atom.config.get('linter-clojure.clojureExecutablePath'), '-i', filePath];
            return helpers.exec(command, parameters, {
              stream: 'stderr'
            }).then(function(output) {
              var errors, message;
              errors = (function() {
                var _i, _len, _ref, _results;
                _ref = helpers.parse(output, regex, {
                  filePath: filePath
                });
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  message = _ref[_i];
                  message.type = 'error';
                  _results.push(message);
                }
                return _results;
              })();
              return errors;
            });
          };
        })(this)
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL21hcmNvc2xhbXVyaWEvLmF0b20vcGFja2FnZXMvbGludGVyLWNsb2p1cmUvbGliL2luaXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsa0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxNQURUO09BREY7QUFBQSxNQUdBLHFCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsbUJBRFQ7T0FKRjtLQURGO0FBQUEsSUFRQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2FBQ1IsT0FBQSxDQUFRLG1CQUFSLENBQTRCLENBQUMsT0FBN0IsQ0FBQSxFQURRO0lBQUEsQ0FSVjtBQUFBLElBV0EsYUFBQSxFQUFlLFNBQUEsR0FBQTtBQUNiLFVBQUEsd0JBQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxPQUFBLENBQVEsYUFBUixDQUFWLENBQUE7QUFBQSxNQUNBLEtBQUEsR0FBUSw0RUFEUixDQUFBO2FBRUEsUUFBQSxHQUNFO0FBQUEsUUFBQSxhQUFBLEVBQWUsQ0FBQyxnQkFBRCxFQUFtQixzQkFBbkIsQ0FBZjtBQUFBLFFBQ0EsS0FBQSxFQUFPLE1BRFA7QUFBQSxRQUVBLFNBQUEsRUFBVyxJQUZYO0FBQUEsUUFHQSxJQUFBLEVBQU0sQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLFVBQUQsR0FBQTtBQUNKLGdCQUFBLDZCQUFBO0FBQUEsWUFBQSxRQUFBLEdBQVcsVUFBVSxDQUFDLE9BQVgsQ0FBQSxDQUFYLENBQUE7QUFBQSxZQUNBLE9BQUEsR0FBVSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsbUNBQWhCLENBQUEsSUFBd0QsTUFEbEUsQ0FBQTtBQUFBLFlBRUEsVUFBQSxHQUFhLENBQ1gsTUFEVyxFQUVYLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQ0FBaEIsQ0FGVyxFQUdYLElBSFcsRUFJWCxRQUpXLENBRmIsQ0FBQTtBQVNBLG1CQUFPLE9BQU8sQ0FBQyxJQUFSLENBQWEsT0FBYixFQUFzQixVQUF0QixFQUFrQztBQUFBLGNBQUMsTUFBQSxFQUFRLFFBQVQ7YUFBbEMsQ0FBcUQsQ0FBQyxJQUF0RCxDQUEyRCxTQUFDLE1BQUQsR0FBQTtBQUNoRSxrQkFBQSxlQUFBO0FBQUEsY0FBQSxNQUFBOztBQUFTOzs7QUFBQTtxQkFBQSwyQ0FBQTtxQ0FBQTtBQUNQLGtCQUFBLE9BQU8sQ0FBQyxJQUFSLEdBQWUsT0FBZixDQUFBO0FBQUEsZ0NBQ0EsUUFEQSxDQURPO0FBQUE7O2tCQUFULENBQUE7QUFJQSxxQkFBTyxNQUFQLENBTGdFO1lBQUEsQ0FBM0QsQ0FBUCxDQVZJO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FITjtRQUpXO0lBQUEsQ0FYZjtHQURGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/marcoslamuria/.atom/packages/linter-clojure/lib/init.coffee
