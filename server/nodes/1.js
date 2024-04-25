

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.40l3FmHJ.js","_app/immutable/chunks/scheduler.2Iq1zJtK.js","_app/immutable/chunks/index.zlyRD2dz.js","_app/immutable/chunks/entry.EdqGqwWD.js"];
export const stylesheets = [];
export const fonts = [];
