Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.observeConfig = observeConfig;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atom = require('atom');

var _autohideTreeViewJs = require('./autohide-tree-view.js');

var _hoverEventsJs = require('./hover-events.js');

var _clickEventsJs = require('./click-events.js');

var _touchEventsJs = require('./touch-events.js');

var _pinViewJs = require('./pin-view.js');

var _pinViewJs2 = _interopRequireDefault(_pinViewJs);

'use babel';
var schema = {
  showOn: {
    description: 'The type of event that triggers the tree view to show or hide. The touch events require atom-touch-events (https://atom.io/packages/atom-touch-events) to be installed. You\'ll need to restart Atom after installing atom-touch-events for touch events to become available.',
    type: 'string',
    'default': 'hover',
    'enum': ['hover', 'click', 'touch', 'hover + click', 'hover + touch', 'click + touch', 'hover + click + touch', 'none'],
    order: 0
  },
  showDelay: {
    description: 'The delay in milliseconds before the tree view will show. Only applies to hover events.',
    type: 'integer',
    'default': 200,
    minimum: 0,
    order: 1
  },
  hideDelay: {
    description: 'The delay in milliseconds before the tree view will hide. Only applies to hover events.',
    type: 'integer',
    'default': 200,
    minimum: 0,
    order: 2
  },
  minWidth: {
    description: 'The width in pixels of the tree view when it is hidden.',
    type: 'integer',
    'default': 5,
    minimum: 0,
    order: 3
  },
  maxWidth: {
    description: 'The max width in pixels of the tree view when it is expanded. Set to 0 to always extend to the max filename width.',
    type: 'integer',
    'default': 0,
    minimum: 0,
    order: 4
  },
  animationSpeed: {
    description: 'The speed in 1000 pixels per second of the animation. Set to 0 to disable the animation.',
    type: 'number',
    'default': 1,
    minimum: 0,
    order: 5
  },
  pushEditor: {
    description: 'Push the edge of the editor around to keep the entire editor contents visible.',
    type: 'boolean',
    'default': false,
    order: 6
  },
  triggerAreaSize: {
    description: 'Size of the area at the edge of the screen where hover/click events will trigger the tree view to show/hide',
    type: 'integer',
    'default': 0,
    minimum: 0,
    order: 7
  },
  touchAreaSize: {
    description: 'Width of an invisible area at the edge of the screen where touch events will be triggered.',
    type: 'integer',
    'default': 50,
    minimum: 0,
    order: 8
  },
  maxWindowWidth: {
    description: 'Autohide will be disabled when the window is wider than this. Set to 0 to always enable autohide.',
    type: 'integer',
    'default': 0,
    minimum: 0,
    order: 9
  },
  showPinButton: {
    description: 'Shows a pin button at the top of the tree view that enables/disables autohide.',
    type: 'boolean',
    'default': true,
    order: 10
  }
};

exports.schema = schema;
var config = Object.create(null);
exports['default'] = config;

var _loop = function (key) {
  Object.defineProperty(config, key, {
    get: function get() {
      // eslint-disable-line no-loop-func
      return atom.config.get('autohide-tree-view.' + key);
    }
  });
};

for (var key of Object.keys(schema)) {
  _loop(key);
}

