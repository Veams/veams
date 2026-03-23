import { Fragment, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import {
  BrowserRouter,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom';

import { CodeBlock } from './components/CodeBlock';
import {
  defaultPackage,
  docsPackages,
  getFirstPage,
  getPackageDocs,
  getPackagePages,
  getPackagePath,
  getPageDocs,
} from './content/site';
import { ConceptGrid } from './components/ConceptGrid';
import { LiveExample } from './components/LiveExample';

function renderInlineText(text: string): ReactNode {
  const segments = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean);

  return segments.map((segment, index) => {
    if (segment.startsWith('`') && segment.endsWith('`')) {
      return (
        <code className="inline-code" key={`${segment}-${index + 1}`}>
          {segment.slice(1, -1)}
        </code>
      );
    }

    if (segment.startsWith('**') && segment.endsWith('**')) {
      return (
        <strong className="inline-strong" key={`${segment}-${index + 1}`}>
          {segment.slice(2, -2)}
        </strong>
      );
    }

    return <Fragment key={`${segment}-${index + 1}`}>{segment}</Fragment>;
  });
}

function getPackageNavStyle(accent: string): CSSProperties {
  return {
    '--package-accent': `var(--accent-${accent})`,
    '--package-accent-soft': `var(--accent-${accent}-soft)`,
    '--package-accent-ghost': `var(--accent-${accent}-ghost)`,
  } as CSSProperties;
}

function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  return null;
}

function PackageRedirect() {
  const { packageId } = useParams();
  const packageDoc = getPackageDocs(packageId);

  if (!packageDoc) {
    return <Navigate replace to="/" />;
  }

  return <Navigate replace to={getPackagePath(packageDoc.id, getFirstPage(packageDoc).id)} />;
}

