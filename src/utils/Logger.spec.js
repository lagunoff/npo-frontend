import { expect } from 'chai';
import Logger from './Logger';

describe('Logger', () => {

  it('should be able to use as a constructor with one argument', () => {
    expect(new Logger('http://google.com/')).to.be.ok;
  });
  
  it('should produce instance that has `log` method', () => {
    const instance = new Logger('http://google.com/');
    expect(instance).to.respondTo('log');
  });
  
});
