# language: es
Característica: Autenticación en eShop
  Como un usuario registrado de eShop
  Quiero iniciar sesión en la plataforma
  Para acceder a las funciones protegidas

  Escenario: Inicio de sesión exitoso
    Dado el usuario inicia sesión con usuario "alice" y contraseña "Pass123$"
    Entonces el sistema permite el acceso al catálogo