function VeamsLogo() {
  return (
    <svg
      aria-hidden="true"
      className="brand-logo"
      viewBox="0 0 208.083 60.551"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <polygon
          fill="var(--header-text)"
          points="28.173,24.773 26.098,10.329 20.829,4.218 11.364,31.342 1.898,58.466 30.122,53.102 58.344,47.736 47.952,35.682 31.588,48.547"
        />
      </g>
      <polygon
        fill="var(--header-text)"
        points="68.779,48.361 68.678,48.361 60.764,25.607 58.869,27.098 68.628,55.152 82.411,15.964 79.997,15.964"
      />
      <polygon
        fill="var(--header-text)"
        points="84.724,53.895 102.834,53.895 102.834,51.631 87.139,51.631 87.139,34.275 102.432,34.275 102.432,32.011 87.139,32.011 87.139,18.228 102.834,18.228 102.834,15.964 84.724,15.964"
      />
      <path
        d="M104.392,53.895h2.465l5.081-12.476h16.65l5.082,12.476h2.465l-15.848-39.188L104.392,53.895z M112.842,39.155l7.445-18.312l7.396,18.312H112.842z"
        fill="var(--header-text)"
      />
      <polygon
        fill="var(--header-text)"
        points="159.928,49.216 145.993,14.706 137.844,53.895 140.159,53.895 146.647,22.503 146.749,22.503 159.928,55.152 173.159,22.503 173.258,22.503 179.749,53.895 182.062,53.895 173.913,14.706"
      />
      <path
        d="M202.383,35.835l-7.244-3.772c-3.068-1.459-6.842-3.12-6.842-7.094c0-3.974,3.068-7.244,7.144-7.244c3.572,0,5.985,1.761,7.697,4.477l1.71-1.408c-1.811-3.27-5.434-5.333-9.256-5.333c-5.686,0-9.709,3.974-9.709,9.608c0,3.019,1.408,5.232,3.924,6.791l6.842,3.623c3.27,1.609,7.646,3.42,7.646,7.697c0,5.03-4.377,8.954-9.357,8.954c-4.578,0-7.546-2.817-9.154-6.842l-2.113,0.956c1.761,4.879,5.886,8.148,11.168,8.148c6.138,0,11.871-4.729,11.871-11.017C206.709,39.96,205.25,37.646,202.383,35.835z"
        fill="var(--header-text)"
      />
      <g opacity="0.7">
        <polygon
          fill="var(--accent)"
          points="57.41,15.964 60.764,25.607 69.349,18.857 47.053,9.929 24.757,1 26.098,10.329 39.587,25.978 47.952,35.682 50.469,33.702 58.869,27.098 54.995,15.964"
        />
      </g>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg aria-hidden="true" className="hero-badge-icon" viewBox="0 0 24 24">
      <path
        d="M12 1.5a10.5 10.5 0 0 0-3.32 20.46c.53.1.72-.23.72-.51v-1.99c-2.93.64-3.55-1.24-3.55-1.24a2.8 2.8 0 0 0-1.17-1.55c-.96-.66.07-.65.07-.65a2.22 2.22 0 0 1 1.62 1.09 2.28 2.28 0 0 0 3.11.89 2.3 2.3 0 0 1 .68-1.43c-2.34-.27-4.8-1.17-4.8-5.2a4.06 4.06 0 0 1 1.08-2.83 3.78 3.78 0 0 1 .1-2.8s.88-.28 2.9 1.08a10.08 10.08 0 0 1 5.28 0c2.02-1.36 2.9-1.08 2.9-1.08a3.78 3.78 0 0 1 .1 2.8 4.05 4.05 0 0 1 1.08 2.83c0 4.04-2.47 4.93-4.82 5.2a2.57 2.57 0 0 1 .73 1.99v2.95c0 .28.19.62.73.51A10.5 10.5 0 0 0 12 1.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function NpmIcon() {
  return (
    <svg aria-hidden="true" className="hero-badge-icon hero-badge-icon-npm" viewBox="0 0 24 24">
      <path
        d="M2 7.5v9h6v-6h3v6h11v-9H2Zm5 8H4v-7h3v7Zm5 0H9v-6h3v6Zm9 0h-3v-6h-3v6h-2v-7h8v7Z"
        fill="currentColor"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      aria-hidden="true"
      className="footer-heart-icon"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <p>
        Made with <HeartIcon /> by{' '}
        <a href="https://github.com/Sebastian-Fitzner" rel="noopener noreferrer" target="_blank">
          Sebastian Fitzner
        </a>
      </p>
    </footer>
  );
}

function DocsPage() {
  const location = useLocation();
  const { packageId, pageId } = useParams();
  const packageDoc = packageId ? getPackageDocs(packageId) : defaultPackage;
  const page = packageDoc ? (pageId ? getPageDocs(packageDoc, pageId) : getFirstPage(packageDoc)) : undefined;
  const [isPackageNavOpen, setIsPackageNavOpen] = useState(false);
  const [isSectionNavOpen, setIsSectionNavOpen] = useState(false);
  const documentTitle =
    packageDoc && page ? `${packageDoc.title} · ${page.title} · VEAMS Documentation` : 'VEAMS Documentation';

  useEffect(() => {
    document.title = documentTitle;
  }, [documentTitle]);

  useEffect(() => {
    setIsPackageNavOpen(false);
    setIsSectionNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isPackageNavOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsPackageNavOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPackageNavOpen]);

  if (!packageDoc || !page) {
    return <Navigate replace to="/" />;
  }

  const heroEyebrow = `${page.eyebrow} · ${page.title}`;
  const featureBlocks = page.blocks.filter((block) => block.featureCards);
  const articleBlocks = page.blocks.filter((block) => !block.featureCards);
  const contentBlocks = [...featureBlocks, ...articleBlocks];
  const tocBlocks = contentBlocks;
  const heroParagraphs = page.heroParagraphs ?? [page.intro];
  const heroLinks: { href: string; icon: ReactNode; key: string; label: string }[] = [];

  if (packageDoc.githubPath) {
    heroLinks.push({
      href: `https://github.com/Veams/veams/tree/master/${packageDoc.githubPath}`,
      icon: <GitHubIcon />,
      key: 'github',
      label: packageDoc.title,
    });
  }

  if (packageDoc.npm) {
    heroLinks.push({
      href: `https://www.npmjs.com/package/${packageDoc.npm}`,
      icon: <NpmIcon />,
      key: 'npm',
      label: packageDoc.npm,
    });
  }
  const packagePages = getPackagePages(packageDoc);
  const currentPageIndex = packagePages.findIndex((entry) => entry.id === page.id);
  const previousPage = currentPageIndex > 0 ? packagePages[currentPageIndex - 1] : undefined;
  const nextPage =
    currentPageIndex >= 0 && currentPageIndex < packagePages.length - 1
      ? packagePages[currentPageIndex + 1]
      : undefined;

  return (
    <div className={`site-shell accent-${packageDoc.accent}`}>
      <header className="topbar">
        <div className="topbar-layout">
          <NavLink aria-label="VEAMS Documentation" className="topbar-brand" to="/">
            <VeamsLogo />
            <span aria-hidden="true" className="brand-separator">
              |
            </span>
            <span className="brand-package-name">{packageDoc.title}</span>
          </NavLink>
          <div className="topbar-actions">
            <button
              aria-label="Packages"
              aria-controls="package-switcher"
              aria-expanded={isPackageNavOpen}
              className="topbar-menu-toggle"
              onClick={() => setIsPackageNavOpen(true)}
              type="button"
            >
              <span aria-hidden="true" className="topbar-menu-icon">
                <span />
                <span />
                <span />
              </span>
              <span className="topbar-menu-label">Packages</span>
            </button>
          </div>
        </div>
      </header>

      {isPackageNavOpen ? (
        <button
          aria-label="Close package switcher"
          className="drawer-backdrop"
          onClick={() => setIsPackageNavOpen(false)}
          type="button"
        />
      ) : null}

      <aside
        aria-label="Package switcher"
        aria-hidden={!isPackageNavOpen}
        className={`package-drawer${isPackageNavOpen ? ' is-open' : ''}`}
        id="package-switcher"
      >
        <div className="package-drawer-header">
          <div>
            <p className="eyebrow">Menu</p>
            <h2>Switch package</h2>
          </div>
          <button
            aria-label="Close package switcher"
            className="package-drawer-close"
            onClick={() => setIsPackageNavOpen(false)}
            type="button"
          >
            Close
          </button>
        </div>
        <nav aria-label="Package links" className="package-drawer-nav">
          {docsPackages.map((entry) => (
            <NavLink
              key={entry.id}
              className={({ isActive }) => `package-drawer-link${isActive ? ' is-active' : ''}`}
              onClick={() => setIsPackageNavOpen(false)}
              style={getPackageNavStyle(entry.accent)}
              to={getPackagePath(entry.id, getFirstPage(entry).id)}
            >
              <span>{entry.title}</span>
              <small>{entry.npm ?? entry.description}</small>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="workspace-frame">
        <aside className="sidebar">
          <button
            aria-controls="section-navigation"
            aria-expanded={isSectionNavOpen}
            className="sidebar-mobile-toggle"
            onClick={() => setIsSectionNavOpen((open) => !open)}
            type="button"
          >
            <span>Pages</span>
            <span aria-hidden="true" className="sidebar-mobile-toggle-icon">
              {isSectionNavOpen ? '−' : '+'}
            </span>
          </button>
          <nav
            aria-label={`${packageDoc.title} sections`}
            className={`sidebar-card section-nav${isSectionNavOpen ? ' is-open' : ''}`}
            id="section-navigation"
          >
            {packageDoc.id !== 'ecosystem' ? <p className="eyebrow">Documentation</p> : null}
            {packageDoc.sections.map((section, index) => (
              <Fragment key={section.id}>
                {index > 0 && <div className="sidebar-divider" />}
                <div className="section-group">
                  <h2 className="section-group-title">{section.title}</h2>
                  <div className="section-group-links">
                    {section.pages.map((entry) => {
                      const target = getPackagePath(packageDoc.id, entry.id);

                      return (
                        <NavLink
                          key={entry.id}
                          className={({ isActive }) => `section-link${isActive ? ' is-active' : ''}`}
                          onClick={() => setIsSectionNavOpen(false)}
                          to={target}
                        >
                          <span>{renderInlineText(entry.title)}</span>
                          <small>{renderInlineText(entry.summary)}</small>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              </Fragment>
            ))}
          </nav>
        </aside>

        <main className="content-panel">
          <section className={`hero-card${heroLinks.length ? '' : ' hero-card-full'}`}>
            <div className="hero-copy">
              <p className="eyebrow">{heroEyebrow}</p>
              <h2>{renderInlineText(page.summary)}</h2>
              {page.heroImage ? (
                <div className="hero-image">
                  <img alt={page.title} src={page.heroImage} />
                </div>
              ) : null}
              <div className="hero-body">
                {heroParagraphs.map((paragraph) => (
                  <p key={paragraph}>{renderInlineText(paragraph)}</p>
                ))}
                {page.heroBullets ? (
                  <ul className="hero-bullet-list">
                    {page.heroBullets.map((bullet) => (
                      <li key={bullet}>{renderInlineText(bullet)}</li>
                    ))}
                  </ul>
                ) : null}
                {page.featureCards ? <ConceptGrid items={page.featureCards} /> : null}
              </div>
            </div>
            {heroLinks.length ? (
              <div className="hero-meta">
                {heroLinks.map((link) => (
                  <a
                    className="hero-badge"
                    href={link.href}
                    key={link.key}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {link.icon}
                    <span className="hero-badge-copy">
                      <strong>{link.label}</strong>
                    </span>
                  </a>
                ))}
              </div>
            ) : null}
          </section>

          <div className={`article-grid${tocBlocks.length === 0 ? ' is-full' : ''}`}>
            <article className="article-card">
              {contentBlocks.map((block) => (
                <section className="content-block" id={block.id} key={block.id}>
                  <div className="content-header">
                    <h3>{renderInlineText(block.title)}</h3>
                    <a className="anchor-link" href={`#${block.id}`}>
                      #
                    </a>
                  </div>
                  <div className="content-stack">
                    {block.liveExample ? (
                      <LiveExample id={block.liveExample} sourceExamples={block.codeExamples} />
                    ) : null}
                    {block.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{renderInlineText(paragraph)}</p>
                    ))}
                    {block.bullets ? (
                      <ul className="bullet-list">
                        {block.bullets.map((bullet) => (
                          <li key={bullet}>{renderInlineText(bullet)}</li>
                        ))}
                      </ul>
                    ) : null}
                    {block.callout ? (
                      <div className="callout">
                        <div className="callout-header">
                          <span aria-hidden="true" className="callout-icon">
                            i
                          </span>
                          <span className="callout-label">Note</span>
                        </div>
                        <div className="callout-copy">{renderInlineText(block.callout)}</div>
                      </div>
                    ) : null}
                    {block.featureCards ? <ConceptGrid items={block.featureCards} /> : null}
                    {block.codeExamples && !block.liveExample ? (
                      <div className="code-grid">
                        {block.codeExamples.map((example) => (
                          <CodeBlock example={example} key={`${block.id}-${example.label}`} />
                        ))}
                      </div>
                    ) : null}
                  </div>
                </section>
              ))}

              {previousPage || nextPage ? (
                <nav aria-label="Page navigation" className="page-pagination">
                  <div className="page-pagination-slot">
                    {previousPage ? (
                      <NavLink
                        className="page-pagination-link"
                        to={getPackagePath(packageDoc.id, previousPage.id)}
                      >
                        <small>Previous</small>
                        <span>{renderInlineText(previousPage.title)}</span>
                      </NavLink>
                    ) : null}
                  </div>
                  <div className="page-pagination-slot">
                    {nextPage ? (
                      <NavLink
                        className="page-pagination-link is-next"
                        to={getPackagePath(packageDoc.id, nextPage.id)}
                      >
                        <small>Next</small>
                        <span>{renderInlineText(nextPage.title)}</span>
                      </NavLink>
                    ) : null}
                  </div>
                </nav>
              ) : null}
            </article>

            {tocBlocks.length > 0 ? (
              <aside className="toc-panel">
                <div className="sidebar-card">
                  <p className="eyebrow">On This Page</p>
                  <nav aria-label="Table of contents" className="toc-nav">
                    {tocBlocks.map((block) => (
                      <a href={`#${block.id}`} key={block.id}>
                        <span aria-hidden="true" className="toc-link-icon">
                          #
                        </span>
                        <span>{renderInlineText(block.title)}</span>
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            ) : null}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollManager />
      <Routes>
        <Route element={<DocsPage />} path="/" />
        <Route element={<PackageRedirect />} path="/packages/:packageId" />
        <Route element={<DocsPage />} path="/packages/:packageId/:pageId" />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </BrowserRouter>
  );
}
