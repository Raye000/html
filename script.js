let canalesDisponibles = [];


function cargarCanalesDesdeExcel() {
    fetch('canales.xlsx')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar el archivo: ${response.statusText}`);
            }
            return response.arrayBuffer();
        })
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            canalesDisponibles = XLSX.utils.sheet_to_json(firstSheet);
            console.log(canalesDisponibles); 
        })
        .catch(error => {
            console.error('Error al cargar el archivo de Excel:', error);
            alert('Hubo un problema al cargar el archivo de Excel. Verifique que el archivo esté disponible y en la ubicación correcta.');
        });
}

cargarCanalesDesdeExcel();

function solicitarCanales() {
    const numCanales = parseInt(document.getElementById('numCanales').value);
    if (isNaN(numCanales) || numCanales <= 0) {
        alert('Por favor, ingresa un número válido de canales.');
        return;
    }

    const divSeleccionCanales = document.getElementById('seleccionCanales');
    divSeleccionCanales.innerHTML = '';

    for (let i = 0; i < numCanales; i++) {
        const label = document.createElement('label');
        label.textContent = `Canal ${i + 1}: `;

        const input = document.createElement('input');
        input.className = 'canalInput';
        input.setAttribute('data-index', i);
        input.setAttribute('placeholder', 'Escribe para buscar un canal');

        divSeleccionCanales.appendChild(label);
        divSeleccionCanales.appendChild(input);
        divSeleccionCanales.appendChild(document.createElement('br'));

        new Awesomplete(input, {
            list: canalesDisponibles.map(canal => `${canal.Channel} (${canal['HD/SD']}, ${canal.Transponder})`),
            minChars: 1,
            maxItems: 10,
            autoFirst: true
        });
    }

    document.getElementById('finalizarSeleccion').style.display = 'inline';
}

function finalizarSeleccion() {
    const inputs = document.querySelectorAll('.canalInput');
    const canalesSeleccionados = [];
    const seleccionados = new Set();

    for (const input of inputs) {
        const canalSeleccionado = input.value.split(' (')[0];  
        if (canalSeleccionado === '') {
            alert('Por favor, selecciona todos los canales.');
            return;
        }
        if (seleccionados.has(canalSeleccionado)) {
            alert('No puedes seleccionar el mismo canal más de una vez.');
            return;
        }
        seleccionados.add(canalSeleccionado);

        const canalEncontrado = canalesDisponibles.find(canal => canal.Channel === canalSeleccionado);
        if (canalEncontrado) {
            canalesSeleccionados.push(canalEncontrado);
        }
    }

    contarCams(canalesSeleccionados);
    crearArchivoExcel(canalesSeleccionados);
}

function contarCams(canales) {
    const conteoCams = {};
    let totalCams = 0;
    let camNumero = 1;
    const resultadoCams = [];

    canales.forEach(canal => {
        const transponder = canal.Transponder;
        if (!conteoCams[transponder]) {
            conteoCams[transponder] = [];
        }
        conteoCams[transponder].push(canal.Channel);
    });

    for (const transponder in conteoCams) {
        const canalesGrupo = conteoCams[transponder];
        const cantidad = canalesGrupo.length;
        const camsNecesarias = Math.ceil(cantidad / 8);
        totalCams += camsNecesarias;

        for (let i = 0; i < cantidad; i += 8) {
            const grupo = canalesGrupo.slice(i, i + 8);
            resultadoCams.push(`Cam ${camNumero}: Transponder ${transponder}, Canales: ${grupo.join(', ')} (Total: ${grupo.length} canales)`);
            camNumero++;
        }
    }

    alert(`Total de cams necesarias: ${totalCams}\n\n` + resultadoCams.join('\n'));
    crearArchivoTexto(totalCams, resultadoCams);
}

function crearArchivoTexto(totalCams, resultadoCams) {
    const nombreCliente = prompt("Introduce el nombre del cliente:");
    if (!nombreCliente) {
        alert('Debes ingresar un nombre de cliente.');
        return;
    }

    const contenido = `Cliente: ${nombreCliente}\n\nTotal de cams necesarias: ${totalCams}\n\n` +
        resultadoCams.join('\n');

    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const enlaceDescarga = document.getElementById('downloadLink');

    enlaceDescarga.href = url;
    enlaceDescarga.download = `${nombreCliente}_info_cams.txt`;
    enlaceDescarga.style.display = 'block';
    enlaceDescarga.click();  
}

function crearArchivoExcel(canales) {
    const nombreCliente = prompt("Introduce el nombre del cliente para el archivo Excel:");
    if (!nombreCliente) {
        alert('Debes ingresar un nombre de cliente.');
        return;
    }

    const hojaDatos = [
        ["Cliente", nombreCliente],
        [],
        ["Canal", "Transponder", "HD/SD"]
    ];

    canales.forEach(canal => {
        hojaDatos.push([canal.Channel, canal.Transponder, canal['HD/SD']]);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(hojaDatos);
    XLSX.utils.book_append_sheet(wb, ws, "Canales Seleccionados");

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);

    const enlaceDescargaExcel = document.getElementById('downloadExcelLink');
    enlaceDescargaExcel.href = url;
    enlaceDescargaExcel.download = `${nombreCliente}_info_cams.xlsx`;
    enlaceDescargaExcel.style.display = 'block';
    enlaceDescargaExcel.click();  
}
