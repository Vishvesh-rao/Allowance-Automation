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
node --experimental-json-modules scripts/api.js
```
### Optimising the range

To optimize the search range according to the required use case refer the `config.js` file.

- change the block offset (`START_BLOCK` and `END_BLOCK`) values to specify the start of the search.
- Modify the `ITERATIONS` value to increase/decrease the search range.

> The maximum range of search in one iteration is 3000 blocks
