//Obtener fecha para enviarla a la factura
var obtenerFecha = new Date();
var fecha = document.getElementsByClassName('fecha');

fecha[0].textContent = obtenerFecha.getFullYear();
fecha[1].textContent = obtenerFecha.getMonth() + 1;
fecha[2].textContent = obtenerFecha.getDate();

if(fecha[1].textContent <= 9){
  fecha[1].textContent = '0' + fecha[1].textContent;
}
if(fecha[2].textContent <= 9){
  fecha[2].textContent = '0' + fecha[2].textContent;
}

var personalDatesClient = document.getElementsByClassName('personalDatesClient');
personalDatesClient[0].textContent = sessionStorage.getItem('nombres_apellidos');
sessionStorage.removeItem('nombres_apellidos');
personalDatesClient[1].textContent = sessionStorage.getItem('cedula');
sessionStorage.removeItem('cedula');
personalDatesClient[2].textContent = sessionStorage.getItem('telefono');
sessionStorage.removeItem('telefono');
personalDatesClient[3].textContent = sessionStorage.getItem('direccion');
sessionStorage.removeItem('direccion');

var personalDatesUser = document.getElementsByClassName('personalDatesUser');
personalDatesUser[0].textContent = sessionStorage.getItem('nombreDeUsuario');
personalDatesUser[1].textContent = sessionStorage.getItem('cedulaUser');
sessionStorage.removeItem('cedulaUser');
personalDatesUser[2].textContent = sessionStorage.getItem('telefonoUser');
sessionStorage.removeItem('telefonoUser');
personalDatesUser[3].textContent = sessionStorage.getItem('nombreDeUsuario');
sessionStorage.removeItem('nombreDeUsuario');

var datosCobro = document.getElementsByClassName('datosCobro');
datosCobro[0].textContent = sessionStorage.getItem('valor');
sessionStorage.removeItem('valor');
datosCobro[1].textContent = sessionStorage.getItem('interes') + "%";
sessionStorage.removeItem('interes');
datosCobro[2].textContent = sessionStorage.getItem('numeroCuotas');
sessionStorage.removeItem('numeroCuotas');
datosCobro[3].textContent = sessionStorage.getItem('cuotas');
sessionStorage.removeItem('cuotas');
datosCobro[4].textContent = sessionStorage.getItem('saldo');
sessionStorage.removeItem('saldo');


document.getElementById('print').addEventListener('click', function(){
  cordova.plugins.printer.print();
});
