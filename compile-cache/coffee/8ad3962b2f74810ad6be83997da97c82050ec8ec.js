(function() {
  var pkg;

  pkg = "foldername-tabs";

  describe("FoldernameTabs", function() {
    var activationPromise, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1];
    beforeEach(function() {
      atom.devMode = true;
      atom.config.set("" + pkg + ".debug", 2);
      workspaceElement = atom.views.getView(atom.workspace);
      return waitsForPromise(function() {
        return atom.packages.activatePackage("tabs").then(function() {
          return atom.workspace.open('sample.js');
        }).then(function() {
          return atom.packages.activatePackage(pkg);
        });
      });
    });
    return describe("when the foldername-tabs:toggle event is triggered", function() {
      return it("removes and adds foldernames in tabs", function() {
        return runs(function() {
          var fntElement;
          expect(workspaceElement.querySelector('.tab-bar')).toExist();
          fntElement = workspaceElement.querySelector('div.foldername-tabs');
          expect(fntElement).toExist();
          expect(fntElement.querySelector("span.folder").innerHTML).toEqual("/");
          expect(fntElement.querySelector("span.file").innerHTML).toEqual("sample.js");
          atom.commands.dispatch(workspaceElement, 'foldername-tabs:toggle');
          expect(workspaceElement.querySelector('div.foldername-tabs')).not.toExist();
          return expect(workspaceElement.querySelector('.tab-bar div.title').innerHTML).toEqual("sample.js");
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL21hcmNvc2xhbXVyaWEvLmF0b20vcGFja2FnZXMvZm9sZGVybmFtZS10YWJzL3NwZWMvZm9sZGVybmFtZS10YWJzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLEdBQUE7O0FBQUEsRUFBQSxHQUFBLEdBQU0saUJBQU4sQ0FBQTs7QUFBQSxFQUNBLFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBLEdBQUE7QUFDekIsUUFBQSx5Q0FBQTtBQUFBLElBQUEsT0FBd0MsRUFBeEMsRUFBQywwQkFBRCxFQUFtQiwyQkFBbkIsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsSUFBSSxDQUFDLE9BQUwsR0FBZSxJQUFmLENBQUE7QUFBQSxNQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixFQUFBLEdBQUcsR0FBSCxHQUFPLFFBQXZCLEVBQStCLENBQS9CLENBREEsQ0FBQTtBQUFBLE1BRUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUZuQixDQUFBO2FBR0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsTUFBOUIsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFBLEdBQUE7aUJBQ0osSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFdBQXBCLEVBREk7UUFBQSxDQUROLENBR0EsQ0FBQyxJQUhELENBR00sU0FBQSxHQUFBO2lCQUNKLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixHQUE5QixFQURJO1FBQUEsQ0FITixFQURjO01BQUEsQ0FBaEIsRUFKUztJQUFBLENBQVgsQ0FGQSxDQUFBO1dBYUEsUUFBQSxDQUFTLG9EQUFULEVBQStELFNBQUEsR0FBQTthQUM3RCxFQUFBLENBQUcsc0NBQUgsRUFBMkMsU0FBQSxHQUFBO2VBQ3pDLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxjQUFBLFVBQUE7QUFBQSxVQUFBLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixVQUEvQixDQUFQLENBQWtELENBQUMsT0FBbkQsQ0FBQSxDQUFBLENBQUE7QUFBQSxVQUNBLFVBQUEsR0FBYSxnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixxQkFBL0IsQ0FEYixDQUFBO0FBQUEsVUFFQSxNQUFBLENBQU8sVUFBUCxDQUFrQixDQUFDLE9BQW5CLENBQUEsQ0FGQSxDQUFBO0FBQUEsVUFHQSxNQUFBLENBQU8sVUFBVSxDQUFDLGFBQVgsQ0FBeUIsYUFBekIsQ0FBdUMsQ0FBQyxTQUEvQyxDQUNFLENBQUMsT0FESCxDQUNXLEdBRFgsQ0FIQSxDQUFBO0FBQUEsVUFLQSxNQUFBLENBQU8sVUFBVSxDQUFDLGFBQVgsQ0FBeUIsV0FBekIsQ0FBcUMsQ0FBQyxTQUE3QyxDQUNFLENBQUMsT0FESCxDQUNXLFdBRFgsQ0FMQSxDQUFBO0FBQUEsVUFPQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLHdCQUF6QyxDQVBBLENBQUE7QUFBQSxVQVFBLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixxQkFBL0IsQ0FBUCxDQUE2RCxDQUFDLEdBQzVELENBQUMsT0FESCxDQUFBLENBUkEsQ0FBQTtpQkFVQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0Isb0JBQS9CLENBQW9ELENBQUMsU0FBNUQsQ0FDRSxDQUFDLE9BREgsQ0FDVyxXQURYLEVBWEc7UUFBQSxDQUFMLEVBRHlDO01BQUEsQ0FBM0MsRUFENkQ7SUFBQSxDQUEvRCxFQWR5QjtFQUFBLENBQTNCLENBREEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/marcoslamuria/.atom/packages/foldername-tabs/spec/foldername-tabs-spec.coffee
