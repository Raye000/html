<?php
session_start();

// Cerrar la sesión
session_destroy();

// Redirigir al formulario de login
header('Location: login.php');
exit();
