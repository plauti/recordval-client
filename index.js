const createRvClient = (
  orgId,
  publicKey,
  privateKey,
  apiBaseUrl = "https://jarvis.plauti.com/v3",
  orgType = "SF"
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
      "Provide a publicKey and privateKey to create a new rv api client. " +
        "These can be provided to you by contacting the Plauti support."
    );
  }

  const pemToArrayBuffer = (pem) => {
    try {
      // Remove the PEM header and footer
      const b = pem
        .replace(/-----(BEGIN|END) [A-Z ]+-----/g, "")
        .replace(/\s+/g, "");
      const binaryString = atob(b);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    } catch (error) {
      console.error("Error processing private key:", error);
      throw error;
    }
  };

  const importPrivateKey = async (privateKeyBuffer) => {
    try {
      const key = await crypto.subtle.importKey(
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
    } catch (error) {
      console.error("Key import error:", error);
      throw error;
    }
  };

  const encodePayload = (payload) => {
    const encoder = new TextEncoder();
    return encoder.encode(payload);
  };

  const sign = async (privateKey, encodedPayload) => {
    const signature = await crypto.subtle.sign(
      {
        name: "RSASSA-PKCS1-v1_5",
      },
      privateKey,
      encodedPayload
    );

    return signature;
  };

  const toHex = (data) => {
    return Array.from(new Uint8Array(data))
      .map((b) => ("00" + b.toString(16)).slice(-2))
      .join("");
  };

  const createSignature = async (payload, privateKeyPem) => {
    try {
      const privateKeyBuffer = pemToArrayBuffer(privateKeyPem);
      const importedPrivateKey = await importPrivateKey(privateKeyBuffer);
      const encodeData = encodePayload(payload);
      const signature = await sign(importedPrivateKey, encodeData);
      const hexSignature = toHex(signature);
      return hexSignature;
    } catch (error) {
      console.error("Signature creation error:", error);
      throw error;
    }
  };

  const getRequestOptions = async () => {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const signaturePayload = `${orgType}:${orgId}:${timestamp}`;
      const hash = await createSignature(signaturePayload, privateKey);

      const headers = {
        "x-jarvis-timestamp": timestamp,
        "x-jarvis-apikey": publicKey,
        "x-jarvis-signature": hash,
        "x-jarvis-orgid": orgId,
        "x-jarvis-orgtype": orgType,
        "Content-Type": "application/json",
      };

      return { headers };
    } catch (error) {
      console.error("Error creating request options:", error);
      throw error;
    }
  };

  return {
    async fetchMyCredits() {
      const requestOptions = await getRequestOptions();
      return fetch(myCreditsEndpoint, requestOptions);
    },
    async validateEmail(emailAddress, note = "") {
      const requestOptions = await getRequestOptions();
      requestOptions.method = "POST";
      requestOptions.body = JSON.stringify({
        emailAddress,
        note,
      };
      return fetch(emailValidateEndpoint, requestOptions);
    },
    async validatePhone(phoneNumber, country, format = "E164", note = "") {
      const requestOptions = await getRequestOptions();
      requestOptions.method = "POST";
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
      addressSeparator = ", ",
      geocode = false,
      note = ""
    ) {
      const requestOptions = await getRequestOptions();
      requestOptions.method = "POST";
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
      addressSeparator = ", ",
      note = ""
    ) {
      const requestOptions = await getRequestOptions();
      requestOptions.method = "POST";
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
      addressSeparator = ", ",
      geocode = false,
      note = ""
    ) {
      const requestOptions = await getRequestOptions();
      requestOptions.method = "POST";
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

module.exports = {
  createRvClient,
};
