# 1.3.2

-   fixed to work with node 12

# 1.3.1

-   updated cross-fetch lib to 3.1.5
-   updated runtypes lib to 6.5.1

# 1.3.0

-   Added @trezor/utils dependency.
-   Add possibility to fetch binary from local filesystem (in nodejs env)

# 1.2.1

-   cross-fetch updated to 3.0.6

# 1.2.0

-   added condition for stripping firmware binary header based on `trezorlib` (python-trezor).
-   exposed `modifyFirmware` function for this binary modification.
-   removed unused `baseUrlBeta` params from `getBinary` function.

# 1.1.0

-   always provide latest release together with safe release

# 1.0.8

-   bump intermediary fw

# 1.0.7

-   intermediary fw

# 1.0.5

-   refactored types declarations (general cleanup).
-   fix: types properly exported from the library.

# 1.0.0

-   first release
