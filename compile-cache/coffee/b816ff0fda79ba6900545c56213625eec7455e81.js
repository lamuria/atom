(function() {
  var CommandError, Ex, VimOption, fs, getFullPath, getSearchTerm, path, replaceGroups, saveAs, trySave, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  path = require('path');

  CommandError = require('./command-error');

  fs = require('fs-plus');

  VimOption = require('./vim-option');

  _ = require('underscore-plus');

  trySave = function(func) {
    var deferred, error, errorMatch, fileName, _ref;
    deferred = Promise.defer();
    try {
      func();
      deferred.resolve();
    } catch (_error) {
      error = _error;
      if (error.message.endsWith('is a directory')) {
        atom.notifications.addWarning("Unable to save file: " + error.message);
      } else if (error.path != null) {
        if (error.code === 'EACCES') {
          atom.notifications.addWarning("Unable to save file: Permission denied '" + error.path + "'");
        } else if ((_ref = error.code) === 'EPERM' || _ref === 'EBUSY' || _ref === 'UNKNOWN' || _ref === 'EEXIST') {
          atom.notifications.addWarning("Unable to save file '" + error.path + "'", {
            detail: error.message
          });
        } else if (error.code === 'EROFS') {
          atom.notifications.addWarning("Unable to save file: Read-only file system '" + error.path + "'");
        }
      } else if ((errorMatch = /ENOTDIR, not a directory '([^']+)'/.exec(error.message))) {
        fileName = errorMatch[1];
        atom.notifications.addWarning("Unable to save file: A directory in the " + ("path '" + fileName + "' could not be written to"));
      } else {
        throw error;
      }
    }
    return deferred.promise;
  };

  saveAs = function(filePath, editor) {
    return fs.writeFileSync(filePath, editor.getText());
  };

  getFullPath = function(filePath) {
    filePath = fs.normalize(filePath);
    if (path.isAbsolute(filePath)) {
      return filePath;
    } else if (atom.project.getPaths().length === 0) {
      return path.join(fs.normalize('~'), filePath);
    } else {
      return path.join(atom.project.getPaths()[0], filePath);
    }
  };

  replaceGroups = function(groups, string) {
    var char, escaped, group, replaced;
    replaced = '';
    escaped = false;
    while ((char = string[0]) != null) {
      string = string.slice(1);
      if (char === '\\' && !escaped) {
        escaped = true;
      } else if (/\d/.test(char) && escaped) {
        escaped = false;
        group = groups[parseInt(char)];
        if (group == null) {
          group = '';
        }
        replaced += group;
      } else {
        escaped = false;
        replaced += char;
      }
    }
    return replaced;
  };

  getSearchTerm = function(term, modifiers) {
    var char, escaped, hasC, hasc, modFlags, term_, _i, _len;
    if (modifiers == null) {
      modifiers = {
        'g': true
      };
    }
    escaped = false;
    hasc = false;
    hasC = false;
    term_ = term;
    term = '';
    for (_i = 0, _len = term_.length; _i < _len; _i++) {
      char = term_[_i];
      if (char === '\\' && !escaped) {
        escaped = true;
        term += char;
      } else {
        if (char === 'c' && escaped) {
          hasc = true;
          term = term.slice(0, -1);
        } else if (char === 'C' && escaped) {
          hasC = true;
          term = term.slice(0, -1);
        } else if (char !== '\\') {
          term += char;
        }
        escaped = false;
      }
    }
    if (hasC) {
      modifiers['i'] = false;
    }
    if ((!hasC && !term.match('[A-Z]') && atom.config.get('vim-mode.useSmartcaseForSearch')) || hasc) {
      modifiers['i'] = true;
    }
    modFlags = Object.keys(modifiers).filter(function(key) {
      return modifiers[key];
    }).join('');
    try {
      return new RegExp(term, modFlags);
    } catch (_error) {
      return new RegExp(_.escapeRegExp(term), modFlags);
    }
  };

  Ex = (function() {
    function Ex() {
      this.vsp = __bind(this.vsp, this);
      this.s = __bind(this.s, this);
      this.sp = __bind(this.sp, this);
      this.xit = __bind(this.xit, this);
      this.saveas = __bind(this.saveas, this);
      this.xa = __bind(this.xa, this);
      this.xall = __bind(this.xall, this);
      this.wqa = __bind(this.wqa, this);
      this.wqall = __bind(this.wqall, this);
      this.wa = __bind(this.wa, this);
      this.wq = __bind(this.wq, this);
      this.w = __bind(this.w, this);
      this.e = __bind(this.e, this);
      this.tabp = __bind(this.tabp, this);
      this.tabn = __bind(this.tabn, this);
      this.tabc = __bind(this.tabc, this);
      this.tabclose = __bind(this.tabclose, this);
      this.tabnew = __bind(this.tabnew, this);
      this.tabe = __bind(this.tabe, this);
      this.tabedit = __bind(this.tabedit, this);
      this.qall = __bind(this.qall, this);
      this.q = __bind(this.q, this);
    }

    Ex.singleton = function() {
      return Ex.ex || (Ex.ex = new Ex);
    };

    Ex.registerCommand = function(name, func) {
      return Ex.singleton()[name] = func;
    };

    Ex.registerAlias = function(alias, name) {
      return Ex.singleton()[alias] = function(args) {
        return Ex.singleton()[name](args);
      };
    };

    Ex.prototype.quit = function() {
      return atom.workspace.getActivePane().destroyActiveItem();
    };

    Ex.prototype.quitall = function() {
      return atom.close();
    };

    Ex.prototype.q = function() {
      return this.quit();
    };

    Ex.prototype.qall = function() {
      return this.quitall();
    };

    Ex.prototype.tabedit = function(args) {
      if (args.args.trim() !== '') {
        return this.edit(args);
      } else {
        return this.tabnew(args);
      }
    };

    Ex.prototype.tabe = function(args) {
      return this.tabedit(args);
    };

    Ex.prototype.tabnew = function(_arg) {
      var args, range;
      range = _arg.range, args = _arg.args;
      if (args.trim() === '') {
        return atom.workspace.open();
      } else {
        return this.tabedit(range, args);
      }
    };

    Ex.prototype.tabclose = function(args) {
      return this.quit(args);
    };

    Ex.prototype.tabc = function() {
      return this.tabclose();
    };

    Ex.prototype.tabnext = function() {
      var pane;
      pane = atom.workspace.getActivePane();
      return pane.activateNextItem();
    };

    Ex.prototype.tabn = function() {
      return this.tabnext();
    };

    Ex.prototype.tabprevious = function() {
      var pane;
      pane = atom.workspace.getActivePane();
      return pane.activatePreviousItem();
    };

    Ex.prototype.tabp = function() {
      return this.tabprevious();
    };

    Ex.prototype.edit = function(_arg) {
      var args, editor, filePath, force, fullPath, range;
      range = _arg.range, args = _arg.args, editor = _arg.editor;
      filePath = args.trim();
      if (filePath[0] === '!') {
        force = true;
        filePath = filePath.slice(1).trim();
      } else {
        force = false;
      }
      if (editor.isModified() && !force) {
        throw new CommandError('No write since last change (add ! to override)');
      }
      if (filePath.indexOf(' ') !== -1) {
        throw new CommandError('Only one file name allowed');
      }
      if (filePath.length !== 0) {
        fullPath = getFullPath(filePath);
        if (fullPath === editor.getPath()) {
          return editor.getBuffer().reload();
        } else {
          return atom.workspace.open(fullPath);
        }
      } else {
        if (editor.getPath() != null) {
          return editor.getBuffer().reload();
        } else {
          throw new CommandError('No file name');
        }
      }
    };

    Ex.prototype.e = function(args) {
      return this.edit(args);
    };

    Ex.prototype.enew = function() {
      var buffer;
      buffer = atom.workspace.getActiveTextEditor().buffer;
      buffer.setPath(void 0);
      return buffer.load();
    };

    Ex.prototype.write = function(_arg) {
      var args, deferred, editor, filePath, force, fullPath, range, saveas, saved;
      range = _arg.range, args = _arg.args, editor = _arg.editor, saveas = _arg.saveas;
      if (saveas == null) {
        saveas = false;
      }
      filePath = args;
      if (filePath[0] === '!') {
        force = true;
        filePath = filePath.slice(1);
      } else {
        force = false;
      }
      filePath = filePath.trim();
      if (filePath.indexOf(' ') !== -1) {
        throw new CommandError('Only one file name allowed');
      }
      deferred = Promise.defer();
      editor = atom.workspace.getActiveTextEditor();
      saved = false;
      if (filePath.length !== 0) {
        fullPath = getFullPath(filePath);
      }
      if ((editor.getPath() != null) && ((fullPath == null) || editor.getPath() === fullPath)) {
        if (saveas) {
          throw new CommandError("Argument required");
        } else {
          trySave(function() {
            return editor.save();
          }).then(deferred.resolve);
          saved = true;
        }
      } else if (fullPath == null) {
        fullPath = atom.showSaveDialogSync();
      }
      if (!saved && (fullPath != null)) {
        if (!force && fs.existsSync(fullPath)) {
          throw new CommandError("File exists (add ! to override)");
        }
        if (saveas) {
          editor = atom.workspace.getActiveTextEditor();
          trySave(function() {
            return editor.saveAs(fullPath, editor);
          }).then(deferred.resolve);
        } else {
          trySave(function() {
            return saveAs(fullPath, editor);
          }).then(deferred.resolve);
        }
      }
      return deferred.promise;
    };

    Ex.prototype.wall = function() {
      return atom.workspace.saveAll();
    };

    Ex.prototype.w = function(args) {
      return this.write(args);
    };

    Ex.prototype.wq = function(args) {
      return this.write(args).then((function(_this) {
        return function() {
          return _this.quit();
        };
      })(this));
    };

    Ex.prototype.wa = function() {
      return this.wall();
    };

    Ex.prototype.wqall = function() {
      this.wall();
      return this.quitall();
    };

    Ex.prototype.wqa = function() {
      return this.wqall();
    };

    Ex.prototype.xall = function() {
      return this.wqall();
    };

    Ex.prototype.xa = function() {
      return this.wqall();
    };

    Ex.prototype.saveas = function(args) {
      args.saveas = true;
      return this.write(args);
    };

    Ex.prototype.xit = function(args) {
      return this.wq(args);
    };

    Ex.prototype.split = function(_arg) {
      var args, file, filePaths, newPane, pane, range, _i, _len, _results;
      range = _arg.range, args = _arg.args;
      args = args.trim();
      filePaths = args.split(' ');
      if (filePaths.length === 1 && filePaths[0] === '') {
        filePaths = void 0;
      }
      pane = atom.workspace.getActivePane();
      if ((filePaths != null) && filePaths.length > 0) {
        newPane = pane.splitUp();
        _results = [];
        for (_i = 0, _len = filePaths.length; _i < _len; _i++) {
          file = filePaths[_i];
          _results.push((function() {
            return atom.workspace.openURIInPane(file, newPane);
          })());
        }
        return _results;
      } else {
        return pane.splitUp({
          copyActiveItem: true
        });
      }
    };

    Ex.prototype.sp = function(args) {
      return this.split(args);
    };

    Ex.prototype.substitute = function(_arg) {
      var args, args_, char, delim, e, editor, escapeChars, escaped, flags, flagsObj, parsed, parsing, pattern, patternRE, range, substition, vimState;
      range = _arg.range, args = _arg.args, editor = _arg.editor, vimState = _arg.vimState;
      args_ = args.trimLeft();
      delim = args_[0];
      if (/[a-z1-9\\"|]/i.test(delim)) {
        throw new CommandError("Regular expressions can't be delimited by alphanumeric characters, '\\', '\"' or '|'");
      }
      args_ = args_.slice(1);
      escapeChars = {
        t: '\t',
        n: '\n',
        r: '\r'
      };
      parsed = ['', '', ''];
      parsing = 0;
      escaped = false;
      while ((char = args_[0]) != null) {
        args_ = args_.slice(1);
        if (char === delim) {
          if (!escaped) {
            parsing++;
            if (parsing > 2) {
              throw new CommandError('Trailing characters');
            }
          } else {
            parsed[parsing] = parsed[parsing].slice(0, -1);
          }
        } else if (char === '\\' && !escaped) {
          parsed[parsing] += char;
          escaped = true;
        } else if (parsing === 1 && escaped && (escapeChars[char] != null)) {
          parsed[parsing] += escapeChars[char];
          escaped = false;
        } else {
          escaped = false;
          parsed[parsing] += char;
        }
      }
      pattern = parsed[0], substition = parsed[1], flags = parsed[2];
      if (pattern === '') {
        pattern = vimState.getSearchHistoryItem();
        if (pattern == null) {
          atom.beep();
          throw new CommandError('No previous regular expression');
        }
      } else {
        vimState.pushSearchHistory(pattern);
      }
      try {
        flagsObj = {};
        flags.split('').forEach(function(flag) {
          return flagsObj[flag] = true;
        });
        patternRE = getSearchTerm(pattern, flagsObj);
      } catch (_error) {
        e = _error;
        if (e.message.indexOf('Invalid flags supplied to RegExp constructor') === 0) {
          throw new CommandError("Invalid flags: " + e.message.slice(45));
        } else if (e.message.indexOf('Invalid regular expression: ') === 0) {
          throw new CommandError("Invalid RegEx: " + e.message.slice(27));
        } else {
          throw e;
        }
      }
      return editor.transact(function() {
        var line, _i, _ref, _ref1, _results;
        _results = [];
        for (line = _i = _ref = range[0], _ref1 = range[1]; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; line = _ref <= _ref1 ? ++_i : --_i) {
          _results.push(editor.scanInBufferRange(patternRE, [[line, 0], [line + 1, 0]], function(_arg1) {
            var match, replace;
            match = _arg1.match, replace = _arg1.replace;
            return replace(replaceGroups(match.slice(0), substition));
          }));
        }
        return _results;
      });
    };

    Ex.prototype.s = function(args) {
      return this.substitute(args);
    };

    Ex.prototype.vsplit = function(_arg) {
      var args, file, filePaths, newPane, pane, range, _i, _len, _results;
      range = _arg.range, args = _arg.args;
      args = args.trim();
      filePaths = args.split(' ');
      if (filePaths.length === 1 && filePaths[0] === '') {
        filePaths = void 0;
      }
      pane = atom.workspace.getActivePane();
      if ((filePaths != null) && filePaths.length > 0) {
        newPane = pane.splitLeft();
        _results = [];
        for (_i = 0, _len = filePaths.length; _i < _len; _i++) {
          file = filePaths[_i];
          _results.push((function() {
            return atom.workspace.openURIInPane(file, newPane);
          })());
        }
        return _results;
      } else {
        return pane.splitLeft({
          copyActiveItem: true
        });
      }
    };

    Ex.prototype.vsp = function(args) {
      return this.vsplit(args);
    };

    Ex.prototype["delete"] = function(_arg) {
      var range;
      range = _arg.range;
      range = [[range[0], 0], [range[1] + 1, 0]];
      return atom.workspace.getActiveTextEditor().buffer.setTextInRange(range, '');
    };

    Ex.prototype.set = function(_arg) {
      var args, option, options, range, _i, _len, _results;
      range = _arg.range, args = _arg.args;
      args = args.trim();
      if (args === "") {
        throw new CommandError("No option specified");
      }
      options = args.split(' ');
      _results = [];
      for (_i = 0, _len = options.length; _i < _len; _i++) {
        option = options[_i];
        _results.push((function() {
          var nameValPair, optionName, optionProcessor, optionValue;
          if (option.includes("=")) {
            nameValPair = option.split("=");
            if (nameValPair.length !== 2) {
              throw new CommandError("Wrong option format. [name]=[value] format is expected");
            }
            optionName = nameValPair[0];
            optionValue = nameValPair[1];
            optionProcessor = VimOption.singleton()[optionName];
            if (optionProcessor == null) {
              throw new CommandError("No such option: " + optionName);
            }
            return optionProcessor(optionValue);
          } else {
            optionProcessor = VimOption.singleton()[option];
            if (optionProcessor == null) {
              throw new CommandError("No such option: " + option);
            }
            return optionProcessor();
          }
        })());
      }
      return _results;
    };

    return Ex;

  })();

  module.exports = Ex;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL21hcmNvc2xhbXVyaWEvLmF0b20vcGFja2FnZXMvZXgtbW9kZS9saWIvZXguY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9HQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQURmLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FGTCxDQUFBOztBQUFBLEVBR0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSLENBSFosQ0FBQTs7QUFBQSxFQUlBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FKSixDQUFBOztBQUFBLEVBTUEsT0FBQSxHQUFVLFNBQUMsSUFBRCxHQUFBO0FBQ1IsUUFBQSwyQ0FBQTtBQUFBLElBQUEsUUFBQSxHQUFXLE9BQU8sQ0FBQyxLQUFSLENBQUEsQ0FBWCxDQUFBO0FBRUE7QUFDRSxNQUFBLElBQUEsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLFFBQVEsQ0FBQyxPQUFULENBQUEsQ0FEQSxDQURGO0tBQUEsY0FBQTtBQUlFLE1BREksY0FDSixDQUFBO0FBQUEsTUFBQSxJQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBZCxDQUF1QixnQkFBdkIsQ0FBSDtBQUNFLFFBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFuQixDQUErQix1QkFBQSxHQUF1QixLQUFLLENBQUMsT0FBNUQsQ0FBQSxDQURGO09BQUEsTUFFSyxJQUFHLGtCQUFIO0FBQ0gsUUFBQSxJQUFHLEtBQUssQ0FBQyxJQUFOLEtBQWMsUUFBakI7QUFDRSxVQUFBLElBQUksQ0FBQyxhQUNILENBQUMsVUFESCxDQUNlLDBDQUFBLEdBQTBDLEtBQUssQ0FBQyxJ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

//# sourceURL=/Users/marcoslamuria/.atom/packages/ex-mode/lib/ex.coffee
