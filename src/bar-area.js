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
            --min-inline-size: 70px;
            --linear-axis-inline-size: 0px;
            --bar-color: #426cb3;
            --_min-col-size: calc((100% - var(--linear-axis-inline-size))/var(--_bar-count, 1));
            display: grid;
            grid-template-rows: 1fr auto;
            grid-template-columns: var(--linear-axis-inline-size) repeat(var(--_bar-count), minmax(var(--_min-col-size),1fr));
            min-block-size: 350px;
        }

        :host([horizontal]) {
            writing-mode: vertical-rl;
        }

        #category-axis, #bar-area {
            display: grid;
            grid-template-columns: repeat(var(--_bar-count), minmax(var(--_min-col-size),1fr));
            grid-column: 2 / -1;
        }

        #bar-area {
            justify-items: center;
            align-items: flex-end;
            grid-row: 1;
        }
        
        #linear-axis {
            grid-column: 1;
            grid-row: 1;
        }

        ::slotted(ui-bar) {
            block-size: var(--bar-size, 0%);
            inline-size: min(75%, var(--min-inline-size));
            background-color: var(--bar-color);
        }

        ::slotted([slot=category]) {
            display: grid;
            place-items: center;
            writing-mode: horizontal-tb;
        }

    </style>
    <div id="linear-axis" part="linear-axis">
        <slot name="linear-axis"></slot>
    </div>
    <div id="bar-area" part="bar-area">
        <slot name="bar-area"></slot>
    </div>
    <div id="category-axis" part="category-axis">
        <slot name="category"></slot>
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
    const barsLike = this.#barArea.assignedElements();
    this.style.setProperty('--_bar-count', barsLike.length);

    const groups = barsLike.filter(is('ui-bar-group'));

    const bars = barsLike
      .flatMap((barLike) => [barLike, ...Array.from(barLike.children)])
      .filter(is('ui-bar'));

    groups.forEach((bar) =>
      bar.toggleAttribute('stack', this.hasAttribute('stack')),
    );

    const project = (this.project = compose([
      round,
      createProjection(this),
    ]).bind(this));

    bars.forEach((bar) => {
      bar.setAttribute('size', project(bar.value));
    });

    this.dispatchEvent(new CustomEvent('rendered', { bubbles: true }));
  }
}
