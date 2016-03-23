Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.domListener = domListener;
exports.isChildOf = isChildOf;
exports.getContentWidth = getContentWidth;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

require('array.from');

var _atom = require('atom');

var _mainJs = require('./main.js');

var _configJs = require('./config.js');

var _configJs2 = _interopRequireDefault(_configJs);

'use babel';

function domListener(el, type, cb) {
  var _ref = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

  var useCapture = _ref.useCapture;
  var delegationTarget = _ref.delegationTarget;
  var once = _ref.once;

  if (!(el instanceof EventTarget)) throw new TypeError('Failed to create DOMEventListener: parameter 1 is not of type EventTarget');

  function wrapper(event) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (delegationTarget) {
      target = event.target.closest(delegationTarget);
      if (el.contains(target)) cb.apply(target, [event].concat(args));
    } else {
      cb.apply(el, [event].concat(args));
    }
  }

  function onceWrapper() {
    disposable.dispose();
    wrapper.apply(null, Array.from(arguments));
  }

  var actualWrapper = once ? onceWrapper : wrapper;

  el.addEventListener(type, actualWrapper, useCapture);
  var disposable = new _atom.Disposable(function () {
    return el.removeEventListener(type, actualWrapper, useCapture);
  });

  return disposable;
}

// check if parent contains child, parent can be Node or string

function isChildOf(child, parent) {
  if (parent instanceof HTMLElement) return parent.contains(child);

  while (child.parentNode != document && child.parentNode != null) {
    if (child.parentNode.matches(parent)) return true;
    child = child.parentNode;
  }
  return false;
}

// returns the width of the .list-tree

