# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] 2024-12-11

### Changed

* [BREAKING] Drop node 14 and 16 support (should not actually break anything).
* [Deps] Drop c8 / pta / zora for tests, instead rely on built-in nodejs/bun test library, this has no dev dependency anymore.
* [Documentation] improve jsdoc to contains output type definition.

## [1.0.4] 2022-02-01

### Fixed

* properly protects computation from floating precision losses (sometimes causing NaN errors)

### Changed

* [Deps] updated dev-dependencies

## [1.0.3] 2021-12-11

### Changed

* [Documentation] Add nodejs 14 requirements in `README.md`, `package.json`.
* [Documentation] Add npm and github URLs in `README.md`.

### Internal

* [Deps] Update pta and zora dev-dependencies.
* [Coverage] Removed redundant/useless if.
* [Coverage] Completed existing tests to reach 100% coverage.

## [1.0.2] - 2021-10-17

### Fixed

* Fixed max-value being initialised with a bad value.

## [1.0.1] - 2021-10-17 : Initial (real) release

## [1.0.0] - 2021-10-16 : Initial release
