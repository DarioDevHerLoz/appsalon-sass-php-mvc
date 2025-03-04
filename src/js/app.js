let paso = 1;
const pasoInicial = 1;
const pasoFinal=3;

const cita = {
  id: '',
  nombre: '',
  fecha: '',
  hora: '',
  servicios: []
}


document.addEventListener('DOMContentLoaded', function(){
  iniciarApp();
})

function iniciarApp(){
  mostrarseccion(); //muestra y oculta las secciones
  tabs(); //Cambia la seccion cuando se pesionen los tabs
  botonesPaginador(); //Agrega o quita los botones del paginador
  PaginaSiguiente();
  PaginaAnterior();

  consultarAPI(); //Consulta la API en el backend de PHP

  idCliente();
  nombreCliente(); //Añade el nombre del cliente al objeto cita
  seleccionarFecha(); // Añade la fecha de la cita en el objeto 
  seleccionarHora(); // Añade la hora de la cita en el objeto

  mostrarResumen(); //Muestra el resumen de la cita

}
function mostrarseccion() {
  //ocultar la seccion que tenga la clase de mostrar
  const seccionAnterior = document.querySelector('.mostrar')
  if(seccionAnterior){
    seccionAnterior.classList.remove('mostrar')
  }
  //Seleccionar la seccion con el paso
  const pasoSelector = `#paso-${paso}`
  const section = document.querySelector(pasoSelector)
  section.classList.add('mostrar');
  //Quita la clase de actual al tab anterior
  const tabAnterior = document.querySelector('.actual');
  if(tabAnterior){
    tabAnterior.classList.remove('actual');
  }
  //Resalta el tab actual
  const tab = document.querySelector(`[data-paso="${paso}"]`);
  tab.classList.add('actual');
}

function tabs(){
  const botones = document.querySelectorAll('.tabs button');
  botones.forEach((boton) => {
    boton.addEventListener('click', function(e){
      paso = parseInt(e.target.dataset.paso);
      mostrarseccion();
      botonesPaginador();
    })
  })

}

function botonesPaginador() {
  const PaginaAnterior = document.querySelector('#anterior');
  const PaginaSiguiente = document.querySelector('#siguiente');

  if(paso === 1){
    PaginaAnterior.classList.add('ocultar')
    PaginaSiguiente.classList.remove('ocultar')
  }else if(paso === 3){
    PaginaAnterior.classList.remove('ocultar')
    PaginaSiguiente.classList.add('ocultar')
    mostrarResumen();
  }else {
    PaginaAnterior.classList.remove('ocultar')
    PaginaSiguiente.classList.remove('ocultar')
  }
  mostrarseccion();

}

function PaginaAnterior() {
  const PaginaAnterior = document.querySelector('#anterior')
  PaginaAnterior.addEventListener('click', function (){
    if(paso <= pasoInicial) return;
    paso--;
    botonesPaginador()
  } )
}

function PaginaSiguiente(){
  const PaginaSiguiente = document.querySelector('#siguiente')
  PaginaSiguiente.addEventListener('click', function (){
    if(paso >= pasoFinal) return;
    paso++;
    botonesPaginador()
  } )
}

async function consultarAPI(){
  try {
    const url = 'http://localhost:3000/api/servicios' //Url que voy a consumir la que tiene mi api
    const resultado = await fetch(url) //Funcion que nos permite consumir este servicio: http://localhost:3000/api/servicios
    const servicios = await resultado.json()
    mostrarServicios(servicios)
  }catch(error) {
    console.log(error);
  }
}

function mostrarServicios(servicios){
  servicios.forEach( servicio =>{
    //distruccion
    const {id, nombre, precio} = servicio //Estrae el valor pero tambien te grea la variable al mismo tiempo en una sola linea

    const nombreServicio = document.createElement('P'); //Creamos un elemento HTML
    nombreServicio.classList.add('nombre-servicio'); //le agregamos una clase
    nombreServicio.textContent = nombre //Le añadimos un contenido

    const precioServicio = document.createElement('P'); //Creamos un elemento HTML
    precioServicio.classList.add('precio-servicio'); //le agregamos una clase
    precioServicio.textContent = `$${precio}` //Le añadimos un contenido

    const servicioDiv = document.createElement('DIV')
    servicioDiv.classList.add('servicio');
    servicioDiv.dataset.idServicio = id;
    //Callback
    servicioDiv.onclick = function(){
      seleccionarServicio(servicio)
    } 

    servicioDiv.appendChild(nombreServicio);
    servicioDiv.appendChild(precioServicio);
    document.querySelector('#servicios').appendChild(servicioDiv)
  })
}

function seleccionarServicio(servicio) {
  const {id} = servicio; //Servicio es el que selecciono y servicios es el objeto en memoria
  const { servicios } = cita; //Extraer arreglo serviciuos
  //Identificar al elemento al que se le da click
  const divServicio = document.querySelector(`[data-id-servicio="${id}"]`)
  //Comprobar si un servicio ya fue agregado
  if(servicios.some(agregado => agregado.id === id )) { //el id hace referencia al servicio.id al seleccionado
    //eliminarlo
    cita.servicios = servicios.filter(agregado => agregado.id !== id) //Filter nos permite sacar un elemento dependiendo de cierta condicion
    divServicio.classList.remove('seleccionado');
  } else {
    //Agregarlo
    cita.servicios = [...servicios, servicio]; //Tomo una copia de los servicios y le agrego el nuevo servicio
    divServicio.classList.add('seleccionado');
  }
}

