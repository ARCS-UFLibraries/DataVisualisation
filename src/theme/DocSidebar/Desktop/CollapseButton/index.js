import React from 'react';
import clsx from 'clsx';
import {translate} from '@docusaurus/Translate';
import styles from './styles.module.css';

export default function CollapseButton({onClick}) {
  return (
    <button
      type="button"
      title={translate({
        id: 'theme.docs.sidebar.collapseButtonTitle',
        message: 'Toggle sidebar',
      })}
      aria-label={translate({
        id: 'theme.docs.sidebar.collapseButtonAriaLabel',
        message: 'Toggle sidebar',
      })}
      className={clsx(
        'button button--secondary',
        styles.collapseSidebarButton,
      )}
      onClick={onClick}>
      <span className={styles.hamburger}>☰</span>
    </button>
  );
}