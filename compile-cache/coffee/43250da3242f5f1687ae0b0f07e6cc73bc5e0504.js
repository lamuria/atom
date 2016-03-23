(function() {
  var NReplConnection, RemoteReplProcess;

  NReplConnection = require('./nrepl-connection');

  module.exports = RemoteReplProcess = (function() {
    RemoteReplProcess.prototype.appendText = null;

    RemoteReplProcess.prototype.conn = new NReplConnection();

    function RemoteReplProcess(appendText) {
      this.appendText = appendText;
      null;
    }

    RemoteReplProcess.prototype.getType = function() {
      return "Remote";
    };

    RemoteReplProcess.prototype.start = function(connOptions) {
      return this.conn.start(connOptions);
    };

    RemoteReplProcess.prototype.sendCommand = function(code, options, resultHandler) {
      return this.conn.sendCommand(code, options, resultHandler);
    };

    RemoteReplProcess.prototype.getCurrentNs = function() {
      return this.conn.getCurrentNs();
    };

    RemoteReplProcess.prototype.interrupt = function() {
      this.conn.interrupt();
      return this.appendText("Interrupting");
    };

    RemoteReplProcess.prototype.running = function() {
      return this.conn.connected();
    };

    RemoteReplProcess.prototype.stop = function() {
      return this.conn.close();
    };

    return RemoteReplProcess;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL21hcmNvc2xhbXVyaWEvLmF0b20vcGFja2FnZXMvcHJvdG8tcmVwbC9saWIvcHJvY2Vzcy9yZW1vdGUtcmVwbC1wcm9jZXNzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrQ0FBQTs7QUFBQSxFQUFBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLG9CQUFSLENBQWxCLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUVNO0FBR0osZ0NBQUEsVUFBQSxHQUFZLElBQVosQ0FBQTs7QUFBQSxnQ0FHQSxJQUFBLEdBQVUsSUFBQSxlQUFBLENBQUEsQ0FIVixDQUFBOztBQUthLElBQUEsMkJBQUUsVUFBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsYUFBQSxVQUNiLENBQUE7QUFBQSxNQUFBLElBQUEsQ0FEVztJQUFBLENBTGI7O0FBQUEsZ0NBUUEsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUNQLFNBRE87SUFBQSxDQVJULENBQUE7O0FBQUEsZ0NBV0EsS0FBQSxHQUFPLFNBQUMsV0FBRCxHQUFBO2FBQ0wsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksV0FBWixFQURLO0lBQUEsQ0FYUCxDQUFBOztBQUFBLGdDQWdCQSxXQUFBLEdBQWEsU0FBQyxJQUFELEVBQU8sT0FBUCxFQUFnQixhQUFoQixHQUFBO2FBQ1gsSUFBQyxDQUFBLElBQUksQ0FBQyxXQUFOLENBQWtCLElBQWxCLEVBQXdCLE9BQXhCLEVBQWlDLGFBQWpDLEVBRFc7SUFBQSxDQWhCYixDQUFBOztBQUFBLGdDQW1CQSxZQUFBLEdBQWMsU0FBQSxHQUFBO2FBQ1osSUFBQyxDQUFBLElBQUksQ0FBQyxZQUFOLENBQUEsRUFEWTtJQUFBLENBbkJkLENBQUE7O0FBQUEsZ0NBc0JBLFNBQUEsR0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBTixDQUFBLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxVQUFELENBQVksY0FBWixFQUZTO0lBQUEsQ0F0QlgsQ0FBQTs7QUFBQSxnQ0EwQkEsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUNQLElBQUMsQ0FBQSxJQUFJLENBQUMsU0FBTixDQUFBLEVBRE87SUFBQSxDQTFCVCxDQUFBOztBQUFBLGdDQThCQSxJQUFBLEdBQU0sU0FBQSxHQUFBO2FBQ0osSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQUEsRUFESTtJQUFBLENBOUJOLENBQUE7OzZCQUFBOztNQVJGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/marcoslamuria/.atom/packages/proto-repl/lib/process/remote-repl-process.coffee
