/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Room {
  id?: number;
  name?: string;
  description?: string;
  capacity?: number;
  imageUrl?: string | null;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Meeting Room Booking API
 * @version 1.0.0
 *
 * API documentation for the Meeting Room Booking System
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Create a new user account with the provided details
     *
     * @tags Authentication
     * @name PostApiAuthRegister
     * @summary Register a new user
     * @request POST:/api/auth/register
     */
    postApiAuthRegister: (
      data: {
        username: string;
        password: string;
        email: string;
        firstName: string;
        lastName: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/auth/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Authenticate a user and return a JWT token
     *
     * @tags Authentication
     * @name PostApiAuthLogin
     * @summary User login
     * @request POST:/api/auth/login
     */
    postApiAuthLogin: (
      data: {
        username: string;
        password: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/api/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Create a new room with the provided details and optional image upload
     *
     * @tags Rooms
     * @name PostApiRoomRooms
     * @summary Create a new room
     * @request POST:/api/room/rooms
     */
    postApiRoomRooms: (
      data: {
        name?: string;
        description?: string;
        capacity?: string;
        /** @format binary */
        imageFile?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/room/rooms`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * @description Retrieve a list of all rooms
     *
     * @tags Rooms
     * @name GetApiRoomRooms
     * @summary Get all rooms
     * @request GET:/api/room/rooms
     */
    getApiRoomRooms: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/room/rooms`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Retrieve details of a specific room by ID
     *
     * @tags Rooms
     * @name GetApiRoomRoomsById
     * @summary Get a specific room
     * @request GET:/api/room/rooms/{id}
     */
    getApiRoomRoomsById: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/room/rooms/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Update details of a specific room by ID, including optional image upload. If a new image is uploaded, the old image will be deleted.
     *
     * @tags Rooms
     * @name PutApiRoomRoomsById
     * @summary Update a room
     * @request PUT:/api/room/rooms/{id}
     */
    putApiRoomRoomsById: (
      id: string,
      data: {
        name?: string;
        description?: string;
        capacity?: string;
        /** @format binary */
        image?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/room/rooms/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * @description Delete a specific room by ID and its associated image file
     *
     * @tags Rooms
     * @name DeleteApiRoomRoomsById
     * @summary Delete a room
     * @request DELETE:/api/room/rooms/{id}
     */
    deleteApiRoomRoomsById: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/room/rooms/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description Get a report of room usage within a specified date range
     *
     * @tags Reports
     * @name GetApiReportsRoomUsage
     * @summary Room usage report
     * @request GET:/api/reports/room-usage
     */
    getApiReportsRoomUsage: (
      query: {
        startDate: string;
        endDate: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/reports/room-usage`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Get a report of bookings made by users within a specified date range
     *
     * @tags Reports
     * @name GetApiReportsUserBookings
     * @summary User bookings report
     * @request GET:/api/reports/user-bookings
     */
    getApiReportsUserBookings: (
      query: {
        startDate: string;
        endDate: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/reports/user-bookings`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Get a list of available rooms for a specific date range
     *
     * @tags Reports
     * @name GetApiReportsAvailableRooms
     * @summary Available rooms report
     * @request GET:/api/reports/available-rooms
     */
    getApiReportsAvailableRooms: (
      query: {
        startDate: string;
        endDate: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/reports/available-rooms`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Get a summary of bookings for a specific month
     *
     * @tags Reports
     * @name GetApiReportsMonthlySummary
     * @summary Monthly booking summary
     * @request GET:/api/reports/monthly-summary
     */
    getApiReportsMonthlySummary: (
      query: {
        year: string;
        month: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/reports/monthly-summary`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Get a list of bookings for a specific month
     *
     * @tags Reports
     * @name GetApiReportsMonthlyBookings
     * @summary Monthly bookings report
     * @request GET:/api/reports/monthly-bookings
     */
    getApiReportsMonthlyBookings: (
      query: {
        year: string;
        month: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/reports/monthly-bookings`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Get a report of the most frequently used rooms within a specified date range, suitable for pie chart visualization
     *
     * @tags Reports
     * @name GetApiReportsMostUsedRooms
     * @summary Most used rooms report for pie chart
     * @request GET:/api/reports/most-used-rooms
     */
    getApiReportsMostUsedRooms: (
      query: {
        startDate: string;
        endDate: string;
        limit?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/reports/most-used-rooms`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Create a new booking for a room (requires authentication)
     *
     * @tags Bookings
     * @name PostApiBookingBookings
     * @summary Create a new booking
     * @request POST:/api/booking/bookings
     */
    postApiBookingBookings: (
      data: {
        roomId: number;
        startTime: string;
        endTime: string;
        title: string;
        description?: string;
        attendeeCount: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/booking/bookings`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Retrieve a list of all bookings (admin only, requires authentication)
     *
     * @tags Bookings
     * @name GetApiBookingBookings
     * @summary Get all bookings
     * @request GET:/api/booking/bookings
     */
    getApiBookingBookings: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/booking/bookings`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Retrieve details of a specific booking by ID (requires authentication)
     *
     * @tags Bookings
     * @name GetApiBookingBookingsById
     * @summary Get a specific booking
     * @request GET:/api/booking/bookings/{id}
     */
    getApiBookingBookingsById: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/booking/bookings/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Update details of a specific booking by ID (requires authentication)
     *
     * @tags Bookings
     * @name PutApiBookingBookingsById
     * @summary Update a booking
     * @request PUT:/api/booking/bookings/{id}
     */
    putApiBookingBookingsById: (
      id: string,
      data: {
        startTime: string;
        endTime: string;
        description?: string;
        title: string;
        attendeeCount: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/booking/bookings/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Delete a specific booking by ID (requires authentication)
     *
     * @tags Bookings
     * @name DeleteApiBookingBookingsById
     * @summary Delete a booking
     * @request DELETE:/api/booking/bookings/{id}
     */
    deleteApiBookingBookingsById: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/booking/bookings/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * @description Retrieve all bookings for the authenticated user
     *
     * @tags Bookings
     * @name GetApiBookingMyBookings
     * @summary Get my bookings
     * @request GET:/api/booking/my-bookings
     */
    getApiBookingMyBookings: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/booking/my-bookings`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Retrieve a list of available rooms for a specific time period
     *
     * @tags Bookings
     * @name GetApiBookingAvailableRooms
     * @summary Get available rooms
     * @request GET:/api/booking/available-rooms
     */
    getApiBookingAvailableRooms: (
      query: {
        startTime: string;
        endTime: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/booking/available-rooms`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Check if a room is available for a specific time period
     *
     * @tags Bookings
     * @name GetApiBookingRoomsByRoomIdAvailability
     * @summary Check room availability
     * @request GET:/api/booking/rooms/{roomId}/availability
     */
    getApiBookingRoomsByRoomIdAvailability: (
      roomId: string,
      query: {
        startTime: string;
        endTime: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/booking/rooms/${roomId}/availability`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Update user information
     *
     * @tags User
     * @name PutApiRoomUpdateProfile
     * @summary Update user
     * @request PUT:/api/room/update-profile
     */
    putApiRoomUpdateProfile: (
      data: {
        email: string;
        firstName: string;
        lastName: string;
        nickname: string;
        phone: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          message: string;
        },
        {
          message: string;
        }
      >({
        path: `/api/room/update-profile`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get current user information
     *
     * @tags User
     * @name GetApiRoomMe
     * @summary Get user info
     * @request GET:/api/room/me
     */
    getApiRoomMe: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/room/me`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Get current user menu
     *
     * @tags User
     * @name GetApiRoomMeMenu
     * @summary Get user menu
     * @request GET:/api/room/meMenu
     */
    getApiRoomMeMenu: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/room/meMenu`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Change user password
     *
     * @tags User
     * @name PutApiRoomChangePassword
     * @summary Change password
     * @request PUT:/api/room/change-password
     */
    putApiRoomChangePassword: (
      data: {
        currentPassword: string;
        newPassword: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          message: string;
        },
        {
          message: string;
        }
      >({
        path: `/api/room/change-password`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  uploads = {
    /**
     * @description Get Image From Folder ./uploads
     *
     * @tags Images
     * @name GetUploadsByFilename
     * @summary Get Image
     * @request GET:/uploads/{filename}
     */
    getUploadsByFilename: (filename: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/uploads/${filename}`,
        method: "GET",
        ...params,
      }),
  };
  swagger = {
    /**
     * No description
     *
     * @name GetSwagger
     * @request GET:/swagger
     */
    getSwagger: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/swagger`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @name GetSwaggerJson
     * @request GET:/swagger/json
     */
    getSwaggerJson: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/swagger/json`,
        method: "GET",
        ...params,
      }),
  };
}
