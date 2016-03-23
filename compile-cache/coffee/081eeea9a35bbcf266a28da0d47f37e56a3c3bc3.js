(function() {
  var $, NReplConnectionView, TextEditorView, View, defaultHost, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View, TextEditorView = _ref.TextEditorView;

  defaultHost = "localhost";

  module.exports = NReplConnectionView = (function(_super) {
    __extends(NReplConnectionView, _super);

    NReplConnectionView.content = function() {
      return this.div({
        "class": "proto-repl proto-repl-nrepl-connection-dialog"
      }, (function(_this) {
        return function() {
          _this.h3("nRepl connection", {
            "class": "icon icon-clobe"
          });
          _this.div({
            "class": "block"
          }, function() {
            _this.label("Host");
            return _this.subview("hostEditor", new TextEditorView({
              mini: true,
              placeholderText: defaultHost,
              attributes: {
                tabindex: 1
              }
            }));
          });
          return _this.div({
            "class": "block"
          }, function() {
            _this.label("Port");
            return _this.subview("portEditor", new TextEditorView({
              mini: true,
              attributes: {
                tabindex: 2
              }
            }));
          });
        };
      })(this));
    };

    function NReplConnectionView(confirmCallback) {
      this.confirmCallback = confirmCallback;
      NReplConnectionView.__super__.constructor.apply(this, arguments);
    }

    NReplConnectionView.prototype.initialize = function() {
      return atom.commands.add(this.element, {
        "core:confirm": (function(_this) {
          return function() {
            return _this.onConfirm();
          };
        })(this),
        "core:cancel": (function(_this) {
          return function() {
            return _this.onCancel();
          };
        })(this)
      });
    };

    NReplConnectionView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: false
        });
      }
      this.storeActiveElement();
      this.resetEditors();
      this.panel.show();
      return this.hostEditor.focus();
    };

    NReplConnectionView.prototype.onConfirm = function() {
      var _ref1;
      if (typeof this.confirmCallback === "function") {
        this.confirmCallback({
          port: parseInt(this.portEditor.getText()),
          host: this.hostEditor.getText() || defaultHost
        });
      }
      return (_ref1 = this.panel) != null ? _ref1.hide() : void 0;
    };

    NReplConnectionView.prototype.onCancel = function() {
      var _ref1;
      if ((_ref1 = this.panel) != null) {
        _ref1.hide();
      }
      return this.restoreFocus();
    };

    NReplConnectionView.prototype.storeActiveElement = function() {
      return this.previousActiveElement = $(document.activeElement);
    };

    NReplConnectionView.prototype.restoreFocus = function() {
      var _ref1;
      return (_ref1 = this.previousActiveElement) != null ? _ref1.focus() : void 0;
    };

    NReplConnectionView.prototype.resetEditors = function() {
      this.hostEditor.setText('');
      return this.portEditor.setText('');
    };

    return NReplConnectionView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL21hcmNvc2xhbXVyaWEvLmF0b20vcGFja2FnZXMvcHJvdG8tcmVwbC9saWIvdmlld3MvbnJlcGwtY29ubmVjdGlvbi12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrREFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsT0FBNEIsT0FBQSxDQUFRLHNCQUFSLENBQTVCLEVBQUMsU0FBQSxDQUFELEVBQUksWUFBQSxJQUFKLEVBQVUsc0JBQUEsY0FBVixDQUFBOztBQUFBLEVBRUEsV0FBQSxHQUFjLFdBRmQsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7QUFDSiwwQ0FBQSxDQUFBOztBQUFBLElBQUEsbUJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLCtDQUFQO09BQUwsRUFBNkQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUMzRCxVQUFBLEtBQUMsQ0FBQSxFQUFELENBQUksa0JBQUosRUFBd0I7QUFBQSxZQUFBLE9BQUEsRUFBTyxpQkFBUDtXQUF4QixDQUFBLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxPQUFQO1dBQUwsRUFBcUIsU0FBQSxHQUFBO0FBQ25CLFlBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTyxNQUFQLENBQUEsQ0FBQTttQkFDQSxLQUFDLENBQUEsT0FBRCxDQUFTLFlBQVQsRUFBMkIsSUFBQSxjQUFBLENBQWU7QUFBQSxjQUFBLElBQUEsRUFBTSxJQUFOO0FBQUEsY0FBWSxlQUFBLEVBQWlCLFdBQTdCO0FBQUEsY0FBMEMsVUFBQSxFQUFZO0FBQUEsZ0JBQUEsUUFBQSxFQUFVLENBQVY7ZUFBdEQ7YUFB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

//# sourceURL=/Users/marcoslamuria/.atom/packages/proto-repl/lib/views/nrepl-connection-view.coffee
