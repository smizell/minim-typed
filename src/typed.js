import _ from 'lodash';
import Promise from 'bluebird';

export function namespace({base}) {
  let typed = base.typed = {};

  typed.build = function(givenOptions) {
    const options = _.defaults(givenOptions, {
      annotations: []
    });

    const refractAnnotations = options.annotations.map(annotation => {
      return base.fromRefract(annotation);
    });

    return function(value) {
      const refractArguments = Array.slice(arguments).map(argument => {
        return base.toElement(argument);
      });

      return new Promise((resolve, reject) => {
        for (let i = 0; i < refractArguments.length; i++) {
          let argument = refractArguments[i];
          let annotation = refractAnnotations[i];

          if (argument.element !== annotation.element) {
            return reject(new TypeError(`Expected ${annotation.element} for argument ${i}`));
          }
        }

        return resolve(refractArguments[0].toValue());
      });
    };
  };
}

export default {namespace};
