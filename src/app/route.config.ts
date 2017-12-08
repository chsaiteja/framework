
/** Framework */
import { FrameworkComponent } from './modules/framework/framework.component';
import { TileDesignComponent } from './modules/framework/layouts/tiles-design/tiles-design.component';

/** Layout configuration Component */
import { LayoutConfigComponent } from './layout-config.component';

import { AuthManager } from './shared/auth/authmanager';

/** Importing route config */
import { routeObj, sectionsArr } from './shared/constants/app.constants';



/** This route config is for tiles design.*/
let tileRoute = {
    path: 'tiles',
    component: TileDesignComponent
};

/** This route config is for parent routes.*/
let parentRoutes = {
    framework: {
        path: 'framework',
        component: FrameworkComponent,
        children: [],
        canActivate: [AuthManager]
    }
};



export function getRouteConfig(framework) {

    try {
        let results: Array<Object> = new Array<Object>();
        results = [];
        let tmpParent = parentRoutes;

        // Initializing frameJSON with default framework parent route.
        let frameJSON;
        frameJSON = tmpParent.framework;

        // Initializing modlist variable with modList array of FrameworkJSON
        let modlist = framework.Result.tabItems;

        let redirectVariable = "";
        let parentRedirect = '', childRedirect = '';

        // Checking whether modlist contains any objects or not.
        if (modlist.length > 0) {

            // Iterating through the modlist to get the framework configuration.
            modlist.forEach(function (obj, inx) {

                parentRoutes[obj.tabId] = {
                    path: obj.tabId + '',
                    component: LayoutConfigComponent,
                    children: []
                }


                childRedirect = '';

                // Newly written code
                if (parentRedirect == '') {
                    parentRedirect = obj.tabId + '';
                }

                if (obj.hasPLP == true) {
                    plpSectionFunction(obj);
                }

                // Checking whether FrameworkJSON's parent route exists in our app parent route configuration.
                if (tmpParent[obj.tabId] !== undefined) {

                    // Emptying the child array values
                    // Initializing inrJSON with empty array.
                    let inrJSON = [];

                    // If the layout is tiles then we have to place tiles route also
                    if (obj.layout === 'tiles') {
                        inrJSON.push(tileRoute);
                    }

                    // Iterating through Child array components of FrameworkJSON
                    obj.compList.forEach(function (objinr, inxinr) {

                        // Checking whether the child component in FrameworkJSON is defined by us or not
                        if (routeObj[objinr.compId] !== undefined && routeObj[objinr.compId].routeConfig !== undefined) {


                            // If it is deifined then we have to push it into newly formed route json
                            inrJSON.push(routeObj[objinr.compId].routeConfig);
                        }


                        if (obj.defaultComp != 'landing' && (routeObj[objinr.compId] != undefined) && childRedirect == '') {
                            childRedirect = routeObj[objinr.compId].routeConfig.path;
                        }
                    });

                    // If the redirection is empty then we are redirecting to tiles route
                    if (childRedirect == '' || obj.defaultComp == 'landing') {
                        childRedirect = 'tiles';
                    }

                    if (obj.defaultComp != 'landing' && obj.defaultComp != "" && obj.defaultComp != null) {
                        inrJSON.push({ path: '', redirectTo: routeObj[obj.defaultComp].routeConfig.path, pathMatch: 'full' });
                        inrJSON.push({ path: '**', redirectTo: routeObj[obj.defaultComp].routeConfig.path, pathMatch: 'full' });
                    }
                    else {
                        inrJSON.push({ path: '', redirectTo: childRedirect, pathMatch: 'full' });
                        inrJSON.push({ path: '**', redirectTo: childRedirect, pathMatch: 'full' });
                    }

                    // After preparing Child JSON we have add this child json to parent route json
                    tmpParent[obj.tabId].children = inrJSON;


                    // Finally pushing this parent route json to framework route as child routs.
                    frameJSON.children.push(tmpParent[obj.tabId]);
                }

            });
            frameJSON.children.push({ path: '', redirectTo: parentRedirect, pathMatch: 'full' });
            frameJSON.children.push({ path: '**', redirectTo: parentRedirect, pathMatch: 'full' });

        }
        results.push(frameJSON);
        results.push({ path: '', redirectTo: 'framework', pathMatch: 'full' });
        results.push({ path: '**', redirectTo: 'framework', pathMatch: 'full' });

        return results;
    } catch (e) {
        console.log('getRouteConfig exception:' + e.message);
    }

}

function plpSectionFunction(plpObject) {
    if (sectionsArr.length != 0) {
        sectionsArr.length = 0;
    }
    plpObject.compList.forEach(function (objinr, inxinr) {
        if (routeObj[objinr.compId] !== undefined && routeObj[objinr.compId].itemConfig !== undefined) {
            sectionsArr.push(
                {
                    routerLink: routeObj[objinr.compId].routeConfig.path,
                    section: routeObj[objinr.compId].itemConfig.section,
                    SectionCode: routeObj[objinr.compId].itemConfig.apiName,
                    title: objinr.displayName,
                    icon: objinr.icon
                }
            )
        }

    });

}
