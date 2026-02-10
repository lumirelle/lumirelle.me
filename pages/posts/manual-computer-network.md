---
title: Computer Network Manual
date: 2025-09-30T22:30+08:00
update: 2025-12-01T13:49+08:00
lang: en
duration: 15min
type: note
---

[[toc]]

## Simply Explain Computer Network

> [!Note]
>
> Likes front-end technologic stack, during the development of computer network, there are many different technologies, protocols and standards.
>
> This article only includes the most widely used ones nowadays, and simplifies the explanation to the greatest extent, it's not the entire truth of computer network.

### Start with the Minimal Network

#### Connect Two Computers

Long long ago, you invented a method which can let two computers talk to each other: You installed the network cards for each computer to receive and send data, and the network cable interfaces for each computer to accept network cables. Then, you connected the two computers with a network cable, and the minimal **local area network (LAN)** composed of two computers was born.

The message structure of the data sent through the network cable looks like this:

```txt
+-------------------+
| Data              |
| (variable length) |
+-------------------+
```

When computer A wants to communicate with computer B, the only thing it needs to do is to let its network card send the message as above through the cable, and computer B's network card will receive the message from the cable and pass it to computer B.

#### Connect Three Computers

But, how about three computers? You got a trouble of identifying these computers when they are talking to each other.

That couldn't stop your steps, you asked each network card manufacturer to add a unique identifier to their products, which is called **MAC address**.

The structure of a MAC address looks like this: `BB:BB:BB:BB:BB:BB`, it is a 48-bit (6 bytes) identifier, each byte is represented by two hexadecimal digits and separated by colons. The first 3 bytes are the manufacturer identifier, assigned by the IEEE, the last 3 bytes are the unique identifier assigned by the manufacturer.

This can ensure to the greatest extent that each computer within the LAN has a unique identifier.

> [!Note]
>
> It looks like MAC address is globally unique, but actually it is not guaranteed to be unique, because the MAC address of a device can be changed or spoofed. If there are two devices with the same MAC address in the same LAN, it will cause confusion and communication failure.
>
> For different LANs, it's no matter because they have another unique identifier, called IP address, which will be introduced later.

Now the message structure looks like this, it adds a **data link layer** info to store the MAC addresses of both sender and receiver:

```txt
+---------------------------------------+-------------------+
| Data Link Layer Info (12 bytes)       | Data              |
|                                       | (variable length) |
+---------------------------------------+-------------------+
                    |
                    v
+-------------------+-------------------+
| Destination MAC   | Source MAC        |
| Address (6 bytes) | Address (6 bytes) |
+-------------------+-------------------+
```

Now, computer A has two network cable interface and both are linked to its network card.

In initial state, computer A doesn't know the MAC address of each computer of its network cable interfaces is connected to, so it should make a broadcast to all computers in the LAN, asking "What's your MAC address?", and record the MAC address that it receives from each interface, for instance:

| MAC Address                    | Interface       |
| ------------------------------ | --------------- |
| BB:BB:BB:BB:BB:BB (Computer B) | Network Cable 1 |
| CC:CC:CC:CC:CC:CC (Computer C) | Network Cable 2 |

When computer A wants to communicate with computer `BB:BB:BB:BB:BB:BB` (Computer B), it just find what interface is connected with that computer and sends the message through this interface.

This saved the world!

### Start to Manage the Network

The good times didn't last long, soon you found that it was hard to manage the case of many computers: If there are 10 computers, you need to install 9 network cable interfaces for each computer, and every computer needs to record MAC address of each computer of its network cable interfaces is connected to! How about 100 computers? 1000 computers? It was a nightmare!

To solve this problem, you've come up with a good idea: **Switch**.

A switch is a device that connects all computers together, it maintains a MAC address table which maps each computer to its corresponding interface (also called port), and forwards the message to the correct port by reading the MAC address from the Data Link Layer Info. What a wonderful centralized management system! XD

In this case, the way computers get the MAC address of each other is the same as before, but now, they only have one cable interface connected to the switch. That's to say, all MAC addresses are associated with the same interface connected to the switch.

What's more, the switch also needs to know the MAC address of each computer connected to its ports. Different from computers, the switch learns the MAC address by receiving the message from each port: When switch receives a message from computer A from port 1, it will record:

| MAC Address                    | Interface | Note       |
| ------------------------------ | --------- | ---------- |
| AA:AA:AA:AA:AA:AA (Computer A) | Port 1    | New record |

If this message is sent to computer `BB:BB:BB:BB:BB:BB` (Computer B) and switch doesn't know which port computer B is connected to, it will make a broadcast this message directly to all ports. When switch receives a message from computer B from port 2, it will add a new record:

| MAC Address                    | Interface | Note       |
| ------------------------------ | --------- | ---------- |
| AA:AA:AA:AA:AA:AA (Computer A) | Port 1    |            |
| BB:BB:BB:BB:BB:BB (Computer B) | Port 2    | New record |

When computer A sends a message to computer B next time, switch will forward this message to port 2 directly.

