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
    var coleccion = db.ref().child("precios");
    var dataSet = [];//array para guardar los valores de los campos inputs del form
    var table = $('#tablaPrecio').DataTable({
                pageLength : 5,
                lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'Todos']],
                data: dataSet,
                columnDefs: [
                    {
                        targets: [0],  
                        visible: false, //ocultamos la columna de ID que es la [0]                        
                    },
                    {
                        targets: -1,        
                        defaultContent: "<div class='wrapper text-center'><div class='btn-group'><button class='btnEditar btn btn-primary' data-toggle='tooltip' title='Editar'>"+iconoEditar+"</button><button class='btnBorrar btn btn-danger' data-toggle='tooltip' title='Borrar'>"+iconoBorrar+"</button></div></div>"
                    }
                ]	   
            });

    coleccion.on("child_added", datos => {
        dataSet = [datos.key, datos.child("especialidad").val(), datos.child("personas").val(), datos.child("precio").val()];
        table.rows.add([dataSet]).draw();
    });
    coleccion.on('child_changed', datos => {
        dataSet = [datos.key, datos.child("especialidad").val(), datos.child("personas").val(), datos.child("precio").val()];
        table.row(filaEditada).data(dataSet).draw();
    });
    coleccion.on("child_removed", function() {
        table.row(filaEliminada.parents('tr')).remove().draw();                     
    });
          

    $('form').submit(function(e){
        e.preventDefault();
        let id = $.trim($('#id').val());        
        let especialidad = $.trim($('#especialidad').val());
        let personas = $.trim($('#personas').val());         
        let precio = $.trim($('#precio').val());
        let idFirebase = id;
        if (idFirebase == ''){                      
            idFirebase = coleccion.push().key;
        };                
        data = {especialidad:especialidad, personas:personas, precio:precio};             
        actualizacionData = {};
        actualizacionData[`/${idFirebase}`] = data;
        coleccion.update(actualizacionData);
        id = '';        
        $("form").trigger("reset");
        $('#modalAltaEdicion').modal('hide');
        Swal.fire('¡Accion realizada!', 'Datos guardados correctamente.','success');
    });
    //Botones
    $('#btnNuevo').click(function() {
        $('#id').val('');        
        $('#personas').val('');
        $('#precio').val('');
        $("form").trigger("reset");
        $('#modalAltaEdicion').modal('show');
    });        

    $("#tablaPrecio").on("click", ".btnEditar", function() {    
        filaEditada = table.row($(this).parents('tr'));           
        let fila = $('#tablaPrecio').dataTable().fnGetData($(this).closest('tr'));               
        let id = fila[0];
		let especialidad = $(this).closest('tr').find('td:eq(0)').text(); 
        let personas = $(this).closest('tr').find('td:eq(1)').text();        
        let precio = $(this).closest('tr').find('td:eq(2)').text();
        $('#id').val(id);        
        $('#especialidad').val(especialidad);
        $('#personas').val(personas);                
        $('#precio').val(precio);
        $('#modalAltaEdicion').modal('show');
	});  
  
    $("#tablaPrecio").on("click", ".btnBorrar", function() {   
        filaEliminada = $(this);
        Swal.fire({
        title: '¿Está seguro de eliminar el registro?',
        text: "¡Está operación no se puede revertir!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Borrar'
        }).then((result) => {
        if (result.value) {
            let fila = $('#tablaPrecio').dataTable().fnGetData($(this).closest('tr'));            
            let id = fila[0];            
            db.ref(`precios/${id}`).remove()
            Swal.fire('¡Eliminado!', 'El registro ha sido eliminado.','success')
        }
        })        
	});  

});