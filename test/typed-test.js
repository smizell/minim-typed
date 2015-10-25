import {expect} from 'chai';

import minim from 'minim';
import minimTyped from '../src/typed';

const namespace = minim.namespace().use(minimTyped);

describe('Minim Typed', () => {
  context('with simple value annotations', () => {
    let stringChecker;


    before(() => {
      stringChecker = namespace.typed.build({
        annotations: [{element: 'string'}]
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

      it('should not return an error', () => {
        expect(error).to.be.an.instanceOf(TypeError);
        expect(error.message).to.include('string'); // Expected string
      });
    });
  });
});
