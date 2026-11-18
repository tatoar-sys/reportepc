const APPS_SCRIPT_URL = '';

function llamarApiAppsScript(accion, datos, alCompletar, alFallar) {
    if (!APPS_SCRIPT_URL) {
        alFallar('Configura la URL de Apps Script en config.js.');
        return;
    }

    const callback = `appsScriptCallback${Date.now()}${Math.random().toString(36).slice(2)}`;
    const script = document.createElement('script');
    const temporizador = setTimeout(function() {
        limpiar();
        alFallar('Tiempo de espera agotado. Inténtalo nuevamente.');
    }, 20000);

    function limpiar() {
        clearTimeout(temporizador);
        delete window[callback];
        script.remove();
    }

    window[callback] = function(resultado) {
        limpiar();
        alCompletar(resultado);
    };
    script.onerror = function() {
        limpiar();
        alFallar('No se pudo conectar con Apps Script. Verifica la URL y el despliegue.');
    };

    const parametros = new URLSearchParams({ action: accion, callback });
    if (datos) parametros.set('data', JSON.stringify(datos));
    script.src = `${APPS_SCRIPT_URL}?${parametros.toString()}`;
    document.head.appendChild(script);
}
