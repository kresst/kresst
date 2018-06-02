import { Map } from "immutable";
import { isNil, isNumber } from "lodash";
import { VError } from "verror";

const makeHttpStatus = (code: number, description: string): any => {
    return { code, description };
};

/**
 * @info http://tools.ietf.org/html/rfc2616#section-10.5.6
 */
export enum HttpStatus {
    /**
     * @code 100 Continue
     * @info http://tools.ietf.org/html/rfc2616#section-10.1.1
     */
    CONTINUE = makeHttpStatus(100, "Continue"),
    /**
     * @code 101 Switching Protocols
     * @info http://tools.ietf.org/html/rfc2616#section-10.1.2
     */
    SWITCHING_PROTOCOLS = makeHttpStatus(101, "Switching Protocols"),
    /**
     * @code 200 OK
     * @info http://tools.ietf.org/html/rfc2616#section-10.2.1
     */
    OK = makeHttpStatus(200, "OK"),
    /**
     * @code 201 Created
     * @info http://tools.ietf.org/html/rfc2616#section-10.2.2
     */
    CREATED = makeHttpStatus(201, "Created"),
    /**
     * @code 202 Accepted
     * @info http://tools.ietf.org/html/rfc2616#section-10.2.3
     */
    ACCEPTED = makeHttpStatus(202, "Accepted"),
    /**
     * @code 203 Non-Authoritative Information
     * @info http://tools.ietf.org/html/rfc2616#section-10.2.4
     */
    NON_AUTHORITATIVE_INFORMATION = makeHttpStatus(203, "Non-Authoritative Information"),
    /**
     * @code 204 No Content
     * @info http://tools.ietf.org/html/rfc2616#section-10.2.5
     */
    NO_CONTENT = makeHttpStatus(204, "No Content"),
    /**
     * @code 205 Reset Content
     * @info http://tools.ietf.org/html/rfc2616#section-10.2.6
     */
    RESET_CONTENT = makeHttpStatus(205, "Reset Content"),
    /**
     * @code 206 Partial Content
     * @info http://tools.ietf.org/html/rfc2616#section-10.2.7
     */
    PARTIAL_CONTENT = makeHttpStatus(206, "Partial Content"),
    /**
     * @code 300 Multiple Choices
     * @info http://tools.ietf.org/html/rfc2616#section-10.3.1
     */
    MULTIPLE_CHOICES = makeHttpStatus(300, "Multiple Choices"),
    /**
     * @code 301 Moved Permanently
     * @info http://tools.ietf.org/html/rfc2616#section-10.3.2
     */
    MOVED_PERMANENTLY = makeHttpStatus(301, "Moved Permanently"),
    /**
     * @code 302 Found
     * @info http://tools.ietf.org/html/rfc2616#section-10.3.3
     */
    FOUND = makeHttpStatus(302, "Found"),
    /**
     * @code 303 See Other
     * @info http://tools.ietf.org/html/rfc2616#section-10.3.4
     */
    SEE_OTHER = makeHttpStatus(303, "See Other"),
    /**
     * @code 304 Not Modified
     * @info http://tools.ietf.org/html/rfc2616#section-10.3.5
     */
    NOT_MODIFIED = makeHttpStatus(304, "Not Modified"),
    /**
     * @code 305 Use Proxy
     * @info http://tools.ietf.org/html/rfc2616#section-10.3.6
     */
    USE_PROXY = makeHttpStatus(305, "Use Proxy"),
    /**
     * @code 307 Temporary Redirect
     * @info http://tools.ietf.org/html/rfc2616#section-10.3.8
     */
    TEMPORARY_REDIRECT = makeHttpStatus(307, "Temporary Redirect"),
    /**
     * @code 400 Bad Request
     * @info http://tools.ietf.org/html/rfc2616#section-10.4.1
     */
    BAD_REQUEST = makeHttpStatus(400, "Bad Request"),
    /**
     * @code 401 Unauthorized
     * @info http://tools.ietf.org/html/rfc2616#section-10.4.2
     */
    UNAUTHORIZED = makeHttpStatus(401, "Unauthorized"),
    /**
     * @code 402 Payment Required
     * @info http://tools.ietf.org/html/rfc2616#section-10.4.3
     */
    PAYMENT_REQUIRED = makeHttpStatus(402, "Payment Required"),
    /**
     * @code 403 Forbidden
     * @info http://tools.ietf.org/html/rfc2616#section-10.4.4
     */
    FORBIDDEN = makeHttpStatus(403, "Forbidden"),
    /**
     * @code 404 Not Found
     * @info http://tools.ietf.org/html/rfc2616#section-10.4.5
     */
    NOT_FOUND = makeHttpStatus(404, "Not Found"),
    /**
     * @code 405 Method Not Allowed
     * @info http://tools.ietf.org/html/rfc2616#section-10.4.6
     */
    METHOD_NOT_ALLOWED = makeHttpStatus(405, "Method Not Allowed"),
    /**
     * @code 406 Not Acceptable
     * @info http://tools.ietf.org/html/rfc2616#section-10.4.7
     */
    NOT_ACCEPTABLE = makeHttpStatus(406, "Not Acceptable"),
    /**
     * @code 407 Proxy Authentication Required
     *  = makeHttpStatus@info http://tools.ietf.org/html/rfc2616#section-10.4.8
     */
    PROXY_AUTHENTICATION_REQUIRED = makeHttpStatus(407, "Proxy Authentication Required"),
    /**
     * @code 408 Request Timeout
     * @info http://tools.ietf.org/html/rfc2616#section-10.4.9
     */
    REQUEST_TIMEOUT = makeHttpStatus(408, "Request Time-out"),
    /**
     * @code 409 Conflict
     * @info http://tools.ietf.org/html/rfc2616#section-10.4.10
     */
    CONFLICT = makeHttpStatus(409, "Conflict"),
    /**
     * @code 410 Gone
     * @info http://tools.ietf.org/html/rfc2616#section-10.4.11
     */
    GONE = makeHttpStatus(410, "Gone"),
    /**
     * @code 411 Length Required
     * @info http://tools.ietf.org/html/rfc2616#section-10.4.12
     */
    LENGTH_REQUIRED = makeHttpStatus(411, "Length Required"),
    /**
     * @code 412 Precondition failed
     * @info http://tools.ietf.org/html/rfc2616#section-10.4.13
     */
    PRECONDITION_FAILED = makeHttpStatus(412, "Precondition Failed"),
    /**
     * @code 413 Request Entity Too Large
     * @info http://tools.ietf.org/html/rfc2616#section-10.4.14
     */
    REQUEST_ENTITY_TOO_LARGE = makeHttpStatus(413, "Request Entity Too Large"),
    /**
     * @code 414 Request-URI Too Long
     * @info http://tools.ietf.org/html/rfc2616#section-10.4.15
     */
    REQUEST_URI_TOO_LONG = makeHttpStatus(414, "Request-URI Too Large"),
    /**
     * @code 415 Unsupported Media Type
     * @info http://tools.ietf.org/html/rfc2616#section-10.4.16
     */
    UNSUPPORTED_MEDIA_TYPE = makeHttpStatus(415, "Unsupported Media Type"),
    /**
     * @code 416 Requested Range Not Satisfiable
     * @info http://tools.ietf.org/html/rfc2616#section-10.4.17
     */
    REQUESTED_RANGE_NOT_SATISFIABLE = makeHttpStatus(416, "Requested range not satisfiable"),
    /**
     * @code 417 Expectation Failed
     * @info http://tools.ietf.org/html/rfc2616#section-10.4.18
     */
    EXPECTATION_FAILED = makeHttpStatus(417, "Expectation Failed"),
    /**
     * @code 418 I'm a teapot
     * @info http://en.wikipedia.org/wiki/List_of_HTTP_status_codes
     */
    I_AM_A_TEAPOT = makeHttpStatus(418, "I'm a teapot"),
    /**
     * @code 422 Unprocessable Entity
     * @info http://en.wikipedia.org/wiki/List_of_HTTP_status_codes
     */
    UNPROCESSABLE_ENTITY = makeHttpStatus(422, "Unprocessable Entity"),
    /**
     * @code 423 Locked
     * @info http://en.wikipedia.org/wiki/List_of_HTTP_status_codes
     */
    LOCKED = makeHttpStatus(423, "Locked"),
    /**
     * @code 424 Failed Dependency
     * @info http://en.wikipedia.org/wiki/List_of_HTTP_status_codes
     */
    FAILED_DEPENDENCY = makeHttpStatus(424, "Failed Dependency"),
    /**
     * @code 428 Precondition Required
     * @info http://tools.ietf.org/html/rfc6585">RFC 6585</a>
     */
    PRECONDITION_REQUIRED = makeHttpStatus(428, "Precondition Required"),
    /**
     * @code 429 Too Many Requests
     * @info http://tools.ietf.org/html/rfc6585">RFC 6585</a>
     */
    TOO_MANY_REQUESTS = makeHttpStatus(429, "Too Many Requests"),
    /**
     * @code 431 Request Header Fields Too Large
     * @info http://tools.ietf.org/html/rfc6585">RFC 6585</a>
     */
    REQUEST_HEADER_FIELDS_TOO_LARGE = makeHttpStatus(431, "Request Header Fields Too Large"),
    /**
     * @code 500 Internal Server Error
     * @info http://tools.ietf.org/html/rfc2616#section-10.5.1
     */
    INTERNAL_SERVER_ERROR = makeHttpStatus(500, "Internal Server Error"),
    /**
     * @code 501 Not Implemented
     * @info http://tools.ietf.org/html/rfc2616#section-10.5.2
     */
    NOT_IMPLEMENTED = makeHttpStatus(501, "Not Implemented"),
    /**
     * @code 502 Bad Gateway
     * @info http://tools.ietf.org/html/rfc2616#section-10.5.3
     */
    BAD_GATEWAY = makeHttpStatus(502, "Bad Gateway"),
    /**
     * @code 503 Service Unavailable
     * @info http://tools.ietf.org/html/rfc2616#section-10.5.4
     */
    SERVICE_UNAVAILABLE = makeHttpStatus(503, "Service Unavailable"),
    /**
     * @code 504 Gateway Timeout
     * @info http://tools.ietf.org/html/rfc2616#section-10.5.5
     */
    GATEWAY_TIMEOUT = makeHttpStatus(504, "Gateway Time-out"),
    /**
     * @code 505 HTTP Version Not Supported
     * @info http://tools.ietf.org/html/rfc2616#section-10.5.6
     */
    HTTP_VERSION_NOT_SUPPORTED = makeHttpStatus(505, "HTTP Version not supported")
}

export namespace HttpStatus {
    export interface HttpStatusDetail {
        code: number;
        description: string;
    }

    export const getCode = (status: HttpStatus): number => {
        const code: number = (<any>status).code;

        if (!isNumber(code)) {
            throw new VError(`Invalid HTTP Status: ${status}`);
        }

        return code;
    };

    export const havingCode = (code: number): HttpStatusDetail => {
        const status = Map<string, HttpStatusDetail>(HttpStatus).find((detail: HttpStatusDetail) => {
            return isNumber(detail.code) && detail.code === code;
        });

        if (isNil(status)) {
            throw new VError(`Invalid HTTP Status code: ${code}`);
        }

        return status;
    };
}
