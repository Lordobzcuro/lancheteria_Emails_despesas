// Service worker mínimo — habilita a instalação do app (PWA).
self.addEventListener("install", (e) => self.skipWaiting());
self.addEventListener("activate", (e) => self.clients.claim());
self.addEventListener("fetch", (e) => {
  // passthrough (rede). Mantido pra qualificar como app instalável.
});
