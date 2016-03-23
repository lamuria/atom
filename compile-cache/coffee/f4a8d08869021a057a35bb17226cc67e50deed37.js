(function() {
  var helpers;

  helpers = require('./spec-helper');

  describe("Scrolling", function() {
    var editor, editorElement, keydown, vimState, _ref;
    _ref = [], editor = _ref[0], editorElement = _ref[1], vimState = _ref[2];
    beforeEach(function() {
      var vimMode;
      vimMode = atom.packages.loadPackage('vim-mode');
      vimMode.activateResources();
      return helpers.getEditorElement(function(element) {
        editorElement = element;
        editor = editorElement.getModel();
        vimState = editorElement.vimState;
        vimState.activateNormalMode();
        vimState.resetNormalMode();
        return jasmine.attachToDOM(element);
      });
    });
    keydown = function(key, options) {
      if (options == null) {
        options = {};
      }
      if (options.element == null) {
        options.element = editorElement;
      }
      return helpers.keydown(key, options);
    };
    describe("scrolling keybindings", function() {
      beforeEach(function() {
        editor.setText("100\n200\n300\n400\n500\n600\n700\n800\n900\n1000");
        editor.setCursorBufferPosition([1, 2]);
        editorElement.setHeight(editorElement.getHeight() * 4 / 10);
        return expect(editor.getVisibleRowRange()).toEqual([0, 4]);
      });
      return describe("the ctrl-e and ctrl-y keybindings", function() {
        return it("moves the screen up and down by one and keeps cursor onscreen", function() {
          keydown('e', {
            ctrl: true
          });
          expect(editor.getFirstVisibleScreenRow()).toBe(1);
          expect(editor.getLastVisibleScreenRow()).toBe(5);
          expect(editor.getCursorScreenPosition()).toEqual([2, 2]);
          keydown('2');
          keydown('e', {
            ctrl: true
          });
          expect(editor.getFirstVisibleScreenRow()).toBe(3);
          expect(editor.getLastVisibleScreenRow()).toBe(7);
          expect(editor.getCursorScreenPosition()).toEqual([4, 2]);
          keydown('2');
          keydown('y', {
            ctrl: true
          });
          expect(editor.getFirstVisibleScreenRow()).toBe(1);
          expect(editor.getLastVisibleScreenRow()).toBe(5);
          return expect(editor.getCursorScreenPosition()).toEqual([2, 2]);
        });
      });
    });
    describe("scroll cursor keybindings", function() {
      beforeEach(function() {
        var i, text, _i;
        text = "";
        for (i = _i = 1; _i <= 200; i = ++_i) {
          text += "" + i + "\n";
        }
        editor.setText(text);
        spyOn(editor, 'moveToFirstCharacterOfLine');
        spyOn(editorElement, 'setScrollTop');
        editorElement.style.lineHeight = "20px";
        editorElement.component.sampleFontStyling();
        editorElement.setHeight(200);
        spyOn(editorElement, 'getFirstVisibleScreenRow').andReturn(90);
        return spyOn(editorElement, 'getLastVisibleScreenRow').andReturn(110);
      });
      describe("the z<CR> keybinding", function() {
        var keydownCodeForEnter;
        keydownCodeForEnter = '\r';
        beforeEach(function() {
          return spyOn(editorElement, 'pixelPositionForScreenPosition').andReturn({
            top: 1000,
            left: 0
          });
        });
        return it("moves the screen to position cursor at the top of the window and moves cursor to first non-blank in the line", function() {
          keydown('z');
          keydown(keydownCodeForEnter);
          expect(editorElement.setScrollTop).toHaveBeenCalledWith(960);
          return expect(editor.moveToFirstCharacterOfLine).toHaveBeenCalled();
        });
      });
      describe("the zt keybinding", function() {
        beforeEach(function() {
          return spyOn(editorElement, 'pixelPositionForScreenPosition').andReturn({
            top: 1000,
            left: 0
          });
        });
        return it("moves the screen to position cursor at the top of the window and leave cursor in the same column", function() {
          keydown('z');
          keydown('t');
          expect(editorElement.setScrollTop).toHaveBeenCalledWith(960);
          return expect(editor.moveToFirstCharacterOfLine).not.toHaveBeenCalled();
        });
      });
      describe("the z. keybinding", function() {
        beforeEach(function() {
          return spyOn(editorElement, 'pixelPositionForScreenPosition').andReturn({
            top: 1000,
            left: 0
          });
        });
        return it("moves the screen to position cursor at the center of the window and moves cursor to first non-blank in the line", function() {
          keydown('z');
          keydown('.');
          expect(editorElement.setScrollTop).toHaveBeenCalledWith(900);
          return expect(editor.moveToFirstCharacterOfLine).toHaveBeenCalled();
        });
      });
      describe("the zz keybinding", function() {
        beforeEach(function() {
          return spyOn(editorElement, 'pixelPositionForScreenPosition').andReturn({
            top: 1000,
            left: 0
          });
        });
        return it("moves the screen to position cursor at the center of the window and leave cursor in the same column", function() {
          keydown('z');
          keydown('z');
          expect(editorElement.setScrollTop).toHaveBeenCalledWith(900);
          return expect(editor.moveToFirstCharacterOfLine).not.toHaveBeenCalled();
        });
      });
      describe("the z- keybinding", function() {
        beforeEach(function() {
          return spyOn(editorElement, 'pixelPositionForScreenPosition').andReturn({
            top: 1000,
            left: 0
          });
        });
        return it("moves the screen to position cursor at the bottom of the window and moves cursor to first non-blank in the line", function() {
          keydown('z');
          keydown('-');
          expect(editorElement.setScrollTop).toHaveBeenCalledWith(860);
          return expect(editor.moveToFirstCharacterOfLine).toHaveBeenCalled();
        });
      });
      return describe("the zb keybinding", function() {
        beforeEach(function() {
          return spyOn(editorElement, 'pixelPositionForScreenPosition').andReturn({
            top: 1000,
            left: 0
          });
        });
        return it("moves the screen to position cursor at the bottom of the window and leave cursor in the same column", function() {
          keydown('z');
          keydown('b');
          expect(editorElement.setScrollTop).toHaveBeenCalledWith(860);
          return expect(editor.moveToFirstCharacterOfLine).not.toHaveBeenCalled();
        });
      });
    });
    return describe("horizontal scroll cursor keybindings", function() {
      beforeEach(function() {
        var i, text, _i;
        editorElement.setWidth(600);
        editorElement.setHeight(600);
        editorElement.style.lineHeight = "10px";
        editorElement.style.font = "16px monospace";
        atom.views.performDocumentPoll();
        text = "";
        for (i = _i = 100; _i <= 199; i = ++_i) {
          text += "" + i + " ";
        }
        editor.setText(text);
        return editor.setCursorBufferPosition([0, 0]);
      });
      describe("the zs keybinding", function() {
        var startPosition, zsPos;
        zsPos = function(pos) {
          editor.setCursorBufferPosition([0, pos]);
          keydown('z');
          keydown('s');
          return editorElement.getScrollLeft();
        };
        startPosition = NaN;
        beforeEach(function() {
          return startPosition = editorElement.getScrollLeft();
        });
        it("does nothing near the start of the line", function() {
          var pos1;
          pos1 = zsPos(1);
          return expect(pos1).toEqual(startPosition);
        });
        it("moves the cursor the nearest it can to the left edge of the editor", function() {
          var pos10, pos11;
          pos10 = zsPos(10);
          expect(pos10).toBeGreaterThan(startPosition);
          pos11 = zsPos(11);
          return expect(pos11 - pos10).toEqual(10);
        });
        it("does nothing near the end of the line", function() {
          var pos340, pos342, pos390, posEnd;
          posEnd = zsPos(399);
          expect(editor.getCursorBufferPosition()).toEqual([0, 399]);
          pos390 = zsPos(390);
          expect(pos390).toEqual(posEnd);
          expect(editor.getCursorBufferPosition()).toEqual([0, 390]);
          pos340 = zsPos(340);
          expect(pos340).toBeLessThan(posEnd);
          pos342 = zsPos(342);
          return expect(pos342 - pos340).toEqual(19);
        });
        return it("does nothing if all lines are short", function() {
          var pos1, pos10;
          editor.setText('short');
          startPosition = editorElement.getScrollLeft();
          pos1 = zsPos(1);
          expect(pos1).toEqual(startPosition);
          expect(editor.getCursorBufferPosition()).toEqual([0, 1]);
          pos10 = zsPos(10);
          expect(pos10).toEqual(startPosition);
          return expect(editor.getCursorBufferPosition()).toEqual([0, 4]);
        });
      });
      return describe("the ze keybinding", function() {
        var startPosition, zePos;
        zePos = function(pos) {
          editor.setCursorBufferPosition([0, pos]);
          keydown('z');
          keydown('e');
          return editorElement.getScrollLeft();
        };
        startPosition = NaN;
        beforeEach(function() {
          return startPosition = editorElement.getScrollLeft();
        });
        it("does nothing near the start of the line", function() {
          var pos1, pos40;
          pos1 = zePos(1);
          expect(pos1).toEqual(startPosition);
          pos40 = zePos(40);
          return expect(pos40).toEqual(startPosition);
        });
        it("moves the cursor the nearest it can to the right edge of the editor", function() {
          var pos109, pos110;
          pos110 = zePos(110);
          expect(pos110).toBeGreaterThan(startPosition);
          pos109 = zePos(109);
          return expect(pos110 - pos109).toEqual(10);
        });
        it("does nothing when very near the end of the line", function() {
          var pos380, pos382, pos397, posEnd;
          posEnd = zePos(399);
          expect(editor.getCursorBufferPosition()).toEqual([0, 399]);
          pos397 = zePos(397);
          expect(pos397).toEqual(posEnd);
          expect(editor.getCursorBufferPosition()).toEqual([0, 397]);
          pos380 = zePos(380);
          expect(pos380).toBeLessThan(posEnd);
          pos382 = zePos(382);
          return expect(pos382 - pos380).toEqual(19);
        });
        return it("does nothing if all lines are short", function() {
          var pos1, pos10;
          editor.setText('short');
          startPosition = editorElement.getScrollLeft();
          pos1 = zePos(1);
          expect(pos1).toEqual(startPosition);
          expect(editor.getCursorBufferPosition()).toEqual([0, 1]);
          pos10 = zePos(10);
          expect(pos10).toEqual(startPosition);
          return expect(editor.getCursorBufferPosition()).toEqual([0, 4]);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL21hcmNvc2xhbXVyaWEvLmF0b20vcGFja2FnZXMvdmltLW1vZGUvc3BlYy9zY3JvbGwtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsT0FBQTs7QUFBQSxFQUFBLE9BQUEsR0FBVSxPQUFBLENBQVEsZUFBUixDQUFWLENBQUE7O0FBQUEsRUFFQSxRQUFBLENBQVMsV0FBVCxFQUFzQixTQUFBLEdBQUE7QUFDcEIsUUFBQSw4Q0FBQTtBQUFBLElBQUEsT0FBb0MsRUFBcEMsRUFBQyxnQkFBRCxFQUFTLHVCQUFULEVBQXdCLGtCQUF4QixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxPQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFkLENBQTBCLFVBQTFCLENBQVYsQ0FBQTtBQUFBLE1BQ0EsT0FBTyxDQUFDLGlCQUFSLENBQUEsQ0FEQSxDQUFBO2FBR0EsT0FBTyxDQUFDLGdCQUFSLENBQXlCLFNBQUMsT0FBRCxHQUFBO0FBQ3ZCLFFBQUEsYUFBQSxHQUFnQixPQUFoQixDQUFBO0FBQUEsUUFDQSxNQUFBLEdBQVMsYUFBYSxDQUFDLFFBQWQsQ0FBQSxDQURULENBQUE7QUFBQSxRQUVBLFFBQUEsR0FBVyxhQUFhLENBQUMsUUFGekIsQ0FBQTtBQUFBLFFBR0EsUUFBUSxDQUFDLGtCQUFULENBQUEsQ0FIQSxDQUFBO0FBQUEsUUFJQSxRQUFRLENBQUMsZUFBVCxDQUFBLENBSkEsQ0FBQTtlQUtBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLE9BQXBCLEVBTnVCO01BQUEsQ0FBekIsRUFKUztJQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFjQSxPQUFBLEdBQVUsU0FBQyxHQUFELEVBQU0sT0FBTixHQUFBOztRQUFNLFVBQVE7T0FDdEI7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

//# sourceURL=/Users/marcoslamuria/.atom/packages/vim-mode/spec/scroll-spec.coffee
