/* Variables BOTONES */
let btnFormulario = document.getElementById('btnformulario')
let btnAgregar = document.getElementById('btnagregar')
let btnCerrar1 = document.getElementById('btncerrar1')
let btnCerrar2 = document.getElementById('btncerrar2')
let btnDetalle = document.getElementById('btnDetalle')
let btnVaciarLista = document.getElementById('btnVaciarLista')

/* variable de datos de formulario */
let datos = document.getElementById('datos')
let enviaDetalle = document.getElementById('enviaDetalle')

/* Distintas pantallas */
let formulario = document.getElementById('formulario')
let lista = document.getElementById('lista')
let inicio = document.getElementById('inicio')
let detalle = document.getElementById('detalle')
let pantallaOscura = document.getElementById('pantallaOscura')

/* Contadores */
let item = 0
let cantidad = 0
let bandera = 0             //se usa cuando se quiere modificar un elemento: 0 agrega elemento nuevo, 1 modifica elemento 
let identificador = 0
let ejecutarEstado = 0

/* ARRAY */
let guardar = []

/* Abrir formulario: pone display:"flex" a la pantalla de formulario, display:"none" a las demas ( solo funciona en celular ), le da opacidad al fondo */
let abrirFormulario = () => {
  formulario.style.display = "flex"
  formulario.style.zIndex = "5"
  btnFormulario.style.display = "none"
  detalle.style.display = "none"
  lista.style.opacity = "0.4"
  inicio.style.opacity = "0.4"
  pantallaOscura.style.display = "flex"
}

/* Cerrar Formulario: pone display:"flex" a la pantalla que corresponda de acuerdo a si hay elementos o no, display:"none" a todos los popup, le quita la opacidad al fondo */
let cerrar = () => {
  formulario.style.display = "none"
  formulario.style.zIndex = "2"
  detalle.style.display = "none"
  pantallaOscura.style.display = "none"
  btnFormulario.style.display = "inline-block"
  lista.style.opacity = "1"
  inicio.style.opacity = "1"
  document.getElementById('descripcion').placeholder = "Ej: 1 kg." // vuelve a colocar el ejemplo de descripcion ya que cuando modificas un elemento se borraba
  if (cantidad == 0) { //si la cantidad de elementos es 0 muestra la pantalla de inicio sin elementos
    inicio.style.display = "flex"
    lista.style.display = "none"
  } else { // si la cantidad de elementos es distinta de 0 muestra la pantalla de lista
    inicio.style.display = "none"
    lista.style.display = "flex"
  }
  bandera = 0 //se pone en 0 para evitar bug si queda en 1 modifica el elemento
  datos.reset()
}

/* Abrir detalle: pone display:"flex" a la pantalla detalle, le da opacidad al fondo, trae el titulo, la imagen y la descripcion del elemento y arma un popup con estos
 trae tambien el ids asociado al elemento para poder modificarlo o borrarlo*/
let abrirDetalle = (titulo, tipo, descripcion, ids) => {
  ejecutarEstado = 1                            //bandera para no cambiar de estado en caso de precionar btn detalle
  detalle.style.display = "flex"
  lista.style.opacity = "0.4"
  pantallaOscura.style.display = "flex"
  let modeloItem
  if (descripcion === '') {                     //si el elemento no tiene descripcion crea el popup sin descripcion
    modeloItem = `<img src="${tipo}" alt="" /><div class="detalleItem"><h4>Producto:</h4><p>${titulo}</p></div><div class="detalleItem"><h4>Descripcion:</h4><p style="color: #666;">No agrego ninguna descripcion del Producto</p></div><div class="dosBotones"><button class="boton" onclick="borrar ('${ids}')">Eliminar</button><button class="boton" onclick="modificar ('${titulo}', '${tipo}', '${descripcion}', '${ids}'), abrirFormulario()">Modificar</button></div></div>`
  } else {                                      //si el elemento tiene descripcion crea un popup con descripcion
    modeloItem = `<img src="${tipo}" alt="" /><div class="detalleItem"><h4>Producto:</h4><p>${titulo}</p></div><div class="detalleItem"><h4>Descripcion:</h4><p>${descripcion}</p></div><div class="dosBotones"><button class="boton" onclick="borrar ('${ids}')">Eliminar</button><button class="boton" onclick="modificar ('${titulo}', '${tipo}', '${descripcion}', '${ids}'), abrirFormulario()">Modificar</button></div></div>`
  }
  let padre = document.getElementById('enviaDetalle')
  padre.innerHTML = modeloItem //
}

