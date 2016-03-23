(function() {
  var Main, SmartTabName, log, pkgName, reloader;

  SmartTabName = null;

  log = null;

  reloader = null;

  pkgName = "smart-tab-name";

  module.exports = new (Main = (function() {
    function Main() {}

    Main.prototype.subscriptions = null;

    Main.prototype.SmartTabName = null;

    Main.prototype.config = {
      debug: {
        type: "integer",
        "default": 0,
        minimum: 0
      }
    };

    Main.prototype.activate = function() {
      var load;
      setTimeout((function() {
        var reloaderSettings;
        reloaderSettings = {
          pkg: pkgName,
          folders: ["lib", "styles"]
        };
        try {
          return reloader != null ? reloader : reloader = require("atom-package-reloader")(reloaderSettings);
        } catch (_error) {

        }
      }), 500);
      if (log == null) {
        log = require("atom-simple-logger")({
          pkg: pkgName,
          nsp: "main"
        });
        log("activating");
      }
      if (this.SmartTabName == null) {
        log("loading core");
        load = (function(_this) {
          return function() {
            try {
              if (SmartTabName == null) {
                SmartTabName = require("./" + pkgName);
              }
              return _this.SmartTabName = new SmartTabName;
            } catch (_error) {
              return log("loading core failed");
            }
          };
        })(this);
        if (atom.packages.isPackageActive("tabs")) {
          return load();
        } else {
          return this.onceActivated = atom.packages.onDidActivatePackage((function(_this) {
            return function(p) {
              if (p.name === "tabs") {
                load();
                return _this.onceActivated.dispose();
              }
            };
          })(this));
        }
      }
    };

    Main.prototype.deactivate = function() {
      var _ref, _ref1;
      log("deactivating");
      if ((_ref = this.onceActivated) != null) {
        if (typeof _ref.dispose === "function") {
          _ref.dispose();
        }
      }
      if ((_ref1 = this.SmartTabName) != null) {
        if (typeof _ref1.destroy === "function") {
          _ref1.destroy();
        }
      }
      this.SmartTabName = null;
      log = null;
      SmartTabName = null;
      if (reloader != null) {
        reloader.dispose();
      }
      return reloader = null;
    };

    return Main;

  })());

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL21hcmNvc2xhbXVyaWEvLmF0b20vcGFja2FnZXMvc21hcnQtdGFiLW5hbWUvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBDQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLElBQWYsQ0FBQTs7QUFBQSxFQUNBLEdBQUEsR0FBTSxJQUROLENBQUE7O0FBQUEsRUFFQSxRQUFBLEdBQVcsSUFGWCxDQUFBOztBQUFBLEVBSUEsT0FBQSxHQUFVLGdCQUpWLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUFpQixHQUFBLENBQUEsQ0FBVTtzQkFDekI7O0FBQUEsbUJBQUEsYUFBQSxHQUFlLElBQWYsQ0FBQTs7QUFBQSxtQkFDQSxZQUFBLEdBQWMsSUFEZCxDQUFBOztBQUFBLG1CQUVBLE1BQUEsR0FDRTtBQUFBLE1BQUEsS0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLENBRFQ7QUFBQSxRQUVBLE9BQUEsRUFBUyxDQUZUO09BREY7S0FIRixDQUFBOztBQUFBLG1CQVFBLFFBQUEsR0FBVSxTQUFBLEdBQUE7QUFDUixVQUFBLElBQUE7QUFBQSxNQUFBLFVBQUEsQ0FBVyxDQUFDLFNBQUEsR0FBQTtBQUNWLFlBQUEsZ0JBQUE7QUFBQSxRQUFBLGdCQUFBLEdBQW1CO0FBQUEsVUFBQSxHQUFBLEVBQUksT0FBSjtBQUFBLFVBQVksT0FBQSxFQUFRLENBQUMsS0FBRCxFQUFPLFFBQVAsQ0FBcEI7U0FBbkIsQ0FBQTtBQUNBO29DQUNFLFdBQUEsV0FBWSxPQUFBLENBQVEsdUJBQVIsQ0FBQSxDQUFpQyxnQkFBakMsRUFEZDtTQUFBLGNBQUE7QUFBQTtTQUZVO01BQUEsQ0FBRCxDQUFYLEVBTUksR0FOSixDQUFBLENBQUE7QUFPQSxNQUFBLElBQU8sV0FBUDtBQUNFLFFBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxvQkFBUixDQUFBLENBQThCO0FBQUEsVUFBQSxHQUFBLEVBQUksT0FBSjtBQUFBLFVBQVksR0FBQSxFQUFJLE1BQWhCO1NBQTlCLENBQU4sQ0FBQTtBQUFBLFFBQ0EsR0FBQSxDQUFJLFlBQUosQ0FEQSxDQURGO09BUEE7QUFVQSxNQUFBLElBQU8seUJBQVA7QUFDRSxRQUFBLEdBQUEsQ0FBSSxjQUFKLENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBQSxHQUFPLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO0FBQ0w7O2dCQUNFLGVBQWdCLE9BQUEsQ0FBUyxJQUFBLEdBQUksT0FBYjtlQUFoQjtxQkFDQSxLQUFDLENBQUEsWUFBRCxHQUFnQixHQUFBLENBQUEsYUFGbEI7YUFBQSxjQUFBO3FCQUlFLEdBQUEsQ0FBSSxxQkFBSixFQUpGO2FBREs7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURQLENBQUE7QUFPQSxRQUFBLElBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLE1BQTlCLENBQUg7aUJBQ0UsSUFBQSxDQUFBLEVBREY7U0FBQSxNQUFBO2lCQUdFLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsb0JBQWQsQ0FBbUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTttQkFBQSxTQUFDLENBQUQsR0FBQTtBQUNsRCxjQUFBLElBQUcsQ0FBQyxDQUFDLElBQUYsS0FBVSxNQUFiO0FBQ0UsZ0JBQUEsSUFBQSxDQUFBLENBQUEsQ0FBQTt1QkFDQSxLQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQSxFQUZGO2VBRGtEO1lBQUEsRUFBQTtVQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkMsRUFIbkI7U0FSRjtPQVhRO0lBQUEsQ0FSVixDQUFBOztBQUFBLG1CQW9DQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSxXQUFBO0FBQUEsTUFBQSxHQUFBLENBQUksY0FBSixDQUFBLENBQUE7OztjQUNjLENBQUU7O09BRGhCOzs7ZUFFYSxDQUFFOztPQUZmO0FBQUEsTUFHQSxJQUFDLENBQUEsWUFBRCxHQUFnQixJQUhoQixDQUFBO0FBQUEsTUFJQSxHQUFBLEdBQU0sSUFKTixDQUFBO0FBQUEsTUFLQSxZQUFBLEdBQWUsSUFMZixDQUFBOztRQU1BLFFBQVEsQ0FBRSxPQUFWLENBQUE7T0FOQTthQU9BLFFBQUEsR0FBVyxLQVJEO0lBQUEsQ0FwQ1osQ0FBQTs7Z0JBQUE7O09BUEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/marcoslamuria/.atom/packages/smart-tab-name/lib/main.coffee
