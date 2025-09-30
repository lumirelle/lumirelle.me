---
title: HTTP Manual
date: 2025-09-30T22:30+08:00
update: 2025-09-30T22:30+08:00
lang: en
duration: 3min
type: blog+note
---

[[toc]]

## What is HTTP?

HTTP is a **data transfer protocol** used for transferring hypertext from web server to client, it uses TCP/IP
**connections protocol** under the hood.

HTTPS is HTTP over TLS/SSL **encryption protocol**, it is more secure than HTTP.

## HTTP message structure

Request and response messages has similar structure, both consists of three main parts:

1. Start line
2. Headers
3. Body (optional)

### Request message structure

- Request line
  - Method (GET, POST, PUT, DELETE, etc.)
  - URL
  - HTTP version (HTTP/1.1, HTTP/2, etc.)
- Request headers
  - Key-value pairs (`Content-Type: application/json`, etc.)
- Request body (optional)
  - Data sent to the server (Form data, JSON payload, etc.)

For example:

```http
GET /index.html HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Encoding: gzip, deflate
Connection: keep-alive
```

### Response message structure

- Status line
  - HTTP version (HTTP/1.1, HTTP/2, etc.)
  - Status code (200, 404, 500, etc.)
  - Reason phrase (OK, Not Found, Internal Server Error, etc.)
- Response headers
  - Key-value pairs (`Content-Type: application/json`, etc.)
- Response body (optional)
  - Data sent back to the client (HTML page, JSON payload, etc.)

For example:

```http
HTTP/1.1 200 OK
Date: Wed, 18 Apr 2024 12:00:00 GMT
Server: Apache/2.4.1 (Unix)
Last-Modified: Wed, 18 Apr 2024 11:00:00 GMT
Content-Length: 12345
Content-Type: text/html; charset=UTF-8

<!DOCTYPE html>
<html>
<head>
    <title>Example Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <!-- The rest of the HTML content -->
</body>
</html>
```

## HTTP methods

HTTP defines a set of request methods to indicate the desired action to be performed for a given resource. The most
common methods are:

- `GET`: Retrieve data from the server. It is **safe**[^1] and **idempotent**[^2].
- `POST`: Send data to the server to create a new resource. It is **not safe** and **not idempotent**.
- `PUT`: Update or replace an existing resource on the server. It is **not safe** but **idempotent**.
- `DELETE`: Remove a resource from the server. It is **not safe** but **idempotent**.
- `PATCH`: Partially update an existing resource on the server. It is **not safe** and not necessarily **idempotent**.
- `HEAD`: Similar to `GET`, but only retrieves the headers without the body. It is **safe** and **idempotent**.
- `OPTIONS`: Describe the communication options for the target resource. It is **safe** and **idempotent**.
- `TRACE`: Perform a message loop-back test along the path to the target resource. It is **safe** and **idempotent**.

## HTTP headers

See [MDN Web Docs: HTTP headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers) for more information.

## HTTP status codes

Here are some common HTTP status codes:

- `1xx` (Informational): Request received, continuing process.
  - `100 Continue`
  - `101 Switching Protocols`
- `2xx` (Successful): The request was successfully received, understood, and accepted.
  - `200 OK`
  - `201 Created`
  - `202 Accepted`
  - `204 No Content`
- `3xx` (Redirection): Further action needs to be taken in order to complete the request.
  - `301 Moved Permanently`
  - `302 Found`
  - `304 Not Modified`
- `4xx` (Client Error): The request contains bad syntax or cannot be fulfilled.
  - `400 Bad Request`
  - `401 Unauthorized`
  - `403 Forbidden`
  - `404 Not Found`
  - `409 Conflict`
- `5xx` (Server Error): The server failed to fulfill an apparently valid request.
  - `500 Internal Server Error`
  - `501 Not Implemented`
  - `502 Bad Gateway`
  - `503 Service Unavailable`
  - `504 Gateway Timeout`

See [MDN Web Docs: HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status) for more information.

## HTTP versions

TODO(Lumirelle): Add more details about different HTTP versions.

[^1]:
    **Safe** methods are those that do not modify resources on the server. They are intended for information retrieval
    only.

[^2]:
    **Idempotent** methods are those that can be called multiple times without different outcomes. The first request
    has the same effect as subsequent requests.
