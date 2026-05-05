// This is a shim to replace the deprecated 'node-domexception' package
// It simply exports the native global DOMException available in Node.js 18+
module.exports = global.DOMException;
