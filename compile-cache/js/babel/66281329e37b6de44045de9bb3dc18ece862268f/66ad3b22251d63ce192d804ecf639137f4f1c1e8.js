Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports.consumeTouchEvents = consumeTouchEvents;
exports.enableTouchEvents = enableTouchEvents;
exports.disableTouchEvents = disableTouchEvents;
exports.isTouchEventsEnabled = isTouchEventsEnabled;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('array.from');

var _atom = require('atom');

var _mainJs = require('./main.js');

var _autohideTreeViewJs = require('./autohide-tree-view.js');

var _configJs = require('./config.js');

var _configJs2 = _interopRequireDefault(_configJs);

var _utilsJs = require('./utils.js');

'use babel';

var touchEvents;

function consumeTouchEvents(touchEventsService) {
  touchEvents = touchEventsService;
  if (_configJs2['default'].showOn.match('touch')) enableTouchEvents();
}

var disposables;

function enableTouchEvents() {
  if (!touchEvents) return atom.notifications.addWarning('autohide-tree-view: atom-touch-events is not loaded, but it is required for touch events to work');

  if (disposables) return;
  disposables = new _atom.CompositeDisposable(touchEvents.onDidTouchSwipeLeft(swipeChange, function () {
    return swipeEnd(false);
  }), touchEvents.onDidTouchSwipeRight(swipeChange, function () {
    return swipeEnd(true);
  }));
}

function disableTouchEvents() {
  if (!disposables) return;
  disposables.dispose();
  disposables = null;
}

function isTouchEventsEnabled() {
  return !!disposables;
}

var isSwiping = false;

function shouldInitSwipe(touches, source) {
  // no swipe if either autohide or touch events is disabled
  if (!isTouchEventsEnabled()) return false;

  var _Array$from = Array.from(touches);

  var _Array$from2 = _slicedToArray(_Array$from, 1);

  var pageX = _Array$from2[0].pageX;

  // if swipe target isn't the tree view, check if
  // swipe is in touchArea
  if (!(0, _utilsJs.isChildOf)(source, _mainJs.treeViewEl.parentNode)) {
    // no swipe if not in touch area
    var showOnRightSide = atom.config.get('tree-view.showOnRightSide');
    if (showOnRightSide && pageX < window.innerWidth - _configJs2['default'].touchAreaSize || !showOnRightSide && pageX > _configJs2['default'].touchAreaSize) return false;
  }
  return isSwiping = true;
}

// triggered while swiping the tree view
function swipeChange(_ref) {
  var touches = _ref.args.touches;
  var source = _ref.source;
  var deltaX = _ref.deltaX;

  // check if swipe should show the tree view
  if (!isSwiping && !shouldInitSwipe(touches, source)) return;
  if (atom.config.get('tree-view.showOnRightSide')) deltaX *= -1;
  requestAnimationFrame(function frame() {
    var newWidth = _mainJs.treeViewEl.clientWidth + deltaX;
    newWidth = Math.min((0, _utilsJs.getContentWidth)(), Math.max(_configJs2['default'].minWidth, newWidth));
    _mainJs.treeViewEl.style.width = newWidth + 'px';
  });
}

