# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.10.5] - 2023-11-11
### :bug: Bug Fixes
- [`26050af`](https://github.com/turfaa/apotek-dashboard/commit/26050af89721a961d7abbeb856a56cd2c7414fe7) - **search-hook**: Don't fetch from server when client-only search is supported *(commit by [@turfaa](https://github.com/turfaa))*


## [v0.10.4] - 2023-11-10
### :bug: Bug Fixes
- [`935a7a3`](https://github.com/turfaa/apotek-dashboard/commit/935a7a31383465fe8e205f2c83ace8078cf26628) - use transitions when changing url *(commit by [@turfaa](https://github.com/turfaa))*
- [`af22d46`](https://github.com/turfaa/apotek-dashboard/commit/af22d46afec68b254d31c6dfbbde8e445989af01) - **stock-opname-summary**: Add date column *(commit by [@turfaa](https://github.com/turfaa))*
- [`f496fcd`](https://github.com/turfaa/apotek-dashboard/commit/f496fcda97a2bbf7813689ec9de63665fbfe27f9) - **date-range-picker**: Add yesterday query *(commit by [@turfaa](https://github.com/turfaa))*


## [v0.10.3] - 2023-11-09
### :bug: Bug Fixes
- [`f846868`](https://github.com/turfaa/apotek-dashboard/commit/f8468688335a047e16dd68ae5cf2bd457ab4956c) - Use Asia/Jakarta timezone *(commit by [@turfaa](https://github.com/turfaa))*


## [v0.10.2] - 2023-11-06
### :bug: Bug Fixes
- [`0459042`](https://github.com/turfaa/apotek-dashboard/commit/0459042648479d883d79aa8c1e1a283e8d809ae5) - Revamp STAFF privileges *(commit by [@turfaa](https://github.com/turfaa))*


## [v0.10.1] - 2023-11-05
### :bug: Bug Fixes
- [`f1f33d5`](https://github.com/turfaa/apotek-dashboard/commit/f1f33d53779a50d33be6fecfef87afdab0833994) - Minor improvements on Invoice Calculator *(commit by [@turfaa](https://github.com/turfaa))*

### :wrench: Chores
- [`2fd3047`](https://github.com/turfaa/apotek-dashboard/commit/2fd30475d7c0dc891f387f8b6546944c34f821c9) - Fully use import '@' instead of './' *(commit by [@turfaa](https://github.com/turfaa))*


## [v0.10.0] - 2023-11-04
### :sparkles: New Features
- [`6f942b5`](https://github.com/turfaa/apotek-dashboard/commit/6f942b56a5846dca9e7bdb3f68140560e2bcfeb3) - Add invoice calculator page *(commit by [@turfaa](https://github.com/turfaa))*

### :wrench: Chores
- [`8bc75d2`](https://github.com/turfaa/apotek-dashboard/commit/8bc75d29a26d01ccc59f6064d8d8dc87edf8f588) - Use shared rupiah object *(commit by [@turfaa](https://github.com/turfaa))*


## [v0.9.1] - 2023-10-31
### :bug: Bug Fixes
- [`85e7752`](https://github.com/turfaa/apotek-dashboard/commit/85e7752a085ce6b323ab1e8cd22617a0b2e37c7b) - **tabs**: Hide tabs in print mode *(commit by [@turfaa](https://github.com/turfaa))*


## [v0.9.0] - 2023-10-31
### :sparkles: New Features
- [`88a0ec4`](https://github.com/turfaa/apotek-dashboard/commit/88a0ec45d70c6e52b0d59a382102d148585a62f7) - **drugs-to-stock-opname**: Support both sales-based and conservative mode for fetching drugs to stock opname *(commit by [@turfaa](https://github.com/turfaa))*
- [`55735cc`](https://github.com/turfaa/apotek-dashboard/commit/55735cca9dd13f1b7932cb67ed7979d271f590f7) - Use GeistSans font *(commit by [@turfaa](https://github.com/turfaa))*

### :bug: Bug Fixes
- [`920a9b4`](https://github.com/turfaa/apotek-dashboard/commit/920a9b4d35bc5883872b0f6ada96f49f1f57030c) - **hooks**: Use useMemo and directly get date range from useSearchParams *(commit by [@turfaa](https://github.com/turfaa))*


## [v0.8.0] - 2023-10-26
### :sparkles: New Features
- [`019573f`](https://github.com/turfaa/apotek-dashboard/commit/019573f8f80a23acd679de12ad8e796babce9bf1) - **sold-drugs**: Add total price in the footer *(commit by [@turfaa](https://github.com/turfaa))*
- [`af5a881`](https://github.com/turfaa/apotek-dashboard/commit/af5a881456122ce7c1d8a386020343b60764d711) - **sale-statistics**: Support changing date range for sale statistics *(commit by [@turfaa](https://github.com/turfaa))*


## [v0.7.2] - 2023-10-25
### :bug: Bug Fixes
- [`92bc00f`](https://github.com/turfaa/apotek-dashboard/commit/92bc00f6d62d7809ed8d55639a2d225b46503920) - **date-range-picker**: Fix date range API url *(commit by [@turfaa](https://github.com/turfaa))*

### :wrench: Chores
- [`580854f`](https://github.com/turfaa/apotek-dashboard/commit/580854fcff864d6e23b86cdf2194a3a7008a4cd4) - **date-range-picker**: Add new line before push *(commit by [@turfaa](https://github.com/turfaa))*


## [v0.7.1] - 2023-10-25
### :bug: Bug Fixes
- [`0431fc3`](https://github.com/turfaa/apotek-dashboard/commit/0431fc38cb369cc9cfc524f8bae4486429b730ff) - **date-range-picker**: Allow one-day range *(commit by [@turfaa](https://github.com/turfaa))*


## [v0.7.0] - 2023-10-24
### :sparkles: New Features
- [`f74c995`](https://github.com/turfaa/apotek-dashboard/commit/f74c995a1eb7dd7155cec832149dca1e498fdbe5) - Support using date range *(commit by [@turfaa](https://github.com/turfaa))*

### :wrench: Chores
- [`145e08f`](https://github.com/turfaa/apotek-dashboard/commit/145e08ff85bc361d72a471414308a52be8e0647a) - Remove './' usage *(commit by [@turfaa](https://github.com/turfaa))*
- [`64b8a50`](https://github.com/turfaa/apotek-dashboard/commit/64b8a502efb01ff869490730066c138c9bc0f394) - Update all dependencies *(commit by [@turfaa](https://github.com/turfaa))*


## [v0.6.1] - 2023-10-24
### :bug: Bug Fixes
- [`033b6c9`](https://github.com/turfaa/apotek-dashboard/commit/033b6c9f80b362484b4375e9b2cec6cd78e2e090) - **stock-opname-report**: Use English for tab names *(commit by [@turfaa](https://github.com/turfaa))*


## [v0.6.0] - 2023-10-23
### :sparkles: New Features
- [`8cf1d7b`](https://github.com/turfaa/apotek-dashboard/commit/8cf1d7b6a4dbb0c563c62de0fa1b72eed15c68a5) - Remove dependencies to Sun Oct 22 05:50:16 WIB 2023 fields *(commit by [@turfaa](https://github.com/turfaa))*
- [`fd44807`](https://github.com/turfaa/apotek-dashboard/commit/fd448071bb51a86446cbf3b450bf70cfc119b5bf) - **stock-opname-summary**: Show stock opname summaries in the stock opname report page *(commit by [@turfaa](https://github.com/turfaa))*

### :bug: Bug Fixes
- [`c0b4263`](https://github.com/turfaa/apotek-dashboard/commit/c0b426330565d8eb18a0c99f00177be21a4df630) - **date-picker**: Read date query param directly from DatePicker *(commit by [@turfaa](https://github.com/turfaa))*
- [`92bea35`](https://github.com/turfaa/apotek-dashboard/commit/92bea35a2ecc27caed7801be056d9983ba55ce12) - Fetch in tables instead of in the parent page *(commit by [@turfaa](https://github.com/turfaa))*


## [v0.5.1] - 2023-10-19
### :bug: Bug Fixes
- [`aab23de`](https://github.com/turfaa/apotek-dashboard/commit/aab23de9fedc23616550926f37c1498ba7798dbd) - Update all dependencies to latest version *(commit by [@turfaa](https://github.com/turfaa))*


## [v0.5.0] - 2023-10-19
### :sparkles: New Features
- [`25d279a`](https://github.com/turfaa/apotek-dashboard/commit/25d279aaefa56d78e011e5a59976fa4da73747d2) - Support printing in all pages for authorized users *(commit by [@turfaa](https://github.com/turfaa))*


## [v0.4.4] - 2023-10-10
### :bug: Bug Fixes
- [`955b994`](https://github.com/turfaa/apotek-dashboard/commit/955b994f6940fab3ab1a8bf66589f96cfe70d3a4) - Use icon.png in navbar fallback *(commit by [@turfaa](https://github.com/turfaa))*
- [`0757345`](https://github.com/turfaa/apotek-dashboard/commit/0757345eb933873543fdc1b801ef236a29b42877) - revamp price list page *(commit by [@turfaa](https://github.com/turfaa))*


## [v0.4.3] - 2023-10-10
### :bug: Bug Fixes
- [`17df2c5`](https://github.com/turfaa/apotek-dashboard/commit/17df2c5a364da201a3261dbe8166a3592e5b6469) - **Dockerfile**: Remove COPY /app/public because the folder is deleted *(commit by [@turfaa](https://github.com/turfaa))*


## [v0.4.2] - 2023-10-10
### :sparkles: New Features
- [`c2aa860`](https://github.com/turfaa/apotek-dashboard/commit/c2aa86000bad7a95626ac8516a85fd9f80e41ff9) - Add authorization *(commit by [@turfaa](https://github.com/turfaa))*

### :bug: Bug Fixes
- [`bf313d0`](https://github.com/turfaa/apotek-dashboard/commit/bf313d058337fabaf1e1c2172e6f09a07eb78fc8) - Add metadata *(commit by [@turfaa](https://github.com/turfaa))*


## [v0.4.1] - 2023-10-09
### :bug: Bug Fixes
- [`b442d7c`](https://github.com/turfaa/apotek-dashboard/commit/b442d7c1f5a7adbf20daff3e5ebf70f3dc29065d) - use apotek-api.ed.id in .env *(commit by [@turfaa](https://github.com/turfaa))*


## [v0.3.0] - 2023-10-09
### :bug: Bug Fixes
- [`4703c1e`](https://github.com/turfaa/apotek-dashboard/commit/4703c1e42023e900ce9b5cb62f9e50b61a154b52) - Use next build, but run in self-hosted runner *(commit by [@turfaa](https://github.com/turfaa))*


## [v0.2.5] - 2023-10-09
### :bug: Bug Fixes
- [`35ff8b6`](https://github.com/turfaa/apotek-dashboard/commit/35ff8b6347f85a433d4519e5762bf16bc9f8eab7) - use experimental-compile *(commit by [@turfaa](https://github.com/turfaa))*


## [v0.2.4] - 2023-10-09
### :bug: Bug Fixes
- [`2a0ffe1`](https://github.com/turfaa/apotek-dashboard/commit/2a0ffe138ffe17319268a6765d28057a22231649) - use compile-incremental *(commit by [@turfaa](https://github.com/turfaa))*


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
[v0.2.4]: https://github.com/turfaa/apotek-dashboard/compare/v0.2.3...v0.2.4
[v0.2.5]: https://github.com/turfaa/apotek-dashboard/compare/v0.2.4...v0.2.5
[v0.3.0]: https://github.com/turfaa/apotek-dashboard/compare/v0.2.6...v0.3.0
[v0.4.1]: https://github.com/turfaa/apotek-dashboard/compare/v0.4.0...v0.4.1
[v0.4.2]: https://github.com/turfaa/apotek-dashboard/compare/v0.4.1...v0.4.2
[v0.4.3]: https://github.com/turfaa/apotek-dashboard/compare/v0.4.2...v0.4.3
[v0.4.4]: https://github.com/turfaa/apotek-dashboard/compare/v0.4.3...v0.4.4
[v0.5.0]: https://github.com/turfaa/apotek-dashboard/compare/v0.4.4...v0.5.0
[v0.5.1]: https://github.com/turfaa/apotek-dashboard/compare/v0.5.0...v0.5.1
[v0.6.0]: https://github.com/turfaa/apotek-dashboard/compare/v0.5.1...v0.6.0
[v0.6.1]: https://github.com/turfaa/apotek-dashboard/compare/v0.6.0...v0.6.1
[v0.7.0]: https://github.com/turfaa/apotek-dashboard/compare/v0.6.1...v0.7.0
[v0.7.1]: https://github.com/turfaa/apotek-dashboard/compare/v0.7.0...v0.7.1
[v0.7.2]: https://github.com/turfaa/apotek-dashboard/compare/v0.7.1...v0.7.2
[v0.8.0]: https://github.com/turfaa/apotek-dashboard/compare/v0.7.2...v0.8.0
[v0.9.0]: https://github.com/turfaa/apotek-dashboard/compare/v0.8.0...v0.9.0
[v0.9.1]: https://github.com/turfaa/apotek-dashboard/compare/v0.9.0...v0.9.1
[v0.10.0]: https://github.com/turfaa/apotek-dashboard/compare/v0.9.1...v0.10.0
[v0.10.1]: https://github.com/turfaa/apotek-dashboard/compare/v0.10.0...v0.10.1
[v0.10.2]: https://github.com/turfaa/apotek-dashboard/compare/v0.10.1...v0.10.2
[v0.10.3]: https://github.com/turfaa/apotek-dashboard/compare/v0.10.2...v0.10.3
[v0.10.4]: https://github.com/turfaa/apotek-dashboard/compare/v0.10.3...v0.10.4
[v0.10.5]: https://github.com/turfaa/apotek-dashboard/compare/v0.10.4...v0.10.5