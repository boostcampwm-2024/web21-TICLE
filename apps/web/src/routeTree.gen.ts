/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root';
import { Route as DashboardImport } from './routes/dashboard';
import { Route as IndexImport } from './routes/index';
import { Route as TicleTicleIdImport } from './routes/ticle/$ticleId';
import { Route as DashboardOpenImport } from './routes/dashboard/open';
import { Route as DashboardApplyImport } from './routes/dashboard/apply';

// Create/Update Routes

const DashboardRoute = DashboardImport.update({
  id: '/dashboard',
  path: '/dashboard',
  getParentRoute: () => rootRoute,
} as any);

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any);

const TicleTicleIdRoute = TicleTicleIdImport.update({
  id: '/ticle/$ticleId',
  path: '/ticle/$ticleId',
  getParentRoute: () => rootRoute,
} as any);

const DashboardOpenRoute = DashboardOpenImport.update({
  id: '/open',
  path: '/open',
  getParentRoute: () => DashboardRoute,
} as any);

const DashboardApplyRoute = DashboardApplyImport.update({
  id: '/apply',
  path: '/apply',
  getParentRoute: () => DashboardRoute,
} as any);

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/';
      path: '/';
      fullPath: '/';
      preLoaderRoute: typeof IndexImport;
      parentRoute: typeof rootRoute;
    };
    '/dashboard': {
      id: '/dashboard';
      path: '/dashboard';
      fullPath: '/dashboard';
      preLoaderRoute: typeof DashboardImport;
      parentRoute: typeof rootRoute;
    };
    '/dashboard/apply': {
      id: '/dashboard/apply';
      path: '/apply';
      fullPath: '/dashboard/apply';
      preLoaderRoute: typeof DashboardApplyImport;
      parentRoute: typeof DashboardImport;
    };
    '/dashboard/open': {
      id: '/dashboard/open';
      path: '/open';
      fullPath: '/dashboard/open';
      preLoaderRoute: typeof DashboardOpenImport;
      parentRoute: typeof DashboardImport;
    };
    '/ticle/$ticleId': {
      id: '/ticle/$ticleId';
      path: '/ticle/$ticleId';
      fullPath: '/ticle/$ticleId';
      preLoaderRoute: typeof TicleTicleIdImport;
      parentRoute: typeof rootRoute;
    };
  }
}

// Create and export the route tree

interface DashboardRouteChildren {
  DashboardApplyRoute: typeof DashboardApplyRoute;
  DashboardOpenRoute: typeof DashboardOpenRoute;
}

const DashboardRouteChildren: DashboardRouteChildren = {
  DashboardApplyRoute: DashboardApplyRoute,
  DashboardOpenRoute: DashboardOpenRoute,
};

const DashboardRouteWithChildren = DashboardRoute._addFileChildren(DashboardRouteChildren);

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute;
  '/dashboard': typeof DashboardRouteWithChildren;
  '/dashboard/apply': typeof DashboardApplyRoute;
  '/dashboard/open': typeof DashboardOpenRoute;
  '/ticle/$ticleId': typeof TicleTicleIdRoute;
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute;
  '/dashboard': typeof DashboardRouteWithChildren;
  '/dashboard/apply': typeof DashboardApplyRoute;
  '/dashboard/open': typeof DashboardOpenRoute;
  '/ticle/$ticleId': typeof TicleTicleIdRoute;
}

export interface FileRoutesById {
  __root__: typeof rootRoute;
  '/': typeof IndexRoute;
  '/dashboard': typeof DashboardRouteWithChildren;
  '/dashboard/apply': typeof DashboardApplyRoute;
  '/dashboard/open': typeof DashboardOpenRoute;
  '/ticle/$ticleId': typeof TicleTicleIdRoute;
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath;
  fullPaths: '/' | '/dashboard' | '/dashboard/apply' | '/dashboard/open' | '/ticle/$ticleId';
  fileRoutesByTo: FileRoutesByTo;
  to: '/' | '/dashboard' | '/dashboard/apply' | '/dashboard/open' | '/ticle/$ticleId';
  id: '__root__' | '/' | '/dashboard' | '/dashboard/apply' | '/dashboard/open' | '/ticle/$ticleId';
  fileRoutesById: FileRoutesById;
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute;
  DashboardRoute: typeof DashboardRouteWithChildren;
  TicleTicleIdRoute: typeof TicleTicleIdRoute;
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  DashboardRoute: DashboardRouteWithChildren,
  TicleTicleIdRoute: TicleTicleIdRoute,
};

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>();

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/dashboard",
        "/ticle/$ticleId"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/dashboard": {
      "filePath": "dashboard.tsx",
      "children": [
        "/dashboard/apply",
        "/dashboard/open"
      ]
    },
    "/dashboard/apply": {
      "filePath": "dashboard/apply.tsx",
      "parent": "/dashboard"
    },
    "/dashboard/open": {
      "filePath": "dashboard/open.tsx",
      "parent": "/dashboard"
    },
    "/ticle/$ticleId": {
      "filePath": "ticle/$ticleId.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
