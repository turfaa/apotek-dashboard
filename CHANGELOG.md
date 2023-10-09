# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.2.3] - 2023-10-09
### :bug: Bug Fixes
- [`2be3795`](https://github.com/turfaa/apotek-dashboard/commit/2be3795b1848de8c1ab451b0f214cb52922d4f6f) - Use suspense when using client components with useSearchParams() *(commit by [@turfaa](https://github.com/turfaa))*
- [`1bb106b`](https://github.com/turfaa/apotek-dashboard/commit/1bb106b5054ac60bcc9de215ed2cb30db3ac5ec0) - Use streaming pattern for price list page *(commit by [@turfaa](https://github.com/turfaa))*


## [v0.2.2] - 2023-10-08
### :bug: Bug Fixes
- [`0e9fb23`](https://github.com/turfaa/apotek-dashboard/commit/0e9fb2309e4573e42ca8e3d0fe013d678c096e2a) - Call /drugs API from client side to make the first load faster *(commit by [@turfaa](https://github.com/turfaa))*

### :recycle: Refactors
- [`f631481`](https://github.com/turfaa/apotek-dashboard/commit/f6314813fda43d36e80755192f06f98dc864ec7d) - Add <Suspense /> around components that use useSearchParams *(commit by [@turfaa](https://github.com/turfaa))*


## [v0.2.1] - 2023-10-08
### :bug: Bug Fixes
- [`2289ed7`](https://github.com/turfaa/apotek-dashboard/commit/2289ed7e1282432c4276a2110aa0a7b75556a87f) - try to use experimental-compile *(commit by [@turfaa](https://github.com/turfaa))*


## [v0.2.0] - 2023-10-08
### :sparkles: New Features
- [`3bb592a`](https://github.com/turfaa/apotek-dashboard/commit/3bb592a3be91a82fcfc4e5086a51a2dfcd630d47) - Add price list page *(commit by [@turfaa](https://github.com/turfaa))*

### :bug: Bug Fixes
- [`f636a67`](https://github.com/turfaa/apotek-dashboard/commit/f636a675c1f6333d1e105aa494fd2fce207986cb) - upgrade vulnerable packages *(commit by [@turfaa](https://github.com/turfaa))*

### :recycle: Refactors
- [`72044cb`](https://github.com/turfaa/apotek-dashboard/commit/72044cb776967b6b8c4d8a728416d13bd04613d6) - refactor api lib *(commit by [@turfaa](https://github.com/turfaa))*

### :wrench: Chores
- [`07df39e`](https://github.com/turfaa/apotek-dashboard/commit/07df39e00a8349969e8ada454fb0216d8680aa84) - remove editor configs *(commit by [@turfaa](https://github.com/turfaa))*


## [v0.1.5] - 2023-10-03
### :bug: Bug Fixes
- [`d184662`](https://github.com/turfaa/apotek-dashboard/commit/d1846627180a8697936eb10c236cd4d7f2636806) - Don't create `latest` tag from `create-tag.yml` workflow *(commit by [@turfaa](https://github.com/turfaa))*


## [v0.1.3] - 2023-10-02
### :bug: Bug Fixes
- [`9d105f4`](https://github.com/turfaa/apotek-dashboard/commit/9d105f4485685201f578059189d1aad69b170895) - **workflow**: Don't trigger publish-image workflow on 'latest' tag *(commit by [@turfaa](https://github.com/turfaa))*


## [v0.1.2] - 2023-10-02
### :bug: Bug Fixes
- [`d3d67c6`](https://github.com/turfaa/apotek-dashboard/commit/d3d67c648007999a2be0a311edf44b8a72eeb8c3) - **workflow**: Don't publish SHA-based image *(commit by [@turfaa](https://github.com/turfaa))*
- [`83daf81`](https://github.com/turfaa/apotek-dashboard/commit/83daf81e6438686a185832e51d02eb37c7a400e6) - Force dynamic rendering on sold-drugs, drugs-to-stock-opname, and stock-opnames pages *(commit by [@turfaa](https://github.com/turfaa))*


## [v0.1.1] - 2023-10-02
### :bug: Bug Fixes
- [`e830b2d`](https://github.com/turfaa/apotek-dashboard/commit/e830b2dcc7df496fd412e45feeacf66a7a5e8a87) - Add contents-write permission to create-changelog workflow *(commit by [@turfaa](https://github.com/turfaa))*


[v0.1.1]: https://github.com/turfaa/apotek-dashboard/compare/v0.1.0...v0.1.1
[v0.1.2]: https://github.com/turfaa/apotek-dashboard/compare/v0.1.1...v0.1.2
[v0.1.3]: https://github.com/turfaa/apotek-dashboard/compare/v0.1.2...v0.1.3
[v0.1.5]: https://github.com/turfaa/apotek-dashboard/compare/v0.1.4...v0.1.5
[v0.2.0]: https://github.com/turfaa/apotek-dashboard/compare/v0.1.5...v0.2.0
[v0.2.1]: https://github.com/turfaa/apotek-dashboard/compare/v0.2.0...v0.2.1
[v0.2.2]: https://github.com/turfaa/apotek-dashboard/compare/v0.2.1...v0.2.2
[v0.2.3]: https://github.com/turfaa/apotek-dashboard/compare/v0.2.2...v0.2.3