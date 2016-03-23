Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.enableClickEvents = enableClickEvents;
exports.disableClickEvents = disableClickEvents;
exports.isClickEventsEnabled = isClickEventsEnabled;

var _atom = require('atom');

var _mainJs = require('./main.js');

var _autohideTreeViewJs = require('./autohide-tree-view.js');

var _utilsJs = require('./utils.js');

'use babel';

var disposables;

function enableClickEvents() {
  if (disposables) return;
  disposables = new _atom.CompositeDisposable(
  // clicks on the tree view toggle the tree view
  (0, _utilsJs.domListener)(_mainJs.treeViewEl, 'click', function (event) {
    if (nextClickInvalidated || event.button != 0) return;
    event.stopPropagation();
    (0, _autohideTreeViewJs.toggleTreeView)();
    uninvalidateNextClick();
  }),

  // ignore the next click on the tree view if
  // the event target is a child of tree view
  // but not .tree-view-scroller, on which it
  // should just toggle the tree view
  (0, _utilsJs.domListener)(_mainJs.treeViewEl, 'click', function (event) {
    if (!(0, _autohideTreeViewJs.isTreeViewVisible)() || event.button != 0) return;
    invalidateNextClick();
  }, { delegationTarget: ':not(.tree-view-scroller)' }),

  // hide and unfocus the tree view when the
  // user clicks anything other than the tree
  // view
  // addDelegatedEventListener(document.body, 'click', ':not(.tree-view-resizer), :not(.tree-view-resizer) *', event => {
  (0, _utilsJs.domListener)(document.body, 'click', function (event) {
    if (event.button != 0 || (0, _utilsJs.isChildOf)(event.target, _mainJs.treeViewEl.parentNode)) return;
    (0, _autohideTreeViewJs.clearFocusedElement)();
    (0, _autohideTreeViewJs.hideTreeView)();
    uninvalidateNextClick();
  }));
}

function disableClickEvents() {
  if (!disposables) return;
  disposables.dispose();
  disposables = null;
}

function isClickEventsEnabled() {
  return !!disposables;
}

// keep track if the next click event
// should trigger a toggleTreeView
var nextClickInvalidated = false;

function invalidateNextClick() {
  nextClickInvalidated = true;
}

