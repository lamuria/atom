(function() {
  var EditorUtils, Point, Range, bufferPositionContext, completionToSuggestion, completionsCode, getPrefix, self_hosted_clj, _ref;

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point;

  EditorUtils = require('./editor-utils');

  self_hosted_clj = require('./proto_repl/proto_repl/self_hosted.js');

  completionToSuggestion = function(prefix, _arg) {
    var candidate, docs, type;
    candidate = _arg.candidate, docs = _arg.docs, type = _arg.type;
    return {
      text: candidate,
      type: type,
      description: docs,
      replacementPrefix: prefix
    };
  };

  bufferPositionContext = function(editor, pos, prefix) {
    var beginning, beginningEnd, ending, range, ranges;
    ranges = EditorUtils.getTopLevelRanges(editor);
    range = ranges.find(function(range) {
      return range.containsPoint(pos);
    });
    if (range) {
      beginningEnd = new Point(pos.row, pos.column - prefix.length);
      beginning = editor.getTextInBufferRange(new Range(range.start, beginningEnd));
      ending = editor.getTextInBufferRange(new Range(pos, range.end));
      return beginning + "__prefix__" + ending;
    } else {
      return "nil";
    }
  };

  completionsCode = function(editor, bufferPosition, prefix) {
    var context, escapedStr, ns;
    context = bufferPositionContext(editor, bufferPosition, prefix);
    ns = EditorUtils.findNsDeclaration(editor) || "nil";
    escapedStr = EditorUtils.escapeClojureCodeInString(context);
    return "(do (require 'compliment.core) (let [completions (compliment.core/completions \"" + prefix + "\" {:tag-candidates true :ns '" + ns + " :context " + escapedStr + "})] (->> completions (take 50) (mapv #(assoc % :docs (compliment.core/documentation (:candidate %) '" + ns + "))))))";
  };

  getPrefix = function(editor, bufferPosition) {
    var line, regex, _ref1;
    regex = /[A-Za-z0-9_\-></.?!*:]+$/;
    line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
    return ((_ref1 = line.match(regex)) != null ? _ref1[0] : void 0) || '';
  };

  module.exports = {
    selector: '.source.clojure',
    disableForSelector: '.source.clojure .comment, .source.clojure .string',
    inclusionPriority: 100,
    excludeLowerPriority: true,
    getSuggestions: function(_arg) {
      var bufferPosition, editor, prefix, scopeDescriptor;
      editor = _arg.editor, bufferPosition = _arg.bufferPosition, scopeDescriptor = _arg.scopeDescriptor;
      prefix = getPrefix(editor, bufferPosition);
      if (prefix !== "") {
        return new Promise(function(resolve) {
          var code;
          if (protoRepl.isSelfHosted()) {
            return self_hosted_clj.completions(prefix, function(matches) {
              var c, suggestions;
              suggestions = (function() {
                var _i, _len, _results;
                _results = [];
                for (_i = 0, _len = matches.length; _i < _len; _i++) {
                  c = matches[_i];
                  _results.push(completionToSuggestion(prefix, c));
                }
                return _results;
              })();
              return resolve(suggestions);
            });
          } else {
            code = completionsCode(editor, bufferPosition, prefix);
            return protoRepl.executeCode(code, {
              displayInRepl: false,
              resultHandler: function(result) {
                var c, completions, suggestions;
                if (result.error) {
                  return console.log(result.error);
                } else {
                  completions = protoRepl.parseEdn(result.value);
                  suggestions = (function() {
                    var _i, _len, _results;
                    _results = [];
                    for (_i = 0, _len = completions.length; _i < _len; _i++) {
                      c = completions[_i];
                      _results.push(completionToSuggestion(prefix, c));
                    }
                    return _results;
                  })();
                  return resolve(suggestions);
                }
              }
            });
          }
        });
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL21hcmNvc2xhbXVyaWEvLmF0b20vcGFja2FnZXMvcHJvdG8tcmVwbC9saWIvY29tcGxldGlvbi1wcm92aWRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFHQTtBQUFBLE1BQUEsMkhBQUE7O0FBQUEsRUFBQSxPQUFpQixPQUFBLENBQVEsTUFBUixDQUFqQixFQUFDLGFBQUEsS0FBRCxFQUFRLGFBQUEsS0FBUixDQUFBOztBQUFBLEVBQ0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQURkLENBQUE7O0FBQUEsRUFFQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSx3Q0FBUixDQUZsQixDQUFBOztBQUFBLEVBS0Esc0JBQUEsR0FBeUIsU0FBQyxNQUFELEVBQVMsSUFBVCxHQUFBO0FBQ3ZCLFFBQUEscUJBQUE7QUFBQSxJQURpQyxpQkFBQSxXQUFXLFlBQUEsTUFBTSxZQUFBLElBQ2xELENBQUE7V0FBQTtBQUFBLE1BQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxNQUNBLElBQUEsRUFBTSxJQUROO0FBQUEsTUFFQSxXQUFBLEVBQWEsSUFGYjtBQUFBLE1BR0EsaUJBQUEsRUFBbUIsTUFIbkI7TUFEdUI7RUFBQSxDQUx6QixDQUFBOztBQUFBLEVBY0EscUJBQUEsR0FBd0IsU0FBQyxNQUFELEVBQVMsR0FBVCxFQUFjLE1BQWQsR0FBQTtBQUN0QixRQUFBLDhDQUFBO0FBQUEsSUFBQSxNQUFBLEdBQVMsV0FBVyxDQUFDLGlCQUFaLENBQThCLE1BQTlCLENBQVQsQ0FBQTtBQUFBLElBQ0EsS0FBQSxHQUFRLE1BQU0sQ0FBQyxJQUFQLENBQVksU0FBQyxLQUFELEdBQUE7YUFBVyxLQUFLLENBQUMsYUFBTixDQUFvQixHQUFwQixFQUFYO0lBQUEsQ0FBWixDQURSLENBQUE7QUFFQSxJQUFBLElBQUcsS0FBSDtBQUVFLE1BQUEsWUFBQSxH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

//# sourceURL=/Users/marcoslamuria/.atom/packages/proto-repl/lib/completion-provider.coffee
