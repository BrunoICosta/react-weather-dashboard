import { afterEach, describe, expect, it } from 'vitest'
import { applyWeatherTheme, getWeatherTheme } from './weatherTheme'

describe('getWeatherTheme', () => {
  it('uses a light tone for daytime and a dark one at night', () => {
    expect(getWeatherTheme(0, true)).toMatchObject({ scene: 'clear', period: 'day', tone: 'light' })
    expect(getWeatherTheme(0, false)).toMatchObject({
      scene: 'clear',
      period: 'night',
      tone: 'dark',
    })
  })

  it('maps drizzle and showers to the rain scene', () => {
    expect(getWeatherTheme(53, true).scene).toBe('rain')
    expect(getWeatherTheme(82, true).scene).toBe('rain')
  })

  it('always uses the dark tone during storms', () => {
    expect(getWeatherTheme(95, true)).toMatchObject({ scene: 'storm', tone: 'dark' })
  })
})

describe('applyWeatherTheme', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-scene')
    document.documentElement.removeAttribute('data-period')
    document.documentElement.removeAttribute('data-tone')
  })

  it('writes data attributes and the theme-color meta', () => {
    const meta = document.createElement('meta')
    meta.name = 'theme-color'
    document.head.append(meta)

    applyWeatherTheme(getWeatherTheme(71, false))

    expect(document.documentElement.dataset).toMatchObject({
      scene: 'snow',
      period: 'night',
      tone: 'dark',
    })
    expect(meta.content).toBe('#1e293b')
    meta.remove()
  })
})
