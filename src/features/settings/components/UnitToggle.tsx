import { useId } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('settings')
  const name = useId()

  return (
    <div className={styles.toggles}>
      <SegmentedControl
        label={t('temperatureUnit')}
        name={`${name}-temperature`}
        value={temperatureUnit}
        onChange={setTemperatureUnit}
        options={TEMPERATURE_UNITS.map((unit) => ({
          value: unit,
          label: TEMPERATURE_SYMBOL[unit],
        }))}
      />
      <SegmentedControl
        label={t('windSpeedUnit')}
        name={`${name}-wind`}
        value={windSpeedUnit}
        onChange={setWindSpeedUnit}
        options={WIND_SPEED_UNITS.map((unit) => ({ value: unit, label: WIND_SPEED_SYMBOL[unit] }))}
      />
    </div>
  )
}
