import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './data-lab.module.css';

export default function DataLabPage() {
  const {siteConfig} = useDocusaurusContext();
  const appUrl = siteConfig.customFields?.shinyAppUrl;

  return (
    <Layout title="DataLab" description="Interactive data science workspace">
      <main className={styles.page}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>INTERACTIVE DATA SCIENCE</p>
          <h1>DataLab</h1>
          <p className={styles.lead}>
            Explore datasets, audit data quality, investigate distributions, and build evidence-based visualizations.
          </p>
          <div className={styles.actions}>
            {appUrl ? (
              <a className={styles.primary} href={appUrl} target="_blank" rel="noopener noreferrer">
                Open Data Explorer ↗
              </a>
            ) : (
              <span className={styles.pending}>Data Explorer deployment URL not configured yet</span>
            )}
            <Link className={styles.secondary} to="/docs/working-with-data">
              Learn data analysis
            </Link>
          </div>
        </section>

        {appUrl ? (
          <section className={styles.embed} aria-label="Interactive Python Shiny Data Explorer">
            <div className={styles.embedHeader}>
              <div>
                <h2>Interactive workspace</h2>
                <p>If the embedded app is blocked by browser settings, open it in a new tab.</p>
              </div>
              <a href={appUrl} target="_blank" rel="noopener noreferrer">Open separately ↗</a>
            </div>
            <iframe title="Python Shiny Data Explorer" src={appUrl} loading="lazy" allow="clipboard-read; clipboard-write" />
          </section>
        ) : (
          <section className={styles.setup}>
            <h2>Connect the Shiny app</h2>
            <p>
              Deploy the Python Shiny project, then set <code>SHINY_APP_URL</code> to its public URL when building this site.
              The DataLab page will automatically show an app launch link and embedded workspace.
            </p>
            <ol>
              <li>Deploy the Shiny project as a Docker Space.</li>
              <li>Add <code>SHINY_APP_URL=https://your-space-url</code> to the build environment.</li>
              <li>Rebuild and redeploy Docusaurus.</li>
            </ol>
          </section>
        )}

        <section className={styles.features}>
          <article><h3>Data quality</h3><p>Review missing values, duplicates, variable types, and potential numeric outliers.</p></article>
          <article><h3>Exploratory analysis</h3><p>Compare groups, inspect distributions, and visualize relationships between variables.</p></article>
          <article><h3>Reproducible workflow</h3><p>Use a documented data dictionary and transparent analysis steps to make results easier to interpret.</p></article>
        </section>
      </main>
    </Layout>
  );
}
