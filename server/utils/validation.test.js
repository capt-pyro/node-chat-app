var expect = require('expect');
var {isRealString} = require('./validation');

describe('isRealString', () => {
  it('should spit true since valid field is sent', () => {
    var str = "hello man";
    var bool = isRealString(str);
    expect(bool).toBe(true);
  });

  it('should spit false since field contains non string values', () => {
    var str = 44;
    var bool = isRealString(str);
    expect(bool).toBe(false);
  });

  it('should spit false since field is filled with spaces', () => {
    var str = "        ";
    var bool = isRealString(str);
    expect(bool).toBe(false);
  });
});
