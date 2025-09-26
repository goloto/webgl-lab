 const defaultShaderType = [
    "VERTEX_SHADER",
    "FRAGMENT_SHADER",
  ];

/**
   * Resize a canvas to match the size its displayed.
   * @param {HTMLCanvasElement} canvas The canvas to resize.
   * @param {number} [multiplier] amount to multiply by.
   *    Pass in window.devicePixelRatio for native pixels.
   * @return {boolean} true if the canvas was resized.
   * @memberOf module:webgl-utils
   */
  export const resizeCanvasToDisplaySize = (canvas, multiplier) => {
    multiplier = multiplier || 1;
    const width  = canvas.clientWidth  * multiplier | 0;
    const height = canvas.clientHeight * multiplier | 0;
    if (canvas.width !== width ||  canvas.height !== height) {
      canvas.width  = width;
      canvas.height = height;
      return true;
    }
    return false;
  }
  
  /**
   * Loads a shader.
   * @param {WebGLRenderingContext} gl The WebGLRenderingContext to use.
   * @param {string} shaderSource The shader source.
   * @param {number} shaderType The type of shader.
   * @return {WebGLShader} The created shader.
   */
   const loadShader = (gl, shaderSource, shaderType) => {
    // Create the shader object
    const shader = gl.createShader(shaderType);

    // Load the shader source
    gl.shaderSource(shader, shaderSource);

    // Compile the shader
    gl.compileShader(shader);

    // Check the compile status
    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
      gl.deleteShader(shader);
      
      return null;
    }

    return shader;
  }
  
  /**
   * Creates a program, attaches shaders, binds attrib locations, links the
   * program and calls useProgram.
   * @param {WebGLShader[]} shaders The shaders to attach
   * @param {string[]} [opt_attribs] An array of attribs names. Locations will be assigned by index if not passed in
   */
  export const createProgram = (gl, shaders) => {
    const program = gl.createProgram();

    shaders.forEach(function(shader) {
      gl.attachShader(program, shader);
    });

    gl.linkProgram(program);

    // Check the link status
    const linked = gl.getProgramParameter(program, gl.LINK_STATUS);

    if (!linked) {
        gl.deleteProgram(program);
        return null;
    }

    return program;
  }

/**
   * Creates a program from 2 sources.
   * @param {WebGLRenderingContext} gl The WebGLRenderingContext
   *        to use.
   * @param {string[]} shaderSourcess Array of sources for the
   *        shaders. The first is assumed to be the vertex shader,
   *        the second the fragment shader.
   * @return {WebGLProgram} The created program.
   * @memberOf module:webgl-utils
   */
  export const createProgramFromSources = (gl, shaderSources) => {
    const shaders = [];

    for (let ii = 0; ii < shaderSources.length; ++ii) {
      shaders.push(loadShader(gl, shaderSources[ii], gl[defaultShaderType[ii]]));
    }

    return createProgram(gl, shaders);
  }