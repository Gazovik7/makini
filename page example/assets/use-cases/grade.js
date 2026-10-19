/* Makini image treatments. Used once at build time; the website serves static WebP files. */
(function (root) {
  'use strict';
  const vertex = `attribute vec2 position;
    varying vec2 uv;
    void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
  const fragment = `precision highp float;
    varying vec2 uv;
    uniform sampler2D source;
    uniform vec2 resolution;
    uniform float treatment;
    float noise(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    void main(){
      vec3 photo=texture2D(source,uv).rgb;
      float light=dot(photo,vec3(.2126,.7152,.0722));
      light=smoothstep(.015,.94,pow(light,.88));
      vec3 ink=vec3(.045,.048,.083);
      vec3 blue=vec3(113.,161.,255.)/255.;
      vec3 pink=vec3(239.,104.,242.)/255.;
      vec3 violet=vec3(148.,104.,242.)/255.;
      float sweep=smoothstep(.08,.98,uv.x*.76+uv.y*.24);
      vec3 accent=mix(blue,pink,sweep);
      vec3 mid=mix(vec3(.16,.23,.48),violet*.55,sweep);
      if(treatment>0.5&&treatment<1.5){accent=blue;mid=vec3(.14,.18,.39);}
      vec3 color=mix(ink,mid,smoothstep(0.,.48,light));
      color=mix(color,accent,smoothstep(.28,.87,light));
      color=mix(color,vec3(.87,.89,.98),smoothstep(.80,1.,light)*.64);
      float grain=noise(floor(uv*resolution))-.5;
      if(treatment>1.5){
        vec2 cell=floor(uv*resolution/3.);
        float ordered=mod(cell.x+mod(cell.y,2.)*2.,4.)/4.;
        float quant=floor(clamp(light+ordered*.10,0.,.999)*7.)/6.;
        color=mix(ink,mix(blue,pink,sweep),clamp(quant,0.,1.));
        float dotMask=smoothstep(.26,.48,length(fract(uv*resolution/3.)-.5));
        color=mix(color,ink,dotMask*.22);
      }
      color+=grain*.026;
      gl_FragColor=vec4(clamp(color,0.,1.),1.);
    }`;
  let canvas, gl, program, texture;
  function init() {
    canvas = document.createElement('canvas');
    gl = canvas.getContext('webgl', {preserveDrawingBuffer:true, antialias:false, alpha:false});
    if (!gl) throw new Error('WebGL is required to bake the image treatments.');
    function compile(type, text) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader,text); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
      return shader;
    }
    program=gl.createProgram();
    const vs=compile(gl.VERTEX_SHADER,vertex), fs=compile(gl.FRAGMENT_SHADER,fragment);
    gl.attachShader(program,vs); gl.attachShader(program,fs); gl.linkProgram(program);
    if (!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    gl.deleteShader(vs); gl.deleteShader(fs); gl.useProgram(program);
    const buffer=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const p=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(p);gl.vertexAttribPointer(p,2,gl.FLOAT,false,0,0);
    texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.uniform1i(gl.getUniformLocation(program,'source'),0);
  }
  root.MakiniGrade = function (image, preset, width) {
    if (!gl) init();
    canvas.width=width||1200; canvas.height=Math.round(canvas.width*image.naturalHeight/image.naturalWidth);
    gl.viewport(0,0,canvas.width,canvas.height);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);
    gl.uniform2f(gl.getUniformLocation(program,'resolution'),canvas.width,canvas.height);
    gl.uniform1f(gl.getUniformLocation(program,'treatment'),{spectrum:0,duotone:1,halftone:2}[preset]);
    gl.drawArrays(gl.TRIANGLES,0,6);
    return canvas;
  };
})(window);
