---
title: Windows Setup Manual
date: 2025-08-24T19:40:00+08:00
update: 2025-10-27T14:31+08:00
lang: en
duration: 9min
type: blog+note
---

[[toc]]

## Foreword

I know Windows is the best OS to play games, but the worst OS to develop.

If we have no choice, the only one thing we can do is trying our best to make Windows being better for our development.

## First Step: Install Windows

We can use [Ventoy](https://www.ventoy.net/en/download.html) to make a bootable USB drive to install Windows.

Notice that, by default, Ventoy will skip the device check and online check while Windows is setting up.

You can also bypass these check manually by unplugging the network cable and executing these commands below (Press `Shift + F10` to open CMD):

```sh
cd OOBE
BypassNRO.cmd
```

### Install And Set Up Ventoy

Insert your USB flash driver, follow the steps in the [official document](https://www.ventoy.net/en/doc_start.html) to install and set up Ventoy.

### Download Windows ISO

For developers, it's recommended to use the latest professional edition of Windows.

From Microsoft (Official):

- [Windows 11 ISO](https://www.microsoft.com/en-us/software-download/windows11)
- [Windows 10 ISO](https://www.microsoft.com/en-us/software-download/windows10)

From MAS:

- [Windows 11 ISO](https://massgrave.dev/windows_11_links)
- [Windows 10 ISO](https://massgrave.dev/windows_10_links)
- [Windows LTSC ISO](https://massgrave.dev/windows_ltsc_links)

### Make A Bootable USB Drive

Move the downloaded Windows ISO file to the USB flash drive.

Insert the USB flash drive, restart your computer and enter BIOS, then choose your USB flash drive in the boot menu.

After Ventoy starts up, choose the Windows ISO and just start to install it.

Then, customize your installation options and wait for the installation to complete.

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

```sh
winget install "<PACKAGE_NAME>" --location "/PATH/YOU/LIKE"
```

For more information:

```sh
winget -?
```

### 1: Clean Up Annoyed System Bundled Software

Uninstall Office 365, Microsoft PC Manager and other trash (system bundled software) you don't need at all, close the UAC (User Account Control) as your need.

Then, close all of anti-virus features of Windows Defender, and use [Huorong](https://www.huorong.cn/person) instead (Much quieter and non-invasive)

| Software | Source/Install Method                    |
| -------- | ---------------------------------------- |
| Huorong  | [Huorong](https://www.huorong.cn/person) |

After Huorong start up, restart your computer, Windows Defender will be closed.

At the end, use Windows 11 Setting Easily (Support Windows 10 too) to close Windows Defender completely, you will see
there is only the Windows Defender service exists, and Windows Defender is being disabled entirely.

| Software                  | Source/Install Method                                                   |
| ------------------------- | ----------------------------------------------------------------------- |
| Windows 11 Setting Easily | [Article on Bilibili](https://www.bilibili.com/opus/904672369138729017) |

Notice that, you should close Windows Defender first, because it will clean Windows 11 Setting Easily as a potential threat.

### 2: Setting Up Network Tool (Optional)

Just install Clash Verge Rev, We will configure it [later](#3-setting-up-personal-preferences).

| Software        | Source/Install Method                                                          |
| --------------- | ------------------------------------------------------------------------------ |
| Clash Verge Rev | [GitHub Releases](https://github.com/clash-verge-rev/clash-verge-rev/releases) |

### 3: Setting Up Personal Preferences

Runtime requires:

| Software         | Source/Install Method                                             | Notice                                                                                                                                                                                                                                                                                                      |
| ---------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Windows Terminal | [Microsoft Store](https://apps.microsoft.com/detail/9n0dx20hk701) | /                                                                                                                                                                                                                                                                                                           |
| gsudo            | `winget install gerardog.gsudo --scope machine`                   | Run Windows Terminal as admin, because gsudo isn't installed yet, we don't have `sudo` command now.<br><br>If you are using Windows 11, please put `C:\Program Files\WinGet\Links` in path the very front to avoid being covered by built-in `sudo` command under `C:\Windows\system32` which is not useful |
| Nushell          | `sudo winget install nushell --scope machine`                     | Command `sudo` is powered by gsudo now                                                                                                                                                                                                                                                                      |
| Starship         | `sudo winget install Starship.Starship --scope machine`           | A rust shell prompt                                                                                                                                                                                                                                                                                         |
| fnm              | `sudo winget install Schniz.fnm --scope machine`                  | /                                                                                                                                                                                                                                                                                                           |

<details>
<summary>Setting up via Nushell (Recommended)</summary>

```sh
# Start fnm temporary
^fnm env --json | from json | load-env
$env.PATH = $env.PATH | prepend ($env.FNM_MULTISHELL_PATH | path join (if $nu.os-info.name == 'windows' {''} else {'bin'}))

# Use Node.js version 22
fnm use 22

# It's recommended to upgrade npm to >= 10.9.3
# Node.js 20+
npm i npm@latest -g
# Node.js 18
npm i npm@^10.9.3 -g
# Node.js < 18, use the bundled npm

# Install useful global node package
# Dependencies manager
npm i corepack @antfu/ni @antfu/nip taze bun -g
# Project scaffolding
npm i @sxzz/create esbuild -g
# Version control helper
npm i czg bumpp changelogithub -g
# If you are still using Node.js < 18
npm i @antfu/ni czg -g

# Install my personal preferences
npm i starship-butler -g
butler cfsys -f
```

</details>

<details>
<summary>Setting up via PowerShell (Deprecated)</summary>

```sh
# Must allow executing local scripts
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# Start fnm temporary
fnm env --use-on-cd --corepack-enabled --shell powershell | Out-String | Invoke-Expression

# Use Node.js version 22
fnm use 22

# It's recommended to upgrade npm to >= 10.9.3
# Node.js 20+
npm i npm@latest -g
# Node.js 18
npm i npm@^10.9.3 -g
# Node.js < 18, use the bundled npm

# Install useful global node package
# Dependencies manager
npm i corepack @antfu/ni @antfu/nip taze bun -g
# Project scaffolding
npm i @sxzz/create esbuild -g
# Version control helper
npm i czg bumpp changelogithub -g
# If you are still using Node.js < 18
npm i @antfu/ni czg -g

# Install my personal preferences
npm i starship-butler -g
butler cfsys -f
```

</details>

### 4: Install Software Preferred

Install the basic software below in order:

| Software                        | Source/Install Method                                                                   | Note                                                                                                                                             |
| ------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Brave                           | [Brave](https://brave.com/download/)                                                    | [Extensions](#5-brave-browser)                                                                                                                   |
| uTools                          | [uTools](https://www.u-tools.cn/download/)                                              | Basic Extensions: 聚合翻译, 本地搜索, OCR文字识别, 计算稿纸, 颜色助手<br><br>Dev Extensions: npm包实时搜索, 编码小助手, 超级JavaScript, Any Rule |
| Auto Dark Mode                  | [Microsoft Store](https://apps.microsoft.com/detail/xp8jk4hzbvf435)                     | /                                                                                                                                                |
| NanaZip                         | [Microsoft Store](https://www.microsoft.com/store/apps/9N8G7TSCL18R)                    | /                                                                                                                                                |
| KeePass 2                       | [KeePass](https://keepass.info/download.html)                                           | Extensions: ColoredPassword, HaveIBeenPwned, KeePassHttp                                                                                         |
| Visual Studio Code              | [Visual Studio Code](https://code.visualstudio.com/Download)                            | /                                                                                                                                                |
| Cursor                          | [Cursor](https://www.cursor.com/downloads)                                              | /                                                                                                                                                |
| Zed                             | [Zed](https://zed.dev/)                                                                 | /                                                                                                                                                |
| IDM                             | [Internet Download Manager](https://www.internetdownloadmanager.com/download.html)      | /                                                                                                                                                |
| Git                             | [Git](https://git-scm.com/download/win)                                                 | /                                                                                                                                                |
| Context Menu Manager            | [GitHub Releases](https://github.com/BluePointLilac/ContextMenuManager/releases)        | For classic context menu                                                                                                                         |
| Windows 11 Context Menu Manager | [GitHub Releases](https://github.com/branhill/windows-11-context-menu-manager/releases) | For new context menu                                                                                                                             |
| DISM++                          | [GitHub Releases](https://github.com/Chuyu-Team/Dism-Multi-language/releases)           |                                                                                                                                                  |
| Driver Store Explorer           | [GitHub Releases](https://github.com/lostindark/DriverStoreExplorer/releases)           | /                                                                                                                                                |
| Revo Uninstaller                | [Revo Uninstaller](https://www.revouninstaller.com/zh/revo-uninstaller-free-download/)  | /                                                                                                                                                |
| DeskPins                        | [DeskPins](https://efotinis.neocities.org/deskpins/)                                    | /                                                                                                                                                |

Install the tool software below in order:

| Software         | Source/Install Method                                                   |
| ---------------- | ----------------------------------------------------------------------- |
| 微信             | [微信](https://pc.weixin.qq.com/)                                       |
| QQ               | [QQ](https://im.qq.com/pcqq/index.shtml)                                |
| Telegram         | [Telegram](https://desktop.telegram.org/)                               |
| WPS Office       | [123pan](https://www.123pan.com/s/sXtA-iLVEh.html)                      |
| PixPin           | [PixPin](https://pixpin.com/)                                           |
| LX Music Desktop | [GitHub Releases](https://github.com/lyswhut/lx-music-desktop/releases) |
| PotPlayer        | [Microsoft Store](https://apps.microsoft.com/detail/xp8bsbgqw2dks0)     |
| NVIDIA App       | [NVIDIA](https://www.nvidia.com/en-us/software/nvidia-app/)             |
| Steam            | [Steam](https://store.steampowered.com/about)                           |
| Epic Games       | [Epic Games](https://store.epicgames.com/download)                      |
| OBS Studio       | [OBS Studio](https://obsproject.com/download)                           |

Install the dev software (WSL / SDK / IDE) below in order:

| Software                 | Source/Install Method                                                              | Note                                                                                                                                    |
| ------------------------ | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| WSL                      | `wsl --install`                                                                    | /                                                                                                                                       |
| Rust                     | [Rust](https://rust-lang.org/tools/install/)                                       | /                                                                                                                                       |
| GraalVM                  | [GraalVM](https://www.graalvm.org/downloads/)                                      | /                                                                                                                                       |
| Python                   | [Python](https://www.python.org/downloads/)                                        | I prefer to disable **"tcl/tk and IDLE"** option                                                                                        |
| Mingw-w64                | [GitHub Releases](https://github.com/niXman/mingw-builds-binaries/releases/latest) | **GCC (GNU Compiler Collection)** migration for Windows<br><br>I prefer to choose **"Posix thread model"** and **"UC runtime"** options |
| Neovim                   | `sudo winget install Neovim.Neovim --scope machine`                                | /                                                                                                                                       |
| LazyVim                  | [LazyVim](https://www.lazyvim.org/installation)                                    | Requires **GCC**                                                                                                                        |
| Visual Studio            | [Visual Studio](https://visualstudio.microsoft.com/downloads/)                     | Bundles **MSVC (Microsoft Visual C++) compiler**                                                                                        |
| JetBrains Toolbox        | [JetBrains](https://www.jetbrains.com/toolbox-app/)                                | /                                                                                                                                       |
| JetBrains IntelliJ IDEA  | Install from JetBrains Toolbox                                                     | /                                                                                                                                       |
| ~~Navicat Premium Lite~~ | [Navicat](https://www.navicat.com/download/navicat-premium-lite)                   | /                                                                                                                                       |
| ~~Docker Desktop~~       | [Docker](https://www.docker.com/products/docker-desktop/)                          | /                                                                                                                                       |

(Optional) Install other software below:

| Software                   | Source/Install Method                                                           |
| -------------------------- | ------------------------------------------------------------------------------- |
| Visual C++ Redistributable | [Microsoft](https://learn.microsoft.com/cpp/windows/latest-supported-vc-redist) |
| AIDE64                     |                                                                                 |
| Crystal Disk Info          | [CrystalDiskInfo](https://crystalmark.info/software/crystaldiskinfo/)           |
| KeyboardSplitter           | [GitHub Releases](https://github.com/djlastnight/KeyboardSplitterXbox/releases) |
| PDF SAM                    | [PDF SAM](https://pdfsam.org/download-pdfsam-basic/)                            |

### 5: Brave Browser

I hate Chrome because it's too opinionated, I hate Edge because it's too heavy.

I just want a Chromium based browser, who is tiny, clean and customizable.

Install useful extensions (Notice: "篡改猴" extension requires you to open the develop mode):

| Extension           | Source/Install Method (`~` is the same as above) | Note                                              |
| ------------------- | ------------------------------------------------ | ------------------------------------------------- |
| Tampermonkey        | Chrome Extension Marketplace                     | Scripts: Download VS Code Extension VSIX Packages |
| ChromeKeePass       | ~                                                | /                                                 |
| Dark Reader         | ~                                                | /                                                 |
| Immersive Translate | ~                                                | /                                                 |
| Grammarly           | ~                                                | /                                                 |

Install dev extensions:

| Extension                        | Source/Install Method (`~` is the same as above) | Note                                                                                        |
| -------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| Vue.js Devtools (Legacy)         | Chrome Extension Marketplace                     | For Vue 3, I recommended to use [Vite plugin](https://devtools.vuejs.org/guide/vite-plugin) |
| Cookie Editor                    | ~                                                | Extension Key：`ookdjilphngeeeghgngjabigmpepanpl`                                           |
| SEO META in 1 CLICK              | ~                                                | /                                                                                           |
| Refined Github                   | ~                                                | /                                                                                           |
| File Icons for GitHub and GitLab | ~                                                | /                                                                                           |

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

- `~/i/` (Inspired by [antfu](https://github.com/antfu))
- `<DRIVER>:/Projects/`

Use Revo Uninstaller clean useless software at regular intervals.

Use DISM++ clean system at regular intervals.

Shut down and restart at regular intervals.
