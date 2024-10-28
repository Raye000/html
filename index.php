<?php
session_start();

// Verificar si el usuario está autenticado
if (!isset($_SESSION['autenticado'])) {
    // Si no está autenticado, redirigir al formulario de login
    header('Location: login.php');
    exit();
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <img src="logo-slider-1.png" alt="Imagen en la esquina superior derecha" class="img-esquina">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Selección de Canales</title>
    <link rel="icon" href="favicon.ico" type="image/x-icon">
    
    <!-- Awesomplete: Librería para autocompletado -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/awesomplete/1.1.5/awesomplete.min.css" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/awesomplete/1.1.5/awesomplete.min.js"></script>
    
    <!-- CSS -->
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Seleccionar Canales</h1>
        <p>Por favor, selecciona cuántos canales quieres agregar:</p>
        <input type="number" id="numCanales" min="1" placeholder="Número de canales">
        <button onclick="solicitarCanales()">Generar Campos de Búsqueda</button>

        <div id="seleccionCanales"></div>
        <button id="finalizarSeleccion" onclick="finalizarSeleccion()" style="display: none;">Finalizar Selección</button>

        <!-- Enlaces para descargar archivos -->
        <a id="downloadLink" style="display:none;">Descargar archivo de texto</a>
        <a id="downloadExcelLink" style="display:none;">Descargar archivo Excel</a>
        <a href="logout.php">Cerrar Sesión</a>
    </div>

    <!-- Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js"></script>
    <script src="script.js"></script>
</body>
</html>
