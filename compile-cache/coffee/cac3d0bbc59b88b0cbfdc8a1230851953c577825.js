(function() {
  var CompositeDisposable, SmartTabName, basename, ellipsis, log, parsePath, paths, processAllTabs, sep,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  sep = require("path").sep;

  basename = require("path").basename;

  ellipsis = "…";

  log = require("atom-simple-logger")({
    pkg: "smart-tab-name",
    nsp: "core"
  });

  CompositeDisposable = require('atom').CompositeDisposable;

  paths = {};

  parsePath = function(path) {
    var last, pathIdentifier, projectPaths, relativePath, result, splitted;
    result = {};
    relativePath = atom.project.relativizePath(path);
    if ((relativePath != null ? relativePath[0] : void 0) != null) {
      splitted = relativePath[1].split(sep);
      result.filename = splitted.pop();
      projectPaths = atom.project.getPaths();
      pathIdentifier = "";
      if (projectPaths.length > 1) {
        pathIdentifier += "" + (basename(projectPaths[projectPaths.indexOf(relativePath[0])]));
        if (splitted.length > 0) {
          pathIdentifier += sep;
        }
      }
      last = "";
      if (splitted.length > 0) {
        last = splitted.pop();
      }
      if (splitted.length > 0) {
        if (pathIdentifier !== "") {
          result.foldername = pathIdentifier + ellipsis + sep + last + sep;
        } else {
          result.foldername = last + sep;
          result.ellipsis = "" + sep + ellipsis;
        }
      } else {
        result.foldername = pathIdentifier + last + sep;
      }
    } else {
      splitted = path.split(sep);
      result.filename = splitted.pop();
      if (splitted.length) {
        result.foldername = splitted.pop() + sep;
        result.ellipsis = "" + sep + ellipsis;
      }
    }
    return result;
  };

  processAllTabs = function(revert) {
    var container, ellipsisElement, filenameElement, foldernameElement, paneItem, paneItems, path, tab, tabs, _i, _j, _k, _len, _len1, _len2;
    if (revert == null) {
      revert = false;
    }
    log("processing all tabs, reverting:" + revert);
    paths = [];
    paneItems = atom.workspace.getPaneItems();
    for (_i = 0, _len = paneItems.length; _i < _len; _i++) {
      paneItem = paneItems[_i];
      if (paneItem.getPath != null) {
        path = paneItem.getPath();
        if ((path != null) && paths.indexOf(path) === -1) {
          paths.push(path);
        }
      }
    }
    log("found " + paths.length + " different paths of total " + paneItems.length + " paneItems", 2);
    for (_j = 0, _len1 = paths.length; _j < _len1; _j++) {
      path = paths[_j];
      tabs = atom.views.getView(atom.workspace).querySelectorAll("ul.tab-bar> li.tab[data-type='TextEditor']> div.title[data-path='" + (path.replace(/\\/g, "\\\\")) + "']");
      log("found " + tabs.length + " tabs for " + path, 2);
      for (_k = 0, _len2 = tabs.length; _k < _len2; _k++) {
        tab = tabs[_k];
        container = tab.querySelector("div.smart-tab-name");
        if ((container != null) && revert) {
          log("reverting " + path, 2);
          tab.removeChild(container);
          tab.innerHTML = path.split(sep).pop();
        } else if ((container == null) && !revert) {
          log("applying " + path, 2);
          if (paths[path] == null) {
            paths[path] = parsePath(path);
          }
          tab.innerHTML = "";
          container = document.createElement("div");
          container.classList.add("smart-tab-name");
          if (paths[path].foldername && paths[path].foldername !== "/") {
            foldernameElement = document.createElement("span");
            foldernameElement.classList.add("folder");
            foldernameElement.innerHTML = paths[path].foldername;
            container.appendChild(foldernameElement);
          }
          if (paths[path].foldername === "") {
            filenameElement.classList.add("file-only");
          }
          filenameElement = document.createElement("span");
          filenameElement.classList.add("file");
          filenameElement.innerHTML = paths[path].filename;
          container.appendChild(filenameElement);
          if (paths[path].filename.match(/^index\.[a-z]+/)) {
            filenameElement.classList.add("index-filename");
          }
          if (paths[path].ellipsis) {
            ellipsisElement = document.createElement("span");
            ellipsisElement.classList.add("ellipsis");
            ellipsisElement.innerHTML = paths[path].ellipsis;
            container.appendChild(ellipsisElement);
          }
          tab.appendChild(container);
        }
      }
    }
    return !revert;
  };

  module.exports = SmartTabName = (function() {
    SmartTabName.prototype.disposables = null;

    SmartTabName.prototype.processed = false;

    function SmartTabName() {
      this.destroy = __bind(this.destroy, this);
      this.toggle = __bind(this.toggle, this);
      var pane, _i, _len, _ref;
      this.processed = processAllTabs();
      if (this.disposables == null) {
        this.disposables = new CompositeDisposable;
        this.disposables.add(atom.workspace.onDidAddTextEditor(function() {
          return setTimeout(processAllTabs, 10);
        }));
        this.disposables.add(atom.workspace.onDidDestroyPaneItem(function() {
          return setTimeout(processAllTabs, 10);
        }));
        this.disposables.add(atom.workspace.onDidAddPane((function(_this) {
          return function(event) {
            return _this.disposables.add(event.pane.onDidMoveItem(function() {
              return setTimeout(processAllTabs, 10);
            }));
          };
        })(this)));
        this.disposables.add(atom.commands.add('atom-workspace', {
          'smart-tab-name:toggle': this.toggle
        }));
        _ref = atom.workspace.getPanes();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          pane = _ref[_i];
          this.disposables.add(pane.onDidMoveItem(function() {
            return setTimeout(processAllTabs, 10);
          }));
        }
      }
      log("loaded");
    }

    SmartTabName.prototype.toggle = function() {
      return this.processed = processAllTabs(this.processed);
    };

    SmartTabName.prototype.destroy = function() {
      var _ref;
      this.processed = processAllTabs(true);
      if ((_ref = this.disposables) != null) {
        _ref.dispose();
      }
      return this.disposables = null;
    };

    return SmartTabName;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL21hcmNvc2xhbXVyaWEvLmF0b20vcGFja2FnZXMvc21hcnQtdGFiLW5hbWUvbGliL3NtYXJ0LXRhYi1uYW1lLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpR0FBQTtJQUFBLGtGQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQyxHQUF0QixDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQyxRQUQzQixDQUFBOztBQUFBLEVBRUEsUUFBQSxHQUFXLEdBRlgsQ0FBQTs7QUFBQSxFQUdBLEdBQUEsR0FBTSxPQUFBLENBQVEsb0JBQVIsQ0FBQSxDQUE4QjtBQUFBLElBQUEsR0FBQSxFQUFJLGdCQUFKO0FBQUEsSUFBcUIsR0FBQSxFQUFJLE1BQXpCO0dBQTlCLENBSE4sQ0FBQTs7QUFBQSxFQU1DLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFORCxDQUFBOztBQUFBLEVBT0EsS0FBQSxHQUFRLEVBUFIsQ0FBQTs7QUFBQSxFQVNBLFNBQUEsR0FBWSxTQUFDLElBQUQsR0FBQTtBQUNWLFFBQUEsa0VBQUE7QUFBQSxJQUFBLE1BQUEsR0FBUyxFQUFULENBQUE7QUFBQSxJQUNBLFlBQUEsR0FBZSxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWIsQ0FBNEIsSUFBNUIsQ0FEZixDQUFBO0FBR0EsSUFBQSxJQUFHLHlEQUFIO0FBQ0UsTUFBQSxRQUFBLEdBQVcsWUFBYSxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQWhCLENBQXNCLEdBQXRCLENBQVgsQ0FBQTtBQUFBLE1BQ0EsTUFBTSxDQUFDLFFBQVAsR0FBa0IsUUFBUSxDQUFDLEdBQVQsQ0FBQSxDQURsQixDQUFBO0FBQUEsTUFFQSxZQUFBLEdBQWUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FGZixDQUFBO0FBQUEsTUFHQSxjQUFBLEdBQWlCLEVBSGpCLENBQUE7QUFLQSxNQUFBLElBQUcsWUFBWSxDQUFDLE1BQWIsR0FBc0IsQ0FBekI7QUFDRSxRQUFBLGNBQUEsSUFBa0IsRUFBQSxHQUFFLENBQUMsUUFBQSxDQUFTLFlBQWEsQ0FBQSxZQUFZLENBQUMsT0FBYixDQUFxQixZQUFhLENBQUEsQ0FBQSxDQUFsQyxDQUFBLENBQXRCLENBQUQsQ0FBcEIsQ0FBQTtBQUNBLFFBQUEsSUFBeUIsUUFBUSxDQUFDLE1BQVQsR0FBa0IsQ0FBM0M7QUFBQSxVQUFBLGNBQUEsSUFBa0IsR0FBbEIsQ0FBQTtTQUZGO09BTEE7QUFBQSxNQVNBLElBQUEsR0FBTyxFQVRQLENBQUE7QUFVQSxNQUFBLElBQUcsUUFBUSxDQUFDLE1BQVQsR0FBa0IsQ0FBckI7QUFDRSxRQUFBLElBQUEsR0FBTyxRQUFRLENBQUMsR0FBVCxDQUFBLENBQVAsQ0FERjtPQVZBO0FBYUEsTUFBQSxJQUFHLFFBQVEsQ0FBQyxNQUFULEdBQWtCLENBQXJCO0FBQ0UsUUFBQSxJQUFHLGNBQUEsS0FBa0IsRUFBckI7QUFDRSxVQUFBLE1BQU0sQ0FBQyxVQUFQLEdBQW9CLGNBQUEsR0FBaUIsUUFBakIsR0FBNEIsR0FBNUIsR0FBa0MsSUFBbEMsR0FBeUMsR0FBN0QsQ0FERjtTQUFBLE1BQUE7QUFHRSxVQUFBLE1BQU0sQ0FBQyxVQUFQLEdBQW9CLElBQUEsR0FBTyxHQUEzQixDQUFBO0FBQUEsVUFFQSxNQUFNLENBQUMsUUFBUCxHQUFrQixFQUFBLEdBQUcsR0FBSCxHQUFTLFFBRjNCLENBSEY7U0FERjtPQUFBLE1BQUE7QUFRRSxRQUFBLE1BQU0sQ0FBQyxVQUFQLEdBQW9CLGNBQUEsR0FBaUIsSUFBakIsR0FBd0IsR0FBNUMsQ0FSRjtPQWRGO0tBQUEsTUFBQTtBQXlCRSxNQUFBLFFBQUEsR0FBVyxJQUFJLENBQUMsS0FBTCxDQUFXLEdBQVgsQ0FBWCxDQUFBO0FBQUEsTUFDQSxNQUFNLENBQUMsUUFBUCxHQUFrQixRQUFRLENBQUMsR0FBVCxDQUFBLENBRGxCLENBQUE7QUFFQSxNQUFBLElBQUcsUUFBUSxDQUFDLE1BQVo7QUFDRSxRQUFBLE1BQU0sQ0FBQyxVQUFQLEdBQW9CLFFBQVEsQ0FBQyxHQUFULENBQUEsQ0FBQSxHQUFpQixHQUFyQyxDQUFBO0FBQUEsUUFFQSxNQUFNLENBQUMsUUFBUCxHQUFrQixFQUFBLEdBQUcsR0FBSCxHQUFTLFFBRjNCLENBREY7T0EzQkY7S0FIQTtBQW1DQSxXQUFPLE1BQVAsQ0FwQ1U7RUFBQSxDQVRaLENBQUE7O0FBQUEsRUErQ0EsY0FBQSxHQUFpQixTQUFDLE1BQUQsR0FBQTtBQUNmLFFBQUEsb0lBQUE7O01BRGdCLFNBQU87S0FDdkI7QUFBQSxJQUFBLEdBQUEsQ0FBSyxpQ0FBQSxHQUFpQyxNQUF0QyxDQUFBLENBQUE7QUFBQSxJQUNBLEtBQUEsR0FBUSxFQURSLENBQUE7QUFBQSxJQUVBLFNBQUEsR0FBWSxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQWYsQ0FBQSxDQUZaLENBQUE7QUFHQSxTQUFBLGdEQUFBOytCQUFBO0FBRUUsTUFBQSxJQUFHLHdCQUFIO0FBQ0UsUUFBQSxJQUFBLEdBQU8sUUFBUSxDQUFDLE9BQVQsQ0FBQSxDQUFQLENBQUE7QUFFQSxRQUFBLElBQUcsY0FBQSxJQUFVLEtBQUssQ0FBQyxPQUFOLENBQWMsSUFBZCxDQUFBLEtBQXVCLENBQUEsQ0FBcEM7QUFDRSxVQUFBLEtBQUssQ0FBQyxJQUFOLENBQVcsSUFBWCxDQUFBLENBREY7U0FIRjtPQUZGO0FBQUEsS0FIQTtBQUFBLElBV0EsR0FBQSxDQUFLLFFBQUEsR0FBUSxLQUFLLENBQUMsTUFBZCxHQUFxQiw0QkFBckIsR0FDSyxTQUFTLENBQUMsTUFEZixHQUNzQixZQUQzQixFQUN1QyxDQUR2QyxDQVhBLENBQUE7QUFhQSxTQUFBLDhDQUFBO3VCQUFBO0FBQ0UsTUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFrQyxDQUFDLGdCQUFuQyxDQUFxRCxtRUFBQSxHQUVwQyxDQUFDLElBQUksQ0FBQyxPQUFMLENBQWEsS0FBYixFQUFtQixNQUFuQixDQUFELENBRm9DLEdBRVIsSUFGN0MsQ0FBUCxDQUFBO0FBQUEsTUFHQSxHQUFBLENBQUssUUFBQSxHQUFRLElBQUksQ0FBQyxNQUFiLEdBQW9CLFlBQXBCLEdBQWdDLElBQXJDLEVBQTRDLENBQTVDLENBSEEsQ0FBQTtBQUlBLFdBQUEsNkNBQUE7dUJBQUE7QUFDRSxRQUFBLFNBQUEsR0FBWSxHQUFHLENBQUMsYUFBSixDQUFrQixvQkFBbEIsQ0FBWixDQUFBO0FBQ0EsUUFBQSxJQUFHLG1CQUFBLElBQWUsTUFBbEI7QUFDRSxVQUFBLEdBQUEsQ0FBSyxZQUFBLEdBQVksSUFBakIsRUFBd0IsQ0FBeEIsQ0FBQSxDQUFBO0FBQUEsVUFDQSxHQUFHLENBQUMsV0FBSixDQUFnQixTQUFoQixDQURBLENBQUE7QUFBQSxVQUVBLEdBQUcsQ0FBQyxTQUFKLEdBQWdCLElBQUksQ0FBQyxLQUFMLENBQVcsR0FBWCxDQUFlLENBQUMsR0FBaEIsQ0FBQSxDQUZoQixDQURGO1NBQUEsTUFJSyxJQUFPLG1CQUFKLElBQW1CLENBQUEsTUFBdEI7QUFDSCxVQUFBLEdBQUEsQ0FBSyxXQUFBLEdBQVcsSUFBaEIsRUFBdUIsQ0FBdkIsQ0FBQSxDQUFBOztZQUNBLEtBQU0sQ0FBQSxJQUFBLElBQVMsU0FBQSxDQUFVLElBQVY7V0FEZjtBQUFBLFVBRUEsR0FBRyxDQUFDLFNBQUosR0FBZ0IsRUFGaEIsQ0FBQTtBQUFBLFVBR0EsU0FBQSxHQUFZLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBSFosQ0FBQTtBQUFBLFVBSUEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFwQixDQUF3QixnQkFBeEIsQ0FKQSxDQUFBO0FBTUEsVUFBQSxJQUFHLEtBQU0sQ0FBQSxJQUFBLENBQUssQ0FBQyxVQUFaLElBQTJCLEtBQU0sQ0FBQSxJQUFBLENBQUssQ0FBQyxVQUFaLEtBQTBCLEdBQXhEO0FBQ0UsWUFBQSxpQkFBQSxHQUFvQixRQUFRLENBQUMsYUFBVCxDQUF1QixNQUF2QixDQUFwQixDQUFBO0FBQUEsWUFDQSxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsR0FBNUIsQ0FBZ0MsUUFBaEMsQ0FEQSxDQUFBO0FBQUEsWUFFQSxpQkFBaUIsQ0FBQyxTQUFsQixHQUE4QixLQUFNLENBQUEsSUFBQSxDQUFLLENBQUMsVUFGMUMsQ0FBQTtBQUFBLFlBR0EsU0FBUyxDQUFDLFdBQVYsQ0FBc0IsaUJBQXRCLENBSEEsQ0FERjtXQU5BO0FBWUEsVUFBQSxJQUFHLEtBQU0sQ0FBQSxJQUFBLENBQUssQ0FBQyxVQUFaLEtBQTBCLEVBQTdCO0FBQ0UsWUFBQSxlQUFlLENBQUMsU0FBUyxDQUFDLEdBQTFCLENBQThCLFdBQTlCLENBQUEsQ0FERjtXQVpBO0FBQUEsVUFlQSxlQUFBLEdBQWtCLFFBQVEsQ0FBQyxhQUFULENBQXVCLE1BQXZCLENBZmxCLENBQUE7QUFBQSxVQWdCQSxlQUFlLENBQUMsU0FBUyxDQUFDLEdBQTFCLENBQThCLE1BQTlCLENBaEJBLENBQUE7QUFBQSxVQWlCQSxlQUFlLENBQUMsU0FBaEIsR0FBNEIsS0FBTSxDQUFBLElBQUEsQ0FBSyxDQUFDLFFBakJ4QyxDQUFBO0FBQUEsVUFrQkEsU0FBUyxDQUFDLFdBQVYsQ0FBc0IsZUFBdEIsQ0FsQkEsQ0FBQTtBQW9CQSxVQUFBLElBQUcsS0FBTSxDQUFBLElBQUEsQ0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFyQixDQUEyQixnQkFBM0IsQ0FBSDtBQUNFLFlBQUEsZUFBZSxDQUFDLFNBQVMsQ0FBQyxHQUExQixDQUE4QixnQkFBOUIsQ0FBQSxDQURGO1dBcEJBO0FBdUJBLFVBQUEsSUFBRyxLQUFNLENBQUEsSUFBQSxDQUFLLENBQUMsUUFBZjtBQUNFLFlBQUEsZUFBQSxHQUFrQixRQUFRLENBQUMsYUFBVCxDQUF1QixNQUF2QixDQUFsQixDQUFBO0FBQUEsWUFDQSxlQUFlLENBQUMsU0FBUyxDQUFDLEdBQTFCLENBQThCLFVBQTlCLENBREEsQ0FBQTtBQUFBLFlBRUEsZUFBZSxDQUFDLFNBQWhCLEdBQTRCLEtBQU0sQ0FBQSxJQUFBLENBQUssQ0FBQyxRQUZ4QyxDQUFBO0FBQUEsWUFHQSxTQUFTLENBQUMsV0FBVixDQUFzQixlQUF0QixDQUhBLENBREY7V0F2QkE7QUFBQSxVQTZCQSxHQUFHLENBQUMsV0FBSixDQUFnQixTQUFoQixDQTdCQSxDQURHO1NBTlA7QUFBQSxPQUxGO0FBQUEsS0FiQTtBQXVEQSxXQUFPLENBQUEsTUFBUCxDQXhEZTtFQUFBLENBL0NqQixDQUFBOztBQUFBLEVBeUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiwyQkFBQSxXQUFBLEdBQWEsSUFBYixDQUFBOztBQUFBLDJCQUNBLFNBQUEsR0FBVyxLQURYLENBQUE7O0FBRWMsSUFBQSxzQkFBQSxHQUFBO0FBQ1osK0NBQUEsQ0FBQTtBQUFBLDZDQUFBLENBQUE7QUFBQSxVQUFBLG9CQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsU0FBRCxHQUFhLGNBQUEsQ0FBQSxDQUFiLENBQUE7QUFDQSxNQUFBLElBQU8sd0JBQVA7QUFDRSxRQUFBLElBQUMsQ0FBQSxXQUFELEdBQWUsR0FBQSxDQUFBLG1CQUFmLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLFNBQUEsR0FBQTtpQkFDakQsVUFBQSxDQUFXLGNBQVgsRUFBMkIsRUFBM0IsRUFEaUQ7UUFBQSxDQUFsQyxDQUFqQixDQURBLENBQUE7QUFBQSxRQUdBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsU0FBUyxDQUFDLG9CQUFmLENBQW9DLFNBQUEsR0FBQTtpQkFDbkQsVUFBQSxDQUFXLGNBQVgsRUFBMkIsRUFBM0IsRUFEbUQ7UUFBQSxDQUFwQyxDQUFqQixDQUhBLENBQUE7QUFBQSxRQUtBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsU0FBUyxDQUFDLFlBQWYsQ0FBNEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLEtBQUQsR0FBQTttQkFDM0MsS0FBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLEtBQUssQ0FBQyxJQUFJLENBQUMsYUFBWCxDQUF5QixTQUFBLEdBQUE7cUJBQ3hDLFVBQUEsQ0FBVyxjQUFYLEVBQTJCLEVBQTNCLEVBRHdDO1lBQUEsQ0FBekIsQ0FBakIsRUFEMkM7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE1QixDQUFqQixDQUxBLENBQUE7QUFBQSxRQVFBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ2pCO0FBQUEsVUFBQSx1QkFBQSxFQUF5QixJQUFDLENBQUEsTUFBMUI7U0FEaUIsQ0FBakIsQ0FSQSxDQUFBO0FBV0E7QUFBQSxhQUFBLDJDQUFBOzBCQUFBO0FBQ0UsVUFBQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLGFBQUwsQ0FBbUIsU0FBQSxHQUFBO21CQUNsQyxVQUFBLENBQVcsY0FBWCxFQUEyQixFQUEzQixFQURrQztVQUFBLENBQW5CLENBQWpCLENBQUEsQ0FERjtBQUFBLFNBWkY7T0FEQTtBQUFBLE1BZ0JBLEdBQUEsQ0FBSSxRQUFKLENBaEJBLENBRFk7SUFBQSxDQUZkOztBQUFBLDJCQW9CQSxNQUFBLEdBQVEsU0FBQSxHQUFBO2FBQ04sSUFBQyxDQUFBLFNBQUQsR0FBYSxjQUFBLENBQWUsSUFBQyxDQUFBLFNBQWhCLEVBRFA7SUFBQSxDQXBCUixDQUFBOztBQUFBLDJCQXNCQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsU0FBRCxHQUFhLGNBQUEsQ0FBZSxJQUFmLENBQWIsQ0FBQTs7WUFDWSxDQUFFLE9BQWQsQ0FBQTtPQURBO2FBRUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxLQUhSO0lBQUEsQ0F0QlQsQ0FBQTs7d0JBQUE7O01BM0dGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/marcoslamuria/.atom/packages/smart-tab-name/lib/smart-tab-name.coffee
