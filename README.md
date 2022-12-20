# Allowance-Automation

This project exposes a couple of API's that allow the user to input any address and get the list of addresses and their allowances that the given address has approved them to spend.

The two API's are:

1. `getAllowance()`
2. `UpdateAllowance()`

## getAllowance
This api takes the address as a parameter and returns the list of addresses along with their approved amount to spend 


## UpdateAllowance
This api takes the private key of the given address and updates the allowances of all the addreses present in the list returned by `getAllowance()` to 0.

## Usage
to run the app:

```bash
node scripts/api.js
```

if that doesent work
```bash
node node --experimental-json-modules api.js
```
