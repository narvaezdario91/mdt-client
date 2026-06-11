# language: es
Característica: Autenticación en el sistema de Chicken
  Como un usuario registrado del sistema de Chicken
  Quiero iniciar sesión en el sistema de Chicken
  Para acceder a las funciones protegidas del sistema de Chicken

  Escenario: Inicio de sesión exitoso en Chicken
    Dado el usuario se encuentra en la plataforma de Chicken
    Cuando el usuario hace la busqueda de 'Big Box'
    Entonces el usuario agrega el producto 'Big Box Kentucky' al carrito
    Y se observa el mensaje 'Gracias'