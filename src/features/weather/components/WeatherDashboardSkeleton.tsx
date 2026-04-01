import { useTranslation } from 'react-i18next'
import { Card } from '@/shared/components/Card'
import { Skeleton } from '@/shared/components/Skeleton'
import styles from './WeatherDashboard.module.css'

/** Mirrors the dashboard layout so nothing jumps when the data arrives. */
export function WeatherDashboardSkeleton() {
  const { t } = useTranslation('weather')
  return (
    <div className={styles.grid} role="status" aria-label={t('loading')}>
      <div className={styles.current}>
        <Card>
          <div className={styles.skeletonStack}>
            <Skeleton width="45%" height="2rem" />
            <Skeleton width="30%" />
            <div className={styles.skeletonRow}>
              <Skeleton width="7rem" height="5rem" radius="var(--radius-md)" />
              <div className={styles.skeletonStack}>
                <Skeleton width="9rem" height="1.25rem" />
                <Skeleton width="11rem" />
              </div>
            </div>
            <div className={styles.skeletonDetails}>
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} height="4.25rem" radius="var(--radius-md)" />
              ))}
            </div>
          </div>
        </Card>
      </div>
      <div className={styles.hourly}>
        <Card>
          <div className={styles.skeletonStack}>
            <Skeleton width="10rem" />
            <Skeleton height="10.5rem" radius="var(--radius-md)" />
            <Skeleton height="6.5rem" radius="var(--radius-md)" />
          </div>
        </Card>
      </div>
      <div className={styles.daily}>
        <Card>
          <div className={styles.skeletonStack}>
            <Skeleton width="8rem" />
            {Array.from({ length: 7 }, (_, i) => (
              <Skeleton key={i} height="2.5rem" />
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
