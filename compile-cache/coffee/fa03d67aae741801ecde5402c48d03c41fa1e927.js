(function() {
  var FoldernameTabs, Main, pkgName,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  FoldernameTabs = null;

  pkgName = "foldername-tabs";

  module.exports = new (Main = (function() {
    function Main() {
      this.consumeAutoreload = __bind(this.consumeAutoreload, this);
      this.consumeDebug = __bind(this.consumeDebug, this);
    }

    Main.prototype.subscriptions = null;

    Main.prototype.foldernameTabs = null;

    Main.prototype.config = {
      maxLength: {
        title: "Maximum path length",
        type: "integer",
        "default": "20",
        description: "Allowed length of a path, if set to 0, will not shorten the path"
      },
      folderLength: {
        title: "Maximum folder length",
        type: "integer",
        "default": "0",
        description: "Allowed length of a single folder, if set to 0, will not shorten the folder"
      },
      mfpIdent: {
        title: "Multi-folder project identifier",
        type: "integer",
        "default": "0",
        description: "length of the project identifier, if set to 0 will use numbers instead"
      },
      debug: {
        type: "integer",
        "default": 0,
        minimum: 0
      }
    };

    Main.prototype["debugger"] = function() {
      return function() {};
    };

    Main.prototype.debug = function() {};

    Main.prototype.consumeDebug = function(debugSetup) {
      this["debugger"] = debugSetup({
        pkg: pkgName
      });
      this.debug = this["debugger"]("main");
      return this.debug("debug service consumed", 2);
    };

    Main.prototype.consumeAutoreload = function(reloader) {
      reloader({
        pkg: pkgName
      });
      return this.debug("autoreload service consumed", 2);
    };

    Main.prototype.activate = function() {
      var load;
      if (this.foldernameTabs == null) {
        this.debug("loading core");
        load = (function(_this) {
          return function() {
            if (FoldernameTabs == null) {
              FoldernameTabs = require("./foldername-tabs");
            }
            return _this.foldernameTabs = new FoldernameTabs(_this["debugger"]);
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
      this.debug("deactivating");
      if ((_ref = this.onceActivated) != null) {
        if (typeof _ref.dispose === "function") {
          _ref.dispose();
        }
      }
      if ((_ref1 = this.foldernameTabs) != null) {
        if (typeof _ref1.destroy === "function") {
          _ref1.destroy();
        }
      }
      this.foldernameTabs = null;
      return FoldernameTabs = null;
    };

    return Main;

  })());

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL21hcmNvc2xhbXVyaWEvLmF0b20vcGFja2FnZXMvZm9sZGVybmFtZS10YWJzL2xpYi9tYWluLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw2QkFBQTtJQUFBLGtGQUFBOztBQUFBLEVBQUEsY0FBQSxHQUFpQixJQUFqQixDQUFBOztBQUFBLEVBRUEsT0FBQSxHQUFVLGlCQUZWLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUFpQixHQUFBLENBQUEsQ0FBVTs7OztLQUN6Qjs7QUFBQSxtQkFBQSxhQUFBLEdBQWUsSUFBZixDQUFBOztBQUFBLG1CQUNBLGNBQUEsR0FBZ0IsSUFEaEIsQ0FBQTs7QUFBQSxtQkFFQSxNQUFBLEdBQ0U7QUFBQSxNQUFBLFNBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLHFCQUFQO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLElBRlQ7QUFBQSxRQUdBLFdBQUEsRUFBYSxrRUFIYjtPQURGO0FBQUEsTUFNQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyx1QkFBUDtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxHQUZUO0FBQUEsUUFHQSxXQUFBLEVBQWEsNkVBSGI7T0FQRjtBQUFBLE1BV0EsUUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8saUNBQVA7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsR0FGVDtBQUFBLFFBR0EsV0FBQSxFQUFhLHdFQUhiO09BWkY7QUFBQSxNQWdCQSxLQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsQ0FEVDtBQUFBLFFBRUEsT0FBQSxFQUFTLENBRlQ7T0FqQkY7S0FIRixDQUFBOztBQUFBLG1CQXVCQSxXQUFBLEdBQVUsU0FBQSxHQUFBO2FBQUcsU0FBQSxHQUFBLEVBQUg7SUFBQSxDQXZCVixDQUFBOztBQUFBLG1CQXdCQSxLQUFBLEdBQU8sU0FBQSxHQUFBLENBeEJQLENBQUE7O0FBQUEsbUJBeUJBLFlBQUEsR0FBYyxTQUFDLFVBQUQsR0FBQTtBQUNaLE1BQUEsSUFBQyxDQUFBLFVBQUEsQ0FBRCxHQUFZLFVBQUEsQ0FBVztBQUFBLFFBQUEsR0FBQSxFQUFLLE9BQUw7T0FBWCxDQUFaLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBLFVBQUEsQ0FBRCxDQUFVLE1BQVYsQ0FEVCxDQUFBO2FBRUEsSUFBQyxDQUFBLEtBQUQsQ0FBTyx3QkFBUCxFQUFpQyxDQUFqQyxFQUhZO0lBQUEsQ0F6QmQsQ0FBQTs7QUFBQSxtQkE2QkEsaUJBQUEsR0FBbUIsU0FBQyxRQUFELEdBQUE7QUFDakIsTUFBQSxRQUFBLENBQVM7QUFBQSxRQUFBLEdBQUEsRUFBSSxPQUFKO09BQVQsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLEtBQUQsQ0FBTyw2QkFBUCxFQUFzQyxDQUF0QyxFQUZpQjtJQUFBLENBN0JuQixDQUFBOztBQUFBLG1CQWdDQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1IsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFPLDJCQUFQO0FBQ0UsUUFBQSxJQUFDLENBQUEsS0FBRCxDQUFPLGNBQVAsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFBLEdBQU8sQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7O2NBQ0wsaUJBQWtCLE9BQUEsQ0FBUSxtQkFBUjthQUFsQjttQkFDQSxLQUFDLENBQUEsY0FBRCxHQUFzQixJQUFBLGNBQUEsQ0FBZSxLQUFDLENBQUEsVUFBQSxDQUFoQixFQUZqQjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRFAsQ0FBQTtBQUtBLFFBQUEsSUFBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsTUFBOUIsQ0FBSDtpQkFDRSxJQUFBLENBQUEsRUFERjtTQUFBLE1BQUE7aUJBR0UsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxvQkFBZCxDQUFtQyxDQUFBLFNBQUEsS0FBQSxHQUFBO21CQUFBLFNBQUMsQ0FBRCxHQUFBO0FBQ2xELGNBQUEsSUFBRyxDQUFDLENBQUMsSUFBRixLQUFVLE1BQWI7QUFDRSxnQkFBQSxJQUFBLENBQUEsQ0FBQSxDQUFBO3VCQUNBLEtBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBLEVBRkY7ZUFEa0Q7WUFBQSxFQUFBO1VBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuQyxFQUhuQjtTQU5GO09BRFE7SUFBQSxDQWhDVixDQUFBOztBQUFBLG1CQWdEQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSxXQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsS0FBRCxDQUFPLGNBQVAsQ0FBQSxDQUFBOzs7Y0FDYyxDQUFFOztPQURoQjs7O2VBRWUsQ0FBRTs7T0FGakI7QUFBQSxNQUdBLElBQUMsQ0FBQSxjQUFELEdBQWtCLElBSGxCLENBQUE7YUFJQSxjQUFBLEdBQWlCLEtBTFA7SUFBQSxDQWhEWixDQUFBOztnQkFBQTs7T0FMRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/marcoslamuria/.atom/packages/foldername-tabs/lib/main.coffee
