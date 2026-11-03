import { useState } from 'react'
import './App.css'

const initialCakes = [
  {
    id: 1,
    name: 'Полуничний пломбір',
    weight: '1.5 кг',
    date: '03.11.2026',
    biscuit: 'Ванільний бісквіт',
    cream: 'Крем пломбір',
    filling: 'Полуничне конфі',
    allergens: 'Молоко, яйця, глютен',
    shelf: '3 дні',
    emoji: '🍓',
  },
  {
    id: 2,
    name: 'Шоколадна мрія',
    weight: '2 кг',
    date: '02.11.2026',
    biscuit: 'Шоколадний бісквіт',
    cream: 'Шоколадний крем',
    filling: 'Вишня',
    allergens: 'Молоко, яйця, глютен',
    shelf: '3 дні',
    emoji: '🍫',
  },
]

function App() {
  const [cakes, setCakes] = useState(() => {
    const saved = localStorage.getItem('zlata_cakes.pl')
    return saved ? JSON.parse(saved) : initialCakes
  })

  const [page, setPage] = useState('home')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const [form, setForm] = useState({
    name: '',
    weight: '',
    biscuit: '',
    cream: '',
    filling: '',
    allergens: '',
    shelf: '3 дні',
    emoji: '🎂',
  })

  function saveCake(e) {
    e.preventDefault()

    const newCake = {
      ...form,
      id: Date.now(),
      date: new Date().toLocaleDateString('uk-UA'),
    }

    const updated = [newCake, ...cakes]

    setCakes(updated)
    localStorage.setItem('zlata_cakes.pl', JSON.stringify(updated))

    setForm({
      name: '',
      weight: '',
      biscuit: '',
      cream: '',
      filling: '',
      allergens: '',
      shelf: '3 дні',
      emoji: '🎂',
    })

    setPage('cakes')
  }

  function deleteCake(id) {
    if (!window.confirm('Видалити цей торт?')) return

    const updated = cakes.filter(cake => cake.id !== id)
    setCakes(updated)
    localStorage.setItem('zlata_cakes.pl', JSON.stringify(updated))
    setSelected(null)
  }

  const filtered = cakes.filter(cake =>
    cake.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">🎂 <span>zlata_cakes.pl</span></div>
        <p className="subtitle">Твоя солодка майстерня</p>

        <nav>
          <button onClick={() => { setPage('home'); setSelected(null) }}>
            🏠 Головна
          </button>
          <button onClick={() => { setPage('cakes'); setSelected(null) }}>
            🎂 Мої торти
          </button>
          <button onClick={() => { setPage('add'); setSelected(null) }}>
            ➕ Додати торт
          </button>
          <button onClick={() => { setPage('history'); setSelected(null) }}>
            📚 Історія
          </button>
          <button onClick={() => { setPage('nfc'); setSelected(null) }}>
            📡 NFC-програматор
          </button>
        </nav>

        <div className="sidebar-bottom">
          Зроблено з любов'ю ❤️
        </div>
      </aside>

      <main className="main">
        <header>
          <div>
            <p className="welcome">КОНДИТЕРСЬКА МАЙСТЕРНЯ</p>
            <h1>
              {page === 'home' && 'zlata_cakes ☀️'}
              {page === 'cakes' && 'Мої торти 🎂'}
              {page === 'add' && 'Створити новий торт'}
              {page === 'history' && 'Історія тортів'}
              {page === 'nfc' && 'NFC-програматор'}
            </h1>
          </div>
          <div className="avatar">👩🏻‍🍳</div>
        </header>

        {page === 'home' && (
          <>
            <section className="hero">
              <div>
                <span>♡ Вітаємо у zlata_cakes.pl</span>
                <h2>Кожен торт має<br />свою історію!</h2>
                <p>Зберігай рецепти, створюй нові шедеври<br />та керуй своєю солодкою колекцією.</p>
                <button className="primary" onClick={() => setPage('add')}>
                  + Створити торт
                </button>
              </div>
              <div className="hero-cake">🎂</div>
            </section>

            <div className="stats">
              <div className="stat">
                <span>🎂</span>
                <div><small>Усього тортів</small><strong>{cakes.length}</strong></div>
              </div>
              <div className="stat">
                <span>📖</span>
                <div><small>Рецептів</small><strong>{cakes.length}</strong></div>
              </div>
              <div className="stat">
                <span>❤️</span>
                <div><small>Твоя колекція</small><strong>∞</strong></div>
              </div>
            </div>

            <h2 className="section-title">Останні торти</h2>
            <CakeGrid cakes={cakes.slice(0, 3)} onSelect={setSelected} />
          </>
        )}

        {(page === 'cakes' || page === 'history') && (
          <>
            <input
              className="search"
              placeholder="🔍  Знайти торт за назвою..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <CakeGrid cakes={filtered} onSelect={setSelected} />
            {filtered.length === 0 && <p>Тортів поки не знайдено.</p>}
          </>
        )}

        {page === 'add' && (
          <form className="form-card" onSubmit={saveCake}>
            <h2>🍰 Нова картка торта</h2>
            <p>Заповни інформацію про свій кондитерський шедевр.</p>

            {[
              ['name', 'Назва торта', 'Наприклад, Полуничний пломбір'],
              ['weight', 'Вага', 'Наприклад, 1.5 кг'],
              ['biscuit', 'Бісквіт / основа', 'Ванільний бісквіт'],
              ['cream', 'Крем', 'Крем пломбір'],
              ['filling', 'Начинка', 'Полуничне конфі'],
              ['allergens', 'Алергени', 'Молоко, яйця, глютен'],
              ['shelf', 'Термін придатності', 'Наприклад, 3 дні'],
            ].map(([key, label, placeholder]) => (
              <label key={key}>
                {label}
                <input
                  required
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                />
              </label>
            ))}

            <button className="primary" type="submit">
              💾 Зберегти торт
            </button>
          </form>
        )}

        {page === 'nfc' && (
          <div className="form-card nfc-card">
            <div className="nfc-icon">📡</div>
            <h2>Запис NFC-мітки</h2>
            <p>Вибери торт, щоб підготувати його картку для NFC.</p>
            {cakes.map(cake => (
              <button
                className="cake-row"
                key={cake.id}
                onClick={() => setSelected(cake)}
              >
                {cake.emoji} {cake.name} — {cake.weight}
              </button>
            ))}
            <p className="hint">
              Запис NFC додамо наступним етапом. Для цього потрібен
              сумісний смартфон Android із Chrome.
            </p>
          </div>
        )}

        {selected && (
          <div className="overlay" onClick={() => setSelected(null)}>
            <div className="details" onClick={e => e.stopPropagation()}>
              <button className="close" onClick={() => setSelected(null)}>✕</button>
              <div className="detail-emoji">{selected.emoji}</div>
              <h2>{selected.name}</h2>
              <p>Дата виготовлення: {selected.date}</p>
              <hr />
              <p><b>Вага:</b> {selected.weight}</p>
              <p><b>Бісквіт:</b> {selected.biscuit}</p>
              <p><b>Крем:</b> {selected.cream}</p>
              <p><b>Начинка:</b> {selected.filling}</p>
              <p><b>Алергени:</b> {selected.allergens}</p>
              <p><b>Термін придатності:</b> {selected.shelf}</p>
              <button className="delete" onClick={() => deleteCake(selected.id)}>
                Видалити торт
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function CakeGrid({ cakes, onSelect }) {
  if (!cakes.length) return <p>Тут поки немає тортів. Додай свій перший! ❤️</p>

  return (
    <div className="cake-grid">
      {cakes.map(cake => (<div className="cake-card" key={cake.id} onClick={() => onSelect(cake)}>
          <div className="cake-picture">{cake.emoji}</div>
          <div className="cake-info">
            <h3>{cake.name}</h3>
            <p>{cake.weight} · {cake.date}</p>
            <span>Переглянути рецепт →</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App