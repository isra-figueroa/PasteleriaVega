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
    var storageRef = firebase.storage().ref();
    //creamos constantes para los iconos editar y borrar    
    const iconoEditar = '<svg class="bi bi-pencil-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>';
    const iconoBorrar = '<svg class="bi bi-trash" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>';

    var db = firebase.database();
    var coleccion = db.ref().child("catalogo");
    var dataSet = [];//array para guardar los valores de los campos inputs del form
    var table = $('#tablaCatalogo').DataTable({
        language: {
        "decimal": "",
        "emptyTable": "No hay información",
        "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
        "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
        "infoFiltered": "(Filtrado de _MAX_ total entradas)",
        "infoPostFix": "",
        "thousands": ",",
        "lengthMenu": "Mostrar _MENU_ Entradas",
        "loadingRecords": "Cargando...",
        "processing": "Procesando...",
        "search": "Buscar:",
        "zeroRecords": "Sin resultados encontrados",
        "paginate": {
            "first": "Primero",
            "last": "Ultimo",
            "next": "Siguiente",
            "previous": "Anterior"
        }
    },
                pageLength : 5,
                lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'Todos']],
                data: dataSet,
                columnDefs: [
                    {
                        targets: [0,5],  
                        visible: false, //ocultamos la columna de ID que es la [0]                        
                    },
                    {
                        targets: -1,        
                        defaultContent: "<div class='wrapper text-center'><div class='btn-group'><button class='btnEditar btn btn-primary' data-toggle='tooltip' title='Editar'>"+iconoEditar+"</button><button class='btnBorrar btn btn-danger' data-toggle='tooltip' title='Borrar'>"+iconoBorrar+"</button></div></div>"
                    }
                ]	   
            });

    coleccion.on("child_added", datos => {
        var foto = "<img src="+datos.child("imagen").val()+" class='img-fluid' alt='Responsive image'>"
        dataSet = [datos.key, datos.child("nombre").val(), datos.child("descripcion").val(), datos.child("especialidad").val(), foto, datos.child("imagen").val()];
        table.rows.add([dataSet]).draw();
    });
    coleccion.on('child_changed', datos => {
        var foto = "<img src="+datos.child("imagen").val()+" class='img-fluid' alt='Responsive image'>"           
        dataSet = [datos.key, datos.child("nombre").val(), datos.child("descripcion").val(), datos.child("especialidad").val(), foto, datos.child("imagen").val()];
        table.row(filaEditada).data(dataSet).draw();
    });
    coleccion.on("child_removed", function() {
        table.row(filaEliminada.parents('tr')).remove().draw();                     
    });
          

    $('form').submit(function(e){
        e.preventDefault();
        let id = $.trim($('#id').val());        
        let nombre = $.trim($('#nombre').val());
        let descripcion = $.trim($('#descripcion').val());         
        let especialidad = $.trim($('#especialidad').val());
        var preview = document.querySelector('img');
        if(document.getElementById("imagen").files.length == 0 && preview.src.length==101){
            Swal.fire('¡Error!', 'No se selecciono una imagen para el registro','warning');
        }else if(document.getElementById("imagen").files.length > 0){
        const file = $('#imagen').get(0).files[0];
        var task = storageRef.child("images/"+file.name).put(file);
        task.on('state_changed', function(snapshot){

        },function(error){

        },function(){
            task.snapshot.ref.getDownloadURL().then(function(url){
                let idFirebase = id;        
                if (idFirebase == ''){                      
                    idFirebase = coleccion.push().key;
                };
                data = {nombre:nombre, descripcion:descripcion, especialidad:especialidad, imagen:url};
                actualizacionData = {};
                actualizacionData[`/${idFirebase}`] = data;
                coleccion.update(actualizacionData);
                id = '';        
                $("form").trigger("reset");
                $('#modalAltaEdicion').modal('hide');
                Swal.fire('¡Accion realizada!', 'Datos guardados correctamente.','success');
            });
        });}else if(preview.src.length>101){
            let idFirebase = id;        
            if (idFirebase == ''){                      
                idFirebase = coleccion.push().key;
            };                
            data = {nombre:nombre, descripcion:descripcion, especialidad:especialidad, imagen:preview.src};             
            actualizacionData = {};
            actualizacionData[`/${idFirebase}`] = data;
            coleccion.update(actualizacionData);
            id = '';        
            $("form").trigger("reset");
            $('#modalAltaEdicion').modal('hide');
            Swal.fire('¡Accion realizada!', 'Datos guardados correctamente.','success');
        }
        //task.then(storageRef.child("images/"+file.name).getDownloadURL().then(function(url) {alert(url);}));
        /*let idFirebase = id;        
        if (idFirebase == ''){                      
            idFirebase = coleccion.push().key;
        };                
        data = {nombre:nombre, descripcion:descripcion, especialidad:especialidad, imagen:file.name};             
        actualizacionData = {};
        actualizacionData[`/${idFirebase}`] = data;
        coleccion.update(actualizacionData);
        id = '';        
        $("form").trigger("reset");
        $('#modalAltaEdicion').modal('hide');
        Swal.fire('¡Accion realizada!', 'Datos guardados correctamente.','success');*/
    });
    //Botones
    $('#btnNuevo').click(function() {
        $('#id').val('');        
        $('#nombre').val('');
        $('#descripcion').val('');
        var preview = document.querySelector('img');
        preview.src="";         
        $("form").trigger("reset");
        $('#modalAltaEdicion').modal('show');
    });        

    $("#tablaCatalogo").on("click", ".btnEditar", function() {    
        filaEditada = table.row($(this).parents('tr'));           
        let fila = $('#tablaCatalogo').dataTable().fnGetData($(this).closest('tr'));               
        let id = fila[0];
        let imagen = fila[5];
        console.log(id);
		let nombre = $(this).closest('tr').find('td:eq(0)').text(); 
        let descripcion = $(this).closest('tr').find('td:eq(1)').text();        
        let especialidad = $(this).closest('tr').find('td:eq(2)').text();
        var preview = document.querySelector('img');
        preview.src=""+imagen;
        $('#id').val(id);        
        $('#nombre').val(nombre);
        $('#descripcion').val(descripcion);                
        $('#especialidad').val(especialidad);
        $('#modalAltaEdicion').modal('show');
	});  
  
    $("#tablaCatalogo").on("click", ".btnBorrar", function() {   
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
            let fila = $('#tablaCatalogo').dataTable().fnGetData($(this).closest('tr'));            
            let id = fila[0];            
            db.ref(`catalogo/${id}`).remove()
            Swal.fire('¡Eliminado!', 'El registro ha sido eliminado.','success')
        }
        })        
	});  

});