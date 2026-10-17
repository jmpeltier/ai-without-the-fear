import { sectionHeader } from '../ui.js';

export default {
  id: 'attention',
  title: 'The big breakthrough: attention',
  icon: '🔦',
  minutes: 5,
  render(root, section) {
    root.append(sectionHeader(section, 'Coming soon.'));
  },
};
