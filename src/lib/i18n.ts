import { lang } from './stores/ui';
import { get } from 'svelte/store';

type Dict = Record<string, string>;
const fr: Dict = {
  'nav.home': 'Accueil',
  'nav.interactions': 'Interactions',
  'nav.paths': 'Parcours',
  'nav.afest': 'AFEST',
  'nav.a11y': 'Accessibilité & Langues',
  'nav.dashboard': 'Tableau de bord',
  'nav.integrations': 'Intégrations',
  'nav.compare': 'Comparatif',
  'skip': 'Aller au contenu',
  'footer.nav': 'Navigation',
  'footer.legal': 'Légal',
  'footer.contact': 'Contact',
  'kpi.progress': 'Progression',
  'kpi.score': 'Score',
  'kpi.level': 'Niveau',
  'home.title': 'La formation qui agit sur le terrain',
  'home.subtitle': 'Passez du papier au e‑learning interactif, traçable et engageant.',
  'comparatif.title': 'Papier ou Digital : le match est vite plié.',
  'comparatif.subtitle': 'Le e-learning transforme vos supports en expériences interactives, mesurables et déployables partout.',
  'integrations.title': 'Connectée à vos outils, prête dès demain.',
  'integrations.subtitle': 'SSO, SCORM/xAPI, exports RH : nos intégrations fluidifient vos process.',
  'afest.title': 'L’AFEST, la formation en situation réelle.',
  'afest.subtitle': 'Du terrain au digital : preuves, guidage et validation opposable.',
  'parcours.title': 'Un parcours clair, du premier clic au certificat.',
  'parcours.subtitle': 'Chaque apprenant suit un chemin balisé, motivant et mesurable.',
  'interactions.title': 'Les interactions de nos plateformes',
  'a11y.title': 'Former partout, à tous.',
  'a11y.subtitle': 'Multi-langues, sous-titres, transcriptions, lecture RTL : vos équipes apprennent mieux, plus vite, où qu’elles soient.',
  'dashboard.title': 'Pilotez vos formations en temps réel.',
  'dashboard.subtitle': 'Suivez la progression de vos équipes, les scores, les badges obtenus et exportez vos preuves pour l’audit.'
};

const en: Dict = {
  'nav.home': 'Home',
  'nav.interactions': 'Interactions',
  'nav.paths': 'Paths',
  'nav.afest': 'AFEST',
  'nav.a11y': 'Accessibility & Languages',
  'nav.dashboard': 'Dashboard',
  'nav.integrations': 'Integrations',
  'nav.compare': 'Comparison',
  'skip': 'Skip to content',
  'footer.nav': 'Navigation',
  'footer.legal': 'Legal',
  'footer.contact': 'Contact',
  'kpi.progress': 'Progress',
  'kpi.score': 'Score',
  'kpi.level': 'Level',
  'home.title': 'Training that makes real-world impact',
  'home.subtitle': 'Turn paper into interactive, trackable, engaging e‑learning.',
  'comparatif.title': 'Paper or Digital: the match is quickly settled.',
  'comparatif.subtitle': 'E‑learning transforms your materials into interactive, measurable, deployable experiences everywhere.',
  'integrations.title': 'Connected to your tools, ready by tomorrow.',
  'integrations.subtitle': 'SSO, SCORM/xAPI, HR exports: our integrations streamline your processes.',
  'afest.title': 'AFEST, training in real working conditions.',
  'afest.subtitle': 'From field to digital: evidence, guidance and auditable validation.',
  'parcours.title': 'A clear path, from first click to certificate.',
  'parcours.subtitle': 'Each learner follows a structured, motivating and measurable journey.',
  'interactions.title': 'Interactions of our platforms',
  'a11y.title': 'Train everywhere, for everyone.',
  'a11y.subtitle': 'Multi‑language, subtitles, transcripts, RTL: teams learn better and faster wherever they are.',
  'dashboard.title': 'Drive your training in real time.',
  'dashboard.subtitle': 'Track team progress, scores, badges and export evidence for audits.'
};

const dict: Record<'fr'|'en', Dict> = { fr, en };

export function t(key: string, fallback?: string): string {
  const l = get(lang);
  return dict[l]?.[key] ?? fallback ?? fr[key] ?? key;
}
