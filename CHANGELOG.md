# Changelog

## v2.0.0

### ⚠️ BREAKING CHANGES

* ok, errorCode, errorMessage, and output has been removed from responses, now the response directly returns the validation result.

#### Before:
````javascript
const validateEmailResponse = {
  ok: 'boolean',
  errorMessage: 'string',
  errorCode: 'string',
  output: {
    complete: 'string',
    addressee: 'string',
    domain: 'string',
    free: 'boolean',
    disposable: 'boolean',
    status: {
      code: 'string',
      message: 'string',
      credit: 'boolean',
    },
    advice: 'GREEN' | 'AMBER' | 'RED'
  }
};
````

#### After:
````javascript
const validateEmailResponse = {
  complete: 'string',
  addressee: 'string',
  domain: 'string',
  free: 'boolean',
  disposable: 'boolean',
  status: {
    code: 'string',
    message: 'string',
    credit: 'boolean',
  },
  advice: 'GREEN' | 'AMBER' | 'RED'
};
````