<h1 class="nombre-pagina">Olvide Password</h1>
<p class="descripcion-pagina">Restablece tu passsword escribiendo tu email acontinuacion</p>
<?php include_once __DIR__ . '/../templates/alertas.php'; ?>

<form class="formulario" method="POST" action="/olvide">
  <div class="campo">
    <label for="email">Email</label>
    <input 
      type="email"
      id="email"
      name="email"
      placeholder="Tu email"
    />
  </div>

  <input type="submit" class="boton" value="Enviar instruccciones"/>
</form>

<div class="acciones">
  <a href="/">¿Ya tienes una cuenta? Incia Sesion</a>
  <a href="/crear-cuenta">¿Aun no tienes cuenta? Crea una</a>
</div>