import { Header } from '../../components/Header/Header';
import {
  ReactLogo,
  TypeScriptLogo,
  ViteLogo,
  TanStackQueryLogo,
  SassLogo,
  PassportLogo,
  PrismaLogo,
  PnpmLogo,
  PrettierLogo,
} from './Logos';
import './About.scss';

interface Technology {
  name: string;
  icon: React.ReactNode;
  category: 'frontend' | 'backend' | 'database' | 'tools';
  experience: string;
}

const technologies: Technology[] = [
  // Frontend
  {
    name: 'React',
    icon: <ReactLogo size={28} />,
    category: 'frontend',
    experience:
      '1 year — development of interactive interfaces and games',
  },
  {
    name: 'TypeScript',
    icon: <TypeScriptLogo size={28} />,
    category: 'frontend',
    experience: '2 years',
  },
  {
    name: 'Vite',
    icon: <ViteLogo size={28} />,
    category: 'frontend',
    experience: '2 years',
  },
  {
    name: 'React Router',
    icon: (
      <img
        src="/technologies/react-router.svg"
        alt="React Router"
        width={28}
        height={28}
      />
    ),
    category: 'frontend',
    experience: '1 year',
  },
  {
    name: 'TanStack Query',
    icon: <TanStackQueryLogo size={28} />,
    category: 'frontend',
    experience: '0.5 year',
  },
  {
    name: 'SCSS/Sass',
    icon: <SassLogo size={28} />,
    category: 'frontend',
    experience: '0.5 year',
  },

  // Backend
  {
    name: 'NestJS',
    icon: (
      <img
        src="/technologies/nestjs.svg"
        alt="NestJS"
        width={28}
        height={28}
      />
    ),
    category: 'backend',
    experience:
      '2 years — development of microservice architecture and high-load REST API',
  },
  {
    name: 'Node.js',
    icon: (
      <img
        src="/technologies/nodejs.svg"
        alt="Node.js"
        width={28}
        height={28}
      />
    ),
    category: 'backend',
    experience: '2 years',
  },
  {
    name: 'Passport.js',
    icon: <PassportLogo size={28} />,
    category: 'backend',
    experience: 'First used in this project',
  },
  {
    name: 'PostgreSQL',
    icon: (
      <img
        src="/technologies/postgresql.svg"
        alt="PostgreSQL"
        width={28}
        height={28}
      />
    ),
    category: 'database',
    experience: '1.5 years',
  },
  {
    name: 'Prisma ORM',
    icon: <PrismaLogo size={28} />,
    category: 'database',
    experience: '1.5 years',
  },
  {
    name: 'pnpm',
    icon: <PnpmLogo size={28} />,
    category: 'tools',
    experience: 'First used in this project',
  },
  {
    name: 'ESLint',
    icon: (
      <img
        src="/technologies/eslint.svg"
        alt="ESLint"
        width={28}
        height={28}
      />
    ),
    category: 'tools',
    experience: '2 years',
  },
  {
    name: 'Prettier',
    icon: <PrettierLogo size={28} />,
    category: 'tools',
    experience: '2 years',
  },
  {
    name: 'Turborepo',
    icon: (
      <img
        src="/technologies/turborepo.svg"
        alt="ESLint"
        width={28}
        height={28}
      />
    ),
    category: 'tools',
    experience: 'First used in this project',
  },
];

const categoryLabels: Record<
  Technology['category'],
  string
> = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  tools: 'Development Tools',
};

const categoryOrder: Technology['category'][] = [
  'frontend',
  'backend',
  'database',
  'tools',
];

export const About = () => {
  const groupedTechnologies = categoryOrder.map(
    (category) => ({
      category,
      label: categoryLabels[category],
      items: technologies.filter(
        (tech) => tech.category === category,
      ),
    }),
  );

  return (
    <>
      <Header />
      <main className="about">
        <div className="about__container">
          <div className="about__hero">
            <div className="about__avatar">
              <span>NG</span>
            </div>
            <h1 className="about__name">
              Grishanov Nikita Mikhailovich
            </h1>
            <p className="about__subtitle">
              Full-Stack Developer
            </p>
            <div className="about__meta">
              <span className="about__meta-item">
                Financial University under the Government of
                the Russian Federation
              </span>
              <span className="about__meta-divider" />
              <span className="about__group-badge">
                ID23-3
              </span>
            </div>
            <div className="about__meta about__meta--date">
              <span className="about__meta-item">
                Development period: December 13, 2025 —
                December 18, 2025
              </span>
            </div>
          </div>

          <section className="about__section">
            <h2 className="about__section-title">
              Contact Information
            </h2>
            <div className="about__contacts">
              <a
                href="https://www.linkedin.com/in/nikita-grishanov-35675a374/"
                target="_blank"
                rel="noopener noreferrer"
                className="about__contact about__contact--linkedin"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <div className="about__contact-info">
                  <span className="about__contact-label">
                    LinkedIn
                  </span>
                  <span className="about__contact-value">
                    Nikita Grishanov
                  </span>
                </div>
              </a>

              <a
                href="mailto:233484@fa.ru"
                className="about__contact about__contact--email"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <div className="about__contact-info">
                  <span className="about__contact-label">
                    Email
                  </span>
                  <span className="about__contact-value">
                    233484@fa.ru
                  </span>
                </div>
              </a>

              <a
                href="https://t.me/TheMainNPC"
                target="_blank"
                rel="noopener noreferrer"
                className="about__contact about__contact--telegram"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                <div className="about__contact-info">
                  <span className="about__contact-label">
                    Telegram
                  </span>
                  <span className="about__contact-value">
                    @TheMainNPC
                  </span>
                </div>
              </a>

              <a
                href="https://github.com/sorawalker"
                target="_blank"
                rel="noopener noreferrer"
                className="about__contact about__contact--github"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <div className="about__contact-info">
                  <span className="about__contact-label">
                    GitHub
                  </span>
                  <span className="about__contact-value">
                    sorawalker
                  </span>
                </div>
              </a>
            </div>
          </section>

          <section className="about__section">
            <h2 className="about__section-title">
              Technologies & Experience
            </h2>
            <p className="about__section-description">
              Technologies used in this project and work
              experience with each
            </p>

            {groupedTechnologies.map((group) => (
              <div
                key={group.category}
                className="about__tech-group"
              >
                <h3 className="about__tech-category">
                  {group.label}
                </h3>
                <div className="about__tech-grid">
                  {group.items.map((tech) => (
                    <div
                      key={tech.name}
                      className="about__tech-card"
                    >
                      <div className="about__tech-header">
                        <span className="about__tech-icon">
                          {tech.icon}
                        </span>
                        <span className="about__tech-name">
                          {tech.name}
                        </span>
                      </div>
                      {tech.experience ? (
                        <p className="about__tech-experience">
                          {tech.experience}
                        </p>
                      ) : (
                        <p className="about__tech-experience about__tech-experience--empty">
                          Experience description coming
                          soon...
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>
    </>
  );
};
