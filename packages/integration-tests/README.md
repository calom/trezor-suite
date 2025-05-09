# @trezor/integration-tests

This package contains Suite web end-to-end tests and components library tests.

## Suite web tests

Suite uses [Cypress](https://docs.cypress.io/guides/overview/why-cypress.html) to run e2e tests. It also uses [trezor-user-env](https://github.com/trezor/trezor-user-env) which is [daily built](https://gitlab.com/satoshilabs/trezor/trezor-user-env/-/pipelines) into a docker image providing all the necessary instrumentation required to run tests (bridge and emulators).

See how to run them [here](../../docs/tests/e2e-web.md).
