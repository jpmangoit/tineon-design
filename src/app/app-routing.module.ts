import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './modules/web-app/common/page-not-found/page-not-found.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },

    { path: '', loadChildren: () => import('src/app/modules/authorization/authorization.module').then(m => m.AuthorizationModule) },

    { path: 'web', loadChildren: () => import('src/app/modules/web-app/web-app.module').then(m => m.WebAppModule) },

    { path: 'mobile', loadChildren: () => import('src/app/modules/mobile-app/mobile-app.module').then(m => m.MobileAppModule) },

    { path: '**', component: PageNotFoundComponent, data: { title: 'Page-Not-Found' } },
];

@NgModule({
    // imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {

    // public constructor(private router: Router,
    //     private applicationStateService: ApplicationstateService) {
    // }

    // /**
    //  * this function inject new routes for the given module instead the current routes. the operation happens on the given current routes object so after
    //  * this method a call to reset routes on router should be called with the the current routes object.
    //  * @param currentRoutes
    //  * @param routesToInject
    //  * @param childNameToReplaceRoutesUnder - the module name to replace its routes.
    //  */
    // private injectModuleRoutes(currentRoutes: Routes, routesToInject: Routes, childNameToReplaceRoutesUnder: string): void {
    //     for (let i = 0; i < currentRoutes.length; i++) {
    //         if (currentRoutes[i].loadChildren != null &&
    //             currentRoutes[i].loadChildren.toString().indexOf(childNameToReplaceRoutesUnder) != -1) {
    //             // we found it. taking the route prefix
    //             let prefixRoute: string = currentRoutes[i].path;
    //             // first removing the module line
    //             currentRoutes.splice(i, 1);
    //             // now injecting the new routes
    //             // we need to add the prefix route first
    //             this.addPrefixToRoutes(routesToInject, prefixRoute);
    //             for (let route of routesToInject) {
    //                 currentRoutes.push(route);
    //             }
    //             // since we found it we can break the injection
    //             return;
    //         }

    //         if (currentRoutes[i].children != null) {
    //             this.injectModuleRoutes(currentRoutes[i].children, routesToInject, childNameToReplaceRoutesUnder);
    //         }
    //     }
    // }

    // private addPrefixToRoutes(routes: Routes, prefix: string) {
    //     for (let i = 0; i < routes.length; i++) {
    //         routes[i].path = prefix + '/' + routes[i].path;
    //     }
    // }

    // changeRoute() {
    //     if (this.applicationStateService.getIsMobileResolution()) {
    //         this.router.resetConfig(mobile_routes);
    //     } else {
    //         this.router.resetConfig(desktop_routes);

    //     }
    // }
}
