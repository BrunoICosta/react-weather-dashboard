import { useId } from 'react'
import { SegmentedControl } from '@/shared/components/SegmentedControl'
import {
  TEMPERATURE_SYMBOL,
  TEMPERATURE_UNITS,
  WIND_SPEED_SYMBOL,
  WIND_SPEED_UNITS,
} from '@/shared/lib/units'
import { useUnits } from '../units/unitsContext'
import styles from './UnitToggle.module.css'

export function UnitToggle() {
  const { temperatureUnit, windSpeedUnit, setTemperatureUnit, setWindSpeedUnit } = useUnits()
  const name = useId()

  return (
    <div className={styles.toggles}>
      <SegmentedControl
        label="Unidade de temperatura"
        name={`${name}-temperature`}
        value={temperatureUnit}
        onChange={setTemperatureUnit}
        options={TEMPERATURE_UNITS.map((unit) => ({
          value: unit,
          label: TEMPERATURE_SYMBOL[unit],
        }))}
      />
      <SegmentedControl
        label="Unidade de velocidade do vento"
        name={`${name}-wind`}
        value={windSpeedUnit}
        onChange={setWindSpeedUnit}
        options={WIND_SPEED_UNITS.map((unit) => ({ value: unit, label: WIND_SPEED_SYMBOL[unit] }))}
      />
    </div>
  )
}
