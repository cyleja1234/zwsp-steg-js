'use strict';

class Steganography {
  MODE_ZWSP = 0;
  MODE_FULL = 1;

  ZERO_WIDTH_SPACE = '\u200b';
  ZERO_WIDTH_NON_JOINER = '\u200c';
  ZERO_WIDTH_JOINER = '\u200d';
  LEFT_TO_RIGHT_MARK = '\u200e';
  RIGHT_TO_LEFT_MARK = '\u200f';

  listZWSP = [
    this.ZERO_WIDTH_SPACE,
    this.ZERO_WIDTH_NON_JOINER,
    this.ZERO_WIDTH_JOINER,
  ];

  listFull = [
    this.ZERO_WIDTH_SPACE,
    this.ZERO_WIDTH_NON_JOINER,
    this.ZERO_WIDTH_JOINER,
    this.LEFT_TO_RIGHT_MARK,
    this.RIGHT_TO_LEFT_MARK,
  ];

  getPaddingLength(mode) {
    return (mode === this.MODE_ZWSP) ? 11 : 7; // Keep padding as small as possible
  }

  encode(message, mode = this.MODE_FULL) {
    if ('string' !== typeof message) {
      throw new TypeError('Cannot encode ' + typeof message + 's!');
    }
    let alphabet = (mode === this.MODE_ZWSP) ? this.listZWSP : this.listFull;
    let padding = this.getPaddingLength(mode);
    let encoded = '';
    if (message.length === 0) {
      return '';
    }

    for (let i = 0; i < message.length; i++) {
      let code = '0'.repeat(padding) + message.charCodeAt(i).toString(alphabet.length);
      code = code.substr(code.length - padding);
      for (let j = 0; j < code.length; j++) {
        let index = parseInt(code.charAt(j));
        encoded += alphabet[index];
      }
    }
    return encoded;
  }

  decode(message, mode = this.MODE_FULL) {
    if ('string' !== typeof message) {
      throw new TypeError('Cannot decode ' + typeof message + 's!');
    }
    let alphabet = (mode === this.MODE_ZWSP) ? this.listZWSP : this.listFull;
    let padding = this.getPaddingLength(mode);
    let encoded = '', decoded = '';

    for (let i = 0; i < message.length; i++) {
      if (alphabet.includes(message.charAt(i))) {
        encoded += alphabet.indexOf(message.charAt(i)).toString();
      }
    }

    if (encoded.length % padding !== 0) {
      throw new TypeError('Unknown encoding detected!');
    }

    let curEncodedChar = '';
    for (let i = 0; i < encoded.length; i++) {
      curEncodedChar += encoded.charAt(i);
      if (i > 0 && (i + 1) % padding === 0) {
        decoded += String.fromCharCode(parseInt(curEncodedChar, alphabet.length));
        curEncodedChar = '';
      }
    }

    return decoded;
  }
}

console.log("'",(new Steganography()).encode('hello world!'),"'");
console.log("'",(new Steganography()).decode('​​​​‏​‏​​​​‏​‌​​​​‏‌‎​​​​‏‌‎​​​​‏‍‌​​​​‌‌‍​​​​‏‎‏​​​​‏‍‌​​​​‏‍‏​​​​‏‌‎​​​​‏​​​​​​‌‌'),"'");
