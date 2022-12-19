import { html, css, LitElement } from 'lit';

export class KairosPaperRockScissor extends LitElement {
  constructor() {
    super();

    this.id = `element-${this.randomNumber(1, 1000)}-${new Date().getTime()}`;
    this.diameter = 25;
    this.position = {
      top: `${this.randomNumber(this.diameter, 640 - this.diameter)}px`,
      left: `${this.randomNumber(this.diameter, 800 - this.diameter)}px`,
    };
    this.type = this.randomNumber(0, 2);
    this.move = this.move.bind(this);
    this.memory = [];
  }

  static get properties() {
    return {
      position: { type: Object },
      type: { type: String },
      diameter: { type: Number },
    };
  }

  static get styles() {
    return css`
      .element {
        position: absolute;
      }
      .element img {
        width: 64px;
      }
    `;
  }

  firstUpdated() {
    this._setStyles();
  }

  connectedCallback() {
    super.connectedCallback();
    this.moveId = setInterval(this.move, 250);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  // función que sirve para que se muevan de forma "aleatoria", después comprueba que si el top está dentro de los límites
  // el setStyles pinta

  move() {
    const newTop = parseInt(this.position.top, 10) + this.randomNumber(-20, 20);
    const newLeft =
      parseInt(this.position.left, 10) + this.randomNumber(-20, 20);

    if (newTop >= 0 && newTop <= 640 - this.diameter) {
      this.position.top = `${newTop}px`;
    }
    if (newLeft >= 0 && newLeft <= 800 - this.diameter) {
      this.position.left = `${newLeft}px`;
    }

    this._setStyles();
    this.detectCollision();
  }

  // Detecta si hay colisiones

  detectCollision() {
    const elements = document.querySelectorAll('kairos-paper-rock-scissor');
    let oneCollision = false;
    this._null = null;

    elements.forEach(element => {
      const isCollision = this.isCollider(
        this.getMeElement().shadowRoot.childNodes[1],
        element.shadowRoot.childNodes[1]
      );

      if (
        isCollision &&
        this.id !== element.id &&
        !oneCollision &&
        this.type !== element.type
      ) {
        oneCollision = true;

        if (this.type === 0 && element.type === 2) {
          this.type = 2;
        } else if (this.type === 1 && element.type === 0) {
          this.type = 0;
        } else if (this.type === 2 && element.type === 1) {
          this.type = 1;
        }
      }
    });
  }

  getMeElement() {
    const elements = document.querySelectorAll('kairos-paper-rock-scissor');
    let meElement = null;

    elements.forEach(element => {
      if (element.id === this.id) {
        meElement = element;
      }
    });

    return meElement;
  }

  // función para detectar la colisión.

  isCollider(me, element) {
    this._null = null;

    const meBounding = me.getBoundingClientRect();
    const elementBounding = element.getBoundingClientRect();

    return !(
      meBounding.top > elementBounding.bottom ||
      meBounding.right < elementBounding.left ||
      meBounding.bottom < elementBounding.top ||
      meBounding.left > elementBounding.right
    );
  }

  _setStyles() {
    const styles = this.shadowRoot.querySelector('.element').style;
    styles.top = `${this.position.top}`;
    styles.left = `${this.position.left}`;
    styles.width = this.diameter;
    styles.height = this.diameter;
  }

  randomNumber(min, max) {
    this._null = null;
    return parseInt(Math.random() * (max + 1 - min), 10) + min;
  }

  render() {
    if (this.type === 0) {
      return html`<div class="element">
        <img src="../images/paper.png" alt="paper" />
      </div>`;
    }
    if (this.type === 1) {
      return html`<div class="element">
        <img src="../images/rock.png" alt="rock" />
      </div>`;
    }
    if (this.type === 2) {
      return html`<div class="element">
        <img src="../images/scissor.png" alt="scissor" />
      </div>`;
    }

    return html`<div class="element">Error</div>`;
  }
}
