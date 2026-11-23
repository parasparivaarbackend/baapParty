'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/context/LanguageContext';

// Full-screen branded splash shown every time the website is opened
// (full page load / refresh). Client-side navigation does not re-trigger it.
const MIN_VISIBLE_MS = 2600; // minimum time the loader stays on screen
const FADE_MS = 700; // must match .baap-loader transition in globals.css

export default function PageLoader() {
  const { t } = useLang();
  const [phase, setPhase] = useState('show'); // show -> hide -> gone

  useEffect(() => {
    const start = Date.now();
    let t1;
    let t2;

    const finish = () => {
      const wait = Math.max(0, MIN_VISIBLE_MS - (Date.now() - start));
      t1 = setTimeout(() => {
        setPhase('hide');
        t2 = setTimeout(() => setPhase('gone'), FADE_MS);
      }, wait);
    };

    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish, { once: true });

    // Safety net: never block the site longer than 6s.
    const safety = setTimeout(() => {
      setPhase('hide');
      t2 = setTimeout(() => setPhase('gone'), FADE_MS);
    }, 6000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(safety);
      window.removeEventListener('load', finish);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = phase === 'gone' ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [phase]);

  // Tell the welcome dialog the splash is finished.
  useEffect(() => {
    if (phase !== 'gone') return;
    window.__baapLoaderDone = true;
    window.dispatchEvent(new Event('baap:loader-done'));
  }, [phase]);

  if (phase === 'gone') return null;

  return (
    <div
      className={`baap-loader ${phase === "hide" ? "baap-loader--hide" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={t("Loading Bharatiya Avijit Aawaz Party website")}
    >
      <div className="baap-loader__glow" aria-hidden="true" />
      <div className="baap-loader__grid" aria-hidden="true" />

      <div className="baap-loader__content">
        <div className="baap-loader__logo-wrap">
          <span
            className="baap-loader__ring baap-loader__ring--1"
            aria-hidden="true"
          />
          <span
            className="baap-loader__ring baap-loader__ring--2"
            aria-hidden="true"
          />
          <span className="baap-loader__orbit" aria-hidden="true">
            <i />
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/loader-logo.png"
            alt={t("Bharatiya Avijit Aawaz Party logo")}
            className="baap-loader__logo"
            width="480"
            height="480"
            fetchPriority="high"
          />
        </div>

        <h1 className="baap-loader__hindi">भारतीय अविजित आवाज़ पार्टी</h1>
        <p className="baap-loader__title">Bharatiya Avijit Aawaz Party</p>

        <div className="baap-loader__tricolor" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        {/* <p className="baap-loader__tagline">
          {t("Welcome to the official website of the world's largest political party")}
        </p> */}

        <p className="baap-loader__tagline">
          {t("अपनी और अपने परिवार की सुरक्षा के लिए BAAP को चुनें।",)}
        </p>

        <div className="baap-loader__bar" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
}
