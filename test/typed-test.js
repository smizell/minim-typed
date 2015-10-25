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
      let result;
      let error;

      before((done) => {
        stringChecker('foobar').then((checkResult) => {
          result = checkResult;
          done();
        }).catch((checkError) => {
          error = checkError;
          done(error);
        });
      });

      it('should return the correct value', () => {
        expect(result).to.equal('foobar');
      });

      it('should not return an error', () => {
        expect(error).to.be.undefined;
      });
    });

    context('when given an invalid value', () => {
      let result;
      let error;

      before((done) => {
        stringChecker(4000).then((checkResult) => {
          result = checkResult;
          done();
        }).catch((checkError) => {
          error = checkError;
          done();
        });
      });

      it('should return no value', () => {
        expect(result).to.be.undefined;
      });

      it('should return an error', () => {
        expect(error).to.be.an.instanceOf(TypeError);
      });
    });
  });

  context('when checking the output does not match', () => {
    let stringChecker;
    let result;
    let error;

    before((done) => {
      stringChecker = namespace.typed.build({
        // string -> number
        annotations: [
          {element: 'string'},
          {element: 'number'},
        ],
      });

      stringChecker('foobar').then((checkResult) => {
        result = checkResult;
        done();
      }).catch((checkError) => {
        error = checkError;
        done();
      });
    });

    it('should return no value', () => {
      expect(result).to.be.undefined;
    });

    it('should return an error', () => {
      expect(error).to.be.an.instanceOf(TypeError);
    });
  });

  context('when the function has multiple arguments', () => {
    let stringChecker;
    let result;
    let error;

    before((done) => {
      stringChecker = namespace.typed.build({
        // string string -> boolean
        annotations: [
          {element: 'string'},
          {element: 'string'},
          {element: 'boolean'},
        ],

        fn: (string1, string2) => string1 === string2
      });

      stringChecker('foobar', 'foobar').then((checkResult) => {
        result = checkResult;
        done();
      }).catch((checkError) => {
        error = checkError;
        done();
      });
    });

    it('should return the correct value', () => {
      expect(result).to.equal(true);
    });

    it('should not return an error', () => {
      expect(error).to.be.undefined;
    });
  });
});
