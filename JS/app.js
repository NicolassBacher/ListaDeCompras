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
var detalle = document.getElementById('detalle')
let pantallaOscura = document.getElementById('pantallaOscura')

/* Contadores */
let item = 0
let cantidad = 0
let bandera = 0
let identificador = 0

/* ARRAY */
let guardar = []

/* Abrir formulario */
let abrirFormulario = () => {
  formulario.style.display = "flex"
  formulario.style.zIndex = "5"
  btnFormulario.style.display = "none"
  detalle.style.display = "none"
  lista.style.opacity = "0.4"
  inicio.style.opacity = "0.4"
  pantallaOscura.style.display = "flex"
}

/* Cerrar Formulario */
let cerrar = () => {
  formulario.style.display = "none"
  formulario.style.zIndex = "2"
  detalle.style.display = "none"
  pantallaOscura.style.display = "none"
  btnFormulario.style.display = "inline-block"
  lista.style.opacity = "1"
  inicio.style.opacity = "1"
  document.getElementById('descripcion').placeholder = "Ej: 1 kg. preferentemente verde"
  if (cantidad == 0) {
    inicio.style.display = "flex"
    lista.style.display = "none"
  } else {
    inicio.style.display = "none"
    lista.style.display = "flex"
  }
  bandera = 0
  datos.reset()
}

/* Abrir detalle */
let abrirDetalle = (titulo, tipo, descripcion, ids) => {
  detalle.style.display = "flex"
  lista.style.opacity = "0.4"
  pantallaOscura.style.display = "flex"
  let modeloItem
  if (descripcion === '') {
    modeloItem = `<img src="${tipo}" alt="" /><div class="detalleItem"><h4>Producto:</h4><p>${titulo}</p></div><div class="detalleItem"><h4>Descripcion:</h4><p style="color: #666;">No agrego ninguna descripcion del Producto</p></div><div class="dosBotones"><button class="boton" onclick="borrar ('${ids}')">Eliminar</button><button class="boton" onclick="modificar ('${titulo}', '${tipo}', '${descripcion}', '${ids}'), abrirFormulario()">Modificar</button></div></div>`
  } else {
    modeloItem = `<img src="${tipo}" alt="" /><div class="detalleItem"><h4>Producto:</h4><p>${titulo}</p></div><div class="detalleItem"><h4>Descripcion:</h4><p>${descripcion}</p></div><div class="dosBotones"><button class="boton" onclick="borrar ('${ids}')">Eliminar</button><button class="boton" onclick="modificar ('${titulo}', '${tipo}', '${descripcion}', '${ids}'), abrirFormulario()">Modificar</button></div></div>`
  }
  let padre = document.getElementById('enviaDetalle')
  padre.innerHTML = modeloItem
}

/* Funcion para agregar items a la lista */
let agregarItem = (titulo, tipo, descripcion) => {
  descripcion = descripcion.replace(/\n/g, '<br>')
  if (bandera == 1) {
    bandera = 0
    let modeloItem1 = `<img src= "${tipo}" alt="" /><h3>${titulo}</h3><button class="boton" onclick="abrirDetalle ('${titulo}', '${tipo}', '${descripcion}', '${identificador}')">Detalle</button>`
    let padre1 = document.getElementById(`${identificador}`)
    padre1.innerHTML = modeloItem1
    modificarStorage(titulo, tipo, descripcion, identificador)
    identificador = 0
  }
  else {
    item++
    cantidad++
    let ids = 'id' + item
    let modeloItem2 = `<li class="item" id="${ids}"><img src= "${tipo}" alt="" /><h3>${titulo}</h3><button class="boton" onclick="abrirDetalle ('${titulo}', '${tipo}', '${descripcion}', '${ids}')">Detalle</button></li>`
    let padre2 = document.getElementById('contenedor')
    padre2.innerHTML += modeloItem2
    console.log(titulo)
    console.log(descripcion)
    console.log(ids)
    console.log(tipo)
    guardarStorage(titulo, tipo, descripcion, ids)
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

let guardarStorage = (titulo, tipo, descripcion, ids) => {
  let array = { title: titulo, tipe: tipo, description: descripcion, id: ids }
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
      agregarItem(elementos[i].title, elementos[i].tipe, elementos[i].description)
    }
    localStorage.removeItem('items')
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

/* Llamado de funciones mediante evento clic */
btnFormulario.addEventListener('click', abrirFormulario)
btnCerrar2.addEventListener('click', cerrar)
btnCerrar1.addEventListener('click', cerrar)
btnVaciarLista.addEventListener('click', vaciarLista)


/* Llamado de funciona para cerrar popup haciendo clicl afuera */
pantallaOscura.addEventListener('click', cerrar)

/* Llamado de funcion enviar datos */
datos.addEventListener('submit', enviar)