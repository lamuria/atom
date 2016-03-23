Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = initCommands;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _atom = require('atom');

var _mainJs = require('./main.js');

var _autohideTreeViewJs = require('./autohide-tree-view.js');

'use babel';

function initCommands() {
  var _atom$commands$add;

  var disposables = new _atom.CompositeDisposable(
  // resize the tree view when project.paths changes
  atom.project.onDidChangePaths(function () {
    return (0, _autohideTreeViewJs.resizeTreeView)();
  }),

  // add command listeners
  atom.commands.add('atom-workspace', (_atom$commands$add = {}, _defineProperty(_atom$commands$add, 'tree-view:show', function treeViewShow(event) {
    event.stopImmediatePropagation();
    (0, _autohideTreeViewJs.showTreeView)();
  }), _defineProperty(_atom$commands$add, 'tree-view:hide', function treeViewHide(event) {
    event.stopImmediatePropagation();
    (0, _autohideTreeViewJs.hideTreeView)();
  }), _defineProperty(_atom$commands$add, 'tree-view:toggle', function treeViewToggle(event) {
    event.stopImmediatePropagation();
    (0, _autohideTreeViewJs.toggleTreeView)();
  }), _defineProperty(_atom$commands$add, 'tree-view:reveal-active-file', function treeViewRevealActiveFile() {
    (0, _autohideTreeViewJs.showTreeView)(0).then(function () {
      return _mainJs.treeView.scrollToEntry(_mainJs.treeView.getSelectedEntries()[0]);
    });
  }), _defineProperty(_atom$commands$add, 'tree-view:toggle-focus', function treeViewToggleFocus() {
    (0, _autohideTreeViewJs.toggleTreeView)();
  }), _defineProperty(_atom$commands$add, 'tree-view:remove', function treeViewRemove() {
    (0, _autohideTreeViewJs.resizeTreeView)();
  }), _defineProperty(_atom$commands$add, 'tree-view:paste', function treeViewPaste() {
    (0, _autohideTreeViewJs.resizeTreeView)();
  }), _atom$commands$add)),

  // hide the tree view when `esc` key is pressed
  atom.commands.add(_mainJs.treeViewEl, 'tool-panel:unfocus', function () {
    return (0, _autohideTreeViewJs.hideTreeView)();
  }));

  for (var action of ['expand', 'collapse']) {
    var _atom$commands$add2;

    disposables.add(atom.commands.add('atom-workspace', (_atom$commands$add2 = {}, _defineProperty(_atom$commands$add2, 'tree-view:' + action + '-directory', _autohideTreeViewJs.resizeTreeView), _defineProperty(_atom$commands$add2, 'tree-view:recursive-' + action + '-directory', _autohideTreeViewJs.resizeTreeView), _atom$commands$add2)));
  }

  // hide the tree view when a file is opened by a command
  for (var direction of ['', '-right', '-left', '-up', '-down']) {
    disposables.add(atom.commands.add('atom-workspace', 'tree-view:open-selected-entry' + direction, didOpenFile));
  }

  for (var i of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    disposables.add(atom.commands.add('atom-workspace', 'tree-view:open-selected-entry-in-pane-' + i, didOpenFile));
  }

  return disposables;
}

function didOpenFile() {
  process.nextTick(function () {
    (0, _autohideTreeViewJs.storeFocusedElement)(atom.views.getView(atom.workspace.getActiveTextEditor()));
    (0, _autohideTreeViewJs.hideTreeView)();
  });
}
module.exports = exports['default'];

// tree-view commands

// this one isn't actually in the tree-view package
// but have it here for the sake of symmetry :)

