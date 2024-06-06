# Plauti Record Validation API Client

This is a JavaScript API Client for consuming the Record Validation API. The following endpoints have been implemented:

- [fetchMyCredits](#Usage)
- [validateEmail](#validateEmail)
- [validatePhone](#validatePhone)
- [validateAddress](#validateAddress)
- [findAddress](#findAddress)
- [retrieveAddress](#retrieveaddress)

## Usage

Configuring the client and using the `fetchMyCredits` method.

````javascript
const rvClient = createRvClient(
    'ORG_ID',
    'PUBLIC_API_KEY',
    'PRIVATE_API_KEY'
);
// There is also an optional fourth parameter if it's provided the apiBaseUrl is overriden.
// This can be used to use a server located in a different region.
try {
  const result = await rvClient.fetchMyCredits();
  // returns
  const creditInfoResponse = {
    credit: 'number', // number of credits for current api consumer
    status: {
      code: 'string',
      message: 'string',
      credit: 'boolean',
      addressValid: 'boolean',
    }
  };
} catch (e) {
  // handle possible error
}
````

### validateEmail

Validates en email address.

````javascript
const emailToValidate = 'validate.me@plaut.com';
const note = 'note that is written in the transaction log'; // optional - defaults to ''
await rvClient.validateEmail(emailToValidate, note);
````

<details>
<summary>View response structure</summary>

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

</details>

### validatePhone

Validates a phone number and returns the type.

````javascript
const phoneNumberAsString = '+31-24-3611111';
const country = 'NL' | 'Netherlands' | 'Pays-Bas'; // country
const format = 'E164' | 'NATIONAL' | 'INTERNATIONAL' | 'RFC3966'; // optional - defaults to E164
const note = 'note that is written in the transaction log'; // optional - defaults to ''
await rvClient.validatePhone(phoneNumberAsString, country, format, note);
````

<details>
<summary>View response structure</summary>

````javascript
const validatePhoneResponse = {
  ok: 'boolean',
  errorMessage: 'string',
  errorCode: 'string',
  output: {
    phoneNumber: 'string',
    countryCode: 'string',
    phoneType: 'FIXED_LINE' | 'MOBILE' | 'FIXED_LINE_OR_MOBILE' | 'TOLL_FREE' | 'PREMIUM_RATE' | 'SHARED_COST' |
        'VOIP' | 'PERSONAL_NUMBER' | 'PAGER' | 'UAN' | 'VOICEMAIL' | 'UNKNOWN',
    status: {
      code: 'string',
      message: 'string',
      credit: 'boolean',
    },
    advice: 'GREEN' | 'AMBER' | 'RED'
  }
};
````

</details>

### validateAddress

Validates an address and returns a list of possible matches.

````javascript
const street = 'Jansbuitensingel';
const housenumber = '6';
const housenumberAddition = '';
const state = 'Gelderland';
const city = 'Arnhem';
const postalCode = '8611AA';
const country = 'Netherlands';
const ishouseNumber = false; // optional - defaults to false - specifies if the housenumber should be separated from the street
const isHouseNumberAddition = false; // optional - defaults to false - specifies if the addition should be separated from the housebumber
const convertToSuggestionStatus = true; // optional - defaults to true - specifies if TODO
const addressSeparator = '\n' | ', '; // optional - defaults to ', ' - specifies what separtor is used for the fullAddress
const geocode = false; // optional - defaults to false - specifies if geocode information should be returned
const note = 'note that is written in the transaction log'; // optional - defaults to ''
await rvClient.validateAddress(
    street,
    housenumber,
    housenumberAddition,
    state,
    city,
    postalCode,
    country,
    ishouseNumber,
    isHouseNumberAddition,
    convertToSuggestionStatus,
    addressSeparator,
    geocode,
    note
);
````

<details>
<summary>View response structure</summary>

````javascript
  const validateAddressResponse = {
  ok: 'boolean',
  errorMessage: 'string',
  errorCode: 'string',
  output: {
    addresses: [
      {
        identifier: 'string',
        fullAddress: 'string',
        Street: 'string',
        houseNumber: null | 'string',
        houseNumberAddition: null | 'string',
        state: 'string',
        stateCode: 'string',
        postalCode: 'string',
        city: 'string',
        country: 'string',
        countryCode: 'string',
        latitude: null | 'string',
        longitude: null | 'string',
        geoStatus: null | {
          code: 'string',
          message: 'string',
          credit: 'boolean',
        },
        status: {
          code: 'string',
          message: 'string',
          credit: 'boolean',
        },
        advice: 'GREEN' | 'AMBER' | 'RED'
      }
    ],
    status: {
      code: 'string',
      message: 'string',
      credit: 'boolean',
    },
    advice: 'GREEN' | 'AMBER' | 'RED'
  }
};
````

</details>

### findAddress

Use this method to get suggestions and use the container value from a suggestion to get more detailed suggestions.

For example the first request was executed with container set to `''` which returned a suggestion with the
container `'NL|AV|DUT|ARNHEM-JANSBUITENSINGEL'`.
The second request would then use this as the value for container.

````javascript
const address = 'Jansbuitensingel 6';
const country = 'Netherlands';
const container = ''; // used this parameter to get more detailed suggestions
const addressSeparator = '\n' | ', '; // optional - defaults to ', ' - specifies what separtor is used for the fullAddress
const note = 'note that is written in the transaction log'; // optional - defaults to ''
await rvClient.findAddress(
    address,
    country,
    container,
    addressSeparator,
    note
);
````

<details>
<summary>View response structure</summary>

````javascript
const findAddressResponse = {
  ok: 'boolean',
  errorMessage: 'string',
  errorCode: 'string',
  output: {
    suggestions: [
      {
        container: 'string',
        address: 'string',
        description: 'string',
        type: 'string',
        highlight: 'string',
      }
    ],
    status: {
      code: 'string',
      message: 'string',
      credit: 'boolean',
    },
    advice: 'GREEN' | 'AMBER' | 'RED'
  }
};
````

</details>

### retrieveAddress

Use the container value from the previous method to get the complete address information.

````javascript
const container = 'NL|AV|DUT|ARNHEM-JANSBUITENSINGEL';
const ishouseNumber = false; // optional - defaults to false - specifies if the housenumber should be separated from the street
const isHouseNumberAddition = false; // optional - defaults to false - specifies if the addition should be separated from the housebumber
const addressSeparator = '\n' | ', '; // optional - defaults to ', ' - specifies what separtor is used for the fullAddress
const geocode = false; // optional - defaults to false - specifies if geocode information should be returned
const note = 'note that is written in the transaction log'; // optional - defaults to ''
await rvClient.retrieveAddress(
    container,
    ishouseNumber,
    isHouseNumberAddition,
    addressSeparator,
    geocode,
    note
);
````

<details>
<summary>View response structure</summary>

````javascript
const retrieveAddressResponse = {
  ok: 'boolean',
  errorMessage: 'string',
  errorCode: 'string',
  output: {
    address: {
      identifier: 'string',
      fullAddress: 'string',
      Street: 'string',
      houseNumber: null | 'string',
      houseNumberAddition: null | 'string',
      state: 'string',
      stateCode: 'string',
      postalCode: 'string',
      city: 'string',
      country: 'string',
      countryCode: 'string',
      latitude: null | 'string',
      longitude: null | 'string',
      geoStatus: null | {
        code: 'string',
        message: 'string',
        credit: 'boolean',
      },
      status: {
        code: 'string',
        message: 'string',
        credit: 'boolean',
      },
      advice: 'GREEN' | 'AMBER' | 'RED'
    },
    status: {
      code: 'string',
      message: 'string',
      credit: 'boolean',
    },
    advice: 'GREEN' | 'AMBER' | 'RED'
  }
};
````

</details>
