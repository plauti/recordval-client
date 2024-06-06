const createRvClient = (
    orgId,
    publicKey,
    privateKey,
    apiBaseUrl = 'https://dq-api.plauti.io',
) => {
  const myCreditsEndpoint = `${apiBaseUrl}/v1/info/credit`;
  // V1 endpoints are deprecated
  const emailValidateEndpoint = `${apiBaseUrl}/v2/email/validate`;
  const phoneValidateEndpoint = `${apiBaseUrl}/v2/phone/validate`;
  const addressValidateEndpoint = `${apiBaseUrl}/v2/address/validate`;
  const addressFindEndpoint = `${apiBaseUrl}/v2/address/find`;
  const addressRetrieveEndpoint = `${apiBaseUrl}/v2/address/retrieve`;

  if (!publicKey || !privateKey) {
    throw Error(
        'Provide a publicKey and privateKey to create a new rv api client. ' +
        'These can be provided to you by contacting the Plauti support.',
    );
  }

  const sha1 = async (seed) => {
    const enc = new TextEncoder();
    const hash = await crypto.subtle.digest('SHA-1', enc.encode(seed));
    return Array.from(new Uint8Array(hash)).
        map(v => v.toString(16).padStart(2, '0')).
        join('');
  };
  const getRequestOptions = async () => {
    // The number of milliseconds since January 1, 1970, 00:00:00 GMT
    const timestamp = Date.now();
    const hash = await sha1(publicKey + timestamp.toString() + privateKey);
    return {
      'headers': {
        'plauti-dq-time': timestamp.toString(),
        'plauti-dq-apikey': publicKey,
        'plauti-dq-hash': hash,
        'plauti-dq-org': orgId,
        'Content-Type': 'application/json',
      },
    };
  };

  return {
    async fetchMyCredits() {
      const requestOptions = await getRequestOptions();
      return fetch(myCreditsEndpoint, requestOptions);
    },
    async validateEmail(
        emailAddress,
        note = '',
    ) {
      const requestOptions = await getRequestOptions();
      requestOptions.method = 'POST';
      requestOptions.body = {
        emailAddress,
        note,
      };
      return fetch(emailValidateEndpoint, requestOptions);
    },
    async validatePhone(
        phoneNumber,
        country,
        format = 'E164',
        note = '',
    ) {
      const requestOptions = await getRequestOptions();
      requestOptions.method = 'POST';
      requestOptions.body = JSON.stringify({
        phoneNumber,
        country,
        format,
        note,
      });
      return fetch(phoneValidateEndpoint, requestOptions);
    },
    async validateAddress(
        street,
        housenumber,
        housenumberAddition,
        state,
        city,
        postalCode,
        country,
        ishouseNumber = false,
        isHouseNumberAddition = false,
        convertToSuggestionStatus = true,
        addressSeparator = ', ',
        geocode = false,
        note = '',
    ) {
      const requestOptions = await getRequestOptions();
      requestOptions.method = 'POST';
      requestOptions.body = JSON.stringify({
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
        note,
      });
      return fetch(addressValidateEndpoint, requestOptions);
    },
    async findAddress(
        address,
        country,
        container,
        ishouseNumber = false,
        isHouseNumberAddition = false,
        addressSeparator = ', ',
        note = '',
    ) {
      const requestOptions = await getRequestOptions();
      requestOptions.method = 'POST';
      requestOptions.body = JSON.stringify({
        address,
        country,
        container,
        ishouseNumber,
        isHouseNumberAddition,
        addressSeparator,
        note,
      });
      return fetch(addressFindEndpoint, requestOptions);
    },
    async retrieveAddress(
        container,
        ishouseNumber = false,
        isHouseNumberAddition = false,
        addressSeparator = ', ',
        geocode = false,
        note = '',
    ) {
      const requestOptions = await getRequestOptions();
      requestOptions.method = 'POST';
      requestOptions.body = JSON.stringify({
        container,
        ishouseNumber,
        isHouseNumberAddition,
        addressSeparator,
        geocode,
        note,
      });
      return fetch(addressRetrieveEndpoint, requestOptions);
    },
  };
};