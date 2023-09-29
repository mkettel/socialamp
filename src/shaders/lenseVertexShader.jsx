const vertexShader = `
precision mediump float;
uniform float u_time;

varying vec2 vUv;
varying float vZ;

void main() {
  vUv = uv; // pass the UV value to the fragment shader
  vec4 modelPosition = modelMatrix * vec4(position, 1.0); // get the model position

  modelPosition.z += cos(modelPosition.y * 2.0 + u_time * 0.8) * 0.1;
  modelPosition.z += cos(modelPosition.x * 1.0 + u_time * 0.8) * 0.1;

  vZ = modelPosition.z;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}
`

export default vertexShader

/*
Takes a vertical plane and adjusts the vertices
based off of the time value in the z direction.
*/
