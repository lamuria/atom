Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.enableHoverEvents = enableHoverEvents;
exports.disableHoverEvents = disableHoverEvents;
exports.isHoverEventsEnabled = isHoverEventsEnabled;
exports.disableHoverEventsDuringMouseDown = disableHoverEventsDuringMouseDown;
exports.disableHoverEventsUntilBlur = disableHoverEventsUntilBlur;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atom = require('atom');

var _mainJs = require('./main.js');

var _autohideTreeViewJs = require('./autohide-tree-view.js');

var _configJs = require('./config.js');

var _configJs2 = _interopRequireDefault(_configJs);

var _utilsJs = require('./utils.js');

'use babel';

var disposables;

function enableHoverEvents() {
  if (disposables) return;
  disposables = new _atom.CompositeDisposable((0, _utilsJs.domListener)(_autohideTreeViewJs.eventTriggerArea, 'mouseenter', function () {
    return (0, _autohideTreeViewJs.showTreeView)(_configJs2['default'].showDelay, false);
  }), (0, _utilsJs.domListener)(_mainJs.treeViewEl, 'mouseleave', function () {
    return (0, _autohideTreeViewJs.hideTreeView)(_configJs2['default'].hideDelay);
  }), (0, _utilsJs.domListener)(_mainJs.treeViewEl.querySelector('.tree-view-resize-handle'), 'mousedown', function (event) {
    if (event.button == 0) disableHoverEventsDuringMouseDown();
  }), (0, _utilsJs.domListener)(document.body, 'mousedown', function (event) {
    if (event.button == 0) disableHoverEventsDuringMouseDown();
  }, { delegationTarget: 'atom-text-editor' }));
}

function disableHoverEvents() {
  if (!disposables) return;
  disposables.dispose();
  disposables = null;
}

function isHoverEventsEnabled() {
  return !!disposables;
}

function disableHoverEventsDuringMouseDown() {
  if (!disposables) return;
  disableHoverEvents();
  (0, _utilsJs.domListener)(document.body, 'mouseup', function () {
    enableHoverEvents();
  }, { once: true });
}

