// functions/api/verify.js
// Cloudflare Pages Function → queda expuesta automáticamente en /api/verify
// Esto corre en el servidor. El usuario JAMÁS ve este archivo ni su contenido.

export async function onRequestPost({ request, env }) {
  let code;
  try {
    ({ code } = await request.json());
  } catch {
    return Response.json({ valid: false }, { status: 400 });
  }

  if (!code || typeof code !== 'string') {
    return Response.json({ valid: false });
  }

  const normalizado = code.trim().toUpperCase();

  // --- OPCIÓN 1 (recomendada): códigos guardados en KV ---
  // Requiere el binding "CODIGOS" configurado en Settings → Functions → KV bindings
  const existe = await env.CODIGOS.get(normalizado);
  const esValido = !!existe;

  // --- OPCIÓN 2: si todavía no configuraste KV, para probar rápido
  // descomenta esto y comenta el bloque de arriba (OPCIÓN 1):
  //
  // const CODIGOS_VALIDOS = ['AZUL7', 'ROJO3', 'CLAVE-01'];
  // const esValido = CODIGOS_VALIDOS.includes(normalizado);

  return Response.json({ valid: esValido });
}

// Cualquier otro método (GET, etc.) responde 405 en vez de filtrar info
export async function onRequestGet() {
  return new Response('Method not allowed', { status: 405 });
}