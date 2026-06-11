# language: es
Característica: Agregar productos al carrito de eShop
  Como un usuario autenticado
  Quiero agregar productos a mi carrito
  Para poder comprarlos

  Escenario: Agregar producto al carrito exitosamente
    Dado el usuario se autentica en eShop
    Cuando el usuario selecciona el producto "Adventurer GPS Watch"
    Y el usuario agrega el producto al carrito
    Entonces el carrito muestra el producto "Adventurer GPS Watch"
