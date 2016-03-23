Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports.activate = activate;
exports.deactivate = deactivate;

function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj['default']; return newObj; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _justDebounce = require('just-debounce');

var _justDebounce2 = _interopRequireDefault(_justDebounce);

var _atom = require('atom');

var _autohideTreeViewJs = require('./autohide-tree-view.js');

var _pinViewJs = require('./pin-view.js');

var _pinViewJs2 = _interopRequireDefault(_pinViewJs);

var _configJs = require('./config.js');

var _configJs2 = _interopRequireDefault(_configJs);

var _utilsJs = require('./utils.js');

'use babel';
Object.defineProperty(exports, 'config', {
  enumerable: true,
  get: function get() {
    return _configJs.schema;
  }
});

var _serviceProviderJs = require('./service-provider.js');

_defaults(exports, _interopExportWildcard(_serviceProviderJs, _defaults));

var _touchEventsJs = require('./touch-events.js');

Object.defineProperty(exports, 'consumeTouchEvents', {
  enumerable: true,
  get: function get() {
    return _touchEventsJs.consumeTouchEvents;
  }
});
var treeView;
exports.treeView = treeView;
var treeViewEl;

exports.treeViewEl = treeViewEl;
var disposables;

function activate() {
  if (!atom.packages.isPackageLoaded('tree-view')) return atom.notifications.addError('autohide-tree-view: Could not activate because the tree-view package doesn\'t seem to be loaded');

  atom.packages.activatePackage('tree-view').then(function (pkg) {
    exports.treeView = treeView = pkg.mainModule.createView();
    exports.treeViewEl = treeViewEl = atom.views.getView(treeView);

    disposables = new _atom.CompositeDisposable(atom.workspace.onDidDestroyPaneItem(updateActivationState), atom.workspace.observePaneItems(updateActivationState), atom.config.observe('autohide-tree-view.maxWindowWidth', updateActivationState), (0, _utilsJs.domListener)(window, 'resize', (0, _justDebounce2['default'])(updateActivationState, 200)));
  });
}

function deactivate() {
  stop();
  disposables.dispose();
  var _ref = null;

  var _ref2 = _slicedToArray(_ref, 3);

  disposables = _ref2[0];
  exports.treeView = treeView = _ref2[1];
  exports.treeViewEl = treeViewEl = _ref2[2];
}

// determine if autohide should be enabled based on the window
// width, number of files open and whether the tree view is pinned
function updateActivationState() {
  if (_pinViewJs2['default'].isActive()) return;
  var isWindowSmall = window.innerWidth < (_configJs2['default'].maxWindowWidth || Infinity);
  var hasOpenFiles = atom.workspace.getPaneItems().length > 0;
  isWindowSmall && hasOpenFiles ? start() : stop();
}

var commandsDisposable;

function start() {
  var _atom$commands$add;

  if (commandsDisposable) return;
  _pinViewJs2['default'].attach();
  commandsDisposable = new _atom.CompositeDisposable(atom.commands.add('atom-workspace', (_atom$commands$add = {}, _defineProperty(_atom$commands$add, 'autohide-tree-view:pin', function autohideTreeViewPin() {
    (0, _autohideTreeViewJs.disableAutohide)();
  }), _defineProperty(_atom$commands$add, 'autohide-tree-view:unpin', function autohideTreeViewUnpin() {
    (0, _autohideTreeViewJs.enableAutohide)();
  }), _defineProperty(_atom$commands$add, 'autohide-tree-view:toggle-pinned', function autohideTreeViewTogglePinned() {
    (0, _autohideTreeViewJs.toggleAutohide)();
  }), _defineProperty(_atom$commands$add, 'autohide-tree-view:toggle-push-editor', function autohideTreeViewTogglePushEditor() {
    atom.config.set('autohide-tree-view.pushEditor', !_configJs2['default'].pushEditor);
  }), _atom$commands$add)));
  (0, _autohideTreeViewJs.enableAutohide)();
}

