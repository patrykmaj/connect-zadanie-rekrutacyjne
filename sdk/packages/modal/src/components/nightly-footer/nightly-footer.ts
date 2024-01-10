import { customElement, property } from 'lit/decorators.js'
import { tailwindElement } from '../../shared/tailwind.element'
import style from './nightly-footer.css'
import { LitElement, html } from 'lit'
import { FooterURLs } from 'src/utils/types'

@customElement('nightly-footer')
export class NightlyFooter extends LitElement {
  static styles = tailwindElement(style)

  @property({ type: Object })
  footerURLsOverride: Partial<FooterURLs> = {}

  render() {
    return html`
      <div class="nc_footerWrapper">
        <div class="nc_footerText">
          By connecting, you agree to Common&#39;s 
          <a href="${this.footerURLsOverride?.termsOfServiceURL || "https://wallet.nightly.app"}" class="nc_footerLink" target="_blank" >Terms of Service</a>
          and to its
          <a href="${this.footerURLsOverride?.privacyPolicyURL || "https://wallet.nightly.app/Nightly_Privacy_Policy.pdf"}" class="nc_footerLink" target="_blank" >Privacy Policy</a>.
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nightly-footer': NightlyFooter
  }
}
