

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.9WwnCE0H.js","_app/immutable/chunks/scheduler.2Iq1zJtK.js","_app/immutable/chunks/index.zlyRD2dz.js"];
export const stylesheets = [];
export const fonts = [];
