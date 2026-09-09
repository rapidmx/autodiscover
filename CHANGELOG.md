# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0-beta.0] - 2026-09-09

### Added
- Added changelog, contributing guide, contributors

### Changed
- Initial commit
- Upgraded all dependencies
- Updated CI workflows
- Updated claude commit instructions
- Register a DnsResolver test double so DomainVerificationJob starts cleanly
- restapi's unreleased next version adds a pluggable DnsResolver interface
- (Domain TXT-record verification), injected by DomainVerificationJob, which
- the shared test/server-mongo and test/server-sql fixture apps boot
- unconditionally alongside every other background service. Without a
- registered double, that job failed to start on every integration test run.
- Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>

[Unreleased]: https://github.com/RapidMX/autodiscover/compare/v1.0.0-beta.0...HEAD
[1.0.0-beta.0]: https://github.com/RapidMX/autodiscover/releases/tag/v1.0.0-beta.0
