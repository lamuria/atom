
/*
 * Modifierhandling shamelessly stolen and customized from brackets:
 * https://github.com/adobe/brackets/blob/master/src/command/KeyBindingManager.js
 */

(function() {
  var KeyEvent, ModifierStateHandler;

  KeyEvent = require('./key-event');

  module.exports = ModifierStateHandler = (function() {

    /**
     * States of Ctrl key down detection
     * @enum {number}
     */
    var LINUX_ALTGR_IDENTIFIER;

    ModifierStateHandler.prototype.CtrlDownStates = {
      'NOT_YET_DETECTED': 0,
      'DETECTED': 1,
      'DETECTED_AND_IGNORED': 2
    };


    /**
     * Flags used to determine whether right Alt key is pressed. When it is pressed,
     * the following two keydown events are triggered in that specific order.
     *
     *    1. ctrlDown - flag used to record { ctrlKey: true, keyIdentifier: "Control", ... } keydown event
     *    2. altGrDown - flag used to record { ctrlKey: true, altKey: true, keyIdentifier: "Alt", ... } keydown event
     *
     * @type {CtrlDownStates|boolean}
     */

    ModifierStateHandler.prototype.ctrlDown = 0;

    ModifierStateHandler.prototype.altGrDown = false;

    ModifierStateHandler.prototype.hasShift = false;

    ModifierStateHandler.prototype.hasCtrl = false;

    ModifierStateHandler.prototype.hasAltGr = false;

    ModifierStateHandler.prototype.hasAlt = false;

    ModifierStateHandler.prototype.hasCmd = false;


    /**
     * Constant used for checking the interval between Control keydown event and Alt keydown event.
     * If the right Alt key is down we get Control keydown followed by Alt keydown within 30 ms. if
     * the user is pressing Control key and then Alt key, the interval will be larger than 30 ms.
     * @type {number}
     */

    ModifierStateHandler.prototype.MAX_INTERVAL_FOR_CTRL_ALT_KEYS = 30;


    /**
     * Constant used for identifying AltGr on Linux
     * @type {String}
     */

    LINUX_ALTGR_IDENTIFIER = 'U+00E1';


    /**
     * Used to record the timeStamp property of the last keydown event.
     * @type {number}
     */

    ModifierStateHandler.prototype.lastTimeStamp = null;


    /**
     * Used to record the keyIdentifier property of the last keydown event.
     * @type {string}
     */

    ModifierStateHandler.prototype.lastKeyIdentifier = null;


    /**
     * keyUpListener for AltGrMode recognition
     * @type {event}
     */

    ModifierStateHandler.prototype.keyUpEventListener = null;


    /**
     * clear modifiers listener on editor blur and focus
     * @type {event}
     */

    ModifierStateHandler.prototype.clearModifierStateListener = null;

    function ModifierStateHandler() {
      this.clearModifierStateListener = (function(_this) {
        return function() {
          return _this.clearModifierState();
        };
      })(this);
      window.addEventListener('blur', this.clearModifierStateListener);
      window.addEventListener('focus', this.clearModifierStateListener);
    }

    ModifierStateHandler.prototype.destroy = function() {
      window.removeEventListener('blur', this.clearModifierStateListener);
      return window.removeEventListener('focus', this.clearModifierStateListener);
    };

    ModifierStateHandler.prototype.clearModifierState = function() {
      if (process.platform === 'win32') {
        this.quitAltGrMode();
      }
      this.hasShift = false;
      this.hasCtrl = false;
      this.hasAltGr = false;
      this.hasAlt = false;
      return this.hasCmd = false;
    };


    /**
     * Resets all the flags and removes onAltGrUp event listener.
     */

    ModifierStateHandler.prototype.quitAltGrMode = function() {
      this.ctrlDown = this.CtrlDownStates.NOT_YET_DETECTED;
      this.altGrDown = false;
      this.hasAltGr = false;
      this.lastTimeStamp = null;
      this.lastKeyIdentifier = null;
      return document.removeEventListener('keyup', this.keyUpEventListener);
    };


    /**
     * Detects the release of AltGr key by checking all keyup events
     * until we receive one with ctrl key code. Once detected, reset
     * all the flags and also remove this event listener.
     *
     * @param {KeyboardEvent} e keyboard event object
     */

    ModifierStateHandler.prototype.onAltGrUp = function(e) {
      var key;
      if (process.platform === 'win32') {
        key = e.keyCode || e.which;
        if (this.altGrDown && key === KeyEvent.DOM_VK_CONTROL) {
          this.quitAltGrMode();
        }
      }
      if (process.platform === 'linux') {
        if (e.keyIdentifier === LINUX_ALTGR_IDENTIFIER) {
          return this.quitAltGrMode();
        }
      }
    };


    /**
     * Detects whether AltGr key is pressed. When it is pressed, the first keydown event has
     * ctrlKey === true with keyIdentifier === "Control". The next keydown event with
     * altKey === true, ctrlKey === true and keyIdentifier === "Alt" is sent within 30 ms. Then
     * the next keydown event with altKey === true, ctrlKey === true and keyIdentifier === "Control"
     * is sent. If the user keep holding AltGr key down, then the second and third
     * keydown events are repeatedly sent out alternately. If the user is also holding down Ctrl
     * key, then either keyIdentifier === "Control" or keyIdentifier === "Alt" is repeatedly sent
     * but not alternately.
     *
     * @param {KeyboardEvent} e keyboard event object
     */

    ModifierStateHandler.prototype.detectAltGrKeyDown = function(e) {
      if (process.platform === 'win32') {
        if (!this.altGrDown) {
          if (this.ctrlDown !== this.CtrlDownStates.DETECTED_AND_IGNORED && e.ctrlKey && e.keyIdentifier === 'Control') {
            this.ctrlDown = this.CtrlDownStates.DETECTED;
          } else if (e.repeat && e.ctrlKey && e.keyIdentifier === 'Control') {
            this.ctrlDown = this.CtrlDownStates.DETECTED_AND_IGNORED;
          } else if (this.ctrlDown === this.CtrlDownStates.DETECTED && e.altKey && e.ctrlKey && e.keyIdentifier === 'Alt' && e.timeStamp - this.lastTimeStamp < this.MAX_INTERVAL_FOR_CTRL_ALT_KEYS && (e.location === 2 || e.keyLocation === 2)) {
            this.altGrDown = true;
            this.lastKeyIdentifier = 'Alt';
            this.keyUpEventListener = (function(_this) {
              return function(e) {
                return _this.onAltGrUp(e);
              };
            })(this);
            document.addEventListener('keyup', this.keyUpEventListener);
          } else {
            this.ctrlDown = this.CtrlDownStates.NOT_YET_DETECTED;
          }
          this.lastTimeStamp = e.timeStamp;
        } else if (e.keyIdentifier === 'Control' || e.keyIdentifier === 'Alt') {
          if (e.altKey && e.ctrlKey && e.keyIdentifier === this.lastKeyIdentifier) {
            this.quitAltGrMode();
          } else {
            this.lastKeyIdentifier = e.keyIdentifier;
          }
        }
      }
      if (process.platform === 'linux') {
        if (!this.altGrDown) {
          if (e.keyIdentifier === LINUX_ALTGR_IDENTIFIER) {
            this.altGrDown = true;
            this.keyUpEventListener = (function(_this) {
              return function(e) {
                return _this.onAltGrUp(e);
              };
            })(this);
            return document.addEventListener('keyup', this.keyUpEventListener);
          }
        }
      } else {

      }
    };


    /**
     * Handle key event
     *
     * @param {KeyboardEvent} e keyboard event object
     */

    ModifierStateHandler.prototype.handleKeyEvent = function(e) {
      this.detectAltGrKeyDown(e);
      if (process.platform === 'win32') {
        this.hasCtrl = !this.altGrDown && e.ctrlKey;
        this.hasAltGr = this.altGrDown;
        this.hasAlt = !this.altGrDown && e.altKey;
      } else if (process.platform === 'linux') {
        this.hasCtrl = e.ctrlKey;
        this.hasAltGr = this.altGrDown;
        this.hasAlt = e.altKey;
      } else {
        this.hasCtrl = (e.ctrlKey != null) && e.ctrlKey === true;
        this.hasAltGr = e.altKey;
        this.hasAlt = e.altKey;
      }
      this.hasShift = e.shiftKey;
      return this.hasCmd = (e.metaKey != null) && e.metaKey === true;
    };


    /**
     * determine if shift key is pressed
     */

    ModifierStateHandler.prototype.isShift = function() {
      return this.hasShift;
    };


    /**
     * determine if altgr key is pressed
     */

    ModifierStateHandler.prototype.isAltGr = function() {
      return this.hasAltGr;
    };


    /**
     * determine if alt key is pressed
     */

    ModifierStateHandler.prototype.isAlt = function() {
      return this.hasAlt;
    };


    /**
     * determine if ctrl key is pressed
     */

    ModifierStateHandler.prototype.isCtrl = function() {
      return this.hasCtrl;
    };


    /**
     * determine if cmd key is pressed
     */

    ModifierStateHandler.prototype.isCmd = function() {
      return this.hasCmd;
    };


    /**
     * get the state of all modifiers
     * @return {object}
     */

    ModifierStateHandler.prototype.getState = function() {
      return {
        shift: this.isShift(),
        altgr: this.isAltGr(),
        alt: this.isAlt(),
        ctrl: this.isCtrl(),
        cmd: this.isCmd()
      };
    };


    /**
     * get the modifier sequence string.
     * Additionally with a character
     * @param {String} character
     * @return {String}
     */

    ModifierStateHandler.prototype.getStrokeSequence = function(character) {
      var sequence;
      sequence = [];
      if (this.isCtrl()) {
        sequence.push('ctrl');
      }
      if (this.isAlt()) {
        sequence.push('alt');
      }
      if (this.isAltGr()) {
        sequence.push('altgr');
      }
      if (this.isShift()) {
        sequence.push('shift');
      }
      if (this.isCmd()) {
        sequence.push('cmd');
      }
      if (character) {
        sequence.push(character);
      }
      return sequence.join('-');
    };

    return ModifierStateHandler;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL21hcmNvc2xhbXVyaWEvLmF0b20vcGFja2FnZXMva2V5Ym9hcmQtbG9jYWxpemF0aW9uL2xpYi9tb2RpZmllci1zdGF0ZS1oYW5kbGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUE7OztHQUFBO0FBQUE7QUFBQTtBQUFBLE1BQUEsOEJBQUE7O0FBQUEsRUFLQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FMWCxDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKO0FBQUE7OztPQUFBO0FBQUEsUUFBQSxzQkFBQTs7QUFBQSxtQ0FJQSxjQUFBLEdBQ0U7QUFBQSxNQUFBLGtCQUFBLEVBQW9CLENBQXBCO0FBQUEsTUFDQSxVQUFBLEVBQVksQ0FEWjtBQUFBLE1BRUEsc0JBQUEsRUFBd0IsQ0FGeEI7S0FMRixDQUFBOztBQVNBO0FBQUE7Ozs7Ozs7O09BVEE7O0FBQUEsbUNBa0JBLFFBQUEsR0FBVSxDQWxCVixDQUFBOztBQUFBLG1DQW1CQSxTQUFBLEdBQVcsS0FuQlgsQ0FBQTs7QUFBQSxtQ0FxQkEsUUFBQSxHQUFVLEtBckJWLENBQUE7O0FBQUEsbUNBc0JBLE9BQUEsR0FBUyxLQXRCVCxDQUFBOztBQUFBLG1DQXVCQSxRQUFBLEdBQVUsS0F2QlYsQ0FBQTs7QUFBQSxtQ0F3QkEsTUFBQSxHQUFRLEtBeEJSLENBQUE7O0FBQUEsbUNBeUJBLE1BQUEsR0FBUSxLQXpCUixDQUFBOztBQTJCQTtBQUFBOzs7OztPQTNCQTs7QUFBQSxtQ0FpQ0EsOEJBQUEsR0FBZ0MsRUFqQ2hDLENBQUE7O0FBbUNBO0FBQUE7OztPQW5DQTs7QUFBQSxJQXVDQSxzQkFBQSxHQUF5QixRQXZDekIsQ0FBQTs7QUF5Q0E7QUFBQTs7O09BekNBOztBQUFBLG1DQTZDQSxhQUFBLEdBQWUsSUE3Q2YsQ0FBQTs7QUEr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

//# sourceURL=/Users/marcoslamuria/.atom/packages/keyboard-localization/lib/modifier-state-handler.coffee
