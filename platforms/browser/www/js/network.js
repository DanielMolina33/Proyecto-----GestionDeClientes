var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        checkConnection();
    },

    receivedEvent: function() {
    }
}

app.initialize();

function checkConnection(){
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    if(states[networkState] == states[Connection.NONE]){
      toastAlert('No tienes conexion a internet, algunas caracteristicas podrian no funcionar');
    }
}

function toastAlert(text){
  M.toast({
    html: text,
    classes: 'rounded margin_bottom_sm',
    displayLength: 4000
  });
}
