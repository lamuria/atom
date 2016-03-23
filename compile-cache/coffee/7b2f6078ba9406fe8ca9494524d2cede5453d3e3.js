(function() {
  var pkg;

  pkg = "smart-tab-name";

  describe("SmartTabName", function() {
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
    return describe("when the smart-tab-name:toggle event is triggered", function() {
      return it("adjust path in tabs", function() {
        return runs(function() {
          var fntElement;
          expect(workspaceElement.querySelector('.tab-bar')).toExist();
          fntElement = workspaceElement.querySelector('div.smart-tab-name');
          expect(fntElement).toExist();
          expect(fntElement.querySelector("span.folder").innerHTML).toEqual("/");
          expect(fntElement.querySelector("span.file").innerHTML).toEqual("sample.js");
          atom.commands.dispatch(workspaceElement, 'smart-tab-name:toggle');
          expect(workspaceElement.querySelector('div.smart-tab-name')).not.toExist();
          return expect(workspaceElement.querySelector('.tab-bar div.title').innerHTML).toEqual("sample.js");
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL21hcmNvc2xhbXVyaWEvLmF0b20vcGFja2FnZXMvc21hcnQtdGFiLW5hbWUvc3BlYy9zbWFydC10YWItbmFtZS1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxHQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLGdCQUFOLENBQUE7O0FBQUEsRUFDQSxRQUFBLENBQVMsY0FBVCxFQUF5QixTQUFBLEdBQUE7QUFDdkIsUUFBQSx5Q0FBQTtBQUFBLElBQUEsT0FBd0MsRUFBeEMsRUFBQywwQkFBRCxFQUFtQiwyQkFBbkIsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsSUFBSSxDQUFDLE9BQUwsR0FBZSxJQUFmLENBQUE7QUFBQSxNQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixFQUFBLEdBQUcsR0FBSCxHQUFPLFFBQXZCLEVBQStCLENBQS9CLENBREEsQ0FBQTtBQUFBLE1BRUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUZuQixDQUFBO2FBR0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsTUFBOUIsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFBLEdBQUE7aUJBQ0osSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFdBQXBCLEVBREk7UUFBQSxDQUROLENBR0EsQ0FBQyxJQUhELENBR00sU0FBQSxHQUFBO2lCQUNKLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixHQUE5QixFQURJO1FBQUEsQ0FITixFQURjO01BQUEsQ0FBaEIsRUFKUztJQUFBLENBQVgsQ0FGQSxDQUFBO1dBYUEsUUFBQSxDQUFTLG1EQUFULEVBQThELFNBQUEsR0FBQTthQUM1RCxFQUFBLENBQUcscUJBQUgsRUFBMEIsU0FBQSxHQUFBO2VBQ3hCLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxjQUFBLFVBQUE7QUFBQSxVQUFBLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixVQUEvQixDQUFQLENBQWtELENBQUMsT0FBbkQsQ0FBQSxDQUFBLENBQUE7QUFBQSxVQUNBLFVBQUEsR0FBYSxnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixvQkFBL0IsQ0FEYixDQUFBO0FBQUEsVUFFQSxNQUFBLENBQU8sVUFBUCxDQUFrQixDQUFDLE9BQW5CLENBQUEsQ0FGQSxDQUFBO0FBQUEsVUFHQSxNQUFBLENBQU8sVUFBVSxDQUFDLGFBQVgsQ0FBeUIsYUFBekIsQ0FBdUMsQ0FBQyxTQUEvQyxDQUNFLENBQUMsT0FESCxDQUNXLEdBRFgsQ0FIQSxDQUFBO0FBQUEsVUFLQSxNQUFBLENBQU8sVUFBVSxDQUFDLGFBQVgsQ0FBeUIsV0FBekIsQ0FBcUMsQ0FBQyxTQUE3QyxDQUNFLENBQUMsT0FESCxDQUNXLFdBRFgsQ0FMQSxDQUFBO0FBQUEsVUFPQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLHVCQUF6QyxDQVBBLENBQUE7QUFBQSxVQVFBLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixvQkFBL0IsQ0FBUCxDQUE0RCxDQUFDLEdBQzNELENBQUMsT0FESCxDQUFBLENBUkEsQ0FBQTtpQkFVQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0Isb0JBQS9CLENBQW9ELENBQUMsU0FBNUQsQ0FDRSxDQUFDLE9BREgsQ0FDVyxXQURYLEVBWEc7UUFBQSxDQUFMLEVBRHdCO01BQUEsQ0FBMUIsRUFENEQ7SUFBQSxDQUE5RCxFQWR1QjtFQUFBLENBQXpCLENBREEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/marcoslamuria/.atom/packages/smart-tab-name/spec/smart-tab-name-spec.coffee
