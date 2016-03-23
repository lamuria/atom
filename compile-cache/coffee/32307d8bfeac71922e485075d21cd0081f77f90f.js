(function() {
  var CompositeDisposable, SaveRecallFeature, exampleTree;

  CompositeDisposable = require('atom').CompositeDisposable;

  exampleTree = ["                                      m |         a | b |", ["                                   {} |   :apples | 2 |", "m: {}", "a: :apples", "b: 2"], ["                          {:apples 2} |  :oranges | 3 |", "m: {:apples 2}", "a: :oranges", "b: 3"], ["              {:apples 2, :oranges 3} | :cherries | 4 |", "m: {:apples 2, :oranges 3}", "a: :cherries", "b: 4"], [" {:apples 2, :oranges 3, :cherries 4} |   :apples | 7 |", "m: {:apples 2, :oranges 3, :cherries 4}", "a: :apples", "b: 7"]];

  module.exports = SaveRecallFeature = (function() {
    SaveRecallFeature.prototype.protoRepl = null;

    SaveRecallFeature.prototype.subscriptions = null;

    function SaveRecallFeature(protoRepl) {
      this.protoRepl = protoRepl;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'proto-repl:insert-save-value-call': (function(_this) {
          return function() {
            return _this.insertSaveValueCall();
          };
        })(this),
        'proto-repl:display-saved-values': (function(_this) {
          return function() {
            return _this.fetchAndDisplaySavedValues();
          };
        })(this),
        'proto-repl:clear-saved-values': (function(_this) {
          return function() {
            return _this.clearSavedValues();
          };
        })(this)
      }));
    }

    SaveRecallFeature.prototype.deactivate = function() {
      return this.subscriptions.dispose();
    };

    SaveRecallFeature.prototype.insertSaveValueCall = function() {
      var editor;
      if (editor = atom.workspace.getActiveTextEditor()) {
        this.nextUniqueSaveId || (this.nextUniqueSaveId = 1);
        editor.insertText("(proto/save " + this.nextUniqueSaveId + ")");
        return this.nextUniqueSaveId += 1;
      }
    };

    SaveRecallFeature.prototype.clearSavedValues = function() {
      var editor;
      this.protoRepl.executeCode("(proto/clear-saved-values!)", {
        displayInRepl: false
      });
      if (editor = atom.workspace.getActiveTextEditor()) {
        return atom.commands.dispatch(atom.views.getView(editor), 'inline-results:clear-all');
      }
    };

    SaveRecallFeature.prototype.fetchAndDisplaySavedValues = function() {
      return this.protoRepl.executeCode("(proto/saved-values)", {
        displayInRepl: false,
        resultHandler: (function(_this) {
          return function(result, options) {
            var editor, range, tree, uniq, uniqsToTrees, _i, _len, _ref, _ref1, _results;
            if (result.error) {
              _this.protoRepl.appendText("Error polling for saved values " + result.error);
              return;
            }
            uniqsToTrees = _this.protoRepl.ednSavedValuesToDisplayTrees(result.value);
            _results = [];
            for (_i = 0, _len = uniqsToTrees.length; _i < _len; _i++) {
              _ref = uniqsToTrees[_i], uniq = _ref[0], tree = _ref[1];
              _ref1 = protoRepl.EditorUtils.findEditorRangeContainingString(uniq), editor = _ref1[0], range = _ref1[1];
              _results.push(_this.protoRepl.repl.displayInline(editor, range, tree));
            }
            return _results;
          };
        })(this)
      });
    };

    SaveRecallFeature.prototype.startSavedInlineDisplayPolling = function() {
      return this.pollingId = setInterval((function(_this) {
        return function() {
          return _this.fetchAndDisplaySavedValues();
        };
      })(this), 5000);
    };

    SaveRecallFeature.prototype.stopSavedInlineDisplayPolling = function() {
      return clearInterval(this.pollingId);
    };

    return SaveRecallFeature;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL21hcmNvc2xhbXVyaWEvLmF0b20vcGFja2FnZXMvcHJvdG8tcmVwbC9saWIvZmVhdHVyZXMvc2F2ZS1yZWNhbGwtZmVhdHVyZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbURBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUVBLFdBQUEsR0FFRSxDQUFDLDJEQUFELEVBQ0MsQ0FBQyx5REFBRCxFQUNHLE9BREgsRUFFRyxZQUZILEVBR0csTUFISCxDQURELEVBS0MsQ0FBQyx5REFBRCxFQUNFLGdCQURGLEVBRUUsYUFGRixFQUdFLE1BSEYsQ0FMRCxFQVNDLENBQUMseURBQUQsRUFDRSw0QkFERixFQUVFLGNBRkYsRUFHRSxNQUhGLENBVEQsRUFhQyxDQUFDLHlEQUFELEVBQ0UseUNBREYsRUFFRSxZQUZGLEVBR0UsTUFIRixDQWJELENBSkYsQ0FBQTs7QUFBQSxFQXVCQSxNQUFNLENBQUMsT0FBUCxHQUVNO0FBR0osZ0NBQUEsU0FBQSxHQUFXLElBQVgsQ0FBQTs7QUFBQSxnQ0FDQSxhQUFBLEdBQWUsSUFEZixDQUFBOztBQUdhLElBQUEsMkJBQUUsU0FBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsWUFBQSxTQUNiLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFBakIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDakI7QUFBQSxRQUFBLG1DQUFBLEVBQXFDLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFFLEtBQUMsQ0FBQSxtQkFBRCxDQUFBLEVBQUY7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

//# sourceURL=/Users/marcoslamuria/.atom/packages/proto-repl/lib/features/save-recall-feature.coffee