function idCliente(){
  cita.id = document.querySelector('#id').value;
}

function nombreCliente(){
  cita.nombre = document.querySelector('#nombre').value;
}

function seleccionarFecha(){
  const inputFecha = document.querySelector('#fecha');
  inputFecha.addEventListener('input', function (e){

    const dia = new Date(e.target.value).getUTCDay();

    if([6,0].includes(dia)){
      e.target.value =''
      mostrarAlerta('Fines de semana no abrimos', 'error', '.formulario');
    } else {
      cita.fecha = e.target.value;
    }
  })
}

function seleccionarHora() {
  const inputHora = document.querySelector('#hora');
  inputHora.addEventListener('input', function(e){
    const horaCita = e.target.value;
    const hora = horaCita.split(":")[0];
    if(hora<10 || hora>18 ){
      mostrarAlerta('Hora No Válida', 'error', '.formulario');
      e.target.value = ""
    }else {
      cita.hora = e.target.value;
    }
  })
}

function mostrarAlerta(mensaje,tipo,elemento, desaparece = true){
  //previene que se genere mas de una alerta
  const alertaPrevia =document.querySelector('.alerta')
  if(alertaPrevia){
    alertaPrevia.remove();
  }

  //Crear la alerta
  const alerta = document.createElement('DIV');
  alerta.textContent = mensaje
  alerta.classList.add('alerta');
  alerta.classList.add(tipo);

  const referencia = document.querySelector(elemento);
  referencia.appendChild(alerta);

  if(desaparece){
    //Eliminar la alerta
    setTimeout(() => {
      alerta.remove();
    }, 3000)
  }

}

function mostrarResumen() {
  const resumen = document.querySelector('.contenido-resumen');

  //Limpiar el contenido de resumen
  while (resumen.firstChild) {
    resumen.removeChild(resumen.firstChild);

  }



  if(Object.values(cita).includes('') || cita.servicios.length === 0){
    mostrarAlerta('hacen falta datos de Servicios, Fecha u Hora', 'error', '.contenido-resumen',false);
    return;
  }
  //Formatear el div de resumen
  const {nombre, fecha, hora, servicios } =cita;

  //Heading para servicios en resumen
  const headingServicios = document.createElement('H3')
  headingServicios.textContent = 'Resumen de Servicios'
  resumen.appendChild(headingServicios)
  //Iterando y mostrando los servicios
  servicios.forEach(servicio => {
    const {id, precio, nombre} = servicio
    const contenedorServicio = document.createElement('DIV');
    contenedorServicio.classList.add('contenedor-servicio');

    const textoServicio = document.createElement('P');
    textoServicio.textContent = nombre;

    const precioServicio = document.createElement('P')
    precioServicio.innerHTML = `<span>Precio:</span> $${precio}`

    contenedorServicio.appendChild(textoServicio);
    contenedorServicio.appendChild(precioServicio);

    resumen.appendChild(contenedorServicio)
  })

  const headingCita = document.createElement('H3')
  headingCita.textContent = 'Resumen de la cita'
  resumen.appendChild(headingCita)

  const nombreCliente = document.createElement('P');
  nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`

  //Formatear la fecha en español
  const fechaObj = new Date(fecha);
  const mes = fechaObj.getMonth();
  const dia = fechaObj.getDate() + 2; //se agregan dos dias porque tiene un deface de dos dias por usarlo dos veces
  const year = fechaObj.getFullYear();
  const fechaUTC = new Date(Date.UTC(year, mes, dia));

  const opciones = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}

  const fechaFormateada = fechaUTC.toLocaleDateString('es-MX',opciones)

  const fechaCita = document.createElement('P');
  fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`

  const horaCita = document.createElement('P');
  horaCita.innerHTML = `<span>Hora:</span> ${hora} Horas`

  //Boton para Crear una cita 
  const botonReservar = document.createElement('BUTTON');
  botonReservar.classList.add('boton');
  botonReservar.textContent = 'Reservar Cita';

  botonReservar.onclick = reservarCita;


  resumen.appendChild(nombreCliente);
  resumen.appendChild(fechaCita);
  resumen.appendChild(horaCita);
  resumen.appendChild(botonReservar)
}

async function reservarCita(){
  const {nombre, fecha, hora, servicios,id} = cita;
  const idServicio = servicios.map( servicio => servicio.id);
  // console.log(idServicio);

  //Diferencia entre el map y el foreach
  //Foreach: solo itera
  //map lee coincidencias las coloca en la variable idServicios
  const datos = new FormData(); //El objeto que permite enviar datos de un formulario funciona como el submit de js
  datos.append('fecha', fecha);
  datos.append('hora', hora);
  datos.append('usuarioId', id);
  datos.append('servicios', idServicio);

  try {
    //Peticion hacia la api
      const url = 'http://localhost:3000/api/citas'

      const respuesta = await fetch(url,{
        method: 'POST', //Utiliza el archivo js utiliza el metodo POST para enviarlo a la URL de arriba
        body: datos//Cuerpo de la peticion que vamos a enviar
      })

      const resultado = await respuesta.json(); //.json covierte una respuesta del js a un resultado objeto js
      console.log(resultado.resultado);

      if (resultado.resultado){
        Swal.fire({
          icon: 'success',
          title: 'Cita Creada',
          text: 'Tu cita fue creada correctamente',
          button: 'OK'
        }).then(() => {
          setTimeout(() => {
            window.location.reload();
          },3000)
          
        })
      }
      //console.log([...datos])    
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Hubo un error al guardar la cita",
    });
  }

  
}
