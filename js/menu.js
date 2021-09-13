function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(window.location);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function colocarName(){
	var txt = getParameterByName("val");
	var arrayDeCadenas = txt.split("-");
	var btn = document.getElementById("menu");
	btn.innerHTML = "<i class='fa fa-heart'></i> "+arrayDeCadenas[0].replaceAll('_', ' ');
	if(arrayDeCadenas[1]=="Cajero"){
	var btn1 = document.getElementById("usuarios");
	var btn2 = document.getElementById("catalogo");
	var btn3 = document.getElementById("registros");
	btn1.disabled = true;
	btn2.disabled = true;
	btn3.disabled = true;
	} 
}

colocarName();

function cambiarPagina(pagina){
	var txt = getParameterByName("val");
	window.location=pagina+"?val="+txt;
}

    function mas(){
        let num = $.trim($('#cantidad').val());
        num++;
        $('#cantidad').val(num);
    }
    function menos(){
        let num = $.trim($('#cantidad').val());
        if(num>0){
        	num--;
        }
        $('#cantidad').val(num);
    }

    function past(){
    	$('#modalAltaEdicion').modal('hide');
        $('#modalAlta').modal('show');
    }
    function save(){
    	$('#modalAlta').modal('hide');
        $('#modalAltaEdicion').modal('show');
        var d = document.getElementById('pastel');
        let pastel = d.options[d.selectedIndex].text;
        var e = document.getElementById('personas');
        let personas = e.options[e.selectedIndex].text;
        $('#pas').val(pastel);
        $('#per').val(personas);
    }

    function pdf(){
        const $elementoParaConvertir = document.getElementById("morado"); // <-- Aquí puedes elegir cualquier elemento del DOM
		html2pdf()
		    .set({
		        margin: 1,
		        filename: 'documento.pdf',
		        image: {
		            type: 'jpeg',
		            quality: 0.98
		        },
		        html2canvas: {
		            scale: 3, // A mayor escala, mejores gráficos, pero más peso
		            letterRendering: true,
		        },
		        jsPDF: {
		            unit: "in",
		            format: "a3",
		            orientation: 'portrait' // landscape o portrait
		        }
		    })
		    .from($elementoParaConvertir)
		    .save()
		    .catch(err => console.log(err));
    }