function observeConfig() {
  return new _atom.CompositeDisposable(
  // changes to these settings should trigger an update
  atom.config.onDidChange('autohide-tree-view.pushEditor', function () {
    return (0, _autohideTreeViewJs.updateTreeView)();
  }), atom.config.onDidChange('autohide-tree-view.minWidth', function () {
    (0, _autohideTreeViewJs.updateTreeView)();
    (0, _autohideTreeViewJs.updateTriggerArea)();
  }), atom.config.onDidChange('tree-view.showOnRightSide', function () {
    return (0, _autohideTreeViewJs.updateTreeView)();
  }), atom.config.onDidChange('tree-view.hideIgnoredNames', function () {
    return (0, _autohideTreeViewJs.updateTreeView)();
  }), atom.config.onDidChange('tree-view.hideVcsIgnoredFiles', function () {
    return (0, _autohideTreeViewJs.updateTreeView)();
  }), atom.config.onDidChange('core.ignoredNames', function () {
    return (0, _autohideTreeViewJs.updateTreeView)();
  }), atom.config.observe('autohide-tree-view.triggerAreaSize', function () {
    return (0, _autohideTreeViewJs.updateTriggerArea)();
  }),

  // enable or disable the event types
  atom.config.observe('autohide-tree-view.showOn', function (showOn) {
    showOn.match('hover') ? (0, _hoverEventsJs.enableHoverEvents)() : (0, _hoverEventsJs.disableHoverEvents)();
    showOn.match('click') ? (0, _clickEventsJs.enableClickEvents)() : (0, _clickEventsJs.disableClickEvents)();
    showOn.match('touch') ? (0, _touchEventsJs.enableTouchEvents)() : (0, _touchEventsJs.disableTouchEvents)();
  }), atom.config.observe('autohide-tree-view.showPinButton', function (showPinButton) {
    return showPinButton ? _pinViewJs2['default'].show() : _pinViewJs2['default'].hide();
  }));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXJjb3NsYW11cmlhLy5hdG9tL3BhY2thZ2VzL2F1dG9oaWRlLXRyZWUtdmlldy9saWIvY29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7b0JBQ2tDLE1BQU07O2tDQUNRLHlCQUF5Qjs7NkJBQ3JCLG1CQUFtQjs7NkJBQ25CLG1CQUFtQjs7NkJBQ25CLG1CQUFtQjs7eUJBQ25ELGVBQWU7Ozs7QUFObkMsV0FBVyxDQUFDO0FBUUwsSUFBTSxNQUFNLEdBQUc7QUFDcEIsUUFBTSxFQUFFO0FBQ04sZUFBVyxFQUFFLCtRQUErUTtBQUM1UixRQUFJLEVBQUUsUUFBUTtBQUNkLGVBQVMsT0FBTztBQUNoQixZQUFNLENBQ0osT0FBTyxFQUNQLE9BQU8sRUFDUCxPQUFPLEVBQ1AsZUFBZSxFQUNmLGVBQWUsRUFDZixlQUFlLEVBQ2YsdUJBQXVCLEVBQ3ZCLE1BQU0sQ0FDUDtBQUNELFNBQUssRUFBRSxDQUFDO0dBQ1Q7QUFDRCxXQUFTLEVBQUU7QUFDVCxlQUFXLEVBQUUseUZBQXlGO0FBQ3RHLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxHQUFHO0FBQ1osV0FBTyxFQUFFLENBQUM7QUFDVixTQUFLLEVBQUUsQ0FBQztHQUNUO0FBQ0QsV0FBUyxFQUFFO0FBQ1QsZUFBVyxFQUFFLHlGQUF5RjtBQUN0RyxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsR0FBRztBQUNaLFdBQU8sRUFBRSxDQUFDO0FBQ1YsU0FBSyxFQUFFLENBQUM7R0FDVDtBQUNELFVBQVEsRUFBRTtBQUNSLGVBQVcsRUFBRSx5REFBeUQ7QUFDdEUsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLENBQUM7QUFDVixXQUFPLEVBQUUsQ0FBQztBQUNWLFNBQUssRUFBRSxDQUFDO0dBQ1Q7QUFDRCxVQUFRLEVBQUU7QUFDUixlQUFXLEVBQUUsb0hBQW9IO0FBQ2pJLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxDQUFDO0FBQ1YsV0FBTyxFQUFFLENBQUM7QUFDVixT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QW1CLEdBQUcsd0NBQW9CLENBQUM7R0FDcEUsQ0FBQyxFQUVGLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGtDQUFrQyxFQUFFLFVBQUEsYUFBYTtXQUNuRSxhQUFhLEdBQUcsdUJBQVEsSUFBSSxFQUFFLEdBQUcsdUJBQVEsSUFBSSxFQUFFO0dBQUEsQ0FDaEQsQ0FDRixDQUFDO0NBQ0giLCJmaWxlIjoiL1VzZXJzL21hcmNvc2xhbXVyaWEvLmF0b20vcGFja2FnZXMvYXV0b2hpZGUtdHJlZS12aWV3L2xpYi9jb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSc7XG5pbXBvcnQge3VwZGF0ZVRyZWVWaWV3LCB1cGRhdGVUcmlnZ2VyQXJlYX0gZnJvbSAnLi9hdXRvaGlkZS10cmVlLXZpZXcuanMnO1xuaW1wb3J0IHtlbmFibGVIb3ZlckV2ZW50cywgZGlzYWJsZUhvdmVyRXZlbnRzfSBmcm9tICcuL2hvdmVyLWV2ZW50cy5qcyc7XG5pbXBvcnQge2VuYWJsZUNsaWNrRXZlbnRzLCBkaXNhYmxlQ2xpY2tFdmVudHN9IGZyb20gJy4vY2xpY2stZXZlbnRzLmpzJztcbmltcG9ydCB7ZW5hYmxlVG91Y2hFdmVudHMsIGRpc2FibGVUb3VjaEV2ZW50c30gZnJvbSAnLi90b3VjaC1ldmVudHMuanMnO1xuaW1wb3J0IHBpblZpZXcgZnJvbSAnLi9waW4tdmlldy5qcyc7XG5cbmV4cG9ydCBjb25zdCBzY2hlbWEgPSB7XG4gIHNob3dPbjoge1xuICAgIGRlc2NyaXB0aW9uOiAnVGhlIHR5cGUgb2YgZXZlbnQgdGhhdCB0cmlnZ2VycyB0aGUgdHJlZSB2aWV3IHRvIHNob3cgb3IgaGlkZS4gVGhlIHRvdWNoIGV2ZW50cyByZXF1aXJlIGF0b20tdG91Y2gtZXZlbnRzIChodHRwczovL2F0b20uaW8vcGFja2FnZXMvYXRvbS10b3VjaC1ldmVudHMpIHRvIGJlIGluc3RhbGxlZC4gWW91XFwnbGwgbmVlZCB0byByZXN0YXJ0IEF0b20gYWZ0ZXIgaW5zdGFsbGluZyBhdG9tLXRvdWNoLWV2ZW50cyBmb3IgdG91Y2ggZXZlbnRzIHRvIGJlY29tZSBhdmFpbGFibGUuJyxcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiAnaG92ZXInLFxuICAgIGVudW06IFtcbiAgICAgICdob3ZlcicsXG4gICAgICAnY2xpY2snLFxuICAgICAgJ3RvdWNoJyxcbiAgICAgICdob3ZlciArIGNsaWNrJyxcbiAgICAgICdob3ZlciArIHRvdWNoJyxcbiAgICAgICdjbGljayArIHRvdWNoJyxcbiAgICAgICdob3ZlciArIGNsaWNrICsgdG91Y2gnLFxuICAgICAgJ25vbmUnLFxuICAgIF0sXG4gICAgb3JkZXI6IDAsXG4gIH0sXG4gIHNob3dEZWxheToge1xuICAgIGRlc2NyaXB0aW9uOiAnVGhlIGRlbGF5IGluIG1pbGxpc2Vjb25kcyBiZWZvcmUgdGhlIHRyZWUgdmlldyB3aWxsIHNob3cuIE9ubHkgYXBwbGllcyB0byBob3ZlciBldmVudHMuJyxcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMjAwLFxuICAgIG1pbmltdW06IDAsXG4gICAgb3JkZXI6IDEsXG4gIH0sXG4gIGhpZGVEZWxheToge1xuICAgIGRlc2NyaXB0aW9uOiAnVGhlIGRlbGF5IGluIG1pbGxpc2Vjb25kcyBiZWZvcmUgdGhlIHRyZWUgdmlldyB3aWxsIGhpZGUuIE9ubHkgYXBwbGllcyB0byBob3ZlciBldmVudHMuJyxcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMjAwLFxuICAgIG1pbmltdW06IDAsXG4gICAgb3JkZXI6IDIsXG4gIH0sXG4gIG1pbldpZHRoOiB7XG4gICAgZGVzY3JpcHRpb246ICdUaGUgd2lkdGggaW4gcGl4ZWxzIG9mIHRoZSB0cmVlIHZpZXcgd2hlbiBpdCBpcyBoaWRkZW4uJyxcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogNSxcbiAgICBtaW5pbXVtOiAwLFxuICAgIG9yZGVyOiAzLFxuICB9LFxuICBtYXhXaWR0aDoge1xuICAgIGRlc2NyaXB0aW9uOiAnVGhlIG1heCB3aWR0aCBpbiBwaXhlbHMgb2YgdGhlIHRyZWUgdmlldyB3aGVuIGl0IGlzIGV4cGFuZGVkLiBTZXQgdG8gMCB0byBhbHdheXMgZXh0ZW5kIHRvIHRoZSBtYXggZmlsZW5hbWUgd2lkdGguJyxcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMCxcbiAgICBtaW5pbXVtOiAwLFxuICAgIG9yZGVyOiA0LFxuICB9LFxuICBhbmltYXRpb25TcGVlZDoge1xuICAgIGRlc2NyaXB0aW9uOiAnVGhlIHNwZWVkIGluIDEwMDAgcGl4ZWxzIHBlciBzZWNvbmQgb2YgdGhlIGFuaW1hdGlvbi4gU2V0IHRvIDAgdG8gZGlzYWJsZSB0aGUgYW5pbWF0aW9uLicsXG4gICAgdHlwZTogJ251bWJlcicsXG4gICAgZGVmYXVsdDogMSxcbiAgICBtaW5pbXVtOiAwLFxuICAgIG9yZGVyOiA1LFxuICB9LFxuICBwdXNoRWRpdG9yOiB7XG4gICAgZGVzY3JpcHRpb246ICdQdXNoIHRoZSBlZGdlIG9mIHRoZSBlZGl0b3IgYXJvdW5kIHRvIGtlZXAgdGhlIGVudGlyZSBlZGl0b3IgY29udGVudHMgdmlzaWJsZS4nLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBvcmRlcjogNixcbiAgfSxcbiAgdHJpZ2dlckFyZWFTaXplOiB7XG4gICAgZGVzY3JpcHRpb246ICdTaXplIG9mIHRoZSBhcmVhIGF0IHRoZSBlZGdlIG9mIHRoZSBzY3JlZW4gd2hlcmUgaG92ZXIvY2xpY2sgZXZlbnRzIHdpbGwgdHJpZ2dlciB0aGUgdHJlZSB2aWV3IHRvIHNob3cvaGlkZScsXG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDAsXG4gICAgbWluaW11bTogMCxcbiAgICBvcmRlcjogNyxcbiAgfSxcbiAgdG91Y2hBcmVhU2l6ZToge1xuICAgIGRlc2NyaXB0aW9uOiAnV2lkdGggb2YgYW4gaW52aXNpYmxlIGFyZWEgYXQgdGhlIGVkZ2Ugb2YgdGhlIHNjcmVlbiB3aGVyZSB0b3VjaCBldmVudHMgd2lsbCBiZSB0cmlnZ2VyZWQuJyxcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogNTAsXG4gICAgbWluaW11bTogMCxcbiAgICBvcmRlcjogOCxcbiAgfSxcbiAgbWF4V2luZG93V2lkdGg6IHtcbiAgICBkZXNjcmlwdGlvbjogJ0F1dG9oaWRlIHdpbGwgYmUgZGlzYWJsZWQgd2hlbiB0aGUgd2luZG93IGlzIHdpZGVyIHRoYW4gdGhpcy4gU2V0IHRvIDAgdG8gYWx3YXlzIGVuYWJsZSBhdXRvaGlkZS4nLFxuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiAwLFxuICAgIG1pbmltdW06IDAsXG4gICAgb3JkZXI6IDksXG4gIH0sXG4gIHNob3dQaW5CdXR0b246IHtcbiAgICBkZXNjcmlwdGlvbjogJ1Nob3dzIGEgcGluIGJ1dHRvbiBhdCB0aGUgdG9wIG9mIHRoZSB0cmVlIHZpZXcgdGhhdCBlbmFibGVzL2Rpc2FibGVzIGF1dG9oaWRlLicsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgb3JkZXI6IDEwLFxuICB9LFxufTtcblxudmFyIGNvbmZpZyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5leHBvcnQgZGVmYXVsdCBjb25maWc7XG5cbmZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKHNjaGVtYSkpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvbmZpZywga2V5LCB7XG4gICAgZ2V0KCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWxvb3AtZnVuY1xuICAgICAgcmV0dXJuIGF0b20uY29uZmlnLmdldChgYXV0b2hpZGUtdHJlZS12aWV3LiR7a2V5fWApO1xuICAgIH0sXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb2JzZXJ2ZUNvbmZpZygpIHtcbiAgcmV0dXJuIG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKFxuICAgIC8vIGNoYW5nZXMgdG8gdGhlc2Ugc2V0dGluZ3Mgc2hvdWxkIHRyaWdnZXIgYW4gdXBkYXRlXG4gICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2F1dG9oaWRlLXRyZWUtdmlldy5wdXNoRWRpdG9yJywgKCkgPT5cbiAgICAgIHVwZGF0ZVRyZWVWaWV3KClcbiAgICApLFxuICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdhdXRvaGlkZS10cmVlLXZpZXcubWluV2lkdGgnLCAoKSA9PiB7XG4gICAgICB1cGRhdGVUcmVlVmlldygpO1xuICAgICAgdXBkYXRlVHJpZ2dlckFyZWEoKTtcbiAgICB9KSxcbiAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgndHJlZS12aWV3LnNob3dPblJpZ2h0U2lkZScsICgpID0+XG4gICAgICB1cGRhdGVUcmVlVmlldygpXG4gICAgKSxcbiAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgndHJlZS12aWV3LmhpZGVJZ25vcmVkTmFtZXMnLCAoKSA9PlxuICAgICAgdXBkYXRlVHJlZVZpZXcoKVxuICAgICksXG4gICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ3RyZWUtdmlldy5oaWRlVmNzSWdub3JlZEZpbGVzJywgKCkgPT5cbiAgICAgIHVwZGF0ZVRyZWVWaWV3KClcbiAgICApLFxuICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdjb3JlLmlnbm9yZWROYW1lcycsICgpID0+XG4gICAgICB1cGRhdGVUcmVlVmlldygpXG4gICAgKSxcbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdhdXRvaGlkZS10cmVlLXZpZXcudHJpZ2dlckFyZWFTaXplJywgKCkgPT5cbiAgICAgIHVwZGF0ZVRyaWdnZXJBcmVhKClcbiAgICApLFxuXG4gICAgLy8gZW5hYmxlIG9yIGRpc2FibGUgdGhlIGV2ZW50IHR5cGVzXG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnYXV0b2hpZGUtdHJlZS12aWV3LnNob3dPbicsIHNob3dPbiA9PiB7XG4gICAgICBzaG93T24ubWF0Y2goJ2hvdmVyJykgPyBlbmFibGVIb3ZlckV2ZW50cygpIDogZGlzYWJsZUhvdmVyRXZlbnRzKCk7XG4gICAgICBzaG93T24ubWF0Y2goJ2NsaWNrJykgPyBlbmFibGVDbGlja0V2ZW50cygpIDogZGlzYWJsZUNsaWNrRXZlbnRzKCk7XG4gICAgICBzaG93T24ubWF0Y2goJ3RvdWNoJykgPyBlbmFibGVUb3VjaEV2ZW50cygpIDogZGlzYWJsZVRvdWNoRXZlbnRzKCk7XG4gICAgfSksXG5cbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdhdXRvaGlkZS10cmVlLXZpZXcuc2hvd1BpbkJ1dHRvbicsIHNob3dQaW5CdXR0b24gPT5cbiAgICAgIHNob3dQaW5CdXR0b24gPyBwaW5WaWV3LnNob3coKSA6IHBpblZpZXcuaGlkZSgpXG4gICAgKSxcbiAgKTtcbn1cbiJdfQ==
//# sourceURL=/Users/marcoslamuria/.atom/packages/autohide-tree-view/lib/config.js
