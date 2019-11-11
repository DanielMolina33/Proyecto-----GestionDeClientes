var btn_registrar = document.querySelector('#registrar');

var mensajes = ["Contraseña erronea","Usuario creado correctamente","Mensaje de verificacion enviado","La cuenta ya existe"];

function toastAlert(text){
  M.toast({
    html: text,
    classes: 'rounded margin_bottom_sm',
    displayLength: 4000
  });
}

function validarContraseña(password){
  if(password.trim() == "" || password.length < 6){
    toastAlert('Contraseña erronea, debe contener mas de 6 caracteres');
    return false;

  } else {
    return true;
  }
};

function validarEmail(email){
  var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-z])+\.)+([a-z]{2,3})$/;
  if(regex.test(email) == false){
    toastAlert('Correo electronico erroneo');
    return false;
  }else{
    return true;
  }
  // return regex.test(email) ? true : false;
};

function obtenerDatos(){
  let nombreUsuario = document.querySelector('#nombreUsuario');
  let cedula = document.querySelector('#cedula');
  let telefono = document.querySelector('#telefono');
}

function validarCampos(){
  obtenerDatos();
  if(nombreUsuario.value.trim() == "" || !isNaN(nombreUsuario.value.trim())){
    toastAlert('Campo *Nombre de usuario* incorrecto');
    return false;

  } else if(cedula.value.trim() == "" || isNaN(cedula.value.trim())){
    toastAlert('Campo *CC* incorrecto');
    return false;

  } else if(cedula.value.trim().length <= 5){
    toastAlert('El campo *CC* debe tener mas de 5 caracteres');
    return false;

  } else if(telefono.value.trim() == "" || isNaN(telefono.value.trim())){
    toastAlert('Campo *Telefono* incorrecto');
    return false;

  } else if(telefono.value.trim().length <= 5){
    toastAlert('El campo *Telefono* debe tener mas de 5 caracteres');
    return false;

  } else {
    return true;
  }
};

function registrar(){
  var email = document.querySelector('#email').value;
  var password = document.querySelector('#pass').value;

  if(validarEmail(email) && validarContraseña(password) && validarCampos()){
  	firebase.auth().createUserWithEmailAndPassword(email, password)
  	.then(function(user){
      toastAlert(mensajes[1]);
      setDatosDeUsuario();
      verificarCuenta();
      firebase.auth().signOut();
  	})
  	.catch(function(error){
      if(error.code == "auth/email-already-in-use"){
        toastAlert(mensajes[3]);
      } else {
        toastAlert(mensajes[0]);
      }
  	});
  }
};

function verificarCuenta(){
  var sendEmail = firebase.auth().currentUser;
  sendEmail.sendEmailVerification().then(function(){
    toastAlert(mensajes[2]);
  }).catch(function(error){
    toastAlert("Algo ha sucedido " + error);
  });
};

function setDatosDeUsuario(){
  obtenerDatos();
  let datos = {
    nombreDeUsuario: nombreUsuario.value.trim(),
    cedula: cedula.value.trim(),
    telefono: telefono.value.trim(),
  };
  localStorage.setItem('datos', JSON.stringify(datos));
};

// function alertDismissed(){
//   return false;
// }

btn_registrar.addEventListener('click', registrar);
