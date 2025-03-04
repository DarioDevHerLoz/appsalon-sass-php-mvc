<?php 
  namespace Controllers;

use Classes\Email;
use Model\Usuario;
use MVC\Router;

  class LoginController {
    public static function login( Router $router){
      $alertas = [];

      $auth = new Usuario;

      if($_SERVER['REQUEST_METHOD'] === 'POST'){
        $auth = new Usuario($_POST);
        $alertas=$auth->validarLogin();

        if(empty($alertas)){
          //comprobar que exista el usuario
          $usuario= Usuario::where('email',$auth->email);
          if($usuario){
            //verificar el password
            if($usuario->comprobarPasswordAndverificado($auth->password)){
                //Autenticar usario
                session_start();

                $_SESSION['id'] = $usuario->id;
                $_SESSION['nombre'] = $usuario->nombre . " " . $usuario->apellido;
                $_SESSION ['email'] = $usuario->email;
                $_SESSION['login'] = true;
                //Redireccionamiento
                if($usuario->admin === "1"){
                  $_SESSION['admin'] = $usuario->admin ?? null;
                  header('location: /admin');
                }else {
                  header('location: /cita');
                }
            }
            
          }else {
            Usuario::setAlerta('error', 'usuario no encontrado'); //Obtiene las alertas del metodo sin necesidad de instanciarlo
          }
        }
      }
      $alertas = Usuario::getAlertas();
      $router->render('auth/login', [
        'alertas' => $alertas,
        'auth' => $auth
      ]);
    }

    public static function logout( ){
      session_start();
      $_SESSION = [];
      header('Location: /');
    }

    public static function olvide(Router $router ){
      $alertas= [];
      if($_SERVER['REQUEST_METHOD'] === 'POST'){
        $auth = new Usuario($_POST);
        $alertas = $auth->validarEmail();
        if(empty($alertas)){
          $usuario = Usuario::where('email', $auth->email);
          if($usuario && $usuario->confirmado === "1"){
            //Generar un token
            $usuario->crearToken();
            $usuario->guardar();
            //Enviar email:
            $email = new Email($usuario->email, $usuario->nombre, $usuario->token);
            $email->enviarInstrucciones();
            //Alerta
            Usuario::setAlerta('exito', 'Revisa tu email');
          }else {
            Usuario::setAlerta('error', 'El usuario no existe o no esta confirmado');
          }
        }
      }
      $alertas = Usuario::getAlertas();
      $router->render('auth/olvide-password',[
        'alertas' => $alertas
      ]);
    }

    public static function recuperar(Router $router){
      $alertas = [];
      $error = false;
      $token = s($_GET['token']);

      //Buscar usuario pos su token
      $usuario = Usuario::where('token', $token);
      if(empty($usuario)){
        Usuario::setAlerta('error','Token No Valido');
        $error= true;
      }

      if($_SERVER['REQUEST_METHOD'] === 'POST'){
        //Leer el nuevo password y Guaradarlo
        $password = new Usuario($_POST);
        $alertas = $password->validarPassword();
        if(empty($alertas)){
          $usuario->password = null; //reasignamos a null el password que tenia el objeto usuario
          
          $usuario->password = $password->password; //rasignamos el atributo password del usuario con el atribito actual que se guarda en la variable $password 
          $usuario->hashPassword();
          $usuario->token = null;

          $resultado = $usuario->guardar();
          if($resultado){
            header('Location: /');
          }
        }
      }
      //debuguear($usuario);
      $alertas = Usuario::getAlertas();

      $router->render('auth/recuperar-password',[
        'alertas' => $alertas,
        'error' => $error
      ]);
    }

    public static function crear(Router $router ){
      $usuario = new Usuario;
      //Alertas vacias
      $alertas = [];
      if($_SERVER['REQUEST_METHOD'] === 'POST'){
        $usuario->sincronizar($_POST);
        $alertas=$usuario->validarNuevaCuenta();
        //Revisar que alertas este vacio
        if(empty($alertas)){
          //Verificar que el usuario no este registrado
          $resultado = $usuario->existeUsuario();
          if($resultado->num_rows){
            $alertas = Usuario::getAlertas(); //get alertas mada a llamar a la alerta por medio del metodo getAlertas
          }else {
            //hashear el password
            $usuario->hashPassword();

            //generar un Token unico
            $usuario->crearToken();

            //Enviar el email
            $email = new Email($usuario->nombre,$usuario->email,$usuario->token);
            $email->enviarConfirmacion();

            //Crear el usuario
            $resultado = $usuario->guardar();
            if($resultado){
              header('location: /mensaje');
            }

            //ebuguear($usuario);
          }
        }
      }
      
      $router->render('auth/crear-cuenta',[
        'usuario' => $usuario,
        'alertas'=> $alertas
      ]);
    }

    public static function mensaje(Router $router){
      $router->render('auth/mensaje');
    }

    public static function confirmar(Router $router){
      $alertas = [];
      $token = s($_GET['token']);

      $usuario=Usuario::where('token',$token);
      if(empty($usuario)){
        //Mostrar mensaje de error
        Usuario::setAlerta('error','Token no valido');//Obtiene en memoria o Guarda en la memoria
      }else {
        //Modificar usuario confirmado
        $usuario->confirmado = "1";
        $usuario->token= null;
        $usuario->guardar();
        Usuario::setAlerta('exito','Cuenta comprobada exitosamente');
        
      }
      //Obtener alertas
      $alertas = Usuario::getAlertas(); //Muestra lo obtenido en memoria
      $router->render('auth/confirmar-cuenta',[
        'alertas' => $alertas
      ]);
    }
  }
?>