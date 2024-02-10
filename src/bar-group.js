import { createTemplate, pickValue } from './utils.js';

const template = createTemplate(`
<style>
  :host {
      block-size: 100%;
      inline-size: 100%;
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 1fr;
      align-items: end;
      justify-items: center;
  }
  
  :host([stack]) {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
}
  
  ::slotted(ui-bar) {
      block-size: var(--bar-size, 0%);
      inline-size: min(75%, 80px);
      background: var(--bar-color);
  }
</style>
<slot name="bar-area"></slot>
`);

export class BarGroup extends HTMLElement {
  #slot;
  get value() {
    const assignedBars = this.#slot.assignedElements();
    return this.hasAttribute('stack')
      ? assignedBars.reduce((total, { value }) => total + value, 0)
      : Math.max(...assignedBars.map(pickValue));
  }
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.content.cloneNode(true));
    this.#slot = shadowRoot.querySelector('slot[name=bar-area]');
  }

  connectedCallback() {
    if (!this.hasAttribute('slot')) {
      this.setAttribute('slot', 'bar-area');
    }
  }
}