// patch reveal-active-file because it doesn't work
// when the tree view isn't visible
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXJjb3NsYW11cmlhLy5hdG9tL3BhY2thZ2VzL2F1dG9oaWRlLXRyZWUtdmlldy9saWIvY29tbWFuZHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O3FCQU13QixZQUFZOzs7O29CQUxGLE1BQU07O3NCQUNMLFdBQVc7O2tDQUVGLHlCQUF5Qjs7QUFKckUsV0FBVyxDQUFDOztBQU1HLFNBQVMsWUFBWSxHQUFHOzs7QUFDckMsTUFBSSxXQUFXLEdBQUc7O0FBRWhCLE1BQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUM7V0FDNUIseUNBQWdCO0dBQUEsQ0FDakI7OztBQUdELE1BQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixnRUFFL0IsZ0JBQWdCLEVBQUMsc0JBQUMsS0FBSyxFQUFFO0FBQ3hCLFNBQUssQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO0FBQ2pDLDJDQUFjLENBQUM7R0FDaEIsdUNBR0EsZ0JBQWdCLEVBQUMsc0JBQUMsS0FBSyxFQUFFO0FBQ3hCLFNBQUssQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO0FBQ2pDLDJDQUFjLENBQUM7R0FDaEIsdUNBQ0Esa0JBQWtCLEVBQUMsd0JBQUMsS0FBSyxFQUFFO0FBQzFCLFNBQUssQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO0FBQ2pDLDZDQUFnQixDQUFDO0dBQ2xCLHVDQUdBLDhCQUE4QixFQUFDLG9DQUFHO0FBQ2pDLDBDQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQzthQUNuQixpQkFBUyxhQUFhLENBQUMsaUJBQVMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUFBLENBQ3pELENBQUM7R0FDSCx1Q0FDQSx3QkFBd0IsRUFBQywrQkFBRztBQUMzQiw2Q0FBZ0IsQ0FBQztHQUNsQix1Q0FDQSxrQkFBa0IsRUFBQywwQkFBRztBQUNyQiw2Q0FBZ0IsQ0FBQztHQUNsQix1Q0FDQSxpQkFBaUIsRUFBQyx5QkFBRztBQUNwQiw2Q0FBZ0IsQ0FBQztHQUNsQix1QkFDRDs7O0FBR0YsTUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLHFCQUFhLG9CQUFvQixFQUFFO1dBQ2xELHVDQUFjO0dBQUEsQ0FDZixDQUNGLENBQUM7O0FBRUYsT0FBSSxJQUFJLE1BQU0sSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsRUFBRTs7O0FBQ3hDLGVBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLGlGQUNsQyxNQUFNLG9IQUNJLE1BQU0sMkVBQzlCLENBQUMsQ0FBQztHQUNMOzs7QUFHRCxPQUFJLElBQUksU0FBUyxJQUFJLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxFQUFFO0FBQzVELGVBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLG9DQUFrQyxTQUFTLEVBQUksV0FBVyxDQUFDLENBQUMsQ0FBQztHQUNoSDs7QUFFRCxPQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUN4QyxlQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQiw2Q0FBMkMsQ0FBQyxFQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUM7R0FDakg7O0FBRUQsU0FBTyxXQUFXLENBQUM7Q0FDcEI7O0FBRUQsU0FBUyxXQUFXLEdBQUc7QUFDckIsU0FBTyxDQUFDLFFBQVEsQ0FBQyxZQUFNO0FBQ3JCLGlEQUFvQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzlFLDJDQUFjLENBQUM7R0FDaEIsQ0FBQyxDQUFDO0NBQ0oiLCJmaWxlIjoiL1VzZXJzL21hcmNvc2xhbXVyaWEvLmF0b20vcGFja2FnZXMvYXV0b2hpZGUtdHJlZS12aWV3L2xpYi9jb21tYW5kcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJztcbmltcG9ydCB7dHJlZVZpZXcsIHRyZWVWaWV3RWx9IGZyb20gJy4vbWFpbi5qcyc7XG5pbXBvcnQge3Nob3dUcmVlVmlldywgaGlkZVRyZWVWaWV3LCB0b2dnbGVUcmVlVmlldyxcbiAgc3RvcmVGb2N1c2VkRWxlbWVudCwgcmVzaXplVHJlZVZpZXd9IGZyb20gJy4vYXV0b2hpZGUtdHJlZS12aWV3LmpzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaW5pdENvbW1hbmRzKCkge1xuICB2YXIgZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZShcbiAgICAvLyByZXNpemUgdGhlIHRyZWUgdmlldyB3aGVuIHByb2plY3QucGF0aHMgY2hhbmdlc1xuICAgIGF0b20ucHJvamVjdC5vbkRpZENoYW5nZVBhdGhzKCgpID0+XG4gICAgICByZXNpemVUcmVlVmlldygpXG4gICAgKSxcblxuICAgIC8vIGFkZCBjb21tYW5kIGxpc3RlbmVyc1xuICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgIC8vIHRyZWUtdmlldyBjb21tYW5kc1xuICAgICAgWyd0cmVlLXZpZXc6c2hvdyddKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICBzaG93VHJlZVZpZXcoKTtcbiAgICAgIH0sXG4gICAgICAvLyB0aGlzIG9uZSBpc24ndCBhY3R1YWxseSBpbiB0aGUgdHJlZS12aWV3IHBhY2thZ2VcbiAgICAgIC8vIGJ1dCBoYXZlIGl0IGhlcmUgZm9yIHRoZSBzYWtlIG9mIHN5bW1ldHJ5IDopXG4gICAgICBbJ3RyZWUtdmlldzpoaWRlJ10oZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGhpZGVUcmVlVmlldygpO1xuICAgICAgfSxcbiAgICAgIFsndHJlZS12aWV3OnRvZ2dsZSddKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICB0b2dnbGVUcmVlVmlldygpO1xuICAgICAgfSxcbiAgICAgIC8vIHBhdGNoIHJldmVhbC1hY3RpdmUtZmlsZSBiZWNhdXNlIGl0IGRvZXNuJ3Qgd29ya1xuICAgICAgLy8gd2hlbiB0aGUgdHJlZSB2aWV3IGlzbid0IHZpc2libGVcbiAgICAgIFsndHJlZS12aWV3OnJldmVhbC1hY3RpdmUtZmlsZSddKCkge1xuICAgICAgICBzaG93VHJlZVZpZXcoMCkudGhlbigoKSA9PlxuICAgICAgICAgIHRyZWVWaWV3LnNjcm9sbFRvRW50cnkodHJlZVZpZXcuZ2V0U2VsZWN0ZWRFbnRyaWVzKClbMF0pXG4gICAgICAgICk7XG4gICAgICB9LFxuICAgICAgWyd0cmVlLXZpZXc6dG9nZ2xlLWZvY3VzJ10oKSB7XG4gICAgICAgIHRvZ2dsZVRyZWVWaWV3KCk7XG4gICAgICB9LFxuICAgICAgWyd0cmVlLXZpZXc6cmVtb3ZlJ10oKSB7XG4gICAgICAgIHJlc2l6ZVRyZWVWaWV3KCk7XG4gICAgICB9LFxuICAgICAgWyd0cmVlLXZpZXc6cGFzdGUnXSgpIHtcbiAgICAgICAgcmVzaXplVHJlZVZpZXcoKTtcbiAgICAgIH0sXG4gICAgfSksXG5cbiAgICAvLyBoaWRlIHRoZSB0cmVlIHZpZXcgd2hlbiBgZXNjYCBrZXkgaXMgcHJlc3NlZFxuICAgIGF0b20uY29tbWFuZHMuYWRkKHRyZWVWaWV3RWwsICd0b29sLXBhbmVsOnVuZm9jdXMnLCAoKSA9PlxuICAgICAgaGlkZVRyZWVWaWV3KClcbiAgICApLFxuICApO1xuXG4gIGZvcihsZXQgYWN0aW9uIG9mIFsnZXhwYW5kJywgJ2NvbGxhcHNlJ10pIHtcbiAgICBkaXNwb3NhYmxlcy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgW2B0cmVlLXZpZXc6JHthY3Rpb259LWRpcmVjdG9yeWBdOiByZXNpemVUcmVlVmlldyxcbiAgICAgIFtgdHJlZS12aWV3OnJlY3Vyc2l2ZS0ke2FjdGlvbn0tZGlyZWN0b3J5YF06IHJlc2l6ZVRyZWVWaWV3LFxuICAgIH0pKTtcbiAgfVxuXG4gIC8vIGhpZGUgdGhlIHRyZWUgdmlldyB3aGVuIGEgZmlsZSBpcyBvcGVuZWQgYnkgYSBjb21tYW5kXG4gIGZvcihsZXQgZGlyZWN0aW9uIG9mIFsnJywgJy1yaWdodCcsICctbGVmdCcsICctdXAnLCAnLWRvd24nXSkge1xuICAgIGRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCBgdHJlZS12aWV3Om9wZW4tc2VsZWN0ZWQtZW50cnkke2RpcmVjdGlvbn1gLCBkaWRPcGVuRmlsZSkpO1xuICB9XG5cbiAgZm9yKGxldCBpIG9mIFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5XSkge1xuICAgIGRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCBgdHJlZS12aWV3Om9wZW4tc2VsZWN0ZWQtZW50cnktaW4tcGFuZS0ke2l9YCwgZGlkT3BlbkZpbGUpKTtcbiAgfVxuXG4gIHJldHVybiBkaXNwb3NhYmxlcztcbn1cblxuZnVuY3Rpb24gZGlkT3BlbkZpbGUoKSB7XG4gIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge1xuICAgIHN0b3JlRm9jdXNlZEVsZW1lbnQoYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSkpO1xuICAgIGhpZGVUcmVlVmlldygpO1xuICB9KTtcbn1cbiJdfQ==
//# sourceURL=/Users/marcoslamuria/.atom/packages/autohide-tree-view/lib/commands.js
