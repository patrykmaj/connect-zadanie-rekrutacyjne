module.exports = {
  docs: [
    'home',
    {
      type: 'category',
      label: '💻 Application',
      collapsed: false,
      items: ['application/connect', 'application/send']
    },
    {
      type: 'category',
      label: '📱 Client',
      collapsed: false,
      items: [ 'client/connect', 'client/sign', 'client/signMessage', 'client/push']
    },
  ]
}