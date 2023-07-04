import { LitElement, html } from 'lit'
import { customElement, property, state, query } from 'lit/decorators.js'
import { tailwindElement } from '../../shared/tailwind.element'
import '../nightly-modal/nightly-modal'
import style from './nightly-main-page.css'
import '../nightly-connect-wallet/nightly-connect-wallet'
import '../nightly-wallet-selector-page/nightly-wallet-selector-small-page/nightly-wallet-selector-small-page'
import '../nightly-header/nightly-header'
import { animate } from '@lit-labs/motion'
import { styleMap } from 'lit/directives/style-map.js'

export interface WalletSelectorItem {
  name: string
  icon: string
  status: string
  link: string
}

@customElement('nightly-main-page')
export class NightlyMainPage extends LitElement {
  static styles = tailwindElement(style)

  @property()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClose = () => {}

  @property({ type: Array })
  selectorItems: WalletSelectorItem[] = []

  @property({ type: Function })
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onWalletClick: (name: string) => void = () => {}

  @property({ type: String })
  chainIcon = ''

  @property({ type: String })
  chainName = ''

  @property({ type: String })
  sessionId = ''

  @property({ type: String })
  network = ''

  @property({ type: String })
  relay = ''

  @property({ type: Boolean })
  connecting = false

  @state()
  link = ''

  @state()
  walletIcon = ''

  @state()
  currentWalletName = ''

  tryAgainClick = () => {
    this.onSelectWallet(this.currentWalletName)
  }

  @state()
  connectingViewOpen = false

  onSelectWallet = (name: string) => {
    const wallet = this.selectorItems.find((w) => w.name === name)

    this.walletIcon = wallet?.icon ?? ''
    this.currentWalletName = wallet?.name ?? ''
    this.link = wallet?.link ?? ''

    this.connectingViewOpen = true

    this.onWalletClick(name)
  }

  closeHandler = () => {
    this.onClose()
    this.connectingViewOpen = false
  }

  constructor() {
    super()
    this.onSelectWallet = this.onSelectWallet.bind(this)
    this.tryAgainClick = this.tryAgainClick.bind(this)
    this.closeHandler = this.closeHandler.bind(this)
  }

  @query('#modalConnect')
  _modalConnect!: HTMLElement

  @query('#modalSelect')
  _modalSelect!: HTMLElement

  @state()
  mobileContentHeight = 318

  connectObserver: ResizeObserver | undefined
  selectObserver: ResizeObserver | undefined

  renderConnect() {
    setTimeout(() => {
      this.mobileContentHeight = this._modalConnect.scrollHeight
      if (!this.connectObserver) {
        this.connectObserver = new ResizeObserver(() => {
          if (!this._modalConnect) {
            return
          }
          this.mobileContentHeight = this._modalConnect.scrollHeight
        })
      }
      this.connectObserver.observe(this._modalConnect)
    }, 0)
    return html`
      <nightly-connect-wallet
        id="modalConnect"
        class="modalConnect"
        .coinName=${this.currentWalletName}
        .connecting=${this.connecting}
        .tryAgainClick=${this.tryAgainClick}
        .fallback=${this.backToPage}
        .link=${this.link}
        .nameLink=${this.currentWalletName}
        .walletIcon=${this.walletIcon}
        ${animate({
          properties: ['opacity'],
          keyframeOptions: { duration: 380 },
          skipInitial: true,
          in: [
            {
              opacity: 0
            },
            {
              offset: 0.25,
              opacity: 0
            },
            {
              offset: 1,
              opacity: 1
            }
          ]
        })}
      ></nightly-connect-wallet>
    `
  }

  renderSelect() {
    setTimeout(() => {
      this.mobileContentHeight = this._modalSelect.scrollHeight
      if (!this.selectObserver) {
        this.selectObserver = new ResizeObserver(() => {
          if (!this._modalSelect) {
            return
          }
          this.mobileContentHeight = this._modalSelect.scrollHeight
        })
      }
      this.selectObserver.observe(this._modalSelect)
    }, 0)
    return html`<div id="modalSelect">
      <nightly-wallet-selector-small-page
        class="modalMobile"
        .network=${this.network}
        .onWalletClick=${this.onSelectWallet}
        .selectorItems=${this.selectorItems}
        .sessionId=${this.sessionId}
        .relay=${this.relay}
        ${animate({
          properties: ['opacity'],
          keyframeOptions: { duration: 380 },
          skipInitial: true,
          in: [
            {
              opacity: 0
            },
            {
              offset: 0.25,
              opacity: 0
            },
            {
              offset: 1,
              opacity: 1
            }
          ]
        })}
      ></nightly-wallet-selector-small-page>
      <nightly-modal
        class="modalDesktop"
        .chainIcon=${this.chainIcon}
        .chainName=${this.chainName}
        .network=${this.network}
        .onWalletClick=${this.onSelectWallet}
        .selectorItems=${this.selectorItems}
        .sessionId=${this.sessionId}
        .relay=${this.relay}
        ${animate({
          properties: ['opacity'],
          keyframeOptions: { duration: 250 },
          skipInitial: true,
          in: [
            {
              opacity: 0
            },
            {
              offset: 0.25,
              opacity: 0
            },
            {
              offset: 1,
              opacity: 1
            }
          ]
        })}
      ></nightly-modal>
    </div>`
  }

  render() {
    return html`
      <div class="nightlyModal">
        <nightly-header .onClose=${this.onClose}></nightly-header>
        <div
          id="contentWrapper"
          class="contentWrapper"
          style=${styleMap(
            window.innerWidth <= 640 ? { height: this.mobileContentHeight + 'px' } : {}
          )}
          ${animate({
            properties: ['height'],
            keyframeOptions: { duration: 250 },
            skipInitial: true
          })}
        >
          ${this.connectingViewOpen ? this.renderConnect() : this.renderSelect()}
        </div>
      </div>
    `
  }

  backToPage = () => {
    this.connectingViewOpen = false
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nightly-main-page': NightlyMainPage
  }
}