function stop() {
  if (!commandsDisposable) return;
  _pinViewJs2['default'].detach();
  (0, _autohideTreeViewJs.disableAutohide)();
  commandsDisposable.dispose();
  commandsDisposable = null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXJjb3NsYW11cmlhLy5hdG9tL3BhY2thZ2VzL2F1dG9oaWRlLXRyZWUtdmlldy9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs0QkFDcUIsZUFBZTs7OztvQkFDRixNQUFNOztrQ0FDc0IseUJBQXlCOzt5QkFDbkUsZUFBZTs7Ozt3QkFDaEIsYUFBYTs7Ozt1QkFDTixZQUFZOztBQU50QyxXQUFXLENBQUM7Ozs7cUJBUUosTUFBTTs7OztpQ0FDQSx1QkFBdUI7Ozs7NkJBQ0osbUJBQW1COzs7OzswQkFBNUMsa0JBQWtCOzs7QUFFbkIsSUFBSSxRQUFRLENBQUM7O0FBQ2IsSUFBSSxVQUFVLENBQUM7OztBQUV0QixJQUFJLFdBQVcsQ0FBQzs7QUFFVCxTQUFTLFFBQVEsR0FBRztBQUN6QixNQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLEVBQzVDLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsaUdBQWlHLENBQUMsQ0FBQzs7QUFFeEksTUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsR0FBRyxFQUFLO0FBQ3ZELFlBVk8sUUFBUSxHQVVmLFFBQVEsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ3ZDLFlBVk8sVUFBVSxHQVVqQixVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRTFDLGVBQVcsR0FBRyw4QkFDWixJQUFJLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLHFCQUFxQixDQUFDLEVBQzFELElBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMscUJBQXFCLENBQUMsRUFDdEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsbUNBQW1DLEVBQUUscUJBQXFCLENBQUMsRUFDL0UsMEJBQVksTUFBTSxFQUFFLFFBQVEsRUFBRSwrQkFBUyxxQkFBcUIsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUNwRSxDQUFDO0dBQ0gsQ0FBQyxDQUFDO0NBQ0o7O0FBRU0sU0FBUyxVQUFVLEdBQUc7QUFDM0IsTUFBSSxFQUFFLENBQUM7QUFDUCxhQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDZ0IsSUFBSTs7OztBQUF6QyxhQUFXO1VBekJILFFBQVEsR0F5QkgsUUFBUTtVQXhCYixVQUFVLEdBd0JLLFVBQVU7Q0FDbkM7Ozs7QUFJRCxTQUFTLHFCQUFxQixHQUFHO0FBQy9CLE1BQUcsdUJBQVEsUUFBUSxFQUFFLEVBQUUsT0FBTztBQUM5QixNQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsVUFBVSxJQUFJLHNCQUFPLGNBQWMsSUFBSSxRQUFRLENBQUEsQUFBQyxDQUFDO0FBQzVFLE1BQUksWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUM1RCxlQUFhLElBQUksWUFBWSxHQUFHLEtBQUssRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDO0NBQ2xEOztBQUVELElBQUksa0JBQWtCLENBQUM7O0FBRXZCLFNBQVMsS0FBSyxHQUFHOzs7QUFDZixNQUFHLGtCQUFrQixFQUFFLE9BQU87QUFDOUIseUJBQVEsTUFBTSxFQUFFLENBQUM7QUFDakIsb0JBQWtCLEdBQUcsOEJBQ25CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixnRUFDL0Isd0JBQXdCLEVBQUMsK0JBQUc7QUFDM0IsOENBQWlCLENBQUM7R0FDbkIsdUNBQ0EsMEJBQTBCLEVBQUMsaUNBQUc7QUFDN0IsNkNBQWdCLENBQUM7R0FDbEIsdUNBQ0Esa0NBQWtDLEVBQUMsd0NBQUc7QUFDckMsNkNBQWdCLENBQUM7R0FDbEIsdUNBQ0EsdUNBQXVDLEVBQUMsNENBQUc7QUFDMUMsUUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsK0JBQStCLEVBQUUsQ0FBQyxzQkFBTyxVQUFVLENBQUMsQ0FBQztHQUN0RSx1QkFDRCxDQUNILENBQUM7QUFDRiwyQ0FBZ0IsQ0FBQztDQUNsQjs7QUFFRCxTQUFTLElBQUksR0FBRztBQUNkLE1BQUcsQ0FBQyxrQkFBa0IsRUFBRSxPQUFPO0FBQy9CLHlCQUFRLE1BQU0sRUFBRSxDQUFDO0FBQ2pCLDRDQUFpQixDQUFDO0FBQ2xCLG9CQUFrQixDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzdCLG9CQUFrQixHQUFHLElBQUksQ0FBQztDQUMzQiIsImZpbGUiOiIvVXNlcnMvbWFyY29zbGFtdXJpYS8uYXRvbS9wYWNrYWdlcy9hdXRvaGlkZS10cmVlLXZpZXcvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcbmltcG9ydCBkZWJvdW5jZSBmcm9tICdqdXN0LWRlYm91bmNlJztcbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSc7XG5pbXBvcnQge2VuYWJsZUF1dG9oaWRlLCBkaXNhYmxlQXV0b2hpZGUsIHRvZ2dsZUF1dG9oaWRlfSBmcm9tICcuL2F1dG9oaWRlLXRyZWUtdmlldy5qcyc7XG5pbXBvcnQgcGluVmlldyBmcm9tICcuL3Bpbi12aWV3LmpzJztcbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcuanMnO1xuaW1wb3J0IHtkb21MaXN0ZW5lcn0gZnJvbSAnLi91dGlscy5qcyc7XG5cbmV4cG9ydCB7c2NoZW1hIGFzIGNvbmZpZ30gZnJvbSAnLi9jb25maWcuanMnO1xuZXhwb3J0ICogZnJvbSAnLi9zZXJ2aWNlLXByb3ZpZGVyLmpzJztcbmV4cG9ydCB7Y29uc3VtZVRvdWNoRXZlbnRzfSBmcm9tICcuL3RvdWNoLWV2ZW50cy5qcyc7XG5cbmV4cG9ydCB2YXIgdHJlZVZpZXc7XG5leHBvcnQgdmFyIHRyZWVWaWV3RWw7XG5cbnZhciBkaXNwb3NhYmxlcztcblxuZXhwb3J0IGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICBpZighYXRvbS5wYWNrYWdlcy5pc1BhY2thZ2VMb2FkZWQoJ3RyZWUtdmlldycpKVxuICAgIHJldHVybiBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ2F1dG9oaWRlLXRyZWUtdmlldzogQ291bGQgbm90IGFjdGl2YXRlIGJlY2F1c2UgdGhlIHRyZWUtdmlldyBwYWNrYWdlIGRvZXNuXFwndCBzZWVtIHRvIGJlIGxvYWRlZCcpO1xuXG4gIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCd0cmVlLXZpZXcnKS50aGVuKChwa2cpID0+IHtcbiAgICB0cmVlVmlldyA9IHBrZy5tYWluTW9kdWxlLmNyZWF0ZVZpZXcoKTtcbiAgICB0cmVlVmlld0VsID0gYXRvbS52aWV3cy5nZXRWaWV3KHRyZWVWaWV3KTtcblxuICAgIGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoXG4gICAgICBhdG9tLndvcmtzcGFjZS5vbkRpZERlc3Ryb3lQYW5lSXRlbSh1cGRhdGVBY3RpdmF0aW9uU3RhdGUpLFxuICAgICAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVBhbmVJdGVtcyh1cGRhdGVBY3RpdmF0aW9uU3RhdGUpLFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnYXV0b2hpZGUtdHJlZS12aWV3Lm1heFdpbmRvd1dpZHRoJywgdXBkYXRlQWN0aXZhdGlvblN0YXRlKSxcbiAgICAgIGRvbUxpc3RlbmVyKHdpbmRvdywgJ3Jlc2l6ZScsIGRlYm91bmNlKHVwZGF0ZUFjdGl2YXRpb25TdGF0ZSwgMjAwKSksXG4gICAgKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWFjdGl2YXRlKCkge1xuICBzdG9wKCk7XG4gIGRpc3Bvc2FibGVzLmRpc3Bvc2UoKTtcbiAgW2Rpc3Bvc2FibGVzLCB0cmVlVmlldywgdHJlZVZpZXdFbF0gPSBudWxsO1xufVxuXG4vLyBkZXRlcm1pbmUgaWYgYXV0b2hpZGUgc2hvdWxkIGJlIGVuYWJsZWQgYmFzZWQgb24gdGhlIHdpbmRvd1xuLy8gd2lkdGgsIG51bWJlciBvZiBmaWxlcyBvcGVuIGFuZCB3aGV0aGVyIHRoZSB0cmVlIHZpZXcgaXMgcGlubmVkXG5mdW5jdGlvbiB1cGRhdGVBY3RpdmF0aW9uU3RhdGUoKSB7XG4gIGlmKHBpblZpZXcuaXNBY3RpdmUoKSkgcmV0dXJuO1xuICB2YXIgaXNXaW5kb3dTbWFsbCA9IHdpbmRvdy5pbm5lcldpZHRoIDwgKGNvbmZpZy5tYXhXaW5kb3dXaWR0aCB8fCBJbmZpbml0eSk7XG4gIHZhciBoYXNPcGVuRmlsZXMgPSBhdG9tLndvcmtzcGFjZS5nZXRQYW5lSXRlbXMoKS5sZW5ndGggPiAwO1xuICBpc1dpbmRvd1NtYWxsICYmIGhhc09wZW5GaWxlcyA/IHN0YXJ0KCkgOiBzdG9wKCk7XG59XG5cbnZhciBjb21tYW5kc0Rpc3Bvc2FibGU7XG5cbmZ1bmN0aW9uIHN0YXJ0KCkge1xuICBpZihjb21tYW5kc0Rpc3Bvc2FibGUpIHJldHVybjtcbiAgcGluVmlldy5hdHRhY2goKTtcbiAgY29tbWFuZHNEaXNwb3NhYmxlID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoXG4gICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgWydhdXRvaGlkZS10cmVlLXZpZXc6cGluJ10oKSB7XG4gICAgICAgIGRpc2FibGVBdXRvaGlkZSgpO1xuICAgICAgfSxcbiAgICAgIFsnYXV0b2hpZGUtdHJlZS12aWV3OnVucGluJ10oKSB7XG4gICAgICAgIGVuYWJsZUF1dG9oaWRlKCk7XG4gICAgICB9LFxuICAgICAgWydhdXRvaGlkZS10cmVlLXZpZXc6dG9nZ2xlLXBpbm5lZCddKCkge1xuICAgICAgICB0b2dnbGVBdXRvaGlkZSgpO1xuICAgICAgfSxcbiAgICAgIFsnYXV0b2hpZGUtdHJlZS12aWV3OnRvZ2dsZS1wdXNoLWVkaXRvciddKCkge1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2F1dG9oaWRlLXRyZWUtdmlldy5wdXNoRWRpdG9yJywgIWNvbmZpZy5wdXNoRWRpdG9yKTtcbiAgICAgIH0sXG4gICAgfSksXG4gICk7XG4gIGVuYWJsZUF1dG9oaWRlKCk7XG59XG5cbmZ1bmN0aW9uIHN0b3AoKSB7XG4gIGlmKCFjb21tYW5kc0Rpc3Bvc2FibGUpIHJldHVybjtcbiAgcGluVmlldy5kZXRhY2goKTtcbiAgZGlzYWJsZUF1dG9oaWRlKCk7XG4gIGNvbW1hbmRzRGlzcG9zYWJsZS5kaXNwb3NlKCk7XG4gIGNvbW1hbmRzRGlzcG9zYWJsZSA9IG51bGw7XG59XG4iXX0=
//# sourceURL=/Users/marcoslamuria/.atom/packages/autohide-tree-view/lib/main.js
