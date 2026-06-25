---
title: 'Performance Optimization: HTTP Versions'
date: 2026-04-21T10:48+08:00
update: 2026-06-25T14:48+08:00
lang: en
duration: 3min
type: note
---

[[toc]]

## Introduction

Most people probably overlook the fact that HTTP versions actually have a significant impact on page loading performance.

Here is a blog comparing the differences between HTTP/1, HTTP/1.1, HTTP/2, and HTTP/3: https://www.debugbear.com/blog/http1-vs-http2

In a word:

- HTTP/1.x: One request per connection at a time, up to 6 connections per domain (in practice) to achieve parallelism;
  - HTTP/1.0: The connection will be closed after the request is completed;
  - HTTP/1.1: The connection can be reused by next request;
- HTTP/2: Multiple request per connection at a time, no need to open multiple connections for same domain, with header compression, based on TCP;
- HTTP/3: **Based on QUIC**, which is a transport protocol built on top of UDP, packet loss no longer block the queue.

  <details>
    <summary>More details about queue blocking</summary>

    TCP protocol enforces in-order delivery, in HTTP/2, if a packet of request A is lost, all the other requests in the same connection B, C, D... should wait for the retransmission of request A, we call this phenomenon "head-of-line blocking".

    In HTTP/3, since it is based on QUIC, which is built on top of UDP who does not enforce in-order delivery, packet loss no longer block the queue, so the performance is better than HTTP/2.
  </details>

So, to deploy a modern web applications, you should use at least HTTP/2! 🥰

## Enable High HTTP Versions

High HTTP versions are only supported in HTTPS protocol, so you need to prepare your SSL certificate first.

> [!Note]
> In local environment, you can use [mkcert](https://github.com/FiloSottile/mkcert) to generate a local CA and certificates to enable HTTPS.

### Enable HTTP/2

With Nginx:

```nginx
server {
    listen 443 ssl;
    listen [::]:443 ssl;

    http2 on;

    serve_name example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # ...
}
```

With Vite:

```ts
export default defineConfig({
  // ...

  server: {
    https: {
      cert: resolve(import.meta.dirname, 'certs/localhost.pem'),
      key: resolve(import.meta.dirname, 'certs/localhost-key.pem'),
    },
  },

  // ...
})
```

### Enable HTTP/3

With Nginx, you need to check if your Nginx version supports HTTP/3:

> Version of nginx for Windows uses the native Win32 API (not the Cygwin emulation layer). Only the select() and poll() (1.15.9) connection processing methods are currently used, so high performance and scalability should not be expected. Due to this and some other known issues version of nginx for Windows is considered to be a beta version. -- https://nginx.org/en/docs/windows.html
>
> The UDP (and, inherently, QUIC) functionality is not supported. -- https://nginx.org/en/docs/windows.html

```sh
nginx -V 2>&1 | grep -- --with-http_v3_module
```

If you see the output is not empty, it means your Nginx supports HTTP/3 (Otherwise, you need to upgrade your Nginx version or use Linux version). Then you can add the following configuration to enable HTTP/3:

```nginx
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    listen 443 quic reuseport;
    listen [::]:443 quic reuseport;

    http2 on;

    serve_name example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    add_header Alt-Svc 'h3=":443"; ma=86400' always;

    # ...
}
```

With Vite:

It seems that Vite does not natively support HTTP/3 yet...

## Who Supports High HTTP Versions

### Support for HTTP/2

- [Wiki: Server Implementation](https://en.wikipedia.org/wiki/HTTP/2#Server-side_support);

- [GitHub Wiki: Other Implementations](https://github.com/httpwg/http2-spec/wiki/Implementations).

### Support for HTTP/3

- [Wiki: Client & Library & Server Implementations](https://en.wikipedia.org/wiki/HTTP/3#Implementations).