Notice that, switch does not have its own MAC address, it just records all the MAC addresses of each computer connected to its ports.

### Divide the Network into Sub-Networks

Imagine this situation: you have 3 computers in your home, and 3 computers in your office, how can you connect them together?

First of all, you know you should connect the 3 computers in your home with a switch, and the same for your office. Then, the best solution is to connect these two switches together with another switch, like this:

```txt
PC1 --+ s1p1 ---
                |
PC2 --+ s1p2 -- Switch1 --+ s1p4
                |         |
PC3 --+ s1p3 ---          + s2p1
                          |
                          Switch2
                          |
PC4 --+ s3p1 ---          + s2p2
                |         |
PC5 --+ s3p3 -- Switch3 --+ s3p4
                |
PC6 --+ s3p3 ---
```

In the case above, `Switch1` has 4 ports, called `s1p1`, `s1p2`, `s1p3` and `s1p4`, the same for `Switch3`. `s1p1`, `s1p2` and `s1p3` is connected to one computer, and `s1p4` is connected to `s2p1` of `Switch2`, the same for `Switch3`.

Now, the MAC address table of `Switch1` may look like this:

| MAC Address             | Interface |
| ----------------------- | --------- |
| 11:11:11:11:11:11 (PC1) | s1p1      |
| 22:22:22:22:22:22 (PC2) | s1p2      |
| 33:33:33:33:33:33 (PC3) | s1p3      |
| 44:44:44:44:44:44 (PC4) | s1p4      |
| 55:55:55:55:55:55 (PC5) | s1p4      |
| 66:66:66:66:66:66 (PC6) | s1p4      |

You may notice that, `s1p4` is connected to `Switch2`, so all MAC addresses of computers connected to `Switch2` are associated with `s1p4`.

If there are more switches? A port of a switch may match up to hundreds of MAC addresses!

To solve this problem, you need something can divide the network into smaller sub-networks, and manage the traffic between these sub-networks. You, being so smart, have come up with a new solution: **Router**.

A router is a device which has its own MAC address, and it will assign another unique identifier to each computer connected to it (including itself), called **IP address**, also assign the default gateway of each computer to its own IP address.

> [!Note]
>
> The default gateway is the IP address send message to when a computer wants to communicate with another computer in a different sub-network.
>
> It's the router's IP address in common cases.

IP address is a 32-bit (4 bytes) identifier[^1], usually represented in decimal format, separated by dots. For example, `192.168.1.1`.

The same as MAC address, IP address uses a part of its bits to identify the sub-network it created and the router it self (called network part), another part to identify the computers connected to it (called host part). The difference is IP address uses **subnet mask** to dynamically determine how many bits is the network part and how many bits is the host part.

For example, for sub-network with IP address from `192.168.1.0` to `192.168.1.255` and subnet mask `255.255.255.0`:

The subnet mask in binary is `11111111.11111111.11111111.00000000`, has 24 bits of `1`, so the first 24 bits (the first 3 bytes) of IP address is the network part, the last 8 bits (the last byte) is the host part. That's to say, the network part is `192.168.1`, the host part is from `0` to `255`, so this sub-network can have up to 254 IP addresses[^2].

What's more, we can describe this sub-network by `192.168.1.0/24` (in CIDR notation).

Now, the data sent through the network cable has a new structure, we added a **internet layer** info to store the IP addresses of both sender and receiver:

```txt
+-------------------+---------------------------------------+-------------------+
| Data Link Layer   | Internet Layer Info (8 bytes)        | Data              |
| Info (12 bytes)   |                                       | (variable length) |
+-------------------+---------------------------------------+-------------------+
                                        |
                                        v
                    +-------------------+-------------------+
                    | Destination IP    | Source IP         |
                    | Address (4 bytes) | Address (4 bytes) |
                    +-------------------+-------------------+
```

After using router, the network structure will change to:

```txt
PC1 --+ r1p1 ---
                |
PC2 --+ r1p2 -- Router1 --+ r1p4
                |         |
PC3 --+ r1p3 ---          + s1p1
                          |
                          Switch1
                          |
PC4 --+ r2p1 ---          + s1p2
                |         |
PC5 --+ r2p3 -- Router2 --+ r2p4
                |
PC6 --+ r2p3 ---
```

Now, suppose they know each other's IP address.

When PC1 wants to communicate with PC2, it will find out that they are in a same sub-network (because the network part of their IP addresses are the same), so it will send the message directly to PC2 (through Router1 without forwarding).

When PC1 wants to communicate with PC4, it will find out that they are in different sub-networks (because the network part of their IP addresses are different), so it will send the message to its default gateway (Router1), and Router1 will forward this message to Switch1, then Switch1 will forward this message to Router2, finally Router2 will forward this message to PC4.

Thanks to IP address and subnet mask, now you can create a really large network with many sub-networks, and manage the traffic between these sub-networks easily.

Congratulations, you invented the Internet, the largest computer network in the world! 😄

### Connect with Processes Inside Computers

If we want to communicate with a specific process (program) inside a computer, IP address is not enough, we need an additional identifier, called **port**.