// triggered after swipe, completely opens/closes the tree view
// depending on the side of the tree view and swipe direction
function swipeEnd(toRight) {
  if (!isSwiping) return;
  isSwiping = false;
  atom.config.get('tree-view.showOnRightSide') != toRight ? (0, _autohideTreeViewJs.showTreeView)() : (0, _autohideTreeViewJs.hideTreeView)();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXJjb3NsYW11cmlhLy5hdG9tL3BhY2thZ2VzL2F1dG9oaWRlLXRyZWUtdmlldy9saWIvdG91Y2gtZXZlbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7UUFDTyxZQUFZOztvQkFDZSxNQUFNOztzQkFDZixXQUFXOztrQ0FDSyx5QkFBeUI7O3dCQUMvQyxhQUFhOzs7O3VCQUNTLFlBQVk7O0FBTnJELFdBQVcsQ0FBQzs7QUFRWixJQUFJLFdBQVcsQ0FBQzs7QUFFVCxTQUFTLGtCQUFrQixDQUFDLGtCQUFrQixFQUFFO0FBQ3JELGFBQVcsR0FBRyxrQkFBa0IsQ0FBQztBQUNqQyxNQUFHLHNCQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQztDQUN0RDs7QUFFRCxJQUFJLFdBQVcsQ0FBQzs7QUFFVCxTQUFTLGlCQUFpQixHQUFHO0FBQ2xDLE1BQUcsQ0FBQyxXQUFXLEVBQ2IsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxrR0FBa0csQ0FBQyxDQUFDOztBQUUzSSxNQUFHLFdBQVcsRUFBRSxPQUFPO0FBQ3ZCLGFBQVcsR0FBRyw4QkFDWixXQUFXLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFO1dBQU0sUUFBUSxDQUFDLEtBQUssQ0FBQztHQUFBLENBQUMsRUFDbkUsV0FBVyxDQUFDLG9CQUFvQixDQUFDLFdBQVcsRUFBRTtXQUFNLFFBQVEsQ0FBQyxJQUFJLENBQUM7R0FBQSxDQUFDLENBQ3BFLENBQUM7Q0FDSDs7QUFFTSxTQUFTLGtCQUFrQixHQUFHO0FBQ25DLE1BQUcsQ0FBQyxXQUFXLEVBQUUsT0FBTztBQUN4QixhQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDdEIsYUFBVyxHQUFHLElBQUksQ0FBQztDQUNwQjs7QUFFTSxTQUFTLG9CQUFvQixHQUFHO0FBQ3JDLFNBQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQztDQUN0Qjs7QUFFRCxJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUM7O0FBRXRCLFNBQVMsZUFBZSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUU7O0FBRXhDLE1BQUcsQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLE9BQU8sS0FBSyxDQUFDOztvQkFDekIsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7Ozs7TUFBN0IsS0FBSyxtQkFBTCxLQUFLOzs7O0FBR1gsTUFBRyxDQUFDLHdCQUFVLE1BQU0sRUFBRSxtQkFBVyxVQUFVLENBQUMsRUFBRTs7QUFFNUMsUUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUNuRSxRQUFHLGVBQWUsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLFVBQVUsR0FBRyxzQkFBTyxhQUFhLElBQ3BFLENBQUMsZUFBZSxJQUFJLEtBQUssR0FBRyxzQkFBTyxhQUFhLEVBQ2hELE9BQU8sS0FBSyxDQUFDO0dBQ2hCO0FBQ0QsU0FBTyxTQUFTLEdBQUcsSUFBSSxDQUFDO0NBQ3pCOzs7QUFHRCxTQUFTLFdBQVcsQ0FBQyxJQUFpQyxFQUFFO01BQTNCLE9BQU8sR0FBZixJQUFpQyxDQUFoQyxJQUFJLENBQUcsT0FBTztNQUFHLE1BQU0sR0FBeEIsSUFBaUMsQ0FBZixNQUFNO01BQUUsTUFBTSxHQUFoQyxJQUFpQyxDQUFQLE1BQU07OztBQUVuRCxNQUFHLENBQUMsU0FBUyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsRUFBRSxPQUFPO0FBQzNELE1BQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsRUFBRSxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDOUQsdUJBQXFCLENBQUMsU0FBUyxLQUFLLEdBQUc7QUFDckMsUUFBSSxRQUFRLEdBQUcsbUJBQVcsV0FBVyxHQUFHLE1BQU0sQ0FBQztBQUMvQyxZQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQywrQkFBaUIsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLHNCQUFPLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO0FBQzVFLHVCQUFXLEtBQUssQ0FBQyxLQUFLLEdBQU0sUUFBUSxPQUFJLENBQUM7R0FDMUMsQ0FBQyxDQUFDO0NBQ0o7Ozs7QUFJRCxTQUFTLFFBQVEsQ0FBQyxPQUFPLEVBQUU7QUFDekIsTUFBRyxDQUFDLFNBQVMsRUFBRSxPQUFPO0FBQ3RCLFdBQVMsR0FBRyxLQUFLLENBQUM7QUFDbEIsTUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsSUFBSSxPQUFPLEdBQUcsdUNBQWMsR0FBRyx1Q0FBYyxDQUFDO0NBQzNGIiwiZmlsZSI6Ii9Vc2Vycy9tYXJjb3NsYW11cmlhLy5hdG9tL3BhY2thZ2VzL2F1dG9oaWRlLXRyZWUtdmlldy9saWIvdG91Y2gtZXZlbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5pbXBvcnQgJ2FycmF5LmZyb20nO1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJztcbmltcG9ydCB7dHJlZVZpZXdFbH0gZnJvbSAnLi9tYWluLmpzJztcbmltcG9ydCB7c2hvd1RyZWVWaWV3LCBoaWRlVHJlZVZpZXd9IGZyb20gJy4vYXV0b2hpZGUtdHJlZS12aWV3LmpzJztcbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcuanMnO1xuaW1wb3J0IHtnZXRDb250ZW50V2lkdGgsIGlzQ2hpbGRPZn0gZnJvbSAnLi91dGlscy5qcyc7XG5cbnZhciB0b3VjaEV2ZW50cztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnN1bWVUb3VjaEV2ZW50cyh0b3VjaEV2ZW50c1NlcnZpY2UpIHtcbiAgdG91Y2hFdmVudHMgPSB0b3VjaEV2ZW50c1NlcnZpY2U7XG4gIGlmKGNvbmZpZy5zaG93T24ubWF0Y2goJ3RvdWNoJykpIGVuYWJsZVRvdWNoRXZlbnRzKCk7XG59XG5cbnZhciBkaXNwb3NhYmxlcztcblxuZXhwb3J0IGZ1bmN0aW9uIGVuYWJsZVRvdWNoRXZlbnRzKCkge1xuICBpZighdG91Y2hFdmVudHMpXG4gICAgcmV0dXJuIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKCdhdXRvaGlkZS10cmVlLXZpZXc6IGF0b20tdG91Y2gtZXZlbnRzIGlzIG5vdCBsb2FkZWQsIGJ1dCBpdCBpcyByZXF1aXJlZCBmb3IgdG91Y2ggZXZlbnRzIHRvIHdvcmsnKTtcblxuICBpZihkaXNwb3NhYmxlcykgcmV0dXJuO1xuICBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgIHRvdWNoRXZlbnRzLm9uRGlkVG91Y2hTd2lwZUxlZnQoc3dpcGVDaGFuZ2UsICgpID0+IHN3aXBlRW5kKGZhbHNlKSksXG4gICAgdG91Y2hFdmVudHMub25EaWRUb3VjaFN3aXBlUmlnaHQoc3dpcGVDaGFuZ2UsICgpID0+IHN3aXBlRW5kKHRydWUpKSxcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpc2FibGVUb3VjaEV2ZW50cygpIHtcbiAgaWYoIWRpc3Bvc2FibGVzKSByZXR1cm47XG4gIGRpc3Bvc2FibGVzLmRpc3Bvc2UoKTtcbiAgZGlzcG9zYWJsZXMgPSBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNUb3VjaEV2ZW50c0VuYWJsZWQoKSB7XG4gIHJldHVybiAhIWRpc3Bvc2FibGVzO1xufVxuXG52YXIgaXNTd2lwaW5nID0gZmFsc2U7XG5cbmZ1bmN0aW9uIHNob3VsZEluaXRTd2lwZSh0b3VjaGVzLCBzb3VyY2UpIHtcbiAgLy8gbm8gc3dpcGUgaWYgZWl0aGVyIGF1dG9oaWRlIG9yIHRvdWNoIGV2ZW50cyBpcyBkaXNhYmxlZFxuICBpZighaXNUb3VjaEV2ZW50c0VuYWJsZWQoKSkgcmV0dXJuIGZhbHNlO1xuICB2YXIgW3twYWdlWH1dID0gQXJyYXkuZnJvbSh0b3VjaGVzKTtcbiAgLy8gaWYgc3dpcGUgdGFyZ2V0IGlzbid0IHRoZSB0cmVlIHZpZXcsIGNoZWNrIGlmXG4gIC8vIHN3aXBlIGlzIGluIHRvdWNoQXJlYVxuICBpZighaXNDaGlsZE9mKHNvdXJjZSwgdHJlZVZpZXdFbC5wYXJlbnROb2RlKSkge1xuICAgIC8vIG5vIHN3aXBlIGlmIG5vdCBpbiB0b3VjaCBhcmVhXG4gICAgdmFyIHNob3dPblJpZ2h0U2lkZSA9IGF0b20uY29uZmlnLmdldCgndHJlZS12aWV3LnNob3dPblJpZ2h0U2lkZScpO1xuICAgIGlmKHNob3dPblJpZ2h0U2lkZSAmJiBwYWdlWCA8IHdpbmRvdy5pbm5lcldpZHRoIC0gY29uZmlnLnRvdWNoQXJlYVNpemUgfHxcbiAgICAgICFzaG93T25SaWdodFNpZGUgJiYgcGFnZVggPiBjb25maWcudG91Y2hBcmVhU2l6ZSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gaXNTd2lwaW5nID0gdHJ1ZTtcbn1cblxuLy8gdHJpZ2dlcmVkIHdoaWxlIHN3aXBpbmcgdGhlIHRyZWUgdmlld1xuZnVuY3Rpb24gc3dpcGVDaGFuZ2Uoe2FyZ3M6IHt0b3VjaGVzfSwgc291cmNlLCBkZWx0YVh9KSB7XG4gIC8vIGNoZWNrIGlmIHN3aXBlIHNob3VsZCBzaG93IHRoZSB0cmVlIHZpZXdcbiAgaWYoIWlzU3dpcGluZyAmJiAhc2hvdWxkSW5pdFN3aXBlKHRvdWNoZXMsIHNvdXJjZSkpIHJldHVybjtcbiAgaWYoYXRvbS5jb25maWcuZ2V0KCd0cmVlLXZpZXcuc2hvd09uUmlnaHRTaWRlJykpIGRlbHRhWCAqPSAtMTtcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uIGZyYW1lKCkge1xuICAgIHZhciBuZXdXaWR0aCA9IHRyZWVWaWV3RWwuY2xpZW50V2lkdGggKyBkZWx0YVg7XG4gICAgbmV3V2lkdGggPSBNYXRoLm1pbihnZXRDb250ZW50V2lkdGgoKSwgTWF0aC5tYXgoY29uZmlnLm1pbldpZHRoLCBuZXdXaWR0aCkpO1xuICAgIHRyZWVWaWV3RWwuc3R5bGUud2lkdGggPSBgJHtuZXdXaWR0aH1weGA7XG4gIH0pO1xufVxuXG4vLyB0cmlnZ2VyZWQgYWZ0ZXIgc3dpcGUsIGNvbXBsZXRlbHkgb3BlbnMvY2xvc2VzIHRoZSB0cmVlIHZpZXdcbi8vIGRlcGVuZGluZyBvbiB0aGUgc2lkZSBvZiB0aGUgdHJlZSB2aWV3IGFuZCBzd2lwZSBkaXJlY3Rpb25cbmZ1bmN0aW9uIHN3aXBlRW5kKHRvUmlnaHQpIHtcbiAgaWYoIWlzU3dpcGluZykgcmV0dXJuO1xuICBpc1N3aXBpbmcgPSBmYWxzZTtcbiAgYXRvbS5jb25maWcuZ2V0KCd0cmVlLXZpZXcuc2hvd09uUmlnaHRTaWRlJykgIT0gdG9SaWdodCA/IHNob3dUcmVlVmlldygpIDogaGlkZVRyZWVWaWV3KCk7XG59XG4iXX0=
//# sourceURL=/Users/marcoslamuria/.atom/packages/autohide-tree-view/lib/touch-events.js
