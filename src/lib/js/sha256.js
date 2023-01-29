/**
 * @param {ArrayBufferLike} buffer
 */
async function hex(buffer) {
    let digest = ''
    let view = new DataView(buffer)
    for(var i = 0; i < view.byteLength; i += 4) {
      let value = view.getUint32(i)
      let stringValue = value.toString(16)
      let padding = '00000000'
      let paddedValue = (padding + stringValue).slice(-padding.length)
      digest += paddedValue
    } 
    return digest
}

/**
 * @param {string | undefined} str
 */
async function sha256(str) {
    let buffer = new TextEncoder().encode(str)
    return await crypto.subtle.digest("SHA-256", buffer)
}

export {
    hex,
    sha256
}