function getContentWidth() {
  var listTrees = Array.from(_mainJs.treeViewEl.querySelectorAll('.list-tree'));
  var maxListWidth = Math.max.apply(Math, _toConsumableArray(listTrees.map(function (listTree) {
    return listTree.clientWidth;
  })));
  // only apply maxWidth if it's greater than 0
  return Math.min(Math.max(maxListWidth, _configJs2['default'].minWidth), _configJs2['default'].maxWidth || Infinity);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXJjb3NsYW11cmlhLy5hdG9tL3BhY2thZ2VzL2F1dG9oaWRlLXRyZWUtdmlldy9saWIvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7UUFDTyxZQUFZOztvQkFDTSxNQUFNOztzQkFDTixXQUFXOzt3QkFDakIsYUFBYTs7OztBQUpoQyxXQUFXLENBQUM7O0FBTUwsU0FBUyxXQUFXLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQTZDO21FQUFKLEVBQUU7O01BQXhDLFVBQVUsUUFBVixVQUFVO01BQUUsZ0JBQWdCLFFBQWhCLGdCQUFnQjtNQUFFLElBQUksUUFBSixJQUFJOztBQUMzRSxNQUFHLEVBQUUsRUFBRSxZQUFZLFdBQVcsQ0FBQSxBQUFDLEVBQzdCLE1BQU0sSUFBSSxTQUFTLENBQUMsMkVBQTJFLENBQUMsQ0FBQzs7QUFFbkcsV0FBUyxPQUFPLENBQUMsS0FBSyxFQUFXO3NDQUFOLElBQUk7QUFBSixVQUFJOzs7QUFDN0IsUUFBRyxnQkFBZ0IsRUFBRTtBQUNuQixZQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUNoRCxVQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQ3BCLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7S0FDMUMsTUFBTTtBQUNMLFFBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7S0FDcEM7R0FDRjs7QUFFRCxXQUFTLFdBQVcsR0FBRztBQUNyQixjQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDckIsV0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0dBQzVDOztBQUVELE1BQUksYUFBYSxHQUFHLElBQUksR0FBRyxXQUFXLEdBQUcsT0FBTyxDQUFDOztBQUVqRCxJQUFFLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNyRCxNQUFJLFVBQVUsR0FBRyxxQkFBZTtXQUM5QixFQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxVQUFVLENBQUM7R0FBQSxDQUN4RCxDQUFDOztBQUVGLFNBQU8sVUFBVSxDQUFDO0NBQ25COzs7O0FBR00sU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtBQUN2QyxNQUFHLE1BQU0sWUFBWSxXQUFXLEVBQzlCLE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFaEMsU0FBTSxLQUFLLENBQUMsVUFBVSxJQUFJLFFBQVEsSUFBSSxLQUFLLENBQUMsVUFBVSxJQUFJLElBQUksRUFBRTtBQUM5RCxRQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUNqQyxPQUFPLElBQUksQ0FBQztBQUNkLFNBQUssR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO0dBQzFCO0FBQ0QsU0FBTyxLQUFLLENBQUM7Q0FDZDs7OztBQUdNLFNBQVMsZUFBZSxHQUFHO0FBQ2hDLE1BQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsbUJBQVcsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztBQUN0RSxNQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxNQUFBLENBQVIsSUFBSSxxQkFBUSxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQUEsUUFBUTtXQUFJLFFBQVEsQ0FBQyxXQUFXO0dBQUEsQ0FBQyxFQUFDLENBQUM7O0FBRWhGLFNBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxzQkFBTyxRQUFRLENBQUMsRUFBRSxzQkFBTyxRQUFRLElBQUksUUFBUSxDQUFDLENBQUM7Q0FDdkYiLCJmaWxlIjoiL1VzZXJzL21hcmNvc2xhbXVyaWEvLmF0b20vcGFja2FnZXMvYXV0b2hpZGUtdHJlZS12aWV3L2xpYi91dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuaW1wb3J0ICdhcnJheS5mcm9tJztcbmltcG9ydCB7RGlzcG9zYWJsZX0gZnJvbSAnYXRvbSc7XG5pbXBvcnQge3RyZWVWaWV3RWx9IGZyb20gJy4vbWFpbi5qcyc7XG5pbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnLmpzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGRvbUxpc3RlbmVyKGVsLCB0eXBlLCBjYiwge3VzZUNhcHR1cmUsIGRlbGVnYXRpb25UYXJnZXQsIG9uY2V9ID0ge30pIHtcbiAgaWYoIShlbCBpbnN0YW5jZW9mIEV2ZW50VGFyZ2V0KSlcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIERPTUV2ZW50TGlzdGVuZXI6IHBhcmFtZXRlciAxIGlzIG5vdCBvZiB0eXBlIEV2ZW50VGFyZ2V0Jyk7XG5cbiAgZnVuY3Rpb24gd3JhcHBlcihldmVudCwgLi4uYXJncykge1xuICAgIGlmKGRlbGVnYXRpb25UYXJnZXQpIHtcbiAgICAgIHRhcmdldCA9IGV2ZW50LnRhcmdldC5jbG9zZXN0KGRlbGVnYXRpb25UYXJnZXQpO1xuICAgICAgaWYoZWwuY29udGFpbnModGFyZ2V0KSlcbiAgICAgICAgY2IuYXBwbHkodGFyZ2V0LCBbZXZlbnRdLmNvbmNhdChhcmdzKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNiLmFwcGx5KGVsLCBbZXZlbnRdLmNvbmNhdChhcmdzKSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25jZVdyYXBwZXIoKSB7XG4gICAgZGlzcG9zYWJsZS5kaXNwb3NlKCk7XG4gICAgd3JhcHBlci5hcHBseShudWxsLCBBcnJheS5mcm9tKGFyZ3VtZW50cykpO1xuICB9XG5cbiAgdmFyIGFjdHVhbFdyYXBwZXIgPSBvbmNlID8gb25jZVdyYXBwZXIgOiB3cmFwcGVyO1xuXG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgYWN0dWFsV3JhcHBlciwgdXNlQ2FwdHVyZSk7XG4gIHZhciBkaXNwb3NhYmxlID0gbmV3IERpc3Bvc2FibGUoKCkgPT5cbiAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGFjdHVhbFdyYXBwZXIsIHVzZUNhcHR1cmUpXG4gICk7XG5cbiAgcmV0dXJuIGRpc3Bvc2FibGU7XG59XG5cbi8vIGNoZWNrIGlmIHBhcmVudCBjb250YWlucyBjaGlsZCwgcGFyZW50IGNhbiBiZSBOb2RlIG9yIHN0cmluZ1xuZXhwb3J0IGZ1bmN0aW9uIGlzQ2hpbGRPZihjaGlsZCwgcGFyZW50KSB7XG4gIGlmKHBhcmVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuICAgIHJldHVybiBwYXJlbnQuY29udGFpbnMoY2hpbGQpO1xuXG4gIHdoaWxlKGNoaWxkLnBhcmVudE5vZGUgIT0gZG9jdW1lbnQgJiYgY2hpbGQucGFyZW50Tm9kZSAhPSBudWxsKSB7XG4gICAgaWYoY2hpbGQucGFyZW50Tm9kZS5tYXRjaGVzKHBhcmVudCkpXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBjaGlsZCA9IGNoaWxkLnBhcmVudE5vZGU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vLyByZXR1cm5zIHRoZSB3aWR0aCBvZiB0aGUgLmxpc3QtdHJlZVxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnRlbnRXaWR0aCgpIHtcbiAgdmFyIGxpc3RUcmVlcyA9IEFycmF5LmZyb20odHJlZVZpZXdFbC5xdWVyeVNlbGVjdG9yQWxsKCcubGlzdC10cmVlJykpO1xuICB2YXIgbWF4TGlzdFdpZHRoID0gTWF0aC5tYXgoLi4ubGlzdFRyZWVzLm1hcChsaXN0VHJlZSA9PiBsaXN0VHJlZS5jbGllbnRXaWR0aCkpO1xuICAvLyBvbmx5IGFwcGx5IG1heFdpZHRoIGlmIGl0J3MgZ3JlYXRlciB0aGFuIDBcbiAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KG1heExpc3RXaWR0aCwgY29uZmlnLm1pbldpZHRoKSwgY29uZmlnLm1heFdpZHRoIHx8IEluZmluaXR5KTtcbn1cbiJdfQ==
//# sourceURL=/Users/marcoslamuria/.atom/packages/autohide-tree-view/lib/utils.js
