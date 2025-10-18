export async function descargarPDFConPrint(res){
    // Verifica si el blob recibido es realmente un PDF
    const isPDF = res?.data.type === "application/pdf";
    if (!isPDF) {
        // Intenta leer el error como texto
        const errorText = await res?.data.text();
        let errorMsg = "Error del servidor";
        try {
            const errorData = JSON.parse(errorText);
            errorMsg = errorData.message || errorMsg;
        } catch {
            errorMsg = errorText || errorMsg;
        }
        throw new Error(errorMsg);
    }

    if (!res) throw new Error("No se pudo descargar el PDF");

    const blob = new Blob([res?.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    // Create a hidden iframe
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    iframe.src = url;

    // Append the iframe to the body
    document.body.appendChild(iframe);

    // Wait for the iframe to load, then trigger the print dialog
    iframe.onload = () => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    };
}