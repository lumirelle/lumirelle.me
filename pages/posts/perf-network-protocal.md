---
title: 'Performance Optimization: Network Protocols'
date: 2026-04-21T10:48+08:00
update: 2026-04-23T11:11+08:00
lang: en
duration: 2min
type: note
---

[[toc]]

## Introduction

Most people probably overlook the fact that network protocols actually have a significant impact on page loading performance.

Here is a blog comparing the differences between HTTP/1, HTTP/1.1, HTTP/2, and HTTP/3: https://www.debugbear.com/blog/http1-vs-http2

In a word:

- HTTP/1: **Per request per connection**;
- HTTP/1.1: **Multiple requests per connection** to reduce the cost of opening a new connection, and the **requests are processed serially**;
- HTTP/2: Multiple requests per connection, **multiplexing and parallel** to reduce the cost of waiting for the previous request to complete;
- HTTP/3: **Based on QUIC**, which is a transport protocol built on top of UDP

So, to deploy a modern web applications, you should use at least HTTP/2! 🥰


## How to Enable HTTP/2?

In remote environment, you need to configure your web server to support HTTP/2. For example, if you are using Nginx, you can add the following configuration to enable HTTP/2:

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

In local environment, you need to use [mkcert](https://github.com/FiloSottile/mkcert) to generate a local CA and certificates to enable HTTPS first, and then configure your local server to support HTTP/2. For example, if you are using [Vite](https://vitejs.dev/), you can add the following configuration in `vite.config.ts`, Vite will automatically use HTTP/2 when possible:

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

## How to Enable HTTP/3?

In remote environment, you need to configure your web server to support HTTP/3. For example, if you are using Nginx, you need to check if your Nginx version supports HTTP/3:

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

In local environment, it seems that most local servers do not fully support HTTP/3 yet...

## Implementations

### HTTP/2

- [Wiki: Server Implementation](https://en.wikipedia.org/wiki/HTTP/2#Server-side_support);

- [GitHub Wiki: Other Implementations](https://github.com/httpwg/http2-spec/wiki/Implementations).

### HTTP/3

- [Wiki: Client & Library & Server Implementations](https://en.wikipedia.org/wiki/HTTP/3#Implementations).
