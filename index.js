const createRvClient = (
    orgId,
    publicKey,
    privateKey,
    apiBaseUrl = 'https://jarvis-dev.plauti.io/v3', // TODO: Update to prod url once Jarvis is released 
    orgType = 'SF'
) => {
  const myCreditsEndpoint = `${apiBaseUrl}/info/credits`;
  const emailValidateEndpoint = `${apiBaseUrl}/validation/email/validate`;
  const phoneValidateEndpoint = `${apiBaseUrl}/validation/phone/validate`;
  const addressValidateEndpoint = `${apiBaseUrl}/validation/address/validate`;
  const addressFindEndpoint = `${apiBaseUrl}/validation/address/search`;
  const addressRetrieveEndpoint = `${apiBaseUrl}/validation/address/retrieve`;

  if (!publicKey || !privateKey) {
    throw Error(
        'Provide a publicKey and privateKey to create a new rv api client. ' +
        'These can be provided to you by contacting the Plauti support.',
    );
  }

  const pemToArrayBuffer = pem => {
    // Remove the PEM header and footer
    const b = pem.replace(/-----(BEGIN|END) [A-Z ]+-----/g, '').replace(/\s+/g, '');
    const binaryString = window.atob(b);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  const importPrivateKey =  async (privateKeyBuffer) => {
    const key = await window.crypto.subtle.importKey(
      "pkcs8",
      privateKeyBuffer,
      {
          name: "RSASSA-PKCS1-v1_5",
          hash: { name: "SHA-256" },
      },
      true, 
      ["sign"] 
    );

    return key;
  }

  const encodePayload = (payload) => {
    const encoder = new TextEncoder();
    return encoder.encode(payload);
  }

  const sign = async (privateKey, encodedPayload) => {
    const signature = await window.crypto.subtle.sign(
        {
            name: "RSASSA-PKCS1-v1_5",
        },
        privateKey,
        encodedPayload
    );

    return signature;
  }

  const toHex = data => {
    return Array.from(new Uint8Array(data))
    .map(b => ('00' + b.toString(16)).slice(-2))
    .join('');
  }

  const createSignature = async (payload, privateKeyPem) => {
    const privateKeyBuffer = pemToArrayBuffer(privateKeyPem);
    const importedPrivateKey = await importPrivateKey(privateKeyBuffer)
    const encodeData = encodePayload(payload)
    const signature = await sign(importedPrivateKey, encodeData)

    return toHex(signature);
  }

  const getRequestOptions = async () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const signaturePayload = `${orgType}:${orgId}:${timestamp}`
    const hash = await createSignature(signaturePayload, privateKey);

    return {
      'headers': {
        'x-jarvis-timestamp': timestamp,
        'x-jarvis-apikey': publicKey,
        'x-jarvis-signature': hash,
        'x-jarvis-orgid': orgId,
        'x-jarvis-orgtype': orgType,
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
      requestOptions.body = JSON.stringify({
        emailAddress,
        note,
      });
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
        isHouseNumber = false,
        isHouseNumberAddition = false,
        addressSeparator = ', ',
        geocode = false,
        note = '',
    ) {
      const requestOptions = await getRequestOptions();
      requestOptions.method = 'POST';
      requestOptions.body = JSON.stringify({
        container,
        isHouseNumber,
        isHouseNumberAddition,
        addressSeparator,
        geocode,
        note,
      });
      return fetch(addressRetrieveEndpoint, requestOptions);
    },
  };
};