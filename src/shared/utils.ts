enum ShaderTypes {
  Vertex = 35633,
  Fragment = 35632,
}

export const resizeCanvasToDisplaySize = (canvas: HTMLCanvasElement, multiplier = 1) => {
  const width  = canvas.clientWidth  * multiplier | 0;
  const height = canvas.clientHeight * multiplier | 0;

  if (canvas.width !== width ||  canvas.height !== height) {
    canvas.width  = width;
    canvas.height = height;

    return true;
  }

  return false;
}
  
const loadShader = (
  context: WebGL2RenderingContext, 
  shaderSource: string, 
  shaderType: ShaderTypes
) => {
 const shader = context.createShader(shaderType);

 if (shader === null) {
  throw new Error(`Error with ${shaderType} shader`);
 }

 context.shaderSource(shader, shaderSource);
 context.compileShader(shader);

 const compiled = context.getShaderParameter(shader, context.COMPILE_STATUS);

 if (!compiled) {
   context.deleteShader(shader);
   
   throw new Error(`Error with ${shaderType} shader`);
 }

 return shader;
}
  
  export const createProgram = (gl: WebGL2RenderingContext, shaders: WebGLShader[]) => {
    const program = gl.createProgram();

    shaders.forEach((shader) => {
      gl.attachShader(program, shader);
    });

    gl.linkProgram(program);

    const linked = gl.getProgramParameter(program, gl.LINK_STATUS);

    if (!linked) {
        gl.deleteProgram(program);

        return null;
    }

    return program;
  }

  export const createProgramFromSources = (
    context: WebGL2RenderingContext, 
    vertexShader: string, 
    fragmentShader: string
  ) => {
    const shaders = [];

    shaders.push(loadShader(context, vertexShader, ShaderTypes.Vertex));
    shaders.push(loadShader(context, fragmentShader, ShaderTypes.Fragment));

    return createProgram(context, shaders);
  }