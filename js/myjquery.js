 $(document).ready(function(){ 
	$("#mygrid").jqGrid({ //creazione l'instanza di un oggetto jqgrid
		url:'http://localhost:8080/api/tutorial/1.0/employees', //url del server REST
		datatype: "json", //specifico il formato di dati che si aspetta per riempire la griglia
		colNames:['employeeId', 'firstName', 'lastName', 'email', 'phone'], //imposto nomi delle colonne della griglia
		colModel:[//definisco le proprietà delle varie colonne
			{name:'employeeId',index:'employeeId', width:55, editable: true, sorttype: 'int'},
			{name:'firstName',index:'firstName', width:100, editable: true},	
            {name:'lastName',index:'lastName', width:100, editable: true},	        
            {name:'email',index:'email', width:100, editable: true},	   
			{name:'phone',index:'phone', width:100, sortable:false, editable: true}		
		],
		rowNum:10, //numero massimo di righe visualizzate automaticamente
		loadonce: true,    
		rowList:[10,20,30],
		pager: '#mypager', //indico l'id del pager successivamente configurato 
		sortname: 'employeeId', //ordino le righe per l'id dell'impiegato
        viewrecords: true,        
		sortorder: "asc", 
        editable: true, 
        multiselect: true, // abilito la selezione multiriga
		caption:"Manage Employees" //intestazione della tabella
	});


$("#mygrid").jqGrid('navGrid','#mypager', //specifico le proprietà del pager per i vari pulsanti e le rispettive callback
{
    edit:true, edittitle: "Edit", width: 500,
    add:true, addtitle: "Add", width: 500,
    del:true,
    search: true,
    refresh: true,
    refreshstate: "current",
    reloadGridOptions: { fromServer: true },
    view:true
},

{ //gestione del pulsante relativo alla modifica dei dati di un impiegato
    editCaption: "Edit", 
    edittext: "Edit", 
    mtype: "PUT", //imposto il metodo che verrà utilizzato per la richiesta http al server REST
    closeOnEscape: true, 
    closeAfterEdit: true, 
    savekey: [true, 13], 
    errorTextFormat: commonError, 
    width: "500", 
    reloadAfterSubmit: true, 
    bottominfo: "Please, update the data", //imposto la descrizione situata nella parte inferiore
    top: "60", 
    left: "5", 
    right: "5",
    afterSubmit: function () { location.reload(true); }, //specifico che dopo la submit venga effettuato il reload della griglia
    onclickSubmit: function (options, postdata) { //specifico la funzione da richiamare al click del rispettivo bottone
        EditPost(options,postdata);
    }
},

{//gestione del pulsante relativo all'inserimento dei dati di un impiegato
    addCaption: "Add", 
    addtext: "Add", 
    mtype: "POST", //imposto il metodo che verrà utilizzato per la richiesta http al server REST
    closeOnEscape: true, 
    closeAfterEdit: true, 
    savekey: [true, 13], 
    errorTextFormat: commonError, 
    width: "500", 
    reloadAfterSubmit: true, 
    bottominfo: "Please, insert the data", //imposto la descrizione situata nella parte inferiore
    top: "60", 
    left: "5", 
    right: "5",
    afterSubmit: function () { location.reload(true); }, //specifico che dopo la submit venga effettuato il reload della griglia
    onclickSubmit: function (options, postdata) { //specifico la funzione da richiamare al click del rispettivo bottone
        AddPost(options,postdata);
    }
},

{//gestione del pulsante relativo alla cancellazione dei dati di un impiegato
    deleteCaption: "Delete", 
    deletetext: "Delete", 
    mtype: "DELETE", //imposto il metodo che verrà utilizzato per la richiesta http al server REST
    closeOnEscape: true, 
    closeAfterEdit: true, 
    savekey: [true, 13], 
    errorTextFormat: commonError, 
    width: "500", 
    reloadAfterSubmit: true, 
    top: "60", 
    left: "5", 
    right: "5",
    onclickSubmit: function (options, postdata) { //specifico la funzione da richiamare al click del rispettivo bottone
        DeletePost(options,postdata);
    }   
}
);



function commonError(data) { //funzione per l'avviso di eventuali errori
    return "Errore!!!!";
}

function EditPost(options,postdata) { //funzione che effetua l'aggiornamento dei dati inviando una richiesta http tramite metodo put
    var selRowId = jQuery("#mygrid").getGridParam('selrow'); //ricavo l'id della riga selezionata
    celValue = jQuery("#mygrid").jqGrid ('getCell', selRowId, 'employeeId'); //ricavo l'id dell'impiegato selezionato
    //alert("userID:" +userID);  // test
    options.url = "http://localhost:8080/api/tutorial/1.0/employees/"+ celValue; //setto l'url aggiungendo l'id dell'impiegato
    //console.log(postdata);  // test
}
function AddPost(options,postdata) {//funzione che effetua l'inserimento dei dati inviando una richiesta http tramite metodo post
    options.url = "http://localhost:8080/api/tutorial/1.0/employees";
   // console.log(postdata); //test
}
function DeletePost(options,postdata) {//funzione che effetua la rimozione dei dati inviando una richiesta http tramite metodo delete
    var selRowIds = jQuery("#mygrid").jqGrid('getGridParam', 'selarrrow'); //ricavo l'id della riga selezionata
    $.each( selRowIds, function( index, value ){
        celValue = jQuery("#mygrid").jqGrid ('getCell', value, 'employeeId'); //ricavo l'id dell'impiegato selezionato
        var urlREST = "http://localhost:8080/api/tutorial/1.0/employees/"+celValue ; 
        $.ajax({ type: "DELETE",url: urlREST });
    
    });
    // options.url = "http://localhost:8080/api/tutorial/1.0/employees/"+ jQuery("#mygrid").jqGrid('getCell', postdata, 'employeeId');
    //console.log(postdata); //test
}
});

$.extend($.jgrid.edit, { //estensione delle funzionalità di jqgrid
    closeOnEscape: true,
    closeAfterEdit: true,
    closeAfterAdd: true,
    reloadAfterSubmit: false,
    recreateForm: true,
    datatype: "json",
    ajaxEditOptions: { contentType: "application/json" },
    serializeEditData: function (postData) { //converto in stringa JSON
      return JSON.stringify(postData)
    }
});

