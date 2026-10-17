import { sectionHeader } from '../ui.js';

export default {
  id: 'safe-use',
  title: 'Try it safely',
  icon: '🛟',
  minutes: 5,
  render(root, section) {
    root.append(sectionHeader(section, 'Coming soon.'));
  },
};
