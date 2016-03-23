(function() {
  var ClojureVersion;

  module.exports = ClojureVersion = (function() {
    ClojureVersion.prototype.major = null;

    ClojureVersion.prototype.minor = null;

    ClojureVersion.prototype.incremental = null;

    ClojureVersion.prototype.qualifier = null;

    function ClojureVersion(versionMap) {
      this.major = Number.parseInt(versionMap.major);
      this.minor = Number.parseInt(versionMap.minor);
      this.incremental = Number.parseInt(versionMap.incremental);
      this.qualifier = versionMap.qualifier;
    }

    ClojureVersion.prototype.isSupportedVersion = function() {
      return this.major === 1 && this.minor >= 6;
    };

    ClojureVersion.prototype.isReaderConditionalSupported = function() {
      return this.minor >= 7;
    };

    return ClojureVersion;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL21hcmNvc2xhbXVyaWEvLmF0b20vcGFja2FnZXMvcHJvdG8tcmVwbC9saWIvcHJvY2Vzcy9jbG9qdXJlLXZlcnNpb24uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGNBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUVNO0FBQ0osNkJBQUEsS0FBQSxHQUFPLElBQVAsQ0FBQTs7QUFBQSw2QkFDQSxLQUFBLEdBQU8sSUFEUCxDQUFBOztBQUFBLDZCQUVBLFdBQUEsR0FBYSxJQUZiLENBQUE7O0FBQUEsNkJBR0EsU0FBQSxHQUFXLElBSFgsQ0FBQTs7QUFLYSxJQUFBLHdCQUFDLFVBQUQsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxNQUFNLENBQUMsUUFBUCxDQUFnQixVQUFVLENBQUMsS0FBM0IsQ0FBVCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTLE1BQU0sQ0FBQyxRQUFQLENBQWdCLFVBQVUsQ0FBQyxLQUEzQixDQURULENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxXQUFELEdBQWUsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsVUFBVSxDQUFDLFdBQTNCLENBRmYsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFNBQUQsR0FBYSxVQUFVLENBQUMsU0FIeEIsQ0FEVztJQUFBLENBTGI7O0FBQUEsNkJBWUEsa0JBQUEsR0FBb0IsU0FBQSxHQUFBO2FBQ2xCLElBQUMsQ0FBQSxLQUFELEtBQVUsQ0FBVixJQUFlLElBQUMsQ0FBQSxLQUFELElBQVUsRUFEUDtJQUFBLENBWnBCLENBQUE7O0FBQUEsNkJBZ0JBLDRCQUFBLEdBQThCLFNBQUEsR0FBQTthQUM1QixJQUFDLENBQUEsS0FBRCxJQUFVLEVBRGtCO0lBQUEsQ0FoQjlCLENBQUE7OzBCQUFBOztNQUhGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/marcoslamuria/.atom/packages/proto-repl/lib/process/clojure-version.coffee
