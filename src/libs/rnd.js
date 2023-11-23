export function generarCodigoAleatorio() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const longitudCodigo = 6;
    let codigoAleatorio = '';

    for (let i = 0; i < longitudCodigo; i++) {
        const caracterAleatorio = caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        codigoAleatorio += caracterAleatorio;
    }

    return codigoAleatorio;
}