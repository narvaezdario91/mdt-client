# language: es
Característica: Eliminar productos del carrito de eShop
  Como un usuario autenticado
  Quiero eliminar productos de mi carrito
  Para gestionar mi compra

  Escenario: Eliminar producto del carrito exitosamente
    Dado el usuario se autentica en eShop
    Y el usuario agrega "Adventurer GPS Watch" al carrito
    Cuando el usuario cambia la cantidad a "0" y actualiza
    Entonces el carrito muestra el mensaje "Your shopping bag is empty"
