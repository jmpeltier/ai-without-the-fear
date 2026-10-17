import { sectionHeader } from '../ui.js';

export default {
  id: 'next-word',
  title: 'Guess the next word',
  icon: '🔮',
  minutes: 7,
  render(root, section) {
    root.append(sectionHeader(section, 'Coming soon.'));
  },
};
