/* Local renderer: all coordinates are in source-image pixels. No opacity animation. */
(function(root){
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t)};
function canvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function sample(data,w,h,x,y,k){x=clamp(x,0,w-1.001);y=clamp(y,0,h-1.001);const ix=Math.floor(x),iy=Math.floor(y),a=x-ix,b=y-iy,i=(iy*w+ix)*4+k;return (data[i]*(1-a)+data[i+4]*a)*(1-b)+(data[i+w*4]*(1-a)+data[i+w*4+4]*a)*b;}
class AcademiaPatient{
 constructor(c,config,options={}){
  this.canvas=c;this.ctx=c.getContext('2d');this.config=config;this.options={rr:17,amplitude:1,eyes:'auto',...options};this.clock=0;this.phase=0;this.start=-100;this.next=2+Math.random()*3;this.dead=false;
  this.photo=new Image();this.closedPhoto=new Image();let n=0;
  const ready=()=>{if(++n!==2||this.dead)return;this.prepare();this.ready=true;this.draw();this.raf=requestAnimationFrame(t=>this.tick(t));};
  for(const [im,file] of [[this.photo,config.file],[this.closedPhoto,config.closedFile]]){im.onload=ready;im.onerror=()=>c.dispatchEvent(new CustomEvent('patienterror',{detail:file}));im.src=(options.assetRoot||'./')+file;}
 }
 prepare(){
  this.canvas.width=this.photo.naturalWidth;this.canvas.height=this.photo.naturalHeight;
  this.eyes=this.config.eyes.map((e,i)=>this.eyeFrames(e,this.config.lids?.[i]));this.breath=this.breathFrames();
 }
 eyeFrames(e,lid){
  const [x,y,rx,ry,angle]=e,w=Math.ceil(rx*3.2),h=Math.ceil(ry*5.5),cx=w/2,cy=h/2;
  const read=im=>{const p=canvas(w,h),c=p.getContext('2d');c.translate(cx,cy);c.rotate(-angle);c.drawImage(im,-x,-y);return c.getImageData(0,0,w,h).data;};
  const open=read(this.photo),shut=read(this.closedPhoto),frames=[];
  for(let step=0;step<=64;step++){
   const q=step/64,p=canvas(w,h),c=p.getContext('2d'),out=c.createImageData(w,h);
   for(let j=0;j<h;j++)for(let i=0;i<w;i++){
    const u=(i-cx)/rx,v=j-cy,index=(j*w+i)*4;
    const arch=Math.sqrt(Math.max(0,1-u*u));
    const at=values=>{const t=clamp(u/.9,-1,1);return values[1]+(values[2]-values[0])*t/2+((values[0]+values[2])/2-values[1])*t*t;};
    // Keep the texture sampling boundary outside the iris and the lash fringe.
    const top=lid?at(lid[0])-3:-ry*.85*arch,lower=lid?Math.max(top+.3,at(lid[1])+2):ry*.85*arch,seam=lid?at(lid[2]):ry*.42*arch;
    const edge=top+(seam-top)*q,bottom=lower+(seam-lower)*q;
    const anchor=-ry*2.1,floor=ry*1.9;
    const upperPin=Math.min(top,seam)-8,lowerPin=Math.max(lower,seam)+8;
    let openY=v,closedY=v,skin=0,coverage=1;
    // Subpixel coverage at the moving lash edge; the exposed iris stays fixed.
    const refined=this.config.refinedLids&&q>0&&q<1;
    const upperCoverage=refined?clamp((edge-v)/1.2+.5,0,1):0;
    const lowerCoverage=refined?clamp((v-bottom)/1.2+.5,0,1):0;
    if(q>0&&Math.abs(u)<1.22){
     if(q===1){skin=1;}
     else if(v<=edge||(refined&&upperCoverage>0)){
      if(refined)coverage=upperCoverage;
      if(v>upperPin){
       openY=upperPin+(v-upperPin)*(top-upperPin)/(edge-upperPin);
       closedY=upperPin+(v-upperPin)*(seam-upperPin)/(edge-upperPin);
      }
      skin=q;
     }else if(v>=bottom||(refined&&lowerCoverage>0)){
      if(refined)coverage=lowerCoverage;
      if(v<lowerPin){
       openY=lowerPin-(lowerPin-v)*(lowerPin-lower)/(lowerPin-bottom);
       closedY=lowerPin-(lowerPin-v)*(lowerPin-seam)/(lowerPin-bottom);
      }
      skin=q;
     }
    }
    // The exposed eyeball is sampled at its original coordinates throughout.
    // Only the skin above/below the aperture deforms; both lids meet at the seam.
    const feather=smooth((1.24-Math.abs(u))/.25)*smooth((v-anchor)/5)*smooth((floor-v)/5);
    const skinGate=q===0?0:feather*coverage;
    for(let k=0;k<3;k++){
     const lid=sample(open,w,h,i,openY+cy,k)*(1-skin)+sample(shut,w,h,i,closedY+cy,k)*skin;
     out.data[index+k]=open[index+k]*(1-skinGate)+lid*skinGate;
    }
    out.data[index+3]=255;
   }
   c.putImageData(out,0,0);frames.push(p);
  }
  return {e,w,h,frames};
 }
 breathFrames(){
  const [cx,cy,rx,ry]=this.config.chest,w=rx*2,h=ry*2,x=cx-rx,y=cy-ry;
  const p=canvas(w,h),c=p.getContext('2d');c.drawImage(this.photo,-x,-y);const src=c.getImageData(0,0,w,h).data,frames=[];
  for(let s=0;s<=60;s++){
   const f=canvas(w,h),ctx=f.getContext('2d'),out=ctx.createImageData(w,h),q=s/60;
   for(let j=0;j<h;j++)for(let i=0;i<w;i++){
    const u=(i-rx)/rx,v=(j-ry)/ry,r=u*u+v*v,weight=r<1?Math.pow(1-r,2):0;
    // Smooth inverse deformation, fully pinned perimeter; no overlapping image tile.
    const sx=i-u*7*q*weight,sy=j+(8+2*v)*q*weight,idx=(j*w+i)*4;
    for(let k=0;k<3;k++)out.data[idx+k]=sample(src,w,h,sx,sy,k);out.data[idx+3]=255;
   }
   ctx.putImageData(out,0,0);frames.push(f);
  }
  return {x,y,frames};
 }
 set(o){Object.assign(this.options,o);this.draw();}
 blink(){this.start=this.clock;this.next=this.clock+3+Math.random()*3;}
 tick(t){if(this.dead)return;const dt=this.last?Math.min((t-this.last)/1000,.05):0;this.last=t;
  if(!document.hidden&&!this.options.paused&&!(typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches)){this.clock+=dt;this.phase+=dt*Math.max(0,this.options.rr)/60;if(this.clock>=this.next&&this.options.eyes==='auto')this.blink();this.draw();}
  this.raf=requestAnimationFrame(t=>this.tick(t));
 }
 draw(closureOverride,breathOverride){if(!this.ready)return;
  let q=this.options.eyes==='closed'?1:0;const t=this.clock-this.start;
  if(this.options.eyes==='auto'&&t>=0&&t<.23){
   const travel=t<.09?smooth(t/.09):1-smooth((t-.09)/.14);
   q=Math.pow(travel,1.45);
  }
  if(closureOverride!==undefined)q=closureOverride;
  const phase=this.phase%1;let b=this.options.rr>0?(phase<.4?smooth(phase/.4):1-smooth((phase-.4)/.6))*this.options.amplitude:0;
  if(breathOverride!==undefined)b=breathOverride;
  const c=this.ctx;c.drawImage(this.photo,0,0);c.drawImage(this.breath.frames[Math.round(clamp(b,0,1)*(this.breath.frames.length-1))],this.breath.x,this.breath.y);
  if(q>0)for(const eye of this.eyes){const [x,y,,,angle]=eye.e;c.save();c.translate(x,y);c.rotate(angle);c.drawImage(eye.frames[Math.round(clamp(q,0,1)*(eye.frames.length-1))],-eye.w/2,-eye.h/2);c.restore();}
 }
 destroy(){this.dead=true;cancelAnimationFrame(this.raf);this.photo.onload=this.closedPhoto.onload=null;}
}
root.AcademiaPatient=AcademiaPatient;
})(typeof window==='undefined'?globalThis:window);
