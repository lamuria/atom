(function() {
  var CompositeDisposable, FoldernameTabs, abbreviate, log, parsePath, paths, processAllTabs, sep,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  sep = require("path").sep;

  abbreviate = require("abbreviate");

  log = function() {};

  CompositeDisposable = require('atom').CompositeDisposable;

  paths = {};

  parsePath = function(path) {
    var folderLength, lastFolder, maxLength, mfpIdent, pathIdentifier, projectPaths, relativePath, remaining, result, splitted;
    result = {};
    relativePath = atom.project.relativizePath(path);
    if ((relativePath != null ? relativePath[0] : void 0) != null) {
      splitted = relativePath[1].split(sep);
    } else {
      splitted = path.split(sep);
    }
    result.filename = splitted.pop();
    folderLength = atom.config.get("foldername-tabs.folderLength");
    splitted = splitted.map(function(string) {
      if (folderLength > 0) {
        return abbreviate(string, {
          length: folderLength,
          keepSeparators: true,
          strict: false
        });
      } else {
        return string;
      }
    });
    if (splitted.length > 0) {
      lastFolder = splitted.pop();
    } else {
      lastFolder = "";
    }
    if ((relativePath != null ? relativePath[0] : void 0) != null) {
      projectPaths = atom.project.getPaths();
      pathIdentifier = "";
      if (projectPaths.length > 1) {
        mfpIdent = atom.config.get("foldername-tabs.mfpIdent");
        if (mfpIdent <= 0) {
          pathIdentifier += "" + (projectPaths.indexOf(relativePath[0]) + 1);
        } else {
          pathIdentifier += abbreviate(relativePath[0].split(sep).pop(), {
            length: mfpIdent,
            keepSeparators: true,
            strict: false
          });
        }
        if (lastFolder) {
          pathIdentifier += sep;
        }
      }
      result.foldername = pathIdentifier;
    } else {
      splitted.shift();
      result.foldername = sep;
    }
    if (splitted.length > 0) {
      maxLength = atom.config.get("foldername-tabs.maxLength");
      if (maxLength > 0) {
        maxLength -= lastFolder.length + 4;
        if ((relativePath != null ? relativePath[0] : void 0) != null) {
          maxLength -= mfpIdent + 1;
        }
        if (maxLength > 0) {
          if (((relativePath != null ? relativePath[0] : void 0) != null) && splitted[0].length < maxLength) {
            maxLength -= splitted[0].length;
            result.foldername += splitted.shift() + sep;
          }
          remaining = "";
          while (splitted.length > 0 && maxLength > splitted[splitted.length - 1].length + 1) {
            maxLength -= splitted[splitted.length - 1].length + 1;
            remaining = splitted.pop() + sep + remaining;
          }
          if (remaining.length > 0) {
            remaining += sep;
          }
          if (splitted.length > 0) {
            result.foldername += "..." + sep + remaining;
          } else {
            result.foldername += remaining;
          }
        } else {
          result.foldername += "..." + sep;
        }
      } else {
        result.foldername += splitted.join(sep) + sep;
      }
    }
    result.foldername += lastFolder;
    return result;
  };

  processAllTabs = function(revert) {
    var container, filenameElement, foldernameElement, paneItem, paneItems, path, tab, tabs, _i, _j, _k, _len, _len1, _len2;
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
      tabs = atom.views.getView(atom.workspace).querySelectorAll("ul.tab-bar> li.tab[data-type='TextEditor']> div.title[data-path=\"" + (path.replace(/\\/g, "\\\\").replace(/\"/g, "\\\"")) + "\"]");
      log("found " + tabs.length + " tabs for " + path, 2);
      for (_k = 0, _len2 = tabs.length; _k < _len2; _k++) {
        tab = tabs[_k];
        container = tab.querySelector("div.foldername-tabs");
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
          container.classList.add("foldername-tabs");
          if (paths[path].foldername !== "") {
            foldernameElement = document.createElement("span");
            foldernameElement.classList.add("folder");
            foldernameElement.innerHTML = paths[path].foldername;
            container.appendChild(foldernameElement);
          }
          filenameElement = document.createElement("span");
          filenameElement.classList.add("file");
          if (paths[path].foldername === "") {
            filenameElement.classList.add("file-only");
          }
          filenameElement.innerHTML = paths[path].filename;
          container.appendChild(filenameElement);
          tab.appendChild(container);
        }
      }
    }
    return !revert;
  };

  module.exports = FoldernameTabs = (function() {
    FoldernameTabs.prototype.disposables = null;

    FoldernameTabs.prototype.processed = false;

    function FoldernameTabs(logger) {
      this.destroy = __bind(this.destroy, this);
      this.toggle = __bind(this.toggle, this);
      this.repaint = __bind(this.repaint, this);
      log = logger("core");
      this.processed = processAllTabs();
      if (this.disposables == null) {
        this.disposables = new CompositeDisposable;
        this.disposables.add(atom.workspace.onDidAddPaneItem(function() {
          return setTimeout(processAllTabs, 10);
        }));
        this.disposables.add(atom.workspace.observePanes((function(_this) {
          return function(pane) {
            var disposable2, disposable3, disposable4, disposables;
            processAllTabs();
            disposables = new CompositeDisposable;
            disposable3 = pane.onDidRemoveItem(function() {
              return setTimeout(processAllTabs, 10);
            });
            disposable4 = pane.onDidMoveItem(function() {
              return setTimeout(processAllTabs, 10);
            });
            disposable2 = pane.onDidDestroy(function() {
              if (disposables.disposables != null) {
                return disposables.dispose();
              }
            });
            disposables.add(disposable2, disposable3, disposable4);
            return _this.disposables.add(disposable2, disposable3, disposable4);
          };
        })(this)));
        this.disposables.add(atom.commands.add('atom-workspace', {
          'foldername-tabs:toggle': this.toggle
        }));
        this.disposables.add(atom.config.observe("foldername-tabs.mfpIdent", this.repaint));
        this.disposables.add(atom.config.observe("foldername-tabs.folderLength", this.repaint));
        this.disposables.add(atom.config.observe("foldername-tabs.maxLength", this.repaint));
      }
      log("loaded");
    }

    FoldernameTabs.prototype.repaint = function() {
      if (this.processed) {
        processAllTabs(true);
        return processAllTabs();
      }
    };

    FoldernameTabs.prototype.toggle = function() {
      return this.processed = processAllTabs(this.processed);
    };

    FoldernameTabs.prototype.destroy = function() {
      var _ref;
      this.processed = processAllTabs(true);
      if ((_ref = this.disposables) != null) {
        _ref.dispose();
      }
      return this.disposables = null;
    };

    return FoldernameTabs;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL21hcmNvc2xhbXVyaWEvLmF0b20vcGFja2FnZXMvZm9sZGVybmFtZS10YWJzL2xpYi9mb2xkZXJuYW1lLXRhYnMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJGQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDLEdBQXRCLENBQUE7O0FBQUEsRUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLFlBQVIsQ0FEYixDQUFBOztBQUFBLEVBRUEsR0FBQSxHQUFNLFNBQUEsR0FBQSxDQUZOLENBQUE7O0FBQUEsRUFJQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBSkQsQ0FBQTs7QUFBQSxFQUtBLEtBQUEsR0FBUSxFQUxSLENBQUE7O0FBQUEsRUFTQSxTQUFBLEdBQVksU0FBQyxJQUFELEdBQUE7QUFDVixRQUFBLHNIQUFBO0FBQUEsSUFBQSxNQUFBLEdBQVMsRUFBVCxDQUFBO0FBQUEsSUFDQSxZQUFBLEdBQWUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQTRCLElBQTVCLENBRGYsQ0FBQTtBQUVBLElBQUEsSUFBRyx5REFBSDtBQUNFLE1BQUEsUUFBQSxHQUFXLFlBQWEsQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFoQixDQUFzQixHQUF0QixDQUFYLENBREY7S0FBQSxNQUFBO0FBR0UsTUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLEtBQUwsQ0FBVyxHQUFYLENBQVgsQ0FIRjtLQUZBO0FBQUEsSUFNQSxNQUFNLENBQUMsUUFBUCxHQUFrQixRQUFRLENBQUMsR0FBVCxDQUFBLENBTmxCLENBQUE7QUFBQSxJQU9BLFlBQUEsR0FBZ0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDhCQUFoQixDQVBoQixDQUFBO0FBQUEsSUFRQSxR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

//# sourceURL=/Users/marcoslamuria/.atom/packages/foldername-tabs/lib/foldername-tabs.coffee
