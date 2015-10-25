import {expect} from 'chai';

import minim from 'minim';
import minimTyped from '../src/typed';

const namespace = minim.namespace().use(minimTyped);

describe('Minim Typed', () => {
  context('with simple value annotations', () => {
    let stringChecker;

    before(() => {
      stringChecker = namespace.typed.build({
        // string -> string
        annotations: [
          {element: 'string'},
          {element: 'string'},
        ],
      });
    });

    context('when given a valid value', () => {
      it('should return the correct value', () => {
        expect(stringChecker('foobar')).to.equal('foobar');
      });
    });

    context('when given an invalid value', () => {
      it('should return an error', () => {
        expect(function test() {
          stringChecker(4000);
        }).to.throw(TypeError);
      });
    });
  });

  context('when checking the output does not match', () => {
    let stringChecker;

    before(() => {
      stringChecker = namespace.typed.build({
        // string -> number
        annotations: [
          {element: 'string'},
          {element: 'number'},
        ],
      });
    });

    it('should return an error', () => {
      expect(function test() {
        stringChecker('foobar');
      }).to.throw(TypeError);
    });
  });

  context('when the function has multiple arguments', () => {
    let stringChecker;

    before(() => {
      stringChecker = namespace.typed.build({
        // string string -> boolean
        annotations: [
          {element: 'string'},
          {element: 'string'},
          {element: 'boolean'},
        ],

        fn: (string1, string2) => string1 === string2,
      });
    });

    it('should return the correct value', () => {
      expect(stringChecker('foobar', 'foobar')).to.equal(true);
    });
  });
});
