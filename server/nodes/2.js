import * as universal from '../entries/pages/_page.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.js";
export const imports = ["_app/immutable/nodes/2.BDYFhmvq.js","_app/immutable/chunks/scheduler.2Iq1zJtK.js","_app/immutable/chunks/index.zlyRD2dz.js"];
export const stylesheets = ["_app/immutable/assets/2.Yk6IhutJ.css"];
export const fonts = [];
