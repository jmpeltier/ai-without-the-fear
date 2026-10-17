import { sectionHeader } from '../ui.js';

export default {
  id: 'data-centers',
  title: 'Why all the data centers?',
  icon: '🏭',
  minutes: 7,
  render(root, section) {
    root.append(sectionHeader(section, 'Coming soon.'));
  },
};
