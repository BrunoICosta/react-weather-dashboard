import styles from './App.module.css'

export function App() {
  return (
    <div className={styles.app}>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      <header className={styles.header}>
        <div className={styles.brand}>
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" width={32} height={32} />
          <h1 className={styles.title}>Clima</h1>
        </div>
      </header>

      <main id="conteudo" className={styles.main} tabIndex={-1}>
        <p>Em construção.</p>
      </main>

      <footer className={styles.footer}>
        Dados meteorológicos por{' '}
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
          Open-Meteo.com
        </a>{' '}
        (CC BY 4.0)
      </footer>
    </div>
  )
}
