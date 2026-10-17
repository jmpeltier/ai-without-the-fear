import { sectionHeader } from '../ui.js';

export default {
  id: 'takeaways',
  title: 'Take-home cheat sheet',
  icon: '📝',
  minutes: 3,
  render(root, section) {
    root.append(sectionHeader(section, 'Coming soon.'));
  },
};
