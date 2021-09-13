$(document).ready(function() {
        const config = {
        //AQUÍ VA TU PORPIO SDK DE FIREBASE
        apiKey: "AIzaSyD9_Pkc4PFVFBAxx43dtMmNjLxB1CqhWq0",
        authDomain: "pasteleria-49a82.firebaseapp.com",
        projectId: "pasteleria-49a82",
        storageBucket: "pasteleria-49a82.appspot.com",
        messagingSenderId: "919237971331",
        appId: "1:919237971331:web:81b88e3853f3921bcdfab6",
        measurementId: "G-C5C9CB9KS6"
    };    
    firebase.initializeApp(config); //inicializamos firebase
    firebase.analytics();

    var db = firebase.database();
    var coleccion = db.ref().child("usuarios");


    function validarDatos(){
        var busName=document.getElementById("name").value;
        var busPass=document.getElementById("passw").value;
        if (busName.length == 0 ) {
            Swal.fire('¡Error!', 'Nombre de usuario vacio','warning');
        }else if(busPass.length == 0){
            Swal.fire('¡Error!', 'Contraseña vacia','warning');
        }else{
            buscar();
        }
    }
    var buscar=()=>{

        var busName=document.getElementById("name");
        var busPass=document.getElementById("passw");
        var bUser = coleccion;
        var num = "";
        bUser.orderByChild("nombre").equalTo(busName.value).limitToLast(10);
        bUser.on("child_added", function (data) {
            var taskValue = data.val();
            if (String(taskValue.nombre)==String(busName.value)&&String(taskValue.passw)==String(busPass.value)) {
                window.location="menuPrincipal.html?val="+taskValue.nombre.replaceAll(' ', '_')+"-"+taskValue.puesto;
            }else{
                num="El correo y/o la contraseña son incorrectos";
            }
         }    
        );
        if (num.length>0) {
            Swal.fire('¡Error!', 'Usuario no encontrado','warning');
        }
    }

    var validarCorreo=(email)=>{
        var bUser = coleccion;
        var num = "";
        bUser.orderByChild("email").equalTo(email).limitToLast(10);
        bUser.on("child_added", function (data) {
            var taskValue = data.val();
            if (String(taskValue.email)==String(email)) {
                num="El correo encontrado";
                enviar(email, taskValue.passw, taskValue.nombre);
            }
         }    
        );
        if (num.length>0) {
        }else{
            Swal.fire('¡Error!', 'Correo no encontrado','warning');
        }
    }
    //botones
    $('#btnRecuperar').click(function() {
        $('#email').val('');
        $("form").trigger("reset");
        $('#modalAltaEdicion').modal('show');
    }); 

    $('#accesar').click(function() {
        validarDatos();
    });

    $('form').submit(function(e){                         
        e.preventDefault();
        let email = $.trim($('#email').val());
        validarCorreo(email);        
        $("form").trigger("reset");
        $('#modalAltaEdicion').modal('hide');
    });

    function enviar(mail, pass, user){
        Email.send({
            Host : "smtp.gmail.com",
            Username : "vegapasteleria@gmail.com",
            Password : "kvjkyexhyxfeizam",
            To : mail,
            From : "vegapasteleria@gmail.com",
            Subject : "Recuperacion de contraseña",
            Body : "Usuario: "+user+"\n Contraseña: "+pass
        }).then(
          message => Swal.fire('¡Recuperacion exitosa!', 'El usuario y contraseña se enviaron al correo','success')
        );
    }
});

