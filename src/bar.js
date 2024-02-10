export class Bar extends HTMLElement {
  static get observedAttributes() {
    return ['size'];
  }

  get value() {
    return Number(this.getAttribute('value') ?? '0');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && name === 'size') {
      this.style.setProperty('--bar-size', `${newValue}%`);
    }
  }

  connectedCallback() {
    if (!this.hasAttribute('slot')) {
      this.setAttribute('slot', 'bar-area');
    }
  }
}
