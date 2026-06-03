import type { CSSProperties } from "react";
import { Link } from "react-router-dom";

function WelcomeStrandAnimation() {
  const nodes = [
    { leftX: 84, rightX: 156, y: -34, delay: "0s" },
    { leftX: 156, rightX: 84, y: 34, delay: "0.12s" },
    { leftX: 84, rightX: 156, y: 102, delay: "0.24s" },
    { leftX: 156, rightX: 84, y: 170, delay: "0.36s" },
    { leftX: 84, rightX: 156, y: 238, delay: "0.48s" },
    { leftX: 156, rightX: 84, y: 306, delay: "0.6s" },
    { leftX: 84, rightX: 156, y: 374, delay: "0.72s" },
    { leftX: 156, rightX: 84, y: 442, delay: "0.84s" },
    { leftX: 84, rightX: 156, y: 510, delay: "0.96s" },
    { leftX: 156, rightX: 84, y: 578, delay: "1.08s" },
    { leftX: 84, rightX: 156, y: 646, delay: "1.2s" },
    { leftX: 156, rightX: 84, y: 714, delay: "1.32s" },
    { leftX: 84, rightX: 156, y: 782, delay: "1.44s" },
  ];

  return (
    <div className="welcome-strand" aria-hidden="true">
      <svg
        className="welcome-strand__svg"
        viewBox="0 0 240 748"
        preserveAspectRatio="xMidYMid slice"
        role="presentation"
      >
        <path
          className="welcome-strand__rail welcome-strand__rail--left"
          d="M84 -102 C84 -62 156 -36 156 34 C156 78 84 58 84 102 C84 146 156 126 156 170 C156 214 84 194 84 238 C84 282 156 262 156 306 C156 350 84 330 84 374 C84 418 156 398 156 442 C156 486 84 466 84 510 C84 554 156 534 156 578 C156 622 84 602 84 646 C84 690 156 670 156 714 C156 758 84 762 84 850"
        />
        <path
          className="welcome-strand__rail welcome-strand__rail--right"
          d="M156 -102 C156 -62 84 -36 84 34 C84 78 156 58 156 102 C156 146 84 126 84 170 C84 214 156 194 156 238 C156 282 84 262 84 306 C84 350 156 330 156 374 C156 418 84 398 84 442 C84 486 156 466 156 510 C156 554 84 534 84 578 C84 622 156 602 156 646 C156 690 84 670 84 714 C84 758 156 762 156 850"
        />

        {nodes.map((node, index) => (
          <g
            className="welcome-strand__rung"
            key={node.y}
            style={{ "--strand-delay": node.delay } as CSSProperties}
          >
            <line x1={node.leftX} x2={node.rightX} y1={node.y} y2={node.y} />
            <circle className="welcome-strand__node" cx={node.leftX} cy={node.y} r="5.2" />
            <circle className="welcome-strand__node" cx={node.rightX} cy={node.y} r="5.2" />
            {index === 6 ? (
              <circle className="welcome-strand__pulse" cx="120" cy={node.y} r="6" />
            ) : null}
          </g>
        ))}
      </svg>
    </div>
  );
}

export function WelcomePage() {
  return (
    <section className="page page--welcome">
      <div className="welcome-intro">
        <div className="welcome-mark" aria-label="Wandr logo">
          <span className="welcome-mark__glyph">W</span>
          <span className="welcome-mark__word">Wandr</span>
        </div>

        <div className="welcome-hero">
          <p className="hero__eyebrow">Personal city route</p>
          <h1 className="hero__title">Plan a walk that fits your day.</h1>
          <p className="hero__body">
            Wandr connects nearby stops around your mood, timing, and the
            people you are open to crossing paths with.
          </p>
        </div>
      </div>

      <WelcomeStrandAnimation />

      <div className="welcome-decision">
        <div className="welcome-proof" aria-label="What Wandr plans for">
          <div className="welcome-proof__item">
            <span className="welcome-proof__kicker">01</span>
            <span className="welcome-proof__label">Your vibe</span>
          </div>
          <div className="welcome-proof__item">
            <span className="welcome-proof__kicker">02</span>
            <span className="welcome-proof__label">Your time</span>
          </div>
          <div className="welcome-proof__item">
            <span className="welcome-proof__kicker">03</span>
            <span className="welcome-proof__label">Meet nearby</span>
          </div>
        </div>

        <div className="footer-actions footer-actions--welcome">
          <p className="welcome-cta-copy">
            Answer a few prompts. Wandr turns them into a live strand you can
            rework as the day changes.
          </p>
          <Link className="button button--primary button--large button--fixed" to="/onboarding">
            Plan my strand
          </Link>
        </div>
      </div>
    </section>
  );
}
