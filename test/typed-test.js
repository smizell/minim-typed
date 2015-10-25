import {expect} from 'chai';

import minim from 'minim';
import minimTyped from '../src/typed';
import {annotate} from '../src/typed';

const namespace = minim.namespace().use(minimTyped);

describe('Minim Typed', () => {
  context('with simple value annotations', () => {
    let stringChecker;

    before(() => {
      stringChecker = namespace.typed.build({
        // string -> string
        annotations: [
          annotate('string'),
          annotate('string'),
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
          annotate('string'),
          annotate('number'),
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
          annotate('string'),
          annotate('string'),
          annotate('boolean'),
        ],

        fn: (string1, string2) => string1 === string2,
      });
    });

    it('should return the correct value', () => {
      expect(stringChecker('foobar', 'foobar')).to.equal(true);
    });
  });

  context('when an argument is an array', () => {
    let sum;

    before(() => {
      sum = namespace.typed.build({
        // array[number] -> number
        annotations: [
          annotate('array', [annotate('number')]),
          annotate('number'),
        ],

        fn: (numbers) => {
          return numbers.reduce(function sumFn(total, number) {
            return total + number;
          });
        },
      });
    });

    context('when given the correct input', () => {
      it('returns the correct output', () => {
        expect(sum([1, 2, 3])).to.equal(6);
      });
    });

    context('when given the incorrect input', () => {
      it('returns the correct output', () => {
        expect(function test() {
          sum([true, false]);
        }).to.throw(TypeError);
      });
    });
  });
});
