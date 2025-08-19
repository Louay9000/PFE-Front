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
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
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
    id: 'elements',
    title: 'Elements',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'users',
        title: 'Users',
        type: 'item',
        classes: 'nav-item',
        url: '/users',
        icon: 'ti ti-user',
        role: ['ADMIN','MANAGER'],
      },
      {
        id: 'tabler',
        title: 'Tabler',
        type: 'item',
        classes: 'nav-item',
        url: 'https://tabler-icons.io/',
        icon: 'ti ti-plant-2',
        target: true,
        external: true
      },
      {id: 'Departments',
        title: 'Departments',
        type: 'item',
        classes: 'nav-item',
        url: '/departments',
        icon: 'ti ti-article',
        external: true,
        role: ['ADMIN']
      },
        {
        id: 'OKR',
        title: 'OKR',
        type: 'item',
        classes: 'nav-item',
        url: '/okrs',
        icon: 'ti ti-assembly',
        external: true,
        role: ['ADMIN']},

        {id: 'Tasks',
        title: 'Tasks',
        type: 'item',
        classes: 'nav-item',
        url: '/tasks',
        icon: 'ti ti-clipboard-list',
        external: true,
        role: ['ADMIN','MANAGER']
        }
    ]
  },
  {
    id: 'communication',
    title: 'Communication',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Chat',
        title: 'Chat',
        type: 'item',
        classes: 'nav-item',
        url: '/chat/:userId',
        icon: 'ti ti-brand-hipchat'
      },
      {
        id: 'Reunions',
        title: 'Reunions',
        type: 'item',
        classes: 'nav-item',
        url: '/authentication/register',
        icon: 'ti ti-calendar-stats'
      }
    ]
  }

];
