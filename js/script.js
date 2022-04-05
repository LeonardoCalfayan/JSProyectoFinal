

const cantidadMáxima = 100

//Consulto la base de datos local de la lista dr precios en forma asincónica

let listaPrecios = []

async function consultarListaPrecios() {
    const response = await fetch('../json/listaPrecios.json')
    return await response.json()
}

consultarListaPrecios().then(listaDePrecios =>{
    listaPrecios = listaDePrecios
})


//levanto el carrito del Local Storage si está, sino el carrito = arreglo vacío
let carrito
localStorage.getItem("carritoDB") ? carrito = JSON.parse(localStorage.getItem("carritoDB")) : carrito = []  //levanto el carrito del Local Storage si está, sino el carrito = arreglo vacío


const formPasteleriaTradicional = document.getElementById("formPasteleríaTradicional")
const botonCarrito = document.querySelector(".botonCarrito")
const panelCarrito = document.querySelector(".panelCarrito") 

class productoPasteleríaTradicional{
    constructor(nombre, cantidad, comentarios, precio){
        this.nombre = nombre
        this.cantidad = cantidad
        this.comentarios = comentarios
        this.precio = precio
        this.subTotal = 0
    }

    subTotalProducto(){
        this.subTotal = this.precio * this.cantidad
    }
    
}

botonCarrito.addEventListener("click",() => {
    panelCarrito.classList.toggle("activo")
    mostrarCarrito()
})
formPasteleriaTradicional.addEventListener('submit',(e) => {
    e.preventDefault()

    let nombre = document.getElementById("seleccionarPasteleríaTradicional").value
    let aptoCeliaco = document.getElementById("sinTaccPasteleríaTradicional").checked
    let cantidad = document.getElementById("cantidadPasteleríaTradicional").value
    let comentarios = document.getElementById("comentariosPasteleríaTradicional").value

    if(validarCantidad(cantidad)) //? cantidad=Number(cantidad) : formPasteleriaTradicional.reset() //Operador Ternario
    {
        cantidad=Number(cantidad)
        //Verificación de existencia del producto en carrito
        let productoEncontrado = carrito.find((producto) => producto.nombre === nombre)
        if(productoEncontrado){
            if(aptoCeliaco){
                let nuevoProducto = new productoPasteleríaTradicional() 
                   nuevoProducto = {
                   ...productoEncontrado,  //SPREAD: copio el mismo objeto pero agrego una nueva propiedad al objeto producto sólo si es apto celíaco
                   cantidad: cantidad,
                   sinTacc: true
                   }  
                nuevoProducto.subTotal = nuevoProducto.cantidad * nuevoProducto.precio //Al usar Spread no se copiaron los métodos del objeto, por eso lo hago a mano
                carrito.push(nuevoProducto)
                }else{              
                productoEncontrado.cantidad += cantidad
                productoEncontrado.subTotalProducto()
                }
        }else{
            //Utilizo desestructuración
            
            if(listaPrecios.length !== 0){

                let {precio} = (listaPrecios.find((producto) => producto.nombre === nombre)) //Desestructuración
                nuevoProducto = new productoPasteleríaTradicional(nombre, cantidad, comentarios, precio)
                nuevoProducto.subTotalProducto()
                carrito.push(nuevoProducto)
            }else{
                swal({
                    title: "No se pudo cargar el listado de productos"
                })
            }

            

        }

    }else{
        formPasteleriaTradicional.reset()
    }
    
    mostrarCarrito();
})

function validarCantidad(cantidad){

    if(cantidad < 1 || cantidad > cantidadMáxima || cantidad === ""){
        swal({
            title: `La cantidad debe estar entre 1 y ${cantidadMáxima}`
        })
        return false    
    }else{
        return true
    }
}

const mostrarCarrito = () => {
    panelCarrito.innerHTML = ""
    carrito.forEach((item) => {
      let {nombre, cantidad, precio, subTotal } = item //Desestructuración de objeto
      let sinTacc
      (item?.sinTacc)? sinTacc="si":sinTacc="no" //Operador Ternario
    //   if((item?.sinTacc)){ //Acceso Condicional
    //       sinTacc="si"
    //   }else{
    //       sinTacc="no"
    //   }
      panelCarrito.innerHTML += `
          <div class="caja--carrito" >
           
            <div class="caja--carrito--datos">
                <p class="nombre">${nombre}</p>
                <p class="sinTacc">Sin TACC ${sinTacc}</p>
                <p class="cantidad">CANTIDAD: ${cantidad}</p>
                <p class="precio"> precio: $ <span>${precio}</span> </p>
                <p class="subtotal">Subtotal: $${subTotal}</p>
                <button class="botonEliminar" data-id="${nombre}">Eliminar</button>
            
            </div>
  
          </div>`
    })
    localStorage.setItem("carritoDB", JSON.stringify(carrito))
    
  }

  const handlerBotonesPanelCarrito = () => {
    panelCarrito.addEventListener("click", (e) => {
        if (e.target.classList.contains("botonEliminar")) {
            eliminarProducto(e.target.getAttribute("data-id"))
            console.log("handler")
        }
    })
  }

  const eliminarProducto = (producto) => {
        carrito = carrito.filter((element) => element.nombre !== producto)  
        mostrarCarrito()
  }

  handlerBotonesPanelCarrito()