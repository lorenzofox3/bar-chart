import {
  compose,
  createProjection,
  createTemplate,
  is,
  pickValue,
  round,
} from './utils.js';

// language=HTML
const template = createTemplate(`
    <style>
        :host {
            display: grid;
            --min-inline-size: 70px;
            --bar-color:#426cb3;
        }

        :host([horizontal]) {
            writing-mode: vertical-rl;
            --min-inline-size: 4em;
        }

        #bar-area {
            display: grid;
            grid-template-rows: 1fr auto;
            grid-auto-flow: column;
            grid-auto-columns: 1fr;
            justify-items: center;
            align-items: flex-end;
        }

        #category-axis {
            grid-column: 1 / span var(--_bar-count);
            grid-row: 2;
            display: grid;
            grid-template-columns: subgrid;
        }

        ::slotted(ui-bar) {
            block-size: var(--bar-size, 0%);
            inline-size: min(75%, var(--min-inline-size));
            transition: block-size var(--animation-duration);
            background-color: var(--bar-color);
        }

        ::slotted([slot=category]) {
            display: grid;
            place-items: center;
            writing-mode: horizontal-tb;
        }

    </style>
    <div id="bar-area" part="bar-area">
        <slot name="bar-area"></slot>
        <div id="category-axis" part="category-axis">
            <slot name="category"></slot>
        </div>
    </div>
    </style>
`);

export class BarArea extends HTMLElement {
  #barArea;

  static get observedAttributes() {
    return ['domain-min', 'domain-max', 'stack'];
  }

  get domainMin() {
    return this.hasAttribute('domain-min')
      ? Number(this.getAttribute('domain-min'))
      : Math.min(...this.#barArea.assignedElements().map(pickValue));
  }

  get domainMax() {
    return this.hasAttribute('domain-max')
      ? Number(this.getAttribute('domain-max'))
      : Math.max(...this.#barArea.assignedElements().map(pickValue));
  }

  constructor() {
    super();
    const shadowRoot = this.attachShadow({
      mode: 'open',
    });
    shadowRoot.append(template.content.cloneNode(true));
    this.#barArea = this.shadowRoot.querySelector('slot[name=bar-area]');
    this.render = this.render.bind(this);
    this.#barArea.addEventListener('slotchange', this.render);
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    console.log('render');
    const barsLike = this.#barArea.assignedElements();
    this.style.setProperty('--_bar-count', barsLike.length);

    const groups = barsLike.filter(is('ui-bar-group'));

    const bars = barsLike
      .flatMap((barLike) => [barLike, ...Array.from(barLike.children)])
      .filter(is('ui-bar'));

    groups.forEach((bar) =>
      bar.toggleAttribute('stack', this.hasAttribute('stack')),
    );

    const project = compose([round, createProjection(this)]);

    bars.forEach((bar) => {
      bar.setAttribute('size', project(bar.value));
    });
  }
}