Combined with IP address, this can uniquely identify a specific process inside a computer.

Now, you are really be closed to the truth of nowadays computer network!

### OSI Seven Layers Model

Reading through the content above, you may already be familiar with some of the seven layers of computer network.

The seven layers of computer network are:

1. **Physical Layer**: Responsible for the physical connection between devices, cables and optical fibers is the most common medium.
2. **Data Link Layer**: Responsible for node-to-node data transfer, including MAC addressing and error detection, these happens between the network cards of computers or other network devices.
3. **Internet Layer**: Responsible for routing data packets across different networks, including IP addressing and packet forwarding, also called the **IP Layer**.
4. **Transport Layer**: Responsible for end-to-end communication, including TCP and UDP protocols, port is used in this layer to identify specific processes inside computers.
5. **Session Layer**: Responsible for establishing, managing, and terminating sessions between applications, for example, RPC (Remote Procedure Call) protocol.
6. **Presentation Layer**: Responsible for data representation and encryption, including data compression and encryption protocols like TLS/SSL protocols.
7. **Application Layer**: Responsible for providing network services to applications, including HTTP, FTP, and DNS protocols.

## Going Further

### HTTP Protocol in Application Layer

#### What is HTTP?

HTTP is a **application protocol** used for defining how the hypertext from web server to client should be transferred, it uses TCP **transport protocol** and IP **Internet Protocol** under the hood (so-called TCP/IP protocol).

In web development, HTTP is the most widely used protocol in application layer (because web applications are always deployed on web servers and accessed through user's web browser).

Additional, HTTPS is HTTP over TLS/SSL **presentation protocol**, it is more secure than HTTP.

#### HTTP Message Structure

Request and response messages has similar structure, both consists of three main parts:

1. Start line
2. Headers
3. Body (optional)

The request message structure is:

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

The response message structure is:

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

#### HTTP Methods

HTTP defines a set of request methods to indicate the desired action to be performed for a given resource. The most common methods are:

- `GET`: Retrieve data from the server. It is **safe**[^3] and **idempotent**[^4].
- `POST`: Send data to the server to create a new resource. It is **not safe** and **not idempotent**.
- `PUT`: Update or replace an existing resource on the server. It is **not safe** but **idempotent**.
- `DELETE`: Remove a resource from the server. It is **not safe** but **idempotent**.
- `PATCH`: Partially update an existing resource on the server. It is **not safe** and not necessarily **idempotent**.
- `HEAD`: Similar to `GET`, but only retrieves the headers without the body. It is **safe** and **idempotent**.
- `OPTIONS`: Describe the communication options for the target resource. It is **safe** and **idempotent**.
- `TRACE`: Perform a message loop-back test along the path to the target resource. It is **safe** and **idempotent**.

#### HTTP Headers

See [MDN Web Docs: HTTP headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers) for more information.

#### HTTP Status Codes

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

#### HTTP Versions

TODO(Lumirelle): Add more details about different HTTP versions.

#### Making HTTP Requests in VSCode

You can use the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension to make HTTP requests directly in VSCode.

I highly recommend it, it's very convenient for testing and debugging APIs when developing web applications.

The only few things you need to do is:

1. Install the extension.
2. Setting up the environment variables if needed:

   _.vscode/settings.json_

   ```json
   {
     "rest-client.environmentVariables": {
       "$shared": {
         // The variables shared across all environments
       },
       "local": {
         "baseUrl": "http://localhost:3000",
         "authToken": "your-auth-token"
       },
       "production": {
         "baseUrl": "https://api.example.com",
         "authToken": "your-auth-token"
       }
     }
   }
   ```

3. Create a file with `.http` or `.rest` extension, write your HTTP requests in standard HTTP request format:

   _api-test.http_

   ```http
   ### Get user info
   GET {{baseUrl}}/users/1
   Authorization: Bearer {{authToken}}
   Accept: application/json

   ### Create a new user
   POST {{baseUrl}}/users
   Content-Type: application/json
   Authorization: Bearer {{authToken}}

   {
     "name": "John Doe",
     "email": "john.doe@example.com"
   }
   ```

   Btw, you can use `###` to separate multiple requests in a single file.

See [REST Client documentation](https://github.com/Huachao/vscode-restclient/blob/master/README.md) for more information.

[^1]: IPv4 address, there is also IPv6 address which is a 128-bit (16 bytes) identifier, usually represented in hexadecimal format, separated by colons. For example, `2001:0db8:85a3:0000:0000:8a2e:0370:7334`.

[^2]: By default, there are two special IP addresses in each subnet is reserved and cannot be assigned to any computer:

    - The first address (the network address) is used to identify the subnet itself. It is the lowest address in the subnet range.
    - The last address (the broadcast address) is used to send data to all hosts in the subnet. It is the highest address in the subnet range.

[^3]: **Safe** methods are those that do not modify resources on the server. They are intended for information retrieval only.

[^4]: **Idempotent** methods are those that can be called multiple times without different outcomes. The first request has the same effect as subsequent requests.
