export const methodologyFullExample = `<section class="r-dashboard">
  <!-- Region context: finance variant of the dashboard layout -->
  <header class="r-dashboard__header">
    <div class="c-brand c-brand--compact">
      <span class="c-brand__logo" aria-hidden="true"></span>
      <span class="c-brand__title">SME Hub</span>
    </div>

    <nav class="c-navigation" aria-label="Primary">
      <a class="c-navigation__link is-active" href="/">
        <span class="c-navigation__icon" aria-hidden="true"></span>
        <span class="c-navigation__text">Dashboard</span>
      </a>
      <a class="c-navigation__link" href="/profile">
        <span class="c-navigation__icon" aria-hidden="true"></span>
        <span class="c-navigation__text">Profile</span>
      </a>
    </nav>
  </header>

  <main class="r-dashboard__main">
    <div class="u-grid-row has-gap-lg">
      <article class="c-card c-card--dashboard">
        <header class="c-card__header">
          <h2 class="c-card__title">Revenue Overview</h2>
          <span class="c-card__badge is-active">Active</span>
        </header>
        <div class="c-card__content is-collapsed">
          <p class="c-card__text">Quarterly totals and trend indicators.</p>
        </div>
      </article>

      <aside class="c-panel c-panel--summary has-shadow">
        <h3 class="c-panel__title">Quick Stats</h3>
        <ul class="c-panel__list">
          <li class="c-panel__item">Runway: 14 months</li>
          <li class="c-panel__item">Gross margin: 62%</li>
        </ul>
      </aside>
    </div>
  </main>
</section>`;

export const methodologyPatternExampleMarkup = methodologyFullExample;

export const methodologyPatternExampleCss = `.r-dashboard {
  display: grid;
  gap: 3rem;
  padding: 3rem;
}

.r-dashboard__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.c-card--dashboard {
  padding: 2rem;
  border: 1px solid #d7dde8;
  background: #ffffff;
}

.c-panel--summary {
  padding: 2rem;
  background: #f5f8ff;
}`;
