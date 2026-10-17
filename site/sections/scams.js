import { sectionHeader } from '../ui.js';

export default {
  id: 'scams',
  title: 'Spot the AI scam',
  icon: '🕵️',
  minutes: 7,
  render(root, section) {
    root.append(sectionHeader(section, 'Coming soon.'));
  },
};
