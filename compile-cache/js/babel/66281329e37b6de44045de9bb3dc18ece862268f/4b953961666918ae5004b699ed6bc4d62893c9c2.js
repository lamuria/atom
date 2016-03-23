Object.defineProperty(exports, '__esModule', {
  value: true
});

var _mainJs = require('./main.js');

var _autohideTreeViewJs = require('./autohide-tree-view.js');

var _utilsJs = require('./utils.js');

'use babel';

var pinView = document.createElement('div');
pinView.classList.add('tree-view-pin-button', 'icon', 'icon-pin');
(0, _utilsJs.domListener)(pinView, 'mousedown', function () {
  return (0, _autohideTreeViewJs.toggleAutohide)();
});

exports['default'] = {
  attach: function attach() {
    _mainJs.treeViewEl.querySelector('.tree-view-scroller').appendChild(pinView);
    this.deactivate();
  },

  detach: function detach() {
    pinView.remove();
    if (tooltip) tooltip.dispose();
  },

  show: function show() {
    pinView.style.display = '';
  },

  hide: function hide() {
    pinView.style.display = 'none';
  },

  activate: function activate() {
    pinView.classList.add('active');
    setTooltip('Pin tree-view');
  },

  deactivate: function deactivate() {
    pinView.classList.remove('active');
    setTooltip('Unpin tree-view');
  },

  isActive: function isActive() {
    return !!pinView.parentNode && pinView.classList.contains('active');
  }
};

var tooltip;

function setTooltip(title) {
  if (tooltip) tooltip.dispose();
  tooltip = atom.tooltips.add(pinView, { title: title });
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXJjb3NsYW11cmlhLy5hdG9tL3BhY2thZ2VzL2F1dG9oaWRlLXRyZWUtdmlldy9saWIvcGluLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztzQkFDeUIsV0FBVzs7a0NBQ1AseUJBQXlCOzt1QkFDNUIsWUFBWTs7QUFIdEMsV0FBVyxDQUFDOztBQUtaLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDNUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEVBQUUsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ2xFLDBCQUFZLE9BQU8sRUFBRSxXQUFXLEVBQUU7U0FBTSx5Q0FBZ0I7Q0FBQSxDQUFDLENBQUM7O3FCQUUzQztBQUNiLFFBQU0sRUFBQSxrQkFBRztBQUNQLHVCQUFXLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNyRSxRQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7R0FDbkI7O0FBRUQsUUFBTSxFQUFBLGtCQUFHO0FBQ1AsV0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2pCLFFBQUcsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztHQUMvQjs7QUFFRCxNQUFJLEVBQUEsZ0JBQUc7QUFDTCxXQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7R0FDNUI7O0FBRUQsTUFBSSxFQUFBLGdCQUFHO0FBQ0wsV0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0dBQ2hDOztBQUVELFVBQVEsRUFBQSxvQkFBRztBQUNULFdBQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2hDLGNBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQztHQUM3Qjs7QUFFRCxZQUFVLEVBQUEsc0JBQUc7QUFDWCxXQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNuQyxjQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQztHQUMvQjs7QUFFRCxVQUFRLEVBQUEsb0JBQUc7QUFDVCxXQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0dBQ3JFO0NBQ0Y7O0FBRUQsSUFBSSxPQUFPLENBQUM7O0FBRVosU0FBUyxVQUFVLENBQUMsS0FBSyxFQUFFO0FBQ3pCLE1BQUcsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM5QixTQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUMsS0FBSyxFQUFMLEtBQUssRUFBQyxDQUFDLENBQUM7Q0FDL0MiLCJmaWxlIjoiL1VzZXJzL21hcmNvc2xhbXVyaWEvLmF0b20vcGFja2FnZXMvYXV0b2hpZGUtdHJlZS12aWV3L2xpYi9waW4tdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuaW1wb3J0IHt0cmVlVmlld0VsfSBmcm9tICcuL21haW4uanMnO1xuaW1wb3J0IHt0b2dnbGVBdXRvaGlkZX0gZnJvbSAnLi9hdXRvaGlkZS10cmVlLXZpZXcuanMnO1xuaW1wb3J0IHtkb21MaXN0ZW5lcn0gZnJvbSAnLi91dGlscy5qcyc7XG5cbnZhciBwaW5WaWV3ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5waW5WaWV3LmNsYXNzTGlzdC5hZGQoJ3RyZWUtdmlldy1waW4tYnV0dG9uJywgJ2ljb24nLCAnaWNvbi1waW4nKTtcbmRvbUxpc3RlbmVyKHBpblZpZXcsICdtb3VzZWRvd24nLCAoKSA9PiB0b2dnbGVBdXRvaGlkZSgpKTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBhdHRhY2goKSB7XG4gICAgdHJlZVZpZXdFbC5xdWVyeVNlbGVjdG9yKCcudHJlZS12aWV3LXNjcm9sbGVyJykuYXBwZW5kQ2hpbGQocGluVmlldyk7XG4gICAgdGhpcy5kZWFjdGl2YXRlKCk7XG4gIH0sXG5cbiAgZGV0YWNoKCkge1xuICAgIHBpblZpZXcucmVtb3ZlKCk7XG4gICAgaWYodG9vbHRpcCkgdG9vbHRpcC5kaXNwb3NlKCk7XG4gIH0sXG5cbiAgc2hvdygpIHtcbiAgICBwaW5WaWV3LnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgfSxcblxuICBoaWRlKCkge1xuICAgIHBpblZpZXcuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfSxcblxuICBhY3RpdmF0ZSgpIHtcbiAgICBwaW5WaWV3LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIHNldFRvb2x0aXAoJ1BpbiB0cmVlLXZpZXcnKTtcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHBpblZpZXcuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgc2V0VG9vbHRpcCgnVW5waW4gdHJlZS12aWV3Jyk7XG4gIH0sXG5cbiAgaXNBY3RpdmUoKSB7XG4gICAgcmV0dXJuICEhcGluVmlldy5wYXJlbnROb2RlICYmIHBpblZpZXcuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKTtcbiAgfSxcbn07XG5cbnZhciB0b29sdGlwO1xuXG5mdW5jdGlvbiBzZXRUb29sdGlwKHRpdGxlKSB7XG4gIGlmKHRvb2x0aXApIHRvb2x0aXAuZGlzcG9zZSgpO1xuICB0b29sdGlwID0gYXRvbS50b29sdGlwcy5hZGQocGluVmlldywge3RpdGxlfSk7XG59XG4iXX0=
//# sourceURL=/Users/marcoslamuria/.atom/packages/autohide-tree-view/lib/pin-view.js
