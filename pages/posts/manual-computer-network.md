---
title: Computer Network Manual
date: 2025-09-30T22:30+08:00
update: 2026-04-24T18:34+08:00
lang: en
duration: 21min
type: manual
---

[[toc]]

## Simply Explain Computer Network

> [!Note]
>
> Likes front-end technologic stack, during the development of computer network, there are many different technologies, protocols and standards. For example, each layer may have other different protocols with different message structure other than what this article mentioned.
>
> So, this article only includes the most widely used ones nowadays, and simplifies the explanation to the greatest extent, it's not the entire truth of computer network.

### Start with the Minimal Network

#### Connect Two Computers

Long long ago, you invented a method which can let two computers talk to each other: A device called **modem**. Modem can convert the digital signals from computer into analog signals that can be transmitted by electrical wires, and also convert them back to digital signals.

Through this method, you can install a modem for each computer, and connect them together with a electrical wire, then these two computers can talk to each other through the modem and the wire. Then, the minimal **local area network (LAN)** composed of two computers was born.

The message structure of the data sent through the network cable looks like below, a raw data without any additional info, we call it **first-level bit stream**:

```txt
+-------------------+
| Data              |
| (variable length) |
+-------------------+
```

#### Connect Three Computers (Ethernet Protocol)

How about three computers? Easy! Just install two modems in each computer, and connect each other with two wires, like this:

```txt
Computer A -- Computer B
 |                |
 |                |
 +-- Computer C --+
```

But, how can computer A know which modem is connected to computer B? If now modem 1 connects computer B, but later you want to exchange the connection, and connect modem 1 to computer C, how can computer A know that?

You got a trouble of identifying these computers when they are talking to each other.

That couldn't stop your steps, you know, modems are almost never exchanged after there are installed inside the computers, so you asked each modem manufacturer to add a unique identifier to their products, which is called **MAC address (Media Access Control Address, a part of Ethernet Protocol)**.

The structure of a MAC address looks like this: `BB:BB:BB:BB:BB:BB`, it is a 48-bit (6 bytes) identifier, each byte is represented by two hexadecimal digits and separated by colons. The first 3 bytes are the manufacturer identifier, assigned by the IEEE, the last 3 bytes are the unique identifier assigned by the manufacturer. This can ensure to the greatest extent that each computer within the LAN has a unique identifier.

So computer A does not care about who is computer B, it just cares about who is modem `BB:BB:BB:BB:BB:BB`, and send the message to this modem.

> [!Note]
>
> It looks like MAC address is globally unique, but actually it is not guaranteed, because the MAC address of a device can be changed or spoofed. If there are two devices with the same MAC address in the same LAN, it will cause confusion and communication failure.
>
> For devices in different LANs, it's no matter because they have another unique identifier, called IP address, which will be introduced later.

Now the message structure changes looks like below, it adds a **data link layer** info to store the MAC addresses of both sender and receiver, we call it **second-level data frame**:

```txt
+---------------------------------------+--------------------------+--------------------------------+
| Data Link Layer Info (96 bits)        | Data                     | Data Link Layer Info (32 bits) |
|                                       | (46 * 8 ~ 1500 * 8 bits) |                                |
+---------------------------------------+--------------------------+--------------------------------+
                    |                                                             |
                    v                                                             v
+-------------------+-------------------+                          +--------------------------------+
| Destination MAC   | Source MAC        |                          | Frame Check Sequence (32 bits) |
| Address (48 bits) | Address (48 bits) |                          |                                |
+-------------------+-------------------+                          +--------------------------------+
| Internet Layer Protocol (16 bits)     |
|                                       |
+---------------------------------------+
```

Let's see now how these three computers communicate with each other:

In initial state, computer A doesn't know the MAC address of each modems it is connected to, so it should **make a broadcast** (Set the destination MAC address to the broadcast address `FF:FF:FF:FF:FF:FF`) to all computers in the LAN, asking "What's your modem MAC address?", and record the MAC address that it receives from each computer, for instance:

