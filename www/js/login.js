document.addEventListener("backbutton", function(){cordova.plugins.exit();});
function nobackbutton(){
   window.location.hash="no-back-button";
   window.location.hash="Again-No-back-button" //chrome
   window.onhashchange=function(){window.location.hash="no-back-button";}
}
nobackbutton();

function toastAlert(text){
  M.toast({
    html: text,
    classes: 'rounded margin_bottom_sm',
    displayLength: 4000
  });
}

var btn_entrar = document.querySelector('#entrar'),
    btn_reestablecer = document.querySelector('#reestablecer');

const mensajes = ["Contraseña erronea","Ve a tu correo electronico para reestablecer la contraseña","Ve a tu correo electronico y verifica tu cuenta para poder acceder","La cuenta a la que estás tratando de acceder no existe o se eliminó", "La cuenta no existe o se eliminó"];

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
}

function login(){
  var email = document.querySelector('#email').value;
  var password = document.querySelector('#pass').value;
  if(validarEmail(email) && validarContraseña(password)){
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(user){
      usuarioActual(true, true);
    })
    .catch(function(error){
      if(error.code == "auth/user-not-found"){
        toastAlert(mensajes[3]);
      } else {
        toastAlert(mensajes[0]);
      }
    });
  }
};

function reestablecerPass(){
  var email = prompt("Digita tu direccion de correo electronico");
  if(validarEmail(email)){
    firebase.auth().sendPasswordResetEmail(email)
    .then(function(){
      toastAlert(mensajes[1]);
    })
    .catch(function(error){
      if(error.code == "auth/user-not-found"){
        toastAlert(mensajes[4]);
      }
    });
  }
};

function usuarioActual(bienvenido = false, error = false){
  var user = firebase.auth().currentUser;
  if(user){
    if(user.emailVerified){
      if(bienvenido){
        navigator.notification.alert('Bienvenido', alertDismissed, '', 'Aceptar');
      }
      var usuario = user.uid;
      sessionStorage.setItem('usuarioAuth', usuario);
      cordova.InAppBrowser.open('app.html', '_self', 'location=yes');
    }else{
      if(error){toastAlert(mensajes[2])};
    }
  }
};

function alertDismissed(){
  return false;
};

firebase.auth().onAuthStateChanged(function(user){
  usuarioActual();
});

btn_entrar.addEventListener('click', login);
btn_reestablecer.addEventListener('click', reestablecerPass);
