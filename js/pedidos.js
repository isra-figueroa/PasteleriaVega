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
    var filaEliminada; //para capturara la fila eliminada
    var filaEditada; //para capturara la fila editada o actualizada

    //creamos constantes para los iconos editar y borrar    
    const iconoEditar = '<svg class="bi bi-pencil-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>';
    const iconoBorrar = '<svg class="bi bi-trash" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>';
    var db = firebase.database();
    var coleccion = db.ref().child("pedidos");
    var coleccion1 = db.ref().child("catalogo");
    var coleccion2 = db.ref().child("precios");
    var coleccion3 = db.ref().child("ventas");
    var dataSet = [];//array para guardar los valores de los campos inputs del form
    var table = $('#tablaPedidos').DataTable({
                pageLength : 5,
                lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'Todos']],
                data: dataSet,
                columnDefs: [
                    {
                        targets: [0,1,9,10,11,12],  
                        visible: false, //ocultamos la columna de ID que es la [0]                        
                    },
                    {
                        targets: -1,        
                        defaultContent: "<div class='wrapper text-center'><div class='btn-group'><button class='btnEditar btn btn-primary' data-toggle='tooltip' title='Editar'>"+iconoEditar+"</button><button class='btnBorrar btn btn-danger' data-toggle='tooltip' title='Cancelar'><i class='fa fa-ban'></i></button></div></div>"
                    }
                ]	   
            });
    const person = () =>{
        var vale2 = true;
        limpieza();
        let nombre=$.trim($('#pastel').val());
        var d = document.getElementById('pastel');
        var dis = d.options[d.selectedIndex].text;
        var arrayDeCadenas = dis.split("-");
        coleccion2.on("child_added", datos => {
        if(arrayDeCadenas[1]==datos.child("especialidad").val()){
            var option = document.createElement("option");
            option.text = datos.child("personas").val();
            option.value = datos.child("precio").val();
            $select2.appendChild(option);
            if(vale2){
                $('#precio').val(datos.child("precio").val());
                vale2=false;
            }
        }        
        });
    };

    function limpieza(){
        for (let i = $select2.options.length; i >= 0; i--) {
            $select2.remove(i);
        }
    }

    const cash = () =>{
        let nombre=$.trim($('#personas').val());
        $('#precio').val(nombre);
    };

    const $select = document.querySelector("#pastel");
    $select.addEventListener("change", person);
    const $select2 = document.querySelector("#personas");
    $select2.addEventListener("change", cash);
    var vale = true; 
    
    coleccion1.on("child_added", datos => {        
        var option = document.createElement("option");
        option.text = datos.child("nombre").val()+"-"+datos.child("especialidad").val();
        option.value = datos.key;
        $select.appendChild(option);
        if(vale){
            coleccion2.on("child_added", date => {
            if(datos.child("especialidad").val()==date.child("especialidad").val()){
                var option = document.createElement("option");
                option.text = date.child("personas").val();
                option.value = date.child("precio").val();
                $select2.appendChild(option);
            }        
            });
            vale=false;
        }
    });

    function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(window.location);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

    coleccion.on("child_added", datos => {       
        if(datos.child("pedido").val()=="pendiente"){
            var debe = datos.child("precio").val()-datos.child("anticipo").val();
            dataSet = [datos.key, datos.child("fecha1").val(), datos.child("fecha2").val(), datos.child("nombre").val(), datos.child("pastel").val(), datos.child("personas").val(), datos.child("precio").val(), datos.child("anticipo").val(), debe, datos.child("decoracion").val(), datos.child("telefono").val(), datos.child("direccion").val(), datos.child("local").val()];
            table.rows.add([dataSet]).draw();
        }             
    });
    coleccion.on('child_changed', datos => {   
        if(datos.child("pedido").val()=="pendiente"){
            var debe = datos.child("precio").val()-datos.child("anticipo").val();
            dataSet = [datos.key, datos.child("fecha1").val(), datos.child("fecha2").val(), datos.child("nombre").val(), datos.child("pastel").val(), datos.child("personas").val(), datos.child("precio").val(), datos.child("anticipo").val(), debe, datos.child("decoracion").val(), datos.child("telefono").val(), datos.child("direccion").val(), datos.child("local").val()];
            table.row(filaEditada).data(dataSet).draw();
        }                
    });
    coleccion.on("child_removed", function() {
        table.row(filaEliminada.parents('tr')).remove().draw();                     
    });
          
    $('form').submit(function(e){                         
        e.preventDefault();
        let id = $.trim($('#id').val());
        let local = $.trim($('#local').val());
        let fecha1 = $.trim($('#fech').val());
        let pastel=$.trim($('#pas').val());
        let personas = $.trim($('#per').val());
        let precio = $.trim($('#precio').val());
        let anticipo = $.trim($('#anticipo').val());
        let fecha2 = $.trim($('#fecha').val());
        let decoracion = $.trim($('#decoracion').val());
        let nombre = $.trim($('#nombre').val());
        let telefono = $.trim($('#telefono').val());
        let direccion = $.trim($('#direccion').val());
        let pedido = "pendiente";
        let idFirebase = id;        
        if (idFirebase == ''){                      
            idFirebase = coleccion.push().key;
        };
        if (local == ''){                      
            local = 'Local';
        };                
        data = {id:idFirebase, local:local, pedido:pedido, fecha2:fecha2, fecha1:fecha1, nombre:nombre, pastel:pastel, personas:personas, precio:precio, anticipo:anticipo, decoracion:decoracion, telefono:telefono, direccion:direccion};             
        actualizacionData = {};
        actualizacionData[`/${idFirebase}`] = data;
        coleccion.update(actualizacionData);
        id = '';        
        $("form").trigger("reset");
        $('#modalAltaEdicion').modal('hide');
        Swal.fire('¡Accion realizada!', 'Datos guardados correctamente.','success');
    });

    //Botones
    $('#entrega').click(function(e) {
        e.preventDefault();
        let id = $.trim($('#id').val());
        let local = $.trim($('#local').val());
        let fecha1 = $.trim($('#fech').val());
        let pastel=$.trim($('#pas').val());
        let personas = $.trim($('#per').val());
        let precio = $.trim($('#precio').val());
        let anticipo = $.trim($('#anticipo').val());
        let fecha2 = $.trim($('#fecha').val());
        let decoracion = $.trim($('#decoracion').val());
        let nombre = $.trim($('#nombre').val());
        let telefono = $.trim($('#telefono').val());
        let direccion = $.trim($('#direccion').val());
        let txt = getParameterByName("val");
        let idFirebase = coleccion3.push().key;
        let detalle = "Venta por pedido de un pastel estilo "+pastel+" para "+personas+" personas con decoracion "+decoracion+" a nombre de "+nombre+" pedido realizado en fecha del "+fecha1;
        Swal.fire({
        title: '¿Está seguro de marcar el pedido como entregado?',
        text: "¡Está operación no se puede revertir!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#66CCCC',
        cancelButtonColor: '#F06292',
        confirmButtonText: 'Marcar entrega'
        }).then((result) => {
        if (result.value) {           
            db.ref(`pedidos/${id}`).remove()
            data2 = {fecha:fecha2, detalle:detalle, atendio:txt, precio:precio};             
            actualizacionData2 = {};
            actualizacionData2[`/${idFirebase}`] = data2;
            coleccion3.update(actualizacionData2);
            id = '';
            local = '';        
            $("form").trigger("reset");
            $('#modalAltaEdicion').modal('hide');
            Swal.fire('¡Accion realizada!', 'Venta realizada.','success').then((res) => {
            if (res.value) {
            window.location="pedidos.html?val="+txt;
        }})
        }
        })
    });

    $('#btnNuevo').click(function() {
        const fech = new Date();    
        const fecha = fech.getFullYear()+"-"+(fech.getMonth()+1)+"-"+fech.getDate();
        $('#id').val('');
        $('#local').val('');        
        $("form").trigger("reset");
        $('#modalAltaEdicion').modal('show');
        let nombre=$.trim($('#personas').val());
        $('#precio').val(nombre);
        $('#anticipo').val(0);
        var d = document.getElementById('pastel');
        let pastel = d.options[d.selectedIndex].text;
        var e = document.getElementById('personas');
        let personas = e.options[e.selectedIndex].text;
        $('#pas').val(pastel);
        $('#per').val(personas);
        $('#fech').val(fecha);
        var btn1 = document.getElementById("entrega");
        btn1.disabled = true;
    });        

    $("#tablaPedidos").on("click", ".btnEditar", function() {    
        filaEditada = table.row($(this).parents('tr'));           
        let fila = $('#tablaPedidos').dataTable().fnGetData($(this).closest('tr'));               
        let id = fila[0];
        let fecha1 = fila[1];
        let pastel=$(this).closest('tr').find('td:eq(2)').text();
        let personas = parseInt($(this).closest('tr').find('td:eq(3)').text());
        let precio = parseInt($(this).closest('tr').find('td:eq(4)').text());
        let anticipo = parseInt($(this).closest('tr').find('td:eq(5)').text());
        let fecha2 = $(this).closest('tr').find('td:eq(0)').text();
        let decoracion = fila[9];
        let nombre = $(this).closest('tr').find('td:eq(1)').text();;
        let telefono = fila[10];
        let direccion = fila[11];
        let local = fila[12];;
        $('#id').val(id);
        $('#local').val(local);        
        $('#fech').val(fecha1);
        $('#pas').val(pastel);
        $('#per').val(personas);
        $('#precio').val(precio);
        $('#anticipo').val(anticipo);
        $('#fecha').val(fecha2);
        $('#decoracion').val(decoracion);
        $('#nombre').val(nombre);
        $('#telefono').val(telefono);
        $('#direccion').val(direccion);
        $('#modalAltaEdicion').modal('show');
        var btn1 = document.getElementById("entrega");
        btn1.disabled = false;
	});  
  
    $("#tablaPedidos").on("click", ".btnBorrar", function() {   
        filaEliminada = $(this);
        Swal.fire({
        title: '¿Está seguro de cancelar el pedido?',
        text: "¡Está operación no se puede revertir!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Confirm'
        }).then((result) => {
        if (result.value) {
            let fila = $('#tablaPedidos').dataTable().fnGetData($(this).closest('tr'));            
            let id = fila[0];
            let fecha1 = fila[1];
            let pastel=$(this).closest('tr').find('td:eq(2)').text();
            let personas = parseInt($(this).closest('tr').find('td:eq(3)').text());
            let precio = parseInt($(this).closest('tr').find('td:eq(4)').text());
            let anticipo = parseInt($(this).closest('tr').find('td:eq(5)').text());
            let fecha2 = $(this).closest('tr').find('td:eq(0)').text();
            let decoracion = fila[9];
            let nombre = $(this).closest('tr').find('td:eq(1)').text();;
            let telefono = fila[10];
            let direccion = fila[11];
            let local = fila[12];
            let txt = getParameterByName("val");
            let pedido = "cancelado";
            data = {id:id, local:local, pedido:pedido, fecha2:fecha2, fecha1:fecha1, nombre:nombre, pastel:pastel, personas:personas, precio:precio, anticipo:anticipo, decoracion:decoracion, telefono:telefono, direccion:direccion};             
            actualizacionData = {};
            actualizacionData[`/${id}`] = data;
            coleccion.update(actualizacionData);
            Swal.fire('¡Cancelado!', 'El pedido ha sido cancelado.','success').then((res) => {
            if (res.value) {
            window.location="pedidos.html?val="+txt;
        }})
        }
        })        
	});  

});
