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
    
    var db = firebase.database();
    var coleccion = db.ref().child("inventario");
    var coleccion1 = db.ref().child("catalogo");
    var coleccion2 = db.ref().child("ventas");
    var dataSet = [];//array para guardar los valores de los campos inputs del form
    var table = $('#tablaVentas').DataTable({
                pageLength : 5,
                lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'Todos']],
                data: dataSet,
                columnDefs: [
                    {
                        targets: [0,1],  
                        visible: false, //ocultamos la columna de ID que es la [0]                        
                    },
                    {
                        targets: -1,        
                        defaultContent: "<div class='wrapper text-center'><div class='btn-group'><button class='btnEditar btn btn-success' data-toggle='tooltip' title='Vender'><i class='fa fa-shopping-cart'></i></button></div></div>"
                    }
                ]	   
            });

    coleccion.on("child_added", datos => {       
        coleccion1.on("child_added", date => {
            if(datos.child("pastel").val()==date.key){
                if(datos.child("cantidad").val()>0){
                    var foto = "<img src="+date.child("imagen").val()+" class='img-fluid' alt='Responsive image'>"
                    dataSet = [datos.key, datos.child("pastel").val(), date.child("nombre").val(), foto, datos.child("personas").val(), datos.child("precio").val(), datos.child("cantidad").val()];
                    table.rows.add([dataSet]).draw();
                }
            }        
        }); 
    });

    coleccion.on('child_changed', datos => {   
        coleccion1.on("child_added", date => {
            if(datos.child("pastel").val()==date.key){
                if(datos.child("cantidad").val()>0){
                    var foto = "<img src="+date.child("imagen").val()+" class='img-fluid' alt='Responsive image'>"
                    dataSet = [datos.key, datos.child("pastel").val(), date.child("nombre").val(), foto, datos.child("personas").val(), datos.child("precio").val(), datos.child("cantidad").val()];
                    table.row(filaEditada).data(dataSet).draw();
                }
            }        
        });        
    });

    coleccion.on("child_removed", function() {
        table.row(filaEliminada.parents('tr')).remove().draw();                     
    });
          
    $('form').submit(function(e){                         
        e.preventDefault();
        let id = $.trim($('#id').val());
        let pastel=$.trim($('#idpastel').val());
        let personas = $.trim($('#personas').val());
        let precio = $.trim($('#precio').val());
        let can = $.trim($('#cantidad').val());
        let fecha = $.trim($('#fecha').val());
        let cantidad = parseInt(can,10)-1; 
        let idFirebase = coleccion2.push().key;
        let pass = $.trim($('#pastel').val());
        let detalle = "Venta local de un pastel estilo "+pass+" para "+personas+" personas";
        let txt = getParameterByName("val");
        Swal.fire({
        title: '¿Está seguro de realizar la venta?',
        text: "¡Está operación solo se puede revertir por un administrador!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#66CCCC',
        cancelButtonColor: '#F06292',
        confirmButtonText: 'Realizar venta'
        }).then((result) => {
        if (result.value) {
            data = {pastel:pastel, personas:personas, precio:precio, cantidad:cantidad};             
            actualizacionData = {};
            actualizacionData[`/${id}`] = data;
            coleccion.update(actualizacionData);

            data2 = {fecha:fecha, detalle:detalle, atendio:txt, precio:precio};             
            actualizacionData2 = {};
            actualizacionData2[`/${idFirebase}`] = data2;
            coleccion2.update(actualizacionData2);
            id = '';        
            $("form").trigger("reset");
            $('#modalAltaEdicion').modal('hide');
            Swal.fire('¡Accion realizada!', 'Venta realizada.','success').then((res) => {
            if (res.value) {
            window.location="ventas.html?val="+txt;
        }})
        }
        })            
    });        

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(window.location);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

    $("#tablaVentas").on("click", ".btnEditar", function() {
        const fech = new Date();    
        const fecha = fech.getFullYear()+"-"+(fech.getMonth()+1)+"-"+fech.getDate();
        filaEditada = table.row($(this).parents('tr'));           
        let fila = $('#tablaVentas').dataTable().fnGetData($(this).closest('tr'));               
        let id = fila[0];
        let idpass = fila[1];
        let pastel = $(this).closest('tr').find('td:eq(0)').text();
        let personas = $(this).closest('tr').find('td:eq(2)').text();
        let precio = parseInt($(this).closest('tr').find('td:eq(3)').text());
        let cantidad = $(this).closest('tr').find('td:eq(4)').text();
        $('#id').val(id);
        $('#fecha').val(fecha);        
        $('#idpastel').val(idpass);
        $('#pastel').val(pastel);
        $('#personas').val(personas);
        $('#precio').val(precio);
        $('#cantidad').val(cantidad);
        $('#modalAltaEdicion').modal('show');
	});  
  

});