| MAC Address                             | Modem of Computer A        |
| --------------------------------------- | -------------------------- |
| BB:BB:BB:BB:BB:BB (Computer B's modem1) | AA:AA:AA:AA:AA:AA (Modem1) |
| CC:CC:CC:CC:CC:CC (Computer C's modem1) | AA:AA:AA:AA:AA:AB (Modem2) |

The same to computer B and C:

| MAC Address                             | Modem of Computer B        |
| --------------------------------------- | -------------------------- |
| AA:AA:AA:AA:AA:AA (Computer A's modem1) | BB:BB:BB:BB:BB:BB (Modem1) |
| CC:CC:CC:CC:CC:CD (Computer C's modem2) | BB:BB:BB:BB:BB:BC (Modem2) |


| MAC Address                             | Modem of Computer C        |
| --------------------------------------- | -------------------------- |
| AA:AA:AA:AA:AA:AB (Computer A's modem2) | CC:CC:CC:CC:CC:CC (Modem1) |
| BB:BB:BB:BB:BB:BC (Computer B's modem2) | CC:CC:CC:CC:CC:CD (Modem2) |

When computer A wants to communicate with modem `BB:BB:BB:BB:BB:BB` (Computer B), computer A just need to find which one of its modem is connected with `BB:BB:BB:BB:BB:BB` and sends the message through it.

This saved the world!

### Link Computers Nearby Together

Although the previous method works for every case, but it is not a best solution, especially when there are many computers in the LAN: If there are 10 computers, you need to install 9 modems for each computer, 45 wires to connect them! How about 100 computers? 1000 computers? This is a pressure from both money and workload.

To solve this problem, you've come up with a good idea: A centralized system, build on top of **Switch**.

A switch is a device that connects all computers together, it maintains a MAC address table which maps each computer to its corresponding interface (also called port), and forwards the message to the correct port by reading the MAC address from the Data Link Layer Info. What a wonderful centralized management system! XD

In this case, the way computers get the MAC address of each other is the same as before, but now, each computer only need one modem which connected to the switch.

How the switch records the MAC address of each computer connected to its ports? Different from computers, the switch cannot send messages, it learns the MAC address by receiving the message from each port: When switch receives a message from computer A from port 1, it will record:

| MAC Address                    | Interface | Note       |
| ------------------------------ | --------- | ---------- |
| AA:AA:AA:AA:AA:AA (Computer A) | Port 1    | New record |

If this message is sent to computer `BB:BB:BB:BB:BB:BB` (Computer B) and switch doesn't know which port computer B is connected to, it will **forward this message directly to all ports** (In daily practice, we also call this a broadcast, but it's different from computer's broadcast, it's passive forwarding). When switch receives a message from computer B from port 2, it will add a new record:

| MAC Address                    | Interface | Note       |
| ------------------------------ | --------- | ---------- |
| AA:AA:AA:AA:AA:AA (Computer A) | Port 1    |            |
| BB:BB:BB:BB:BB:BB (Computer B) | Port 2    | New record |

When computer A sends a message to computer B next time, switch will forward this message to port 2 directly.

And MAC address record in computer A will look like below, all devices connected to the same modem, and computer A just need to send everything through modem `AA:AA:AA:AA:AA:AA` with correct destination MAC address, then switch will handle other things for it:

| MAC Address                    | Modem                             |
| ------------------------------ | --------------------------------- |
| BB:BB:BB:BB:BB:BB (Computer B) | AA:AA:AA:AA:AA:AA (Computer A)    |
| CC:CC:CC:CC:CC:CC (Computer C) | AA:AA:AA:AA:AA:AA (Computer A)    |
| ...                            | AA:AA:AA:AA:AA:AA (Computer A)    |

### Link Computers Far Away Together (Internet Protocol)

Imagine this situation: you have 3 computers in your home, and 3 computers in your office, how can you connect them together?

From a cost perspective, you know you should connect the 3 computers in your home with a switch, and the same for your office. Then, the best solution is to connect these two switches together with another switch, like this:

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

Through this way, you can save most of the wires.

But, there is still a problem: In the case above, `Switch1` has 4 ports, called `s1p1`, `s1p2`, `s1p3` and `s1p4`, the same for `Switch3`. `s1p1`, `s1p2` and `s1p3` is connected to one computer, and `s1p4` is connected to `s2p1` of `Switch2`, the same for `Switch3`. The MAC address table of `Switch1` may look like this:

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

To solve this problem, you need another thing to identify devices other than MAC addresses, that is **IP address (Internet Protocol Address)**.

IP address is a 32-bit (4 bytes) identifier[^1], usually represented in decimal format, separated by dots. For example, `192.168.1.1`. IP address uses a part of its bits to identify the sub-network it created and the router it self **(called network part)**, another part to identify the computers connected to it **(called host part)**. IP address also uses **subnet mask** to dynamically determine how many bits is the network part and how many bits is the host part.

For example, for sub-network with IP address from `192.168.1.0` to `192.168.1.255` and subnet mask `255.255.255.0`:

The subnet mask in binary is `11111111.11111111.11111111.00000000`, has 24 bits of `1`, so the first 24 bits (the first 3 bytes) of IP address is the network part, the last 8 bits (the last byte) is the host part. That's to say, the network part is `192.168.1`, the host part is from `0` to `255`, so this sub-network can have up to 254 IP addresses.

Why 254? Because there are two special IP addresses in each sub-network preserved and cannot be assigned to any computer:

- The **first address (the network address) is used to identify the subnet itself**. It is the lowest address in the subnet range.
- The **last address (the broadcast address) is used to send data to all hosts in the subnet**. It is the highest address in the subnet range.

So, we can describe this sub-network by `192.168.1.0/24` (in CIDR notation).

Before applying IP address to our network, we need a device to handle the message forwarding based on IP address, like switch for MAC address, it's called **router**.

A router is a enhanced version of switch, it's a device which has its own MAC address and IP address, and it will assign IP addresses to each computer connected to it, also assign the default gateway of each computer to its own IP address.

And the message sent has a new structure, we added a **internet layer** info to store the IP addresses of both sender and receiver, we call it **third-level data package**:

```txt
+-------------------+---------------------------------------+--------------------------+-------------------+
| Data Link Layer   | Internet Layer Info (160 bits)        | Data                     | Data Link Layer   |
| Info (96 bits)    |                                       | (26 * 8 ~ 1480 * 8 bits) | Info (32 bits)    |
+-------------------+---------------------------------------+--------------------------+-------------------+
                                        |
                                        v
                    +-------------------+-------------------+ (Version 4 bits, Header Length 4 bits, Service Type 8 bits,
                    | Header Info (96 bits)                 | Total Length 16 bits, Identification 16 bits, Flags 3 bits,
                    |                                       | Fragment Offset 13 bits, Time To Live 8 bits, Protocol 8 bits,
                    +-------------------+-------------------+ Header Checksum 16 bits)
                    | Destination IP    | Source IP         |
                    | Address (32 bits) | Address (32 bits) |
                    +-------------------+-------------------+
```

> [!Note]
>
> Notice that, in this case, the computer only knows the IP address of target device, but it does not know the MAC address. So there's an agreement here: Use each router's MAC address as the destination when sending the message to each router, and the last router (the router of the sub-network where the target device is located) will rewrite the destination MAC address to the target device's MAC address before the start of data link layer transmission.

Now how do these computers communicate with each other? There are two different cases, depending on whether they are in the same sub-network or not (Assume they know each other's IP address):

- Computer A with IP address `192.168.1.10` and MAC address `AA:AA:AA:AA:AA:AA` wants to communicate with computer B with IP address `192.168.1.11` and MAC address `BB:BB:BB:BB:BB:BB`, in sub-network `192.168.1.0/24`, computer A knows they are in a same sub-network, so it will do like before and try to send a **second-level data package**.

  Computer A now does not make a broadcast "What is your MAC address?" to all devices in the LAN now, it can broadcast "What is the MAC address of IP address `192.168.1.11`?", which is much more efficient than before because it will only get replies from the target device, and this is called **Address Resolution Protocol (ARP)**.

  After computer A gets the response, it will record:

  | IP Address        | MAC Address                  | Modem                       | Note       |
  | ----------------- | ---------------------------- | --------------------------- | ---------- |
  | 192.168.1.1       | CC:CC:CC:CC:CC:CC            |  AA:AA:AA:AA:AA:AA          | Router     |
  | 192.168.1.11      | BB:BB:BB:BB:BB:BB            |  AA:AA:AA:AA:AA:AA          | Computer B |

  Like before, computer A just need to send the message through modem `AA:AA:AA:AA:AA:AA` with correct destination MAC address `BB:BB:BB:BB:BB:BB`, then router (actually, it's the switch module of the router) will forward this message to computer B.

- Computer A with IP address `192.168.1.10` and MAC address `AA:AA:AA:AA:AA:AA` wants to communicate with computer B with IP address `192.168.2.11` and MAC address `BB:BB:BB:BB:BB:BB`, they are in different sub-network, so computer A will try to send a **third-level data package**.

  It will send the message to its default gateway (the router), and the destination MAC address also set to the router's MAC address.

  Then, the router will forward this message to the next router based on the destination IP address, also rewrite the destination MAC address to the next router's MAC address, until the message reaches the router of the target device, then this router will rewrite the destination MAC address to the target device's MAC address before the start of data link layer transmission.

  At the end, everything is the same as before, the last router finally forwards this message to computer B by using the MAC address records with port information.

  > [!Note]
  >
  > Behind how the router find the next router, there are a lot of technologies and protocols, such as routing algorithms, routing tables, dynamic routing protocols (RIP, OSPF, BGP, etc.), static routing, etc. But we won't go into details here.

Thanks to IP address and subnet mask, now you can create a really large network with many sub-networks, and manage the traffic between these sub-networks easily.

Congratulations, you invented the **Internet**, the largest computer network in the world! 😄

### Connect with Processes Inside Computers (Tranmission Control Protocol & User Datagram Protocol)

If we want to communicate with a specific process (program) inside a computer, IP address is not enough, we need an additional identifier, called **port**. Combined with IP address, this can uniquely identify a specific process inside a computer.

What's more, to ensure the reliability of communication between processes, we need to add some control information, such as sequence number, acknowledgment number, etc.

And the message sent has a new structure, we added a **transport layer** info to store the port numbers of both sender and receiver, we call it **fourth-level data fragment**:

```txt
+-------------------+---------------------------------------+------------------------------+-------------------+
| Data Link Layer   | Internet Layer Info (160 bits)        | Transport Layer Info         | Data (32 bits)    |
| Info (96 bits)    |                                       | (TCP 128 bits / UDP 64 bits) | (variable length) |
+-------------------+---------------------------------------+------------------------------+-------------------+
                                                                       |
                                                                       v
                                                            +------------------------------+
                                                            | Destination Port (16 bits)   |
                                                            |                              |
                                                            +------------------------------+
                                                            | Source Port (16 bits)        |
                                                            |                              |
                                                            +------------------------------+
                                                            | Header Info                  |
                                                            | (TCP 96 bits / UDP 32 bits)  |
                                                            +------------------------------+
```

The famous [**TCP (Transmission Control Protocol)**](https://en.wikipedia.org/wiki/Transmission_Control_Protocol) and [**UDP (User Datagram Protocol)**](https://en.wikipedia.org/wiki/User_Datagram_Protocol) are two widely used transport protocols that work on this layer.

Now, you are really be closed to the truth of nowadays computer network!

## OSI Seven Layers Model

Reading through the content above, you may already be familiar with a part of the seven layers of computer network.

The seven layers of computer network are:

1. **Physical Layer**: Responsible for the physical connection between devices, cables and optical fibers is the most common medium.
2. **Data Link Layer**: Responsible for node-to-node data transfer, including MAC addressing and error detection, these happens between the network cards of computers or other network devices.
3. **Internet Layer**: Responsible for routing data packets across different networks, including IP addressing and packet forwarding, also called the **IP Layer**.
4. **Transport Layer**: Responsible for end-to-end communication, including TCP and UDP protocols, port is used in this layer to identify specific processes inside computers.
5. **Session Layer**: Responsible for establishing, managing, and terminating sessions between applications, for example, RPC (Remote Procedure Call) protocol.
6. **Presentation Layer**: Responsible for data representation and encryption, including data compression and encryption protocols like TLS/SSL protocols.
7. **Application Layer**: Responsible for providing network services to applications, including HTTP, FTP, and DNS protocols.

In OSI layers model, protocols in each layer are based on the protocols in previous layer, and provide services to the protocols in next layer. For example, HTTP protocol in application layer is based on TCP protocol in transport layer, which is based on IP protocol in internet layer, which is based on Ethernet protocol in data link layer, which is based on physical layer.

In next sections, we will talk about the last three layers, which are more related to web development.

## Going Further

### Session Layer

TODO(Lumirelle): Add more details about session layer, such as RPC protocol, WebSocket protocol, etc.

### Presentation Layer (Transport Layer Security / Secure Sockets Layer Protocol)

#### What Is TLS/SSL?

**TLS (Transport Layer Security)** is a cryptographic protocol designed to provide communications security over a computer network, such as the Internet.

**SSL (Secure Sockets Layer)** is the predecessor of TLS and is now considered deprecated.

#### How TLS/SSL Works?

TLS/SSL works by using a combination of asymmetric and symmetric encryption to secure the communication between a client and a server. The process typically involves the following steps:

1. The client initiates a connection to the server and requests a secure connection.
2. The server responds with its digital certificate, which contains the server's public key and is signed by a trusted certificate authority (CA).
3. The client verifies the server's certificate against a list of trusted CAs. If the certificate is valid, the client generates a random symmetric key and encrypts it with the server's public key, then sends it to the server.
4. The server decrypts the symmetric key using its private key. Now both the client and the server have the same symmetric key, which they use to encrypt and decrypt the data they exchange during the session.
5. The client and server can now securely exchange data using the symmetric key for encryption.

This process ensures that the communication between the client and server is secure and that any data exchanged cannot be intercepted or tampered with by third parties.

The famous **HTTPS (HyperText Transfer Protocol Secure)** protocol is built on top of HTTP and TLS/SSL.

### Application Layer (HyperText Transfer Protocol)

#### What Is HTTP?

**HTTP (HyperText Transfer Protocol)** is a application protocol used for defining how the hypertext from web server to client should be transferred, it **uses TCP and IP under the hood**.

In web development, HTTP is the most widely used protocol in application layer (because web applications are always deployed on web servers and accessed through user's web browser via HTTP).

>[!Note]
>
> HTTPS is HTTP over TLS/SSL (presentation layer protocol), it is more secure than HTTP.

#### HTTP Message Structure

Request and response messages has similar structure, both consists of three main parts:

- Request line: Method + URL + HTTP version
- Request headers: Key-value pairs
- (Optional) Request body: Data sent to the server

For example:

```http
# Request line
POST /api/users HTTP/1.1
# Request headers
Host: www.example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0
Accept: application/json
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
Content-Type: application/json
Content-Length: 67

# Request body (optional, for POST, PUT, etc.)
{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

The response message structure is:

- Status line: HTTP version + Status code + Reason phrase
- Response headers: Key-value pairs
- (Optional) Response body: Data sent back to the client

For example:

```http
# Status line
HTTP/1.1 200 OK
# Response headers
Date: Wed, 18 Apr 2024 12:00:00 GMT
Server: Apache/2.4.1 (Unix)
Last-Modified: Wed, 18 Apr 2024 11:00:00 GMT
Content-Length: 12345
Content-Type: text/html; charset=UTF-8

# Response body (optional)
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

#### HTTP Versions

See [Performance Optimization: HTTP Versions](perf-http-versions) for more information.

#### HTTP Headers

See [MDN Web Docs: HTTP headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers) for more information.

#### HTTP Methods

HTTP defines a set of request methods to indicate the desired action to be performed for a given resource. The most common methods are:

- `GET`: Retrieve data from the server. It is **safe**[^2] and **idempotent**[^3].
- `POST`: Send data to the server to create a new resource. It is **not safe** and **not idempotent**.
- `PUT`: Update or replace an existing resource on the server. It is **not safe** but **idempotent**.
- `DELETE`: Remove a resource from the server. It is **not safe** but **idempotent**.
- `PATCH`: Partially update an existing resource on the server. It is **not safe** and not necessarily **idempotent**.
- `HEAD`: Similar to `GET`, but only retrieves the headers without the body. It is **safe** and **idempotent**.
- `OPTIONS`: Describe the communication options for the target resource. It is **safe** and **idempotent**.
- `TRACE`: Perform a message loop-back test along the path to the target resource. It is **safe** and **idempotent**.
- ...

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
        "dev": {
          "baseUrl": "http://api-dev.example.com",
          "authToken": "your-auth-token"
        },
        "prod": {
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

[^2]: **Safe** methods are those that do not modify resources on the server. They are intended for information retrieval only.

[^3]: **Idempotent** methods are those that can be called multiple times without different outcomes. The first request has the same effect as subsequent requests.
