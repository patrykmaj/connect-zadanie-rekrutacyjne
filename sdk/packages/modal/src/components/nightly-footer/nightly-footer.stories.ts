import { Meta, StoryObj } from '@storybook/web-components'
import { html } from 'lit/static-html.js'
import './nightly-footer'
import { NightlyFooter } from './nightly-footer'

const meta = {
  title: 'nightly-footer',
  parameters: {
    layout: 'centered'
  },
  render: (args) => {
    return html`
      <nightly-footer
        .footerURLsOverride=${args.footerURLsOverride}
      ></nightly-footer>`
  }
} satisfies Meta<NightlyFooter>

export default meta
type Story = StoryObj<NightlyFooter>

export const Default: Story = {
  name: 'Default',
  args: {
    footerURLsOverride: {
      termsOfServiceURL: 'https://wallet.nightly.app',
      privacyPolicyURL: 'https://wallet.nightly.app/Nightly_Privacy_Policy.pdf',
    }
  }
}