/* Funcion para agregar items a la lista */
let agregarItem = (titulo, tipo, descripcion, color) => {
  descripcion = descripcion.replace(/\n/g, '<br>')
  if (bandera == 1) {
    bandera = 0
    let modeloItem1 = `<img src= "${tipo}" alt=""/><h3>${titulo}</h3><button class="boton" onclick="abrirDetalle ('${titulo}', '${tipo}', '${descripcion}', '${identificador}')">Detalle</button>`
    let padre1 = document.getElementById(`${identificador}`)
    padre1.innerHTML = modeloItem1
    modificarStorage(titulo, tipo, descripcion, identificador)
    identificador = 0
  }
  else {
    item++
    cantidad++
    let ids = 'id' + item
    if (!color) { color = 'estado0' }
    let modeloItem2 = `<li class="item ${color}" onclick="cambiarEstado(${ids})" id="${ids}"><img src= "${tipo}" alt="" class="estado"/><h3 class="estado">${titulo}</h3><button class="boton" onclick="abrirDetalle ('${titulo}', '${tipo}', '${descripcion}', '${ids}')">Detalle</button></li>`
    let padre2 = document.getElementById('contenedor')
    padre2.innerHTML += modeloItem2
    guardarStorage(titulo, tipo, descripcion, ids, color)
  }
}

let modificar = (titulo, tipo, descripcion, ids) => {
  bandera = 1
  descripcion = descripcion.replace(/<br>/g, '\n')
  document.getElementById('titulo').value = titulo
  document.getElementById('tipo').value = tipo
  document.getElementById('descripcion').value = descripcion
  document.getElementById('descripcion').placeholder = "No agrego ninguna descripcion"
  btnAgregar.innerHTML = 'Guardar'
  identificador = ids

}

let borrar = (ids) => {
  cantidad--
  if (cantidad < 0) { cantidad = 0 }
  let itemBorrar = document.getElementById(`${ids}`)
  itemBorrar.remove()
  borrarStorage(ids)
  cerrar()
}

let cambiarEstado = (e) => {
  if (!ejecutarEstado) {
    console.log('estado')
    console.log(e)
    let color = document.getElementById(e.id).classList[1]
    let colorFinal
    console.log(color)
    switch (color) {
      case "estado0":
        document.getElementById(e.id).classList.remove('estado0')
        document.getElementById(e.id).classList.add('estado1')
        colorFinal = 'estado1'
        break;
      case "estado1":
        document.getElementById(e.id).classList.remove('estado1')
        document.getElementById(e.id).classList.add('estado2')
        colorFinal = 'estado2'
        break;
      case "estado2":
        document.getElementById(e.id).classList.remove('estado2')
        document.getElementById(e.id).classList.add('estado0')
        colorFinal = 'estado0'
        break;
    }
    for (let i = 0; i < guardar.length; i++) {
      if (guardar[i].id == e.id)
        guardar[i].colors = colorFinal
      localStorage.setItem('items', JSON.stringify(guardar))
    }
  }
  ejecutarEstado = 0

}

let guardarStorage = (titulo, tipo, descripcion, ids, color) => {
  let array = { title: titulo, tipe: tipo, description: descripcion, id: ids, colors: color }
  guardar.push(array)
  localStorage.setItem('items', JSON.stringify(guardar))
}

let modificarStorage = (titulo, tipo, descripcion, ids) => {
  guardar.forEach((item) => {
    if (item.id == ids) {
      item.title = titulo
      item.tipe = tipo
      item.description = descripcion
    }
  })
  localStorage.setItem('items', JSON.stringify(guardar))
}
let borrarStorage = (ids) => {
  for (let i = 0; i < guardar.length; i++) {
    if (guardar[i].id == ids) {
      guardar.splice(i, 1)
    }
  }
  localStorage.setItem('items', JSON.stringify(guardar))
  console.log(guardar)
}

let verStorage = () => {
  let traerStorage = localStorage.getItem('items')
  let elementos = {}
  if (traerStorage) {
    elementos = JSON.parse(traerStorage)
    localStorage.removeItem('items')
    for (let i = 0; i < elementos.length; i++) {
      agregarItem(elementos[i].title, elementos[i].tipe, elementos[i].description, elementos[i].colors)
    }
    cerrar()
  }
}

verStorage()

let vaciarLista = (() => {
  let contador = 0
  while (cantidad > 0) {
    let ids = 'id' + contador
    let itemBorrar = document.getElementById(`${ids}`)
    if (itemBorrar) {
      itemBorrar.remove()
      cantidad--
    }
    contador++
  }
  localStorage.clear()
  cerrar()


})

/* funciona enviar formulario */
let enviar = (e) => {
  e.preventDefault()
  let titulo = e.target.titulo.value
  let tipo = e.target.tipo.value
  let descripcion = e.target.descripcion.value
  agregarItem(titulo, tipo, descripcion)
  cerrar()
}

/* Llamado de funciones mediante evento click botones*/
btnFormulario.addEventListener('click', abrirFormulario)
btnCerrar2.addEventListener('click', cerrar)
btnCerrar1.addEventListener('click', cerrar)
btnVaciarLista.addEventListener('click', vaciarLista)


/* Llamado de funciona para cerrar popup haciendo clicl afuera */
pantallaOscura.addEventListener('click', cerrar)

/* Llamado de funcion enviar datos */
datos.addEventListener('submit', enviar)

/* llamado de funcion para cambiar de estado */