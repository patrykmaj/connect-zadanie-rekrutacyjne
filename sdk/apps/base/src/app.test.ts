import { assert, describe, expect, test, vi } from 'vitest'
import { BaseApp } from './app'
import { sleep, testAppBaseInitialize, testClientBaseInitialize } from './utils'
import { BaseClient, Connect } from './client'
import { UserConnectedEvent } from '@bindings/UserConnectedEvent'

// Edit an assertion and save to see HMR in action

describe('Base App tests', () => {
  test('#Build()', async () => {
    const baseApp = await BaseApp.build(testAppBaseInitialize)
    expect(baseApp).toBeDefined()
    assert(baseApp.sessionId !== '')
  })
  test('persistent session', async () => {
    const persistInitialize = testAppBaseInitialize
    // Random string as app name to avoid conflicts
    const appName = Math.random().toString(36)
    persistInitialize.appMetadata.name = appName
    persistInitialize.persistent = true
    const baseApp = await BaseApp.build(persistInitialize)
    expect(baseApp).toBeDefined()
    assert(baseApp.sessionId !== '')
    const sessionId = baseApp.sessionId // Save the session id
    // Disconnect
    await baseApp.ws.terminate() // close() does not emit close event
    const disconnecFn = vi.fn()
    baseApp.on('serverDisconnected', () => {
      disconnecFn()
    })
    await sleep(10)
    expect(disconnecFn).toHaveBeenCalledOnce()
    // Reconnect
    persistInitialize.persistentSessionId = sessionId // Set the session id
    const baseApp2 = await BaseApp.build(persistInitialize)
    expect(baseApp2).toBeDefined()
    assert(baseApp2.sessionId == sessionId)
  })
  test('#on("userConnected")', async () => {
    const baseApp = await BaseApp.build(testAppBaseInitialize)
    expect(baseApp).toBeDefined()
    assert(baseApp.sessionId !== '')
    const userConnectedFn = vi.fn()
    baseApp.on('userConnected', async (e) => {
      e
      userConnectedFn(e)
    })
    console.log(baseApp.sessionId)
    await sleep(10)

    // Create client
    const client = await BaseClient.build(testClientBaseInitialize)
    const msg: Connect = {
      publicKeys: ['1', '2'],
      sessionId: baseApp.sessionId
    }
    await client.connect(msg)
    await sleep(10)
    // We should get public keys
    expect(userConnectedFn.mock.lastCall[0].publicKeys).toStrictEqual(msg.publicKeys)
    expect(userConnectedFn).toHaveBeenCalledOnce()
  })
})