function uninvalidateNextClick() {
  nextClickInvalidated = false;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXJjb3NsYW11cmlhLy5hdG9tL3BhY2thZ2VzL2F1dG9oaWRlLXRyZWUtdmlldy9saWIvY2xpY2stZXZlbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7b0JBQ2tDLE1BQU07O3NCQUNmLFdBQVc7O2tDQUVSLHlCQUF5Qjs7dUJBQ2hCLFlBQVk7O0FBTGpELFdBQVcsQ0FBQzs7QUFPWixJQUFJLFdBQVcsQ0FBQzs7QUFFVCxTQUFTLGlCQUFpQixHQUFHO0FBQ2xDLE1BQUcsV0FBVyxFQUFFLE9BQU87QUFDdkIsYUFBVyxHQUFHOztBQUVaLGdEQUF3QixPQUFPLEVBQUUsVUFBQSxLQUFLLEVBQUk7QUFDeEMsUUFBRyxvQkFBb0IsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRSxPQUFPO0FBQ3JELFNBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUN4Qiw2Q0FBZ0IsQ0FBQztBQUNqQix5QkFBcUIsRUFBRSxDQUFDO0dBQ3pCLENBQUM7Ozs7OztBQU1GLGdEQUF3QixPQUFPLEVBQUUsVUFBQSxLQUFLLEVBQUk7QUFDeEMsUUFBRyxDQUFDLDRDQUFtQixJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFLE9BQU87QUFDckQsdUJBQW1CLEVBQUUsQ0FBQztHQUN2QixFQUFFLEVBQUMsZ0JBQWdCLEVBQUUsMkJBQTJCLEVBQUMsQ0FBQzs7Ozs7O0FBTW5ELDRCQUFZLFFBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFVBQUEsS0FBSyxFQUFJO0FBQzNDLFFBQUcsS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksd0JBQVUsS0FBSyxDQUFDLE1BQU0sRUFBRSxtQkFBVyxVQUFVLENBQUMsRUFBRSxPQUFPO0FBQy9FLGtEQUFxQixDQUFDO0FBQ3RCLDJDQUFjLENBQUM7QUFDZix5QkFBcUIsRUFBRSxDQUFDO0dBQ3pCLENBQUMsQ0FDSCxDQUFDO0NBQ0g7O0FBRU0sU0FBUyxrQkFBa0IsR0FBRztBQUNuQyxNQUFHLENBQUMsV0FBVyxFQUFFLE9BQU87QUFDeEIsYUFBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3RCLGFBQVcsR0FBRyxJQUFJLENBQUM7Q0FDcEI7O0FBRU0sU0FBUyxvQkFBb0IsR0FBRztBQUNyQyxTQUFPLENBQUMsQ0FBQyxXQUFXLENBQUM7Q0FDdEI7Ozs7QUFJRCxJQUFJLG9CQUFvQixHQUFHLEtBQUssQ0FBQzs7QUFFakMsU0FBUyxtQkFBbUIsR0FBRztBQUM3QixzQkFBb0IsR0FBRyxJQUFJLENBQUM7Q0FDN0I7O0FBRUQsU0FBUyxxQkFBcUIsR0FBRztBQUMvQixzQkFBb0IsR0FBRyxLQUFLLENBQUM7Q0FDOUIiLCJmaWxlIjoiL1VzZXJzL21hcmNvc2xhbXVyaWEvLmF0b20vcGFja2FnZXMvYXV0b2hpZGUtdHJlZS12aWV3L2xpYi9jbGljay1ldmVudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSc7XG5pbXBvcnQge3RyZWVWaWV3RWx9IGZyb20gJy4vbWFpbi5qcyc7XG5pbXBvcnQge2hpZGVUcmVlVmlldywgdG9nZ2xlVHJlZVZpZXcsIGlzVHJlZVZpZXdWaXNpYmxlLFxuICBjbGVhckZvY3VzZWRFbGVtZW50fSBmcm9tICcuL2F1dG9oaWRlLXRyZWUtdmlldy5qcyc7XG5pbXBvcnQge2lzQ2hpbGRPZiwgZG9tTGlzdGVuZXJ9IGZyb20gJy4vdXRpbHMuanMnO1xuXG52YXIgZGlzcG9zYWJsZXM7XG5cbmV4cG9ydCBmdW5jdGlvbiBlbmFibGVDbGlja0V2ZW50cygpIHtcbiAgaWYoZGlzcG9zYWJsZXMpIHJldHVybjtcbiAgZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAvLyBjbGlja3Mgb24gdGhlIHRyZWUgdmlldyB0b2dnbGUgdGhlIHRyZWUgdmlld1xuICAgIGRvbUxpc3RlbmVyKHRyZWVWaWV3RWwsICdjbGljaycsIGV2ZW50ID0+IHtcbiAgICAgIGlmKG5leHRDbGlja0ludmFsaWRhdGVkIHx8IGV2ZW50LmJ1dHRvbiAhPSAwKSByZXR1cm47XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIHRvZ2dsZVRyZWVWaWV3KCk7XG4gICAgICB1bmludmFsaWRhdGVOZXh0Q2xpY2soKTtcbiAgICB9KSxcblxuICAgIC8vIGlnbm9yZSB0aGUgbmV4dCBjbGljayBvbiB0aGUgdHJlZSB2aWV3IGlmXG4gICAgLy8gdGhlIGV2ZW50IHRhcmdldCBpcyBhIGNoaWxkIG9mIHRyZWUgdmlld1xuICAgIC8vIGJ1dCBub3QgLnRyZWUtdmlldy1zY3JvbGxlciwgb24gd2hpY2ggaXRcbiAgICAvLyBzaG91bGQganVzdCB0b2dnbGUgdGhlIHRyZWUgdmlld1xuICAgIGRvbUxpc3RlbmVyKHRyZWVWaWV3RWwsICdjbGljaycsIGV2ZW50ID0+IHtcbiAgICAgIGlmKCFpc1RyZWVWaWV3VmlzaWJsZSgpIHx8IGV2ZW50LmJ1dHRvbiAhPSAwKSByZXR1cm47XG4gICAgICBpbnZhbGlkYXRlTmV4dENsaWNrKCk7XG4gICAgfSwge2RlbGVnYXRpb25UYXJnZXQ6ICc6bm90KC50cmVlLXZpZXctc2Nyb2xsZXIpJ30pLFxuXG4gICAgLy8gaGlkZSBhbmQgdW5mb2N1cyB0aGUgdHJlZSB2aWV3IHdoZW4gdGhlXG4gICAgLy8gdXNlciBjbGlja3MgYW55dGhpbmcgb3RoZXIgdGhhbiB0aGUgdHJlZVxuICAgIC8vIHZpZXdcbiAgICAvLyBhZGREZWxlZ2F0ZWRFdmVudExpc3RlbmVyKGRvY3VtZW50LmJvZHksICdjbGljaycsICc6bm90KC50cmVlLXZpZXctcmVzaXplciksIDpub3QoLnRyZWUtdmlldy1yZXNpemVyKSAqJywgZXZlbnQgPT4ge1xuICAgIGRvbUxpc3RlbmVyKGRvY3VtZW50LmJvZHksICdjbGljaycsIGV2ZW50ID0+IHtcbiAgICAgIGlmKGV2ZW50LmJ1dHRvbiAhPSAwIHx8IGlzQ2hpbGRPZihldmVudC50YXJnZXQsIHRyZWVWaWV3RWwucGFyZW50Tm9kZSkpIHJldHVybjtcbiAgICAgIGNsZWFyRm9jdXNlZEVsZW1lbnQoKTtcbiAgICAgIGhpZGVUcmVlVmlldygpO1xuICAgICAgdW5pbnZhbGlkYXRlTmV4dENsaWNrKCk7XG4gICAgfSksXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkaXNhYmxlQ2xpY2tFdmVudHMoKSB7XG4gIGlmKCFkaXNwb3NhYmxlcykgcmV0dXJuO1xuICBkaXNwb3NhYmxlcy5kaXNwb3NlKCk7XG4gIGRpc3Bvc2FibGVzID0gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ2xpY2tFdmVudHNFbmFibGVkKCkge1xuICByZXR1cm4gISFkaXNwb3NhYmxlcztcbn1cblxuLy8ga2VlcCB0cmFjayBpZiB0aGUgbmV4dCBjbGljayBldmVudFxuLy8gc2hvdWxkIHRyaWdnZXIgYSB0b2dnbGVUcmVlVmlld1xudmFyIG5leHRDbGlja0ludmFsaWRhdGVkID0gZmFsc2U7XG5cbmZ1bmN0aW9uIGludmFsaWRhdGVOZXh0Q2xpY2soKSB7XG4gIG5leHRDbGlja0ludmFsaWRhdGVkID0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gdW5pbnZhbGlkYXRlTmV4dENsaWNrKCkge1xuICBuZXh0Q2xpY2tJbnZhbGlkYXRlZCA9IGZhbHNlO1xufVxuIl19
//# sourceURL=/Users/marcoslamuria/.atom/packages/autohide-tree-view/lib/click-events.js
