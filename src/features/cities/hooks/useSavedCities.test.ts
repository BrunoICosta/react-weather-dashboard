import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Place } from '@/core/types/place'
import { addCity, MAX_SAVED_CITIES, removeCity, useSavedCities } from './useSavedCities'

const city = (id: string, name = `Cidade ${id}`): Place => ({
  id,
  name,
  latitude: -23,
  longitude: -46,
})

describe('saved cities helpers', () => {
  it('adds new cities first and ignores duplicates', () => {
    const list = addCity([city('1')], city('2'))
    expect(list.map((c) => c.id)).toEqual(['2', '1'])
    expect(addCity(list, city('1'))).toBe(list)
  })

  it('drops the oldest city when the limit is reached', () => {
    const full = Array.from({ length: MAX_SAVED_CITIES }, (_, i) => city(String(i)))
    const next = addCity(full, city('new'))
    expect(next).toHaveLength(MAX_SAVED_CITIES)
    expect(next[0].id).toBe('new')
    expect(next.some((c) => c.id === String(MAX_SAVED_CITIES - 1))).toBe(false)
  })

  it('removes by id', () => {
    expect(removeCity([city('1'), city('2')], '1').map((c) => c.id)).toEqual(['2'])
  })
})

describe('useSavedCities', () => {
  it('persists cities in localStorage', () => {
    const { result } = renderHook(() => useSavedCities())

    act(() => result.current.save(city('3448439', 'São Paulo')))

    expect(result.current.isSaved('3448439')).toBe(true)
    expect(JSON.parse(localStorage.getItem('clima:saved-cities') ?? '[]')).toEqual([
      city('3448439', 'São Paulo'),
    ])

    act(() => result.current.remove('3448439'))
    expect(result.current.cities).toEqual([])
  })

  it('restores saved cities and ignores corrupted entries', () => {
    localStorage.setItem('clima:saved-cities', JSON.stringify([city('1')]))
    expect(renderHook(() => useSavedCities()).result.current.cities).toEqual([city('1')])

    localStorage.setItem('clima:saved-cities', '[{"id":1}]')
    expect(renderHook(() => useSavedCities()).result.current.cities).toEqual([])

    localStorage.setItem('clima:saved-cities', '{not json')
    expect(renderHook(() => useSavedCities()).result.current.cities).toEqual([])
  })
})
