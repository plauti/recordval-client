export declare function createRvClient(
  orgId: string,
  publicKey: string,
  privateKey: string,
  apiBaseUrl?: string,
  orgType?: string
): {
  fetchMyCredits(): Promise<{
    credit: number;
    status: {
      code: string;
      message: string;
      credit: boolean;
    };
  }>;
  validateEmail(
    emailAddress: string,
    note?: string
  ): Promise<{
    complete: string;
    addressee: string;
    domain: string;
    free: boolean;
    disposable: boolean;
    status: {
      code: string;
      message: string;
      credit: boolean;
    };
    advice: "GREEN" | "AMBER" | "RED";
  }>;
  validatePhone(
    phoneNumber: string,
    country: string,
    format?: string,
    note?: string
  ): Promise<{
    phoneNumber: string;
    countryCode: string;
    phoneType:
      | "FIXED_LINE"
      | "MOBILE"
      | "FIXED_LINE_OR_MOBILE"
      | "TOLL_FREE"
      | "PREMIUM_RATE"
      | "SHARED_COST"
      | "VOIP"
      | "PERSONAL_NUMBER"
      | "PAGER"
      | "UAN"
      | "VOICEMAIL"
      | "UNKNOWN";
    status: {
      code: string;
      message: string;
      credit: boolean;
    };
    advice: "GREEN" | "AMBER" | "RED";
  }>;
  validateAddress(
    street: string,
    housenumber: string,
    housenumberAddition: string,
    state: string,
    city: string,
    postalCode: string,
    country: string,
    ishouseNumber?: boolean,
    isHouseNumberAddition?: boolean,
    convertToSuggestionStatus?: boolean,
    addressSeparator?: string,
    geocode?: boolean,
    note?: string
  ): Promise<{
    addresses: [
      {
        identifier: string;
        fullAddress: string;
        street: string;
        houseNumber: null | string;
        houseNumberAddition: null | string;
        state: string;
        stateCode: string;
        postalCode: string;
        city: string;
        country: string;
        countryCode: string;
        latitude: null | string;
        longitude: null | string;
        geoStatus: null | {
          code: string;
          message: string;
          credit: boolean;
        };
        status: {
          code: string;
          message: string;
          credit: boolean;
        };
        advice: "GREEN" | "AMBER" | "RED";
      }
    ];
    status: {
      code: string;
      message: string;
      credit: boolean;
    };
    advice: "GREEN" | "AMBER" | "RED";
  }>;
  findAddress(
    address: string,
    country: string,
    container: string,
    ishouseNumber?: boolean,
    isHouseNumberAddition?: boolean,
    addressSeparator?: string,
    note?: string
  ): Promise<{
    suggestions: [
      {
        container: string;
        address: string;
        description: string;
        type: string;
        highlight: string;
      }
    ];
    status: {
      code: string;
      message: string;
      credit: boolean;
    };
  }>;
  retrieveAddress(
    container: string,
    isHouseNumber?: boolean,
    isHouseNumberAddition?: boolean,
    addressSeparator?: string,
    geocode?: boolean,
    note?: string
  ): Promise<{
    address: {
      identifier: string;
      fullAddress: string;
      street: string;
      houseNumber: null | string;
      houseNumberAddition: null | string;
      state: string;
      stateCode: string;
      postalCode: string;
      city: string;
      country: string;
      countryCode: string;
      latitude: null | string;
      longitude: null | string;
      geoStatus: null | {
        code: string;
        message: string;
        credit: boolean;
      };
      status: {
        code: string;
        message: string;
        credit: boolean;
      };
      advice: "GREEN" | "AMBER" | "RED";
    };
    status: {
      code: string;
      message: string;
      credit: boolean;
    };
  }>;
};
