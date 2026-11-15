/** WebGL/observer-driven effects only run in real browsers that allow motion. */
export function effectsSupported(){
 if(typeof window==='undefined'||typeof IntersectionObserver==='undefined'||typeof ResizeObserver==='undefined')return false;
 try{return !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;}catch{return false;}
}
export function webgl2Supported(){
 if(!effectsSupported())return false;
 try{return !!document.createElement('canvas').getContext('webgl2');}catch{return false;}
}
