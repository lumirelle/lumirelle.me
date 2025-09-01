---
title: Windows Setup Manual
date: 2025-08-24T19:40:00
lang: en
duration: 30min
---

[[toc]]

I know Windows is the best OS to play games, but the worst OS to develop.

If we have no choice, the only one thing we can do is trying our best to make Windows be better for our development.

## First Step: Install or Reinstall

We can use [Ventoy](https://www.ventoy.net/cn/download.html) to make a USB flash driver boot loader to install or reinstall Windows.

Notice that, by default, Ventoy will skip the device check and online check while Windows is setting up. You can also bypass these check manually by these commands below (Press `Shift + F10` to open CMD):

```sh
cd OOBE
BypassNRO.cmd
```

### Install Ventoy

Insert your USB flash driver, follow the steps in [official document](https://www.ventoy.net/cn/doc_start.html) to install and set up Ventoy.

### Download Windows ISO

For developers, it's recommended to use the professional edition of Windows.

From Microsoft (Official):

- [Windows 11 LTSC Enterprise](https://golf.rendering.prod.mscas.io/en-us/evalcenter/download-windows-11-enterprise) (I preferred)
- [Windows 11 ISO](https://www.microsoft.com/en-us/software-download/windows11)
- [Windows 10 ISO](https://www.microsoft.com/en-us/software-download/windows10)

From NEXT, ITELLYOU (For specific Windows edition or version):

- [Windows 11 ISO](https://next.itellyou.cn/Original/#cbp=Product?ID=42e87ac8-9cd6-eb11-bdf8-e0d4e850c9c6)
- [Windows 10 ISO](https://next.itellyou.cn/Original/#cbp=Product?ID=f905b2d9-11e7-4ee3-8b52-407a8befe8d1)
- [Others edition or version](https://next.itellyou.cn/Original/)

If you want to download the Windows ISO via NEXT, ITELLYOU, a BT downloader is required. I recommend [qBittorrent Enhanced Edition](https://github.com/c0re100/qBittorrent-Enhanced-Edition/releases).
Then, you should set the tracker: <https://fastly.jsdelivr.net/gh/XIU2/TrackersListCollection/all.txt>

Notice that, if you are using VPN tool like Clash, please close it or switch to direct mode for better download speed.

### Prepare USB Flash Driver Boot Loader

Move the downloaded Windows ISO file to the USB flash drive.

Insert your USB flash driver with the installation of Ventoy and Windows ISO, and choose it to boot your computer in BIOS.

After Ventoy starts up, choose the right edition & version of Windows ISO and just start to install it.

Then, wait for the installation to complete.

## Second Step: Setting Up System Preferences

Just follow the steps below, clean up the annoyed system bundled software, and install tools you preferred. 😍

### 0: Learn How To Use winget

Install (User Scope):

```sh
winget install "<PACKAGE_NAME>" "[--scope user]"
```

Install (Machine Scope, requires admin permission):

```sh
# In windows, `sudo` command is powered by `gsudo`
sudo winget install "<PACKAGE_NAME>" --scope machine
```

Install on specific location:

```shell
winget install "<PACKAGE_NAME>" --location "/PATH/YOU/LIKE"
```

### 1: Clean Up Annoyed System Bundled Software

If you use Windows Home Edition or Professional Edition, please uninstall Office 365, Microsoft PC Manager and other trash (system bundled software)

Then, close the anti-virus feature of Windows Defender, use [Huorong](https://www.huorong.cn/person) instead (Much quieter and non-invasive)

| Software | Source/Install Method                    |
| -------- | ---------------------------------------- |
| Huorong  | [Huorong](https://www.huorong.cn/person) |

~~At the end, use Windows 11 Setting Easily (Support Windows 10 too) to close Windows Defender completely, adjust system setting.~~
~~Don't forget to restart your computer at last.~~

| ~~Software~~                  | ~~Source/Install Method~~                                                   |
| ----------------------------- | --------------------------------------------------------------------------- |
| ~~Windows 11 Setting Easily~~ | ~~[Article on Bilibili](https://www.bilibili.com/opus/904672369138729017)~~ |

### 2: Setting Up Network Tool (Optional)

Just install Clash Verge Rev, We will configure it later.

| Software        | Source/Install Method                                                          |
| --------------- | ------------------------------------------------------------------------------ |
| Clash Verge Rev | [GitHub Releases](https://github.com/clash-verge-rev/clash-verge-rev/releases) |

### 3: Setting Up Personal Preferences

Runtime requires:

| Software                           | Source/Install Method                                                           | Notice                                                                                                                                                                                                                                               |
| ---------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Windows Terminal                   | [Microsoft Store](https://apps.microsoft.com/detail/9n0dx20hk701)               | /                                                                                                                                                                                                                                                    |
| gsudo                              | `winget install gerardog.gsudo --scope machine`                                 | Run Windows Terminal as admin, because gsudo isn't installed yet, we don't have `sudo` command now.<br><br>If you are using latest Windows 11, please put gsudo the very front to avoid being covered by built-in `sudo` command which is not useful |
| Nushell                            | `sudo winget install nushell --scope machine`                                   | Command `sudo` is powered by gsudo now                                                                                                                                                                                                               |
| ~~PowerShell 7 (Will Deprecated)~~ | ~~[GitHub Releases](https://github.com/PowerShell/PowerShell/releases/latest)~~ | ~~/~~                                                                                                                                                                                                                                                |
| Oh My Posh                         | `sudo winget install JanDeDobbeleer.OhMyPosh --scope machine`                   | /                                                                                                                                                                                                                                                    |
| fnm                                | `sudo winget install Schniz.fnm`                                                | Maybe not support `--scope machine` yet                                                                                                                                                                                                              |

Setting up via Nushell:

```sh
# Start fnm temporary
^fnm env --json | from json | load-env
$env.PATH = $env.PATH | prepend ($env.FNM_MULTISHELL_PATH | path join (if $nu.os-info.name == 'windows' {''} else {'bin'}))

# Install Node.js of latest major version 22
# Notice that, we will just use the LTS version of Node.js
# In fnm, they will be tagged with version code like `Iron` for Node.js 20 LTS
fnm i 22

# Install useful global node package
npm i @antfu/ni @antfu/nip @sxzz/create taze czg -g
# If you are using Node.js < 18, you can just install @antfu/ni and czg as they do not strongly relied on Node.js version
npm i @antfu/ni czg -g

# It's recommended to upgrade npm to >= 10.9.3
# Node.js < 18
# Use bundled npm
# Node.js 18
npm i npm@^10.9.3 -g
# Node.js 20+
npm i npm@latest -g

# Install my personal preferences
npm i impurities -g
# Requires admin permission
sudo we i -f
```

~~Setting up via PowerShell (Deprecated)~~

```sh
# Must allow executing local scripts
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# Start fnm temporary
fnm env --use-on-cd --corepack-enabled --shell powershell | Out-String | Invoke-Expression

# Install Node.js of latest major version 22
# Notice that, we will just use the LTS version of Node.js
# In fnm, they will be tagged with version code like `Iron` for Node.js 20 LTS
fnm i 22

# Install useful global node package
npm i @antfu/ni @antfu/nip @sxzz/create taze czg -g
# If you are using Node.js < 18, you can just install @antfu/ni and czg as they do not strongly relied on Node.js version
npm i @antfu/ni czg -g

# It's recommended to upgrade npm to >= 10.9.3
# Node.js < 18
# Use bundled npm
# Node.js 18
npm i npm@^10.9.3 -g
# Node.js 20+
npm i npm@latest -g

# Install my personal preferences
npm i impurities -g
# Requires admin permission
sudo we i -f
```

### 4: Install Software Preferred

Install the basic software below in order:

| Software                        | Source/Install Method                                                                   | Note                                                                                                                                             |
| ------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Brave                           | [Brave](https://brave.com/download/)                                                    | [Extensions](#_5-brave-browser)                                                                                                                  |
| uTools                          | [uTools](https://www.u-tools.cn/download/)                                              | Basic Extensions: 聚合翻译, 本地搜索, OCR文字识别, 计算稿纸, 颜色助手<br><br>Dev Extensions: npm包实时搜索, 编码小助手, 超级JavaScript, Any Rule |
| Auto Dark Mode                  | [Microsoft Store](https://apps.microsoft.com/detail/xp8jk4hzbvf435)                     | /                                                                                                                                                |
| NanaZip                         | [Microsoft Store](https://www.microsoft.com/store/apps/9N8G7TSCL18R)                    | /                                                                                                                                                |
| KeePass 2                       | [KeePass](https://keepass.info/download.html)                                           | Extensions: ColoredPassword, HaveIBeenPwned, KeePassHttp                                                                                         |
| Visual Studio Code              | [Visual Studio Code](https://code.visualstudio.com/Download)                            | /                                                                                                                                                |
| Cursor                          | [Cursor](https://www.cursor.com/cn/downloads)                                           | /                                                                                                                                                |
| IDM                             | [Internet Download Manager](https://www.internetdownloadmanager.com/download.html)      | /                                                                                                                                                |
| Git                             | [Git](https://git-scm.com/download/win)                                                 | /                                                                                                                                                |
| Visual C++ Redistributable      | [Microsoft](https://learn.microsoft.com/zh-cn/cpp/windows/latest-supported-vc-redist)   | /                                                                                                                                                |
| Context Menu Manager            | [GitHub Releases](https://github.com/BluePointLilac/ContextMenuManager/releases)        | /                                                                                                                                                |
| Windows 11 Context Menu Manager | [GitHub Releases](https://github.com/branhill/windows-11-context-menu-manager/releases) | /                                                                                                                                                |
| DISM++                          | [GitHub Releases](https://github.com/Chuyu-Team/Dism-Multi-language/releases)           |                                                                                                                                                  |
| Driver Store Explorer           | [GitHub Releases](https://github.com/lostindark/DriverStoreExplorer/releases)           | /                                                                                                                                                |
| Revo Uninstaller                | [Revo Uninstaller](https://www.revouninstaller.com/zh/revo-uninstaller-free-download/)  | /                                                                                                                                                |
| HEU KMS Activator               | [GitHub Releases](https://github.com/zbezj/HEU_KMS_Activator/releases)                  | /                                                                                                                                                |

Install the tool software below in order:

| Software         | Source/Install Method                                                   |
| ---------------- | ----------------------------------------------------------------------- |
| 微信             | [微信](https://pc.weixin.qq.com/)                                       |
| QQ               | [QQ](https://im.qq.com/pcqq/index.shtml)                                |
| Telegram         | [Telegram](https://desktop.telegram.org/)                               |
| WPS Office       | [123pan](https://www.123pan.com/s/sXtA-iLVEh.html)                      |
| PixPin           | [PixPin](https://pixpin.cn/)                                            |
| LX Music Desktop | [GitHub Releases](https://github.com/lyswhut/lx-music-desktop/releases) |
| PotPlayer        | [Microsoft Store](https://apps.microsoft.com/detail/xp8bsbgqw2dks0)     |
| NVIDIA App       | [NVIDIA](https://www.nvidia.cn/software/nvidia-app/)                    |
| Steam            | [Steam](https://store.steampowered.com/about)                           |
| Epic Games       | [Epic Games](https://store.epicgames.com/zh-CN/download)                |
| OBS Studio       | [OBS Studio](https://obsproject.com/download)                           |

Install the dev software below in order:

| Software             | Source/Install Method                                                              | Note                                          |
| -------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------- |
| Mingw-w64            | [GitHub Releases](https://github.com/niXman/mingw-builds-binaries/releases/latest) | /                                             |
| Neovim               | `winget install Neovim.Neovim`                                                     | /                                             |
| LazyVim              | [LazyVim](https://www.lazyvim.org/installation)                                    | /                                             |
| JDK                  | [Oracle](https://www.oracle.com/cn/java/technologies/downloads/#graalvmjava21)     | /                                             |
| VEnv                 | `python -m venv /path/to/new/virtual/environment`                                  | /                                             |
| JetBrains Toolbox    | [JetBrains](https://www.jetbrains.com/zh-cn/lp/toolbox/)                           | /                                             |
| JetBrains IDEA       | Install from JetBrains Toolbox                                                     | /                                             |
| Visual Studio        | [Visual Studio](https://visualstudio.microsoft.com/zh-hans/downloads/)             | /                                             |
| Navicat Premium Lite | [Navicat](https://www.navicat.com.cn/download/navicat-premium-lite)                | /                                             |
| WSL                  | `wsl --install`                                                                    | You should enable Hyper-V & WSL support first |
| Docker Desktop       | [Docker](https://www.docker.com/products/docker-desktop/)                          | /                                             |

(Optional) Install other software below:

| Software             | Source/Install Method                                                               |
| -------------------- | ----------------------------------------------------------------------------------- |
| Ventoy               | [GitHub Releases](https://github.com/ventoy/Ventoy/releases)                        |
| qBittorrent Enhanced | [GitHub Releases](https://github.com/c0re100/qBittorrent-Enhanced-Edition/releases) |
| AIDE64               |                                                                                     |
| Crystal Disk Info    | [CrystalDiskInfo](https://crystalmark.info/en/software/crystaldiskinfo/)            |
| KeyboardSplitter     | [GitHub Releases](https://github.com/djlastnight/KeyboardSplitterXbox/releases)     |
| PDF SAM              | [PDF SAM](https://pdfsam.org/zh/download-pdfsam-basic/)                             |

### 5: Brave Browser

I hate Chrome because it's too opinionated, I hate Edge because it's too heavy.

I just want a Chromium based browser, who is tiny, clean and customizable.

Install useful extensions (Notice: "篡改猴" extension requires you to open the develop mode):

| Extension     | Source/Install Method (`~` is the same as above) | Note                                   |
| ------------- | ------------------------------------------------ | -------------------------------------- |
| 篡改猴        | Chrome Extension Marketplace                     | Scripts: 下载 VS Code 扩展插件 VSIX 包 |
| ChromeKeePass | ~                                                | /                                      |
| Dark Reader   | ~                                                | /                                      |
| 沉浸式翻译    | ~                                                | /                                      |
| Grammarly     | ~                                                | /                                      |

Install dev extensions:

| Extension                        | Source/Install Method (`~` is the same as above) | Note                                              |
| -------------------------------- | ------------------------------------------------ | ------------------------------------------------- |
| Vue.js Devtools                  | Chrome Extension Marketplace                     | /                                                 |
| Vue.js Devtools (Legacy)         | ~                                                | /                                                 |
| Cookie Editor                    | ~                                                | Extension Key：`ookdjilphngeeeghgngjabigmpepanpl` |
| SEO META in 1 CLICK              | ~                                                | /                                                 |
| Refined Github                   | ~                                                | /                                                 |
| File Icons for GitHub and GitLab | ~                                                | /                                                 |

### 6: Configure Windows Itself

(Optional) Use HEU KMS Activator to activate Windows

| Software          | Source/Install Method                                                  |
| ----------------- | ---------------------------------------------------------------------- |
| HEU KMS Activator | [GitHub Releases](https://github.com/zbezj/HEU_KMS_Activator/releases) |

At the end, login Microsoft Account, sync the system data, adjust system setting

## Third Step: Maintain System

Programs should under:

- No space path
  - `<DRIVER>:/ProgramData/`
- Standard path
  - `<DRIVER>:/Program Files/`
  - `<DRIVER>:/Program Files (x86)/`
- Portable path
  - `<DRIVER>:/Program Files Portable/`
- User scope path - `$LOCALAPPDATA/Programs/`

Projects should under:

- `<DRIVER>:/Projects/`
- `<DRIVER>:/i/` (Inspired by [antfu](https://github.com/antfu))

Use Revo Uninstaller clean useless software at regular intervals.

Use DISM++ clean system at regular intervals.

Shut down and restart at regular intervals.
