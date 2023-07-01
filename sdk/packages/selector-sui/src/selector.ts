import { AppSui, AppSuiInitialize } from '@nightlylabs/nightly-connect-sui'
import '@nightlylabs/wallet-selector-modal'
import { NightlyMainPage } from '@nightlylabs/wallet-selector-modal'
import { StandardWalletAdapter } from '@mysten/wallet-adapter-wallet-standard'
import { NightlyConnectSuiWallet } from './wallet'
import { publicKeyFromSerialized } from '@mysten/sui.js'
import { getSuiWalletsList } from './detection'
import {
  getWallet,
  isMobileBrowser,
  modalStyle,
  triggerConnect
} from '@nightlylabs/wallet-selector-base'
import { StandardWalletAdapterWallet } from '@mysten/wallet-standard'
import bs58 from 'bs58'
import { Deeplink } from '@nightlylabs/nightly-connect-sui/dist/browser/cjs/types/bindings/Deeplink'

export const convertBase58toBase64 = (base58: string) => {
  const buffer = bs58.decode(base58)
  return buffer.toString('base64')
}

export class NCSuiSelector {
  private _modal: NightlyMainPage | undefined
  private _modalRoot: HTMLDivElement | undefined
  private _app: AppSui
  private _metadataWallets: Array<{
    name: string
    icon: string
    deeplink: Deeplink | null
    link: string
  }>

  appInitData: AppSuiInitialize

  onConnected: ((adapter: StandardWalletAdapter) => void) | undefined
  onOpen: (() => void) | undefined
  onClose: (() => void) | undefined

  constructor(
    appInitData: AppSuiInitialize,
    app: AppSui,
    metadataWallets: Array<{
      name: string
      icon: string
      deeplink: Deeplink | null
      link: string
    }>
  ) {
    this.appInitData = appInitData
    this._app = app
    this._metadataWallets = metadataWallets
    this.setApp(app)
  }

  private setApp = (app: AppSui) => {
    this._app = app
    this._app.on('userConnected', (e) => {
      const adapter = new StandardWalletAdapter({
        wallet: new NightlyConnectSuiWallet(
          app,
          e.publicKeys.map((pk) => publicKeyFromSerialized('ED25519', convertBase58toBase64(pk))),
          async () => {
            const app = await AppSui.build(this.appInitData)
            this.setApp(app)
          }
        )
      })
      adapter.connect().then(() => {
        this.onConnected?.(adapter)
        this.closeModal()
      })
    })
  }

  public static build = async (appInitData: AppSuiInitialize) => {
    const app = await AppSui.build(appInitData)
    const metadataWallets = await AppSui.getWalletsMetadata(
      'https://nc2.nightly.app/get_wallets_metadata'
    )
      .then((list) =>
        list.map((wallet) => ({
          name: wallet.name,
          icon: wallet.image.default,
          deeplink: wallet.mobile,
          link: wallet.homepage
        }))
      )
      .catch(() => [] as any)
    const selector = new NCSuiSelector(appInitData, app, metadataWallets)

    return selector
  }

  public openModal = () => {
    if (!this._modalRoot) {
      this._modal = document.createElement('nightly-main-page')
      this._modal.onClose = this.closeModal

      this._modal.network = 'SUI'
      this._modal.sessionId = this._app.sessionId
      this._modal.relay = 'https://nc2.nightly.app'
      this._modal.chainIcon = 'https://assets.coingecko.com/coins/images/26375/small/sui_asset.jpeg'
      this._modal.chainName = 'Sui'
      this._modal!.selectorItems = getSuiWalletsList(this._metadataWallets).map((w) => ({
        name: w.name,
        icon: w.icon,
        status: w.recent ? 'Recent' : w.detected ? 'Detected' : '',
        link: w.link ?? ''
      })) as any
      this._modal.onWalletClick = (name) => {
        if (isMobileBrowser()) {
          const walletData = this._metadataWallets.find((w) => w.name === name)

          if (
            typeof walletData === 'undefined' ||
            walletData.deeplink === null ||
            (walletData.deeplink.universal === null && walletData.deeplink.native === null)
          ) {
            return
          }

          this._app.base.connectDeeplink({
            walletName: walletData.name,
            url: walletData.deeplink.universal ?? walletData.deeplink.native!
          })

          triggerConnect(
            walletData.deeplink.universal ?? walletData.deeplink.native!,
            this._app.sessionId,
            'https://nc2.nightly.app'
          )

          this._modal!.connecting = true
        } else {
          const wallet = getWallet(name)
          if (typeof wallet === 'undefined') {
            return
          }

          const adapter = new StandardWalletAdapter({
            wallet: wallet as StandardWalletAdapterWallet
          })
          this._modal!.connecting = true
          adapter.connect().then(() => {
            this.onConnected?.(adapter)
            this.closeModal()
          }).catch(() => {
            this._modal!.connecting = false
          })
        }
      }

      const style = document.createElement('style')
      style.textContent = modalStyle
      document.head.appendChild(style)

      this._modalRoot = document.createElement('div')
      this._modalRoot.classList.add('nightlyConnectSelectorOverlay')

      this._modal.classList.add('nightlyConnectSelector')
      this._modalRoot.appendChild(this._modal)

      document.body.appendChild(this._modalRoot)
    } else {
      this._modalRoot.style.display = 'block'
    }
    this.onOpen?.()
  }

  public closeModal = () => {
    if (this._modalRoot) {
      this._modalRoot.style.display = 'none'
      this.onClose?.()
    }
  }
}