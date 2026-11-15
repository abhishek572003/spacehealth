import { lazy,Suspense,useState,type ReactNode } from 'react';
import SpotlightCard from '../vendor/reactbits/SpotlightCard';
import ShinyText from '../vendor/reactbits/ShinyText';
import { effectsSupported,webgl2Supported } from './support';
const Galaxy=lazy(()=>import('../vendor/reactbits/Galaxy'));

/** React Bits Galaxy behind the whole page; nothing renders where WebGL2 or motion is unavailable. */
export function CosmosGalaxy(){
 const [on]=useState(webgl2Supported);
 if(!on)return null;
 return <div className="cosmos-galaxy" aria-hidden="true"><Suspense fallback={null}><Galaxy transparent density={0.75} glowIntensity={0.22} saturation={0.15} hueShift={210} starSpeed={0.18} speed={0.35} rotationSpeed={0.015} twinkleIntensity={0.35} mouseInteraction={false} mouseRepulsion={false} layers={3} opacity={0.75} dpr={Math.min(window.devicePixelRatio||1,1.25)}/></Suspense></div>;
}

/** React Bits Spotlight Card around a tile; a plain wrapper in tests and reduced motion. */
export function Spot({children,className=''}:{children:ReactNode;className?:string}){
 const [on]=useState(effectsSupported);
 if(!on)return <div className={`spot ${className}`}>{children}</div>;
 return <SpotlightCard className={`spot ${className}`} theme="dark" spotlightColor="rgba(242,166,90,0.22)" spotlightSize={420} intensity={0.9} borderGlow={0.6} grain={0.04}>{children}</SpotlightCard>;
}

export function Shine({children}:{children:string}){
 const [on]=useState(effectsSupported);
 if(!on)return <span className="shine-static">{children}</span>;
 return <ShinyText text={children} color="#f2a65a" shineColor="#fff4e6" speed={3.2} delay={2.5} glow={0.25} trigger="loop"/>;
}