function disableHoverEventsUntilBlur() {
  if (!disposables) return;
  disableHoverEvents();
  (0, _utilsJs.domListener)(_mainJs.treeView.list[0], 'blur', function () {
    (0, _autohideTreeViewJs.clearFocusedElement)();
    enableHoverEvents();
    (0, _autohideTreeViewJs.hideTreeView)();
  }, { once: true });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXJjb3NsYW11cmlhLy5hdG9tL3BhY2thZ2VzL2F1dG9oaWRlLXRyZWUtdmlldy9saWIvaG92ZXItZXZlbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O29CQUNrQyxNQUFNOztzQkFDTCxXQUFXOztrQ0FFbEIseUJBQXlCOzt3QkFDbEMsYUFBYTs7Ozt1QkFDTixZQUFZOztBQU50QyxXQUFXLENBQUM7O0FBUVosSUFBSSxXQUFXLENBQUM7O0FBRVQsU0FBUyxpQkFBaUIsR0FBRztBQUNsQyxNQUFHLFdBQVcsRUFBRSxPQUFPO0FBQ3ZCLGFBQVcsR0FBRyw4QkFDWixnRUFBOEIsWUFBWSxFQUFFO1dBQzFDLHNDQUFhLHNCQUFPLFNBQVMsRUFBRSxLQUFLLENBQUM7R0FBQSxDQUN0QyxFQUVELDhDQUF3QixZQUFZLEVBQUU7V0FDcEMsc0NBQWEsc0JBQU8sU0FBUyxDQUFDO0dBQUEsQ0FDL0IsRUFFRCwwQkFBWSxtQkFBVyxhQUFhLENBQUMsMEJBQTBCLENBQUMsRUFBRSxXQUFXLEVBQUUsVUFBQSxLQUFLLEVBQUk7QUFDdEYsUUFBRyxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRSxpQ0FBaUMsRUFBRSxDQUFDO0dBQzNELENBQUMsRUFFRiwwQkFBWSxRQUFRLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxVQUFBLEtBQUssRUFBSTtBQUMvQyxRQUFHLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFLGlDQUFpQyxFQUFFLENBQUM7R0FDM0QsRUFBRSxFQUFDLGdCQUFnQixFQUFFLGtCQUFrQixFQUFDLENBQUMsQ0FDM0MsQ0FBQztDQUNIOztBQUVNLFNBQVMsa0JBQWtCLEdBQUc7QUFDbkMsTUFBRyxDQUFDLFdBQVcsRUFBRSxPQUFPO0FBQ3hCLGFBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN0QixhQUFXLEdBQUcsSUFBSSxDQUFDO0NBQ3BCOztBQUVNLFNBQVMsb0JBQW9CLEdBQUc7QUFDckMsU0FBTyxDQUFDLENBQUMsV0FBVyxDQUFDO0NBQ3RCOztBQUVNLFNBQVMsaUNBQWlDLEdBQUc7QUFDbEQsTUFBRyxDQUFDLFdBQVcsRUFBRSxPQUFPO0FBQ3hCLG9CQUFrQixFQUFFLENBQUM7QUFDckIsNEJBQVksUUFBUSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsWUFBTTtBQUMxQyxxQkFBaUIsRUFBRSxDQUFDO0dBQ3JCLEVBQUUsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztDQUNsQjs7QUFFTSxTQUFTLDJCQUEyQixHQUFHO0FBQzVDLE1BQUcsQ0FBQyxXQUFXLEVBQUUsT0FBTztBQUN4QixvQkFBa0IsRUFBRSxDQUFDO0FBQ3JCLDRCQUFZLGlCQUFTLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsWUFBTTtBQUMxQyxrREFBcUIsQ0FBQztBQUN0QixxQkFBaUIsRUFBRSxDQUFDO0FBQ3BCLDJDQUFjLENBQUM7R0FDaEIsRUFBRSxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0NBQ2xCIiwiZmlsZSI6Ii9Vc2Vycy9tYXJjb3NsYW11cmlhLy5hdG9tL3BhY2thZ2VzL2F1dG9oaWRlLXRyZWUtdmlldy9saWIvaG92ZXItZXZlbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHt0cmVlVmlldywgdHJlZVZpZXdFbH0gZnJvbSAnLi9tYWluLmpzJztcbmltcG9ydCB7c2hvd1RyZWVWaWV3LCBoaWRlVHJlZVZpZXcsIGV2ZW50VHJpZ2dlckFyZWEsXG4gIGNsZWFyRm9jdXNlZEVsZW1lbnR9IGZyb20gJy4vYXV0b2hpZGUtdHJlZS12aWV3LmpzJztcbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcuanMnO1xuaW1wb3J0IHtkb21MaXN0ZW5lcn0gZnJvbSAnLi91dGlscy5qcyc7XG5cbnZhciBkaXNwb3NhYmxlcztcblxuZXhwb3J0IGZ1bmN0aW9uIGVuYWJsZUhvdmVyRXZlbnRzKCkge1xuICBpZihkaXNwb3NhYmxlcykgcmV0dXJuO1xuICBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgIGRvbUxpc3RlbmVyKGV2ZW50VHJpZ2dlckFyZWEsICdtb3VzZWVudGVyJywgKCkgPT5cbiAgICAgIHNob3dUcmVlVmlldyhjb25maWcuc2hvd0RlbGF5LCBmYWxzZSlcbiAgICApLFxuXG4gICAgZG9tTGlzdGVuZXIodHJlZVZpZXdFbCwgJ21vdXNlbGVhdmUnLCAoKSA9PlxuICAgICAgaGlkZVRyZWVWaWV3KGNvbmZpZy5oaWRlRGVsYXkpXG4gICAgKSxcblxuICAgIGRvbUxpc3RlbmVyKHRyZWVWaWV3RWwucXVlcnlTZWxlY3RvcignLnRyZWUtdmlldy1yZXNpemUtaGFuZGxlJyksICdtb3VzZWRvd24nLCBldmVudCA9PiB7XG4gICAgICBpZihldmVudC5idXR0b24gPT0gMCkgZGlzYWJsZUhvdmVyRXZlbnRzRHVyaW5nTW91c2VEb3duKCk7XG4gICAgfSksXG5cbiAgICBkb21MaXN0ZW5lcihkb2N1bWVudC5ib2R5LCAnbW91c2Vkb3duJywgZXZlbnQgPT4ge1xuICAgICAgaWYoZXZlbnQuYnV0dG9uID09IDApIGRpc2FibGVIb3ZlckV2ZW50c0R1cmluZ01vdXNlRG93bigpO1xuICAgIH0sIHtkZWxlZ2F0aW9uVGFyZ2V0OiAnYXRvbS10ZXh0LWVkaXRvcid9KSxcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpc2FibGVIb3ZlckV2ZW50cygpIHtcbiAgaWYoIWRpc3Bvc2FibGVzKSByZXR1cm47XG4gIGRpc3Bvc2FibGVzLmRpc3Bvc2UoKTtcbiAgZGlzcG9zYWJsZXMgPSBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNIb3ZlckV2ZW50c0VuYWJsZWQoKSB7XG4gIHJldHVybiAhIWRpc3Bvc2FibGVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGlzYWJsZUhvdmVyRXZlbnRzRHVyaW5nTW91c2VEb3duKCkge1xuICBpZighZGlzcG9zYWJsZXMpIHJldHVybjtcbiAgZGlzYWJsZUhvdmVyRXZlbnRzKCk7XG4gIGRvbUxpc3RlbmVyKGRvY3VtZW50LmJvZHksICdtb3VzZXVwJywgKCkgPT4ge1xuICAgIGVuYWJsZUhvdmVyRXZlbnRzKCk7XG4gIH0sIHtvbmNlOiB0cnVlfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkaXNhYmxlSG92ZXJFdmVudHNVbnRpbEJsdXIoKSB7XG4gIGlmKCFkaXNwb3NhYmxlcykgcmV0dXJuO1xuICBkaXNhYmxlSG92ZXJFdmVudHMoKTtcbiAgZG9tTGlzdGVuZXIodHJlZVZpZXcubGlzdFswXSwgJ2JsdXInLCAoKSA9PiB7XG4gICAgY2xlYXJGb2N1c2VkRWxlbWVudCgpO1xuICAgIGVuYWJsZUhvdmVyRXZlbnRzKCk7XG4gICAgaGlkZVRyZWVWaWV3KCk7XG4gIH0sIHtvbmNlOiB0cnVlfSk7XG59XG4iXX0=
//# sourceURL=/Users/marcoslamuria/.atom/packages/autohide-tree-view/lib/hover-events.js
