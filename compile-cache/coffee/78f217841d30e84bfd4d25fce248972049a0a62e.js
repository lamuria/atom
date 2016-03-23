(function() {
  var EDIT_DELIMITER, Emitter, Point, Range, ReplTextEditor, TAB_TITLE, _ref;

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point, Emitter = _ref.Emitter;

  EDIT_DELIMITER = "--------------------\n";

  TAB_TITLE = "Clojure REPL";

  module.exports = ReplTextEditor = (function() {
    ReplTextEditor.prototype.emitter = null;

    ReplTextEditor.prototype.textEditor = null;

    ReplTextEditor.prototype.allowAnyChange = false;

    ReplTextEditor.prototype.delimiterRow = 0;

    function ReplTextEditor() {
      this.emitter = new Emitter;
      atom.workspace.open(TAB_TITLE, {
        split: 'right'
      }).done((function(_this) {
        return function(textEditor) {
          window.textEditor = textEditor;
          _this.configureNewTextEditor(textEditor);
          return _this.emitter.emit('proto-repl-text-editor:open');
        };
      })(this));
    }

    ReplTextEditor.prototype.onDidOpen = function(callback) {
      if (this.textEditor) {
        return callback();
      } else {
        return this.emitter.on('proto-repl-text-editor:open', callback);
      }
    };

    ReplTextEditor.prototype.onDidClose = function(callback) {
      return this.emitter.on('proto-repl-text-editor:close', callback);
    };

    ReplTextEditor.prototype.clear = function() {
      if (this.textEditor) {
        return this.modifyTextWith((function(_this) {
          return function() {
            _this.textEditor.setText(EDIT_DELIMITER);
            return _this.delimiterRow = 0;
          };
        })(this));
      }
    };

    ReplTextEditor.prototype.enteredTextRange = function() {
      var end, start;
      start = new Point(this.delimiterRow + 1);
      end = this.textEditor.buffer.getEndPosition();
      return new Range(start, end);
    };

    ReplTextEditor.prototype.enteredText = function() {
      return this.textEditor.getTextInBufferRange(this.enteredTextRange());
    };

    ReplTextEditor.prototype.setEnteredText = function(text) {
      return this.modifyTextWith((function(_this) {
        return function() {
          return _this.textEditor.setTextInBufferRange(_this.enteredTextRange(), text);
        };
      })(this));
    };

    ReplTextEditor.prototype.clearEnteredText = function() {
      return this.setEnteredText("");
    };

    ReplTextEditor.prototype.modifyTextWith = function(f) {
      this.allowAnyChange = true;
      f();
      return this.allowAnyChange = false;
    };

    ReplTextEditor.prototype.onHistoryBack = function(callback) {
      return this.emitter.on('proto-repl-text-editor:history-back', callback);
    };

    ReplTextEditor.prototype.onHistoryForward = function(callback) {
      return this.emitter.on('proto-repl-text-editor:history-forward', callback);
    };

    ReplTextEditor.prototype.configureTextEditorBasics = function() {
      var grammar;
      this.textEditor.getTitle = function() {
        return TAB_TITLE;
      };
      this.textEditor.emitter.emit('did-change-title', TAB_TITLE);
      this.textEditor.isModified = function() {
        return false;
      };
      if (atom.config.get('proto-repl.useClojureSyntax')) {
        grammar = atom.grammars.grammarForScopeName('source.clojure');
        this.textEditor.setGrammar(grammar);
      }
      return this.textEditor.setSoftWrapped(true);
    };

    ReplTextEditor.prototype.configureTextEditorClose = function() {
      return this.textEditor.onDidDestroy((function(_this) {
        return function() {
          _this.emitter.emit('proto-repl-text-editor:close');
          return _this.textEditor = null;
        };
      })(this));
    };

    ReplTextEditor.prototype.allowsRangeChange = function(range) {
      return range.start.row > this.delimiterRow && range.end.row > this.delimiterRow;
    };

    ReplTextEditor.prototype.allowsChange = function(change) {
      return this.allowAnyChange || (this.allowsRangeChange(change.newRange) && this.allowsRangeChange(change.oldRange));
    };

    ReplTextEditor.prototype.configureBufferChanges = function() {
      var shouldAllowChange;
      this.clear();
      shouldAllowChange = (function(_this) {
        return function(change) {
          return _this.allowsChange(change);
        };
      })(this);
      this.textEditor.buffer.oldApplyChange = this.textEditor.buffer.applyChange;
      return this.textEditor.buffer.applyChange = function(change, skipUndo) {
        if (shouldAllowChange(change)) {
          return this.oldApplyChange(change, skipUndo);
        }
      };
    };

    ReplTextEditor.prototype.configureHistorySupport = function() {
      var atBottomOfEditArea, atTopOfEditArea, triggerHistoryBack, triggerHistoryForward;
      atTopOfEditArea = (function(_this) {
        return function(editor) {
          return editor.getCursorBufferPosition().row - 1 === _this.delimiterRow;
        };
      })(this);
      triggerHistoryBack = (function(_this) {
        return function() {
          return _this.emitter.emit("proto-repl-text-editor:history-back");
        };
      })(this);
      this.textEditor.oldMoveUp = this.textEditor.moveUp;
      this.textEditor.moveUp = function(lineCount) {
        if (atTopOfEditArea(this)) {
          return triggerHistoryBack();
        } else {
          return this.oldMoveUp(lineCount);
        }
      };
      atBottomOfEditArea = (function(_this) {
        return function(editor) {
          return editor.getCursorBufferPosition().row === editor.buffer.getEndPosition().row;
        };
      })(this);
      triggerHistoryForward = (function(_this) {
        return function() {
          return _this.emitter.emit("proto-repl-text-editor:history-forward");
        };
      })(this);
      this.textEditor.oldMoveDown = this.textEditor.moveDown;
      return this.textEditor.moveDown = function(lineCount) {
        if (atBottomOfEditArea(this)) {
          return triggerHistoryForward();
        } else {
          return this.oldMoveDown(lineCount);
        }
      };
    };

    ReplTextEditor.prototype.configureNewTextEditor = function(textEditor) {
      this.textEditor = textEditor;
      this.configureTextEditorBasics();
      this.configureTextEditorClose();
      this.configureBufferChanges();
      return this.configureHistorySupport();
    };

    ReplTextEditor.prototype.autoscroll = function() {
      var _ref1, _ref2;
      if (atom.config.get('proto-repl.autoScroll')) {
        return (_ref1 = this.textEditor) != null ? _ref1.scrollToBufferPosition([(_ref2 = this.textEditor) != null ? _ref2.getLastBufferRow() : void 0, 0]) : void 0;
      }
    };

    ReplTextEditor.prototype.appendText = function(text, waitUntilOpen) {
      if (waitUntilOpen == null) {
        waitUntilOpen = false;
      }
      if (waitUntilOpen && !this.textEditor) {
        return this.onDidOpen((function(_this) {
          return function() {
            return _this.appendText(text);
          };
        })(this));
      } else if (this.textEditor && text.length > 0) {
        if (text[text.length - 1] !== "\n") {
          text = text + "\n";
        }
        this.modifyTextWith((function(_this) {
          return function() {
            var insertRange, insertionPoint;
            insertionPoint = new Point(_this.delimiterRow);
            insertRange = _this.textEditor.getBuffer().insert(insertionPoint, text);
            return _this.delimiterRow = insertRange.end.row;
          };
        })(this));
        return this.autoscroll();
      }
    };

    return ReplTextEditor;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL21hcmNvc2xhbXVyaWEvLmF0b20vcGFja2FnZXMvcHJvdG8tcmVwbC9saWIvcmVwbC10ZXh0LWVkaXRvci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0VBQUE7O0FBQUEsRUFBQSxPQUEwQixPQUFBLENBQVEsTUFBUixDQUExQixFQUFDLGFBQUEsS0FBRCxFQUFRLGFBQUEsS0FBUixFQUFlLGVBQUEsT0FBZixDQUFBOztBQUFBLEVBR0EsY0FBQSxHQUFlLHdCQUhmLENBQUE7O0FBQUEsRUFLQSxTQUFBLEdBQVksY0FMWixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FPTTtBQUNKLDZCQUFBLE9BQUEsR0FBUyxJQUFULENBQUE7O0FBQUEsNkJBR0EsVUFBQSxHQUFZLElBSFosQ0FBQTs7QUFBQSw2QkFPQSxjQUFBLEdBQWdCLEtBUGhCLENBQUE7O0FBQUEsNkJBVUEsWUFBQSxHQUFjLENBVmQsQ0FBQTs7QUFZYSxJQUFBLHdCQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBQSxDQUFBLE9BQVgsQ0FBQTtBQUFBLE1BRUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFNBQXBCLEVBQStCO0FBQUEsUUFBQSxLQUFBLEVBQU0sT0FBTjtPQUEvQixDQUE2QyxDQUFDLElBQTlDLENBQW1ELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLFVBQUQsR0FBQTtBQUNqRCxVQUFBLE1BQU0sQ0FBQyxVQUFQLEdBQW9CLFVBQXBCLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxzQkFBRCxDQUF3QixVQUF4QixDQURBLENBQUE7aUJBRUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsNkJBQWQsRUFIaUQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENB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

//# sourceURL=/Users/marcoslamuria/.atom/packages/proto-repl/lib/repl-text-editor.coffee
