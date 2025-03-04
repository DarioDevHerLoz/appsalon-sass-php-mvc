<?php 
namespace Classes ;

use PHPMailer\PHPMailer\PHPMailer;

class Email {
  public $email;
  public $nombre;
  public $token;

  public function __construct($email, $nombre, $token)
  {
    $this->email = $email;
    $this->nombre = $nombre;
    $this->token = $token;
  }

  public function enviarConfirmacion(){
    //Crear el objetod de Email
    $mail = new PHPMailer();
    $mail->isSMTP();
    $mail->Host = 'sandbox.smtp.mailtrap.io';
    $mail->SMTPAuth = true;
    $mail->Port = 2525;
    $mail->Username = '8a169df9abbd31';
    $mail->Password = 'ee9101fed53d84';

    $mail->setFrom('cuentas@appsalon.com');
    $mail->addAddress('cuentas@appsalon.com','AppSalon.com');
    $mail->Subject = "Confirmar Tu cuenta";

    //Set html
    $mail->isHTML(TRUE);
    $mail->CharSet = 'UTF-8';
    $contenido = '<html>';
    $contenido .= "<p><strong> Hola " . $this->nombre . "</strong> Has creado una cuenta en appsalon,
    Solo debes confirmarla haciendo click sobre el siguiente enlace</P>";
    $contenido .= "<p>Presiona Aqui: <a href='http://localhost:3000/confirmar-cuenta?token=" . $this->token ."'>Confirmar Cuenta</a>";
    $contenido .= "<p>Si tu no solicitaste esta cuenta, puedes ignorar el mensaje </p>";
    $contenido .= '</html>';
    $mail->Body = $contenido;

    //Enviar email
    $mail->send();
  }

  public function enviarInstrucciones(){
    //Crear el objetod de Email
    $mail = new PHPMailer();
    $mail->isSMTP();
    $mail->Host = 'sandbox.smtp.mailtrap.io';
    $mail->SMTPAuth = true;
    $mail->Port = 2525;
    $mail->Username = '8a169df9abbd31';
    $mail->Password = 'ee9101fed53d84';

    $mail->setFrom('cuentas@appsalon.com');
    $mail->addAddress('cuentas@appsalon.com','AppSalon.com');
    $mail->Subject = "Reestablece tu password";

    //Set html
    $mail->isHTML(TRUE);
    $mail->CharSet = 'UTF-8';
    $contenido = '<html>';
    $contenido .= "<p><strong> Hola " . $this->nombre . "</strong> Has Solicitado
    reestablecer tu passwor, sigue el siguiente enlace para hacerlo</P>";
    $contenido .= "<p>Presiona Aqui: <a href='http://localhost:3000/recuperar?token=" . $this->token ."'>Reestablecer Password</a>";
    $contenido .= "<p>Si tu no solicitaste esta cuenta, puedes ignorar el mensaje </p>";
    $contenido .= '</html>';
    $mail->Body = $contenido;

    //Enviar email
    $mail->send();
  }
}

?>