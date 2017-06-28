var expect = require('expect');
var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate the correct message object', () => {
    var from = 'Admin';
    var text = "Hello and Welcome";
    var res = generateMessage(from,text);
    expect(res.from).toBe(from);
    expect(res.text).toBe(text);
    expect(res.createdAt).toBeA('number');
  });
});
describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
      var from = 'admin';
      var longitude = 13.213344323;
      var latitude = -32.123432;
      var res = generateLocationMessage(from,latitude,longitude);
      expect(res.from).toBe(from);
      expect(res.url).toBe(`https://www.google.com/maps?q=${latitude},${longitude}`);
      expect(res.createdAt).toBeA('number');
  });
});
