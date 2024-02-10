export const compose = (fns) => (arg) => fns.reduceRight((x, f) => f(x), arg);
const createScale =
  ({ domainMin, domainMax }) =>
  (value) =>
    (value - domainMin) / (domainMax - domainMin);

const greaterOrEqual = (min) => (value) => Math.max(min, value);

const lowerOrEqual = (max) => (value) => Math.min(max, value);

const asPercentage = (val) => Math.floor(val * 10000) / 100;

export const createProjection = ({ domainMin, domainMax }) =>
  compose([
    asPercentage,
    lowerOrEqual(1),
    greaterOrEqual(0),
    createScale({ domainMin, domainMax }),
  ]);

export const round = (val) => Math.floor(val * 10_000) / 10_000;

export const createTemplate = (templateString) => {
  const element = document.createElement('template');
  element.innerHTML = templateString;
  return element;
};

export const pick = (prop) => (target) => target[prop];

export const is =
  (expectedLocalName) =>
  ({ localName }) =>
    localName === expectedLocalName;
export const pickValue = pick('value');
