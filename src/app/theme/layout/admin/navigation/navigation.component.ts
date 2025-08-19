// Angular import
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationItem, NavigationItems } from './navigation'; // adapte le chemin si besoin


// project import

import { NavContentComponent } from './nav-content/nav-content.component';
import { Auth } from 'src/app/demo/services/auth';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [NavContentComponent, CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit {

  public sidebarnavItems:NavigationItem[]=[];
  @Input() items: NavigationItem[] = [];
  constructor(private authService: Auth) {}

  ngOnInit(): void {
   this.authService.loadProfile();

    // Filtrer les éléments selon le rôle
    this.sidebarnavItems = NavigationItems.filter(item => {
      if (!item.children) return true; // groupes sans enfants

      item.children = item.children.filter(child => {
        const roles = child.role || ['ADMIN', 'MANAGER', 'EMPLOYEE']; // fallback
        return this.authService.isAdmin()
          ? roles.includes('ADMIN')
          : this.authService.isManager()
          ? roles.includes('MANAGER')
          : this.authService.isEmployee()
          ? roles.includes('EMPLOYEE')
          : false;
      });

      return item.children.length > 0;
    });
}

filterNavItemsByRole(items: NavigationItem[], role: string): NavigationItem[] {
  return items
    .filter(item => !item.role || item.role.includes(role))
    .map(item => ({
      ...item,
      children: item.children ? this.filterNavItemsByRole(item.children, role) : undefined
    }));
  }
  // public props
  NavCollapsedMob = output();
  SubmenuCollapse = output();
  navCollapsedMob = false;
  windowWidth = window.innerWidth;
  themeMode!: string;

  // public method
  navCollapseMob() {
    if (this.windowWidth < 1025) {
      this.NavCollapsedMob.emit();
    }
  }

  navSubmenuCollapse() {
    document.querySelector('app-navigation.coded-navbar')?.classList.add('coded-trigger');
  }
}
