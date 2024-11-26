/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/` | `/(tabs)/feeds` | `/(tabs)/matches` | `/(tabs)/more` | `/(tabs)/overallStats` | `/TeamDetail` | `/_sitemap` | `/allTeams` | `/allvideos` | `/customWebView` | `/feeds` | `/glodenpage` | `/highlightsmainscreen` | `/homepageview` | `/login` | `/magicmomentsmainscreen` | `/matchcenter` | `/matches` | `/modal` | `/more` | `/newsnevents` | `/overallStats` | `/params` | `/paymentfailed` | `/pointsTable` | `/status` | `/successscreen` | `/traildates` | `/weviewpage`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
