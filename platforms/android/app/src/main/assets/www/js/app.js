var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        document.addEventListener("backbutton", function(){cordova.plugins.exit();});
        function nobackbutton(){
           window.location.hash="no-back-button";
           window.location.hash="Again-No-back-button" //chrome
           window.onhashchange=function(){window.location.hash="no-back-button";}
        }
        nobackbutton();
    },

    receivedEvent: function(){
      var btn_enviar = document.querySelector('#enviar'),
          btn_actualizar = document.querySelector('#actualizar'),
          btn_factura = document.querySelector('#factura'),
          btn_borrar_info = document.querySelector('#borrar'),
          btn_limpiar_info = document.querySelector('#borrar2'),
          btn_salir = document.querySelector('#logout'),
          btn_saldo = document.querySelector('#btn_saldo'),
          formulario = document.querySelector('#formulario'),
          sidebar_content = document.querySelector('#menu'),
          userAuth = sessionStorage.getItem('usuarioAuth'),
          profileName = document.querySelector('#profileName'),
          campoValor = document.querySelector('#valor'),
          campoInteres = document.querySelector('#interes'),
          campoNumeroCuotas = document.querySelector('#numeroCuotas'),
          controlEnvioDeDatos = false,
          userName,
          userPhone,
          userDNI,
          id,
          item,
          database = firebase.database();


      //Gestion de datos... obtener, crear, editar, mostrar
      function obtenerDatos(){
        var nombres = document.querySelector('#nombres_apellidos');
        var cedula = document.querySelector('#cedula');
        var telefono = document.querySelector('#telefono');
        var direccion = document.querySelector('#direccion');
        var valor = document.querySelector('#valor');
        var interes = document.querySelector('#interes');
        var numeroCuotas = document.querySelector('#numeroCuotas');
        var cuotas = document.querySelector('#cuotas');
        var saldo = document.querySelector('#saldo');
      };

      function enviarDatos(){
        obtenerDatos();
        var sino = validarCampos();
        var datoNuevo = database.ref('perfiles/' + userAuth + '/misUsuarios').push();
        if(sino){
          datoNuevo.set({
            nombres_apellidos: nombres_apellidos.value.trim(),
            cedula: cedula.value.trim(),
            telefono: telefono.value.trim(),
            direccion: direccion.value.trim(),
            valor: valor.value.trim(),
            interes: interes.value.trim(),
            numeroCuotas: numeroCuotas.value.trim(),
            cuotas: cuotas.value.trim(),
            saldo: saldo.value.trim()
          });
          formulario.reset();
          eliminarDatosDeFormulario();
        };
      };

      function actualizarDatos(){
        if(controlEnvioDeDatos == true){
          obtenerDatos();
          var sino = validarCampos();
          var actualizarDato = database.ref('perfiles/' + userAuth + "/misUsuarios" + "/" + id);
          if(sino){
            actualizarDato.update({
              nombres_apellidos: nombres_apellidos.value.trim(),
              cedula: cedula.value.trim(),
              telefono: telefono.value.trim(),
              direccion: direccion.value.trim(),
              valor: valor.value.trim(),
              interes: interes.value.trim(),
              numeroCuotas: numeroCuotas.value.trim(),
              cuotas: cuotas.value.trim(),
              saldo: saldo.value.trim()
            });
            formulario.reset();
            eliminarDatosDeFormulario();
          };
          nombres_apellidos.value.trim() == "" ? controlEnvioDeDatos = false : controlEnvioDeDatos = true;
        } else {
          toastAlert('Para enviar datos, pulsa el boton +');
        };
      };

      function getDatosDeUsuario(){
        var getDatos = localStorage.getItem('datos');
        if(getDatos === null){
          console.log("The reference in firebase already exists");
        } else {
          let objDatos = JSON.parse(getDatos);
          let writeDatos = database.ref('perfiles/' + userAuth + "/misDatos").set(objDatos);
          localStorage.removeItem('datos');
        }
      }
      getDatosDeUsuario();

      function mostrarDatosEnCampos(data){
        nombres_apellidos.value = data.nombres_apellidos;
        cedula.value = data.cedula;
        telefono.value = data.telefono;
        direccion.value = data.direccion;
        valor.value = data.valor;
        interes.value = data.interes;
        numeroCuotas.value = data.numeroCuotas;
        cuotas.value = data.cuotas;
        saldo.value = data.saldo;
        M.updateTextFields();
      };

      function calcularCuotas(){
        obtenerDatos();
        if(valor.value.trim().length >= 1 && interes.value.trim().length >= 1 && numeroCuotas.value.trim().length >= 1){
          let interesDecimal = parseFloat(interes.value.trim()) / 100;
          let valorEntero = parseInt(valor.value.trim());
          let numeroCuotasEntero = parseInt(numeroCuotas.value.trim());
          let interesMensual = (valorEntero * interesDecimal);
          let totalInteres = (numeroCuotasEntero * interesMensual);
          let pagoTotal =  (valorEntero + totalInteres);
          let cuotaMensual = Math.round(pagoTotal / numeroCuotasEntero);
          cuotas.value = cuotaMensual;
          saldo.value = pagoTotal;
          M.updateTextFields();

        } else {
          cuotas.value = "";
          saldo.value = "";
        }
      };

      function calcularSaldo(cuotaMensual){
        obtenerDatos();
        let saldoEntero = parseInt(saldo.value.trim());
        let cuotaMensual2 = parseInt(cuotas.value);
        let saldoTotal = (saldoEntero - cuotaMensual2);
        saldoTotal < 0 ? saldo.value = 0 : saldo.value = saldoTotal;
      };

      //Validar campos y evento a los elementos del sidebar
      function validarCampos(){
        if(nombres_apellidos.value.trim() == "" || !isNaN(nombres_apellidos.value.trim())){
          toastAlert('Campo *Nombres y apellidos* incorrecto');
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

        } else if(direccion.value.trim() == ""){
          toastAlert('Campo *Direccion* incorrecto');
          return false;

        } else if(valor.value.trim() < 0 || valor.value.trim() == "" || isNaN(valor.value.trim())){
          toastAlert('Campo *Valor* incorrecto');
          return false;

        } else if(interes.value.trim() < 0 || interes.value.trim() == "" || isNaN(interes.value.trim())){
          toastAlert('Campo *Interés* incorrecto');
          return false;

        } else if(numeroCuotas.value.trim() < 0 || numeroCuotas.value.trim() == "" || isNaN(numeroCuotas.value.trim())){
          toastAlert('Campo *N° de cuotas* incorrecto');
          return false;

        } else if(cuotas.value.trim() < 0 || cuotas.value.trim() == "" || isNaN(cuotas.value.trim())){
          toastAlert('Campo *Valor de cuotas* incorrecto');
          return false;

        } else if(saldo.value.trim() < 0 || saldo.value.trim() == "" || isNaN(saldo.value.trim())){
          toastAlert('Campo *Saldo* incorrecto');
          return false;

        } else {
          return true;
        }
      };

      function eventoEl(elemento, data){
        elemento.addEventListener('click', function(e){
          controlEnvioDeDatos = true;
          id = e.target.id;
          mostrarDatosEnCampos(data);
        });
      };

      //Elimina los datos que se muestran en el formulario
      function eliminarDatosDeFormulario(){
        nombres_apellidos.value = "";
        cedula.value = "";
        telefono.value = "";
        direccion.value = "";
        valor.value = "";
        interes.value = "";
        numeroCuotas.value = "";
        cuotas.value = "";
        saldo.value = "";
      };

      // Logout, buscador y toast
      function cerrarSesion(){
        firebase.auth().signOut().then(function(){
          cordova.InAppBrowser.open('index.html', '_self', 'location=yes');
        }).catch(function(error){
          toastAlert('No Has seleccionado datos para eliminar');
        });
      };

      document.querySelector('#buscador').addEventListener('keyup', function(){
        let menu = document.querySelectorAll('#menu > li');
        menu.forEach(function(elemento){
          if(elemento.textContent.toLowerCase().indexOf(buscador.value.toLowerCase().trim()) != -1){
            elemento.style.display = "block";
          } else {
            elemento.style.display = "none";
          }
        });
      });

      function toastAlert(text){
        M.toast({
        html: text,
        classes: 'rounded margin_bottom_sm',
        displayLength: 4000
        });
      }

      //Crear lista de opciones para cada usuario
      function ListItems(sidebar_content, data){
        let itemList = document.createElement('li');
        let textItemList = document.createElement('a');
        itemList.setAttribute('class', 'listItems');
        textItemList.setAttribute('href', '#');
        textItemList.innerHTML = data.nombres_apellidos;
        itemList.appendChild(textItemList);
        sidebar_content.appendChild(itemList);

        itemList.addEventListener('click', function(){
          if(this.lastChild.style.display == "none"){
            this.lastChild.style.display = "block";
            this.classList.add('border-top-grey');
            this.classList.add('border-bottom-grey');
          } else {
            this.lastChild.style.display = "none";
            this.classList.remove('border-top-grey');
            this.classList.remove('border-bottom-grey');
          }
        });
      };

      function newListOptions(key){
        let options = document.createElement('ul');
        let itemOption = document.createElement('li');
        let textItemOption = document.createElement('a');
        let icon = document.createElement('i');
        icon.setAttribute('class', 'material-icons right');
        icon.innerHTML = "find_in_page";
        textItemOption.setAttribute('id', key);
        textItemOption.setAttribute('href', '#');
        textItemOption.innerHTML = "Mostrar Datos";
        textItemOption.appendChild(icon);
        options.style.display = 'none';
        itemOption.appendChild(textItemOption);
        options.appendChild(itemOption);
        options.appendChild(optionGenerarFactura());
        options.appendChild(optionBorrarDatos());

        let menu = document.querySelectorAll('#menu li');
        menu.forEach(function(elemento){
          elemento.appendChild(options);
        });

        return textItemOption;
      };

      function optionGenerarFactura(){
        let itemOption = document.createElement('li');
        let textItemOption = document.createElement('a');
        let icon = document.createElement('i');
        icon.setAttribute('class', 'material-icons right');
        icon.innerHTML = "description";
        textItemOption.setAttribute('id', 'factura');
        textItemOption.setAttribute('href', '#');
        textItemOption.innerHTML = "Generar Factura";
        textItemOption.appendChild(icon);
        itemOption.appendChild(textItemOption);

        textItemOption.addEventListener('click', function(){
          obtenerDatos();
          let sino = validarCampos();
          if(sino){
            sessionStorage.setItem('nombres_apellidos', nombres_apellidos.value.trim());
            sessionStorage.setItem('cedula', cedula.value.trim());
            sessionStorage.setItem('telefono', telefono.value.trim());
            sessionStorage.setItem('direccion', direccion.value.trim());
            sessionStorage.setItem('valor', valor.value.trim());
            sessionStorage.setItem('interes', interes.value.trim());
            sessionStorage.setItem('numeroCuotas', numeroCuotas.value.trim());
            sessionStorage.setItem('cuotas', cuotas.value.trim());
            sessionStorage.setItem('saldo', saldo.value.trim());
            sessionStorage.setItem('nombreDeUsuario', userName);
            sessionStorage.setItem('telefonoUser', userPhone);
            sessionStorage.setItem('cedulaUser', userDNI);
            cordova.InAppBrowser.open('factura.html', '_self', 'location=yes');
          } else {
            toastAlert("Presiona 'Mostrar datos' y luego 'Generar factura'");
          }
        });

        return itemOption;
      };

      function optionBorrarDatos(){
        let itemOption = document.createElement('li');
        let textItemOption = document.createElement('a');
        let icon = document.createElement('i');
        icon.setAttribute('class', 'material-icons right');
        icon.innerHTML = "delete";
        textItemOption.setAttribute('id', 'borrar');
        textItemOption.setAttribute('href', '#');
        textItemOption.innerHTML = "Borrar datos";
        textItemOption.appendChild(icon);
        itemOption.appendChild(textItemOption);

        textItemOption.addEventListener('click', function(){
          let elemento = document.getElementById(id);
          let borrarDato = database.ref('perfiles/'+ userAuth + "/misUsuarios" + "/" + id);
          if(sidebar_content.contains(elemento) == true){
            borrarDato.remove();
          } else {
            toastAlert('No Has seleccionado datos para eliminar');
          }
        });

        return itemOption;
      };

      //Eventos

      btn_enviar.addEventListener('click', enviarDatos);
      btn_actualizar.addEventListener('click', actualizarDatos);
      btn_salir.addEventListener('click', cerrarSesion);
      campoValor.addEventListener('keyup', calcularCuotas);
      campoInteres.addEventListener('keyup', calcularCuotas);
      campoNumeroCuotas.addEventListener('keyup', calcularCuotas);
      btn_saldo.addEventListener('click', calcularSaldo);
      database.ref('perfiles/' + userAuth + "/misUsuarios").on('child_added', function(snapshot){
        var data = snapshot.val();
        var key = snapshot.key;
        ListItems(sidebar_content, data);
        item = newListOptions(key);
        eventoEl(item, data);
      });
      database.ref('perfiles/' + userAuth + "/misUsuarios").on('child_changed', function(snapshot){
        var itemCambiado = document.getElementById(snapshot.key);
        var data = snapshot.val();
        itemCambiado.parentNode.parentNode.parentNode.firstChild.innerHTML = data.nombres_apellidos;
        eventoEl(itemCambiado, data);
      });
      database.ref('perfiles/' + userAuth + "/misUsuarios").on('child_removed', function(snapshot){
        var elEliminado = document.getElementById(snapshot.key);
        elEliminado.parentNode.parentNode.parentNode.remove();
        eliminarDatosDeFormulario();
      });
      database.ref('perfiles/' + userAuth + "/misDatos").on('value', function(snapshot){
        var data = snapshot.val();
        userName = data.nombreDeUsuario;
        userPhone = data.telefono;
        userDNI = data.cedula;

        profileName.textContent = data.nombreDeUsuario;
      });
    }
};

app.initialize();
