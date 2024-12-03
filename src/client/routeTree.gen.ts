/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './route/__root'

// Create Virtual Routes

const LoginLazyImport = createFileRoute('/login')()
const IndexLazyImport = createFileRoute('/')()
const ScrapsScrapIdLazyImport = createFileRoute('/scraps/$scrapId')()

// Create/Update Routes

const LoginLazyRoute = LoginLazyImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./route/login.lazy').then((d) => d.Route))

const IndexLazyRoute = IndexLazyImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./route/index.lazy').then((d) => d.Route))

const ScrapsScrapIdLazyRoute = ScrapsScrapIdLazyImport.update({
  id: '/scraps/$scrapId',
  path: '/scraps/$scrapId',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./route/scraps/$scrapId.lazy').then((d) => d.Route),
)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginLazyImport
      parentRoute: typeof rootRoute
    }
    '/scraps/$scrapId': {
      id: '/scraps/$scrapId'
      path: '/scraps/$scrapId'
      fullPath: '/scraps/$scrapId'
      preLoaderRoute: typeof ScrapsScrapIdLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '/login': typeof LoginLazyRoute
  '/scraps/$scrapId': typeof ScrapsScrapIdLazyRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '/login': typeof LoginLazyRoute
  '/scraps/$scrapId': typeof ScrapsScrapIdLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexLazyRoute
  '/login': typeof LoginLazyRoute
  '/scraps/$scrapId': typeof ScrapsScrapIdLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/login' | '/scraps/$scrapId'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/login' | '/scraps/$scrapId'
  id: '__root__' | '/' | '/login' | '/scraps/$scrapId'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  LoginLazyRoute: typeof LoginLazyRoute
  ScrapsScrapIdLazyRoute: typeof ScrapsScrapIdLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  LoginLazyRoute: LoginLazyRoute,
  ScrapsScrapIdLazyRoute: ScrapsScrapIdLazyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/login",
        "/scraps/$scrapId"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/login": {
      "filePath": "login.lazy.tsx"
    },
    "/scraps/$scrapId": {
      "filePath": "scraps/$scrapId.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
