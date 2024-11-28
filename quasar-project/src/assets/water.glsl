precision mediump float;

uniform sampler2D uMainSampler;
varying vec2 outTexCoord;

void main(void) {
    vec4 color = texture2D(uMainSampler, outTexCoord);
    // Простой эффект волн
    float wave = sin(outTexCoord.y * 10.0 + time) * 0.05;
    gl_FragColor = vec4(color.r, color.g, color.b, color.a) + vec4(wave, wave, wave, 0.0);
}
