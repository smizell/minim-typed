import _ from 'lodash';

function checkArgument(argument, annotation, argumentNumber) {
  if (argument.element !== annotation.element) {
    throw new TypeError(`Expected ${annotation.element} for argument ${argumentNumber}`);
  }

  // TODO: Handle nested arrays
  if (annotation.element === 'array' && annotation.length > 0) {
    const arrayTypes = annotation.content.map(item => {
      return item.element;
    });

    argument.forEach(item => {
      if (!_.includes(arrayTypes, item.element)) {
        throw new TypeError(`Expected ${arrayTypes} for argument ${argumentNumber}`);
      }
    });
  }
}

export function namespace({base}) {
  base.typed = {};

  base.typed.build = function build(givenOptions) {
    const options = _.defaults(givenOptions, {
      // For annotating input and output
      // When validating a single value, you still need input and output types since we will always call a function
      annotations: [],

      // Identity function by default for checking types for values
      fn: value => value,
    });

    const argumentAnnotations = options.annotations.slice(0, options.annotations.length - 1);
    const outputAnnotation = _.last(options.annotations);

    const refractAnnotations = argumentAnnotations.map(annotation => {
      return base.fromRefract(annotation);
    });

    return function wrapper() {
      const refractArguments = Array.slice(arguments).map(argument => {
        return base.toElement(argument);
      });

      if (refractAnnotations.length > refractArguments.length) {
        throw new TypeError('Not enough arguments');
      }

      if (refractArguments.length > refractAnnotations.length) {
        throw new TypeError('Too many arguments');
      }

      // Check inputs
      for (let i = 0; i < refractAnnotations.length; i++) {
        const argument = refractArguments[i];
        const annotation = refractAnnotations[i];

        checkArgument(argument, annotation, i);
      }

      const output = options.fn.apply(null, arguments);
      const refractOutput = base.toElement(output);

      if (refractOutput.element !== outputAnnotation.element) {
        throw new TypeError(`Expected ${outputAnnotation.element} for output`);
      }

      return output;
    };
  };
}

export function annotate(element, content) {
  // TODO: Use actual elements instead of building one
  return {element, content};
}

export default {namespace, annotate};
