---
title: 'Performance Optimization: Network Protocols'
date: 2026-04-21T10:48+08:00
update: 2026-04-23T00:23+08:00
lang: en
duration: 1min
type: blog+note
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

TODO...
