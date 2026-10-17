import { sectionHeader } from '../ui.js';

export default {
  id: 'timeline',
  title: 'Where AI came from',
  icon: '🕰️',
  minutes: 8,
  render(root, section) {
    root.append(sectionHeader(section, 'Coming soon.'));
  },
};
