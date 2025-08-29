export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  role?: string[];
  isMainParent?: boolean;
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'overview',
    title: 'Overview',
    type: 'group',
    icon: 'ti ti-dashboard',
    children: [
      {
        id: 'home',
        title: 'Home',
        type: 'item',
        classes: 'nav-item',
        url: '/default',
        icon: 'ti ti-home',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'management',
    title: 'Management',
    type: 'group',
    icon: 'ti ti-settings',

    children: [
      {
        id: 'users',
        title: 'Users',
        type: 'item',
        classes: 'nav-item',
        url: '/users',
        icon: 'ti ti-user',
        role: ['ADMIN','MANAGER','EMPLOYEE'],
      },
      {
        id: 'departments',
        title: 'Departments',
        type: 'item',
        classes: 'nav-item',
        url: '/departments',
        icon: 'ti ti-building-warehouse',
        external: true,
        role: ['ADMIN']
      },
      {
        id: 'okrs',
        title: 'Okrs',
        type: 'item',
        classes: 'nav-item',
        url: '/okrs',
        icon: 'ti ti-target',
        external: true,
        role: ['ADMIN','MANAGER']
      },
      {
        id: 'tasks',
        title: 'Tasks',
        type: 'item',
        classes: 'nav-item',
        url: '/tasks',
        icon: 'ti ti-clipboard-list',
        external: true,
        role: ['ADMIN','MANAGER']
      },
      {
        id: 'Your Tasks',
        title: 'Your Tasks',
        type: 'item',
        classes: 'nav-item',
        url: '/employeetasks',
        icon: 'ti ti-clipboard-list',
        role: ['EMPLOYEE']

      },
    ]
  },
  {
    id: 'communication',
    title: 'Communication',
    type: 'group',
    icon: 'ti ti-message-circle',
    children: [
      {
        id: 'meetings',
        title: 'Meetings',
        type: 'item',
        classes: 'nav-item',
        url: '/meetings',
        icon: 'ti ti-calendar-event',
        role: ['MANAGER']
      }
    ]
  }
];

