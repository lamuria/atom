(function() {
  var ReplHistory;

  module.exports = ReplHistory = (function() {
    ReplHistory.prototype.history = null;

    ReplHistory.prototype.currentPosition = null;

    function ReplHistory() {
      this.history = [""];
      this.currentPosition = 0;
    }

    ReplHistory.prototype.size = function() {
      return this.history.length;
    };

    ReplHistory.prototype.currentText = function() {
      var text;
      if (text = this.history[this.currentPosition]) {
        return text;
      } else {
        return "";
      }
    };

    ReplHistory.prototype.setCurrentText = function(text) {
      return this.history[this.currentPosition] = text;
    };

    ReplHistory.prototype.setLastTextAndAddNewEntry = function(text) {
      this.history[this.size() - 1] = text;
      if (this.size() >= atom.config.get("proto-repl:historySize")) {
        this.history.shift();
      }
      this.history.push("");
      return this.currentPosition = this.size() - 1;
    };

    ReplHistory.prototype.back = function() {
      if (this.currentPosition > 0) {
        this.currentPosition -= 1;
      }
      return this.history[this.currentPosition];
    };

    ReplHistory.prototype.forward = function() {
      if (this.currentPosition < this.size() - 1) {
        this.currentPosition += 1;
      }
      return this.history[this.currentPosition];
    };

    return ReplHistory;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL21hcmNvc2xhbXVyaWEvLmF0b20vcGFja2FnZXMvcHJvdG8tcmVwbC9saWIvcmVwbC1oaXN0b3J5LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxXQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUVKLDBCQUFBLE9BQUEsR0FBUyxJQUFULENBQUE7O0FBQUEsMEJBR0EsZUFBQSxHQUFpQixJQUhqQixDQUFBOztBQUthLElBQUEscUJBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxDQUFDLEVBQUQsQ0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsZUFBRCxHQUFtQixDQURuQixDQURXO0lBQUEsQ0FMYjs7QUFBQSwwQkFTQSxJQUFBLEdBQU0sU0FBQSxHQUFBO2FBQ0osSUFBQyxDQUFBLE9BQU8sQ0FBQyxPQURMO0lBQUEsQ0FUTixDQUFBOztBQUFBLDBCQVlBLFdBQUEsR0FBYSxTQUFBLEdBQUE7QUFDWCxVQUFBLElBQUE7QUFBQSxNQUFBLElBQUcsSUFBQSxHQUFPLElBQUMsQ0FBQSxPQUFRLENBQUEsSUFBQyxDQUFBLGVBQUQsQ0FBbkI7ZUFDRSxLQURGO09BQUEsTUFBQTtlQUdFLEdBSEY7T0FEVztJQUFBLENBWmIsQ0FBQTs7QUFBQSwwQkFrQkEsY0FBQSxHQUFnQixTQUFDLElBQUQsR0FBQTthQUNkLElBQUMsQ0FBQSxPQUFRLENBQUEsSUFBQyxDQUFBLGVBQUQsQ0FBVCxHQUE2QixLQURmO0lBQUEsQ0FsQmhCLENBQUE7O0FBQUEsMEJBc0JBLHlCQUFBLEdBQTJCLFNBQUMsSUFBRCxHQUFBO0FBQ3pCLE1BQUEsSUFBQyxDQUFBLE9BQVEsQ0FBQSxJQUFDLENBQUEsSUFBRCxDQUFBLENBQUEsR0FBUSxDQUFSLENBQVQsR0FBc0IsSUFBdEIsQ0FBQTtBQUNBLE1BQUEsSUFBRyxJQUFDLENBQUEsSUFBRCxDQUFBLENBQUEsSUFBVyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0JBQWhCLENBQWQ7QUFDRSxRQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBVCxDQUFBLENBQUEsQ0FERjtPQURBO0FBQUEsTUFJQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxFQUFkLENBSkEsQ0FBQTthQUtBLElBQUMsQ0FBQSxlQUFELEdBQW1CLElBQUMsQ0FBQSxJQUFELENBQUEsQ0FBQSxHQUFRLEVBTkY7SUFBQSxDQXRCM0IsQ0FBQTs7QUFBQSwwQkE4QkEsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLE1BQUEsSUFBRyxJQUFDLENBQUEsZUFBRCxHQUFtQixDQUF0QjtBQUNFLFFBQUEsSUFBQyxDQUFBLGVBQUQsSUFBb0IsQ0FBcEIsQ0FERjtPQUFBO2FBRUEsSUFBQyxDQUFBLE9BQVEsQ0FBQSxJQUFDLENBQUEsZUFBRCxFQUhMO0lBQUEsQ0E5Qk4sQ0FBQTs7QUFBQSwwQkFtQ0EsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLE1BQUEsSUFBRyxJQUFDLENBQUEsZUFBRCxHQUFtQixJQUFDLENBQUEsSUFBRCxDQUFBLENBQUEsR0FBUSxDQUE5QjtBQUNFLFFBQUEsSUFBQyxDQUFBLGVBQUQsSUFBbUIsQ0FBbkIsQ0FERjtPQUFBO2FBRUEsSUFBQyxDQUFBLE9BQVEsQ0FBQSxJQUFDLENBQUEsZUFBRCxFQUhGO0lBQUEsQ0FuQ1QsQ0FBQTs7dUJBQUE7O01BSEosQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/marcoslamuria/.atom/packages/proto-repl/lib/repl-history.coffee
