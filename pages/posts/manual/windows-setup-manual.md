---
title: Windows Setup Manual
date: 2025-08-24T19:40:00+08:00
update: 2025-12-08T12:31+08:00
lang: en
duration: 8min
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

```bat
cd OOBE
BypassNRO.cmd
```

### Install and Set up Ventoy

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

### Make a Bootable USB Drive

Move the downloaded Windows ISO file to the USB flash drive.

Insert the USB flash drive, restart your computer and enter BIOS, then choose your USB flash drive in the boot menu.

After Ventoy starts up, choose the Windows ISO and just start to install it.

Then, customize your installation options and wait for the installation to complete.

## Second Step: Setting up System Preferences

Just follow the steps below, clean up the annoyed system bundled software, and install tools you preferred. 😍

### Learn How to Use winget

Install (User Scope):

```nu
winget install <PACKAGE_NAME> [--scope user]
```

Install (Machine Scope, requires admin permission):

```nu
# In windows, `sudo` command is powered by `gsudo`
sudo winget install <PACKAGE_NAME> --scope machine
```

Install on specific location:

```nu
winget install <PACKAGE_NAME> -l '/PATH/YOU/LIKE'
```

Install with interactive mode (default is non-interactive UI mode):

```nu
winget install <PACKAGE_NAME> -i
```

Install with no UI mode (default is non-interactive UI mode):

```nu
winget install <PACKAGE_NAME> -h
```

For more information:

```nu
winget -?
```

### Clean up Annoyed System Bundled Software

Uninstall Office 365, Microsoft PC Manager and other trash (system bundled software) you don't need at all, close the UAC (User Account Control) as your need.

Then, close all of anti-virus features of Windows Defender, and use [Huorong](https://www.huorong.cn/person) instead (Much quieter and non-invasive)

| Software | Source/Install Method                    |
| -------- | ---------------------------------------- |
| Huorong  | [Huorong](https://www.huorong.cn/person) |

After that, use Windows 11 Setting Easily (Support Windows 10 too) to close Windows Defender completely, and restart your computer. You will see there is only the Windows Defender service exists at the end, that's means Windows Defender is being disabled entirely.

| Software                  | Source/Install Method                                                   |
| ------------------------- | ----------------------------------------------------------------------- |
| Windows 11 Setting Easily | [Article on Bilibili](https://www.bilibili.com/opus/904672369138729017) |

> [!Note]
>
> You should close Windows Defender first, because it will clean Windows 11 Setting Easily as a potential threat.

### Setting up Network Tool (Optional)

Just install Clash Verge Rev, We will configure it [later](#setting-up-personal-preferences).

| Software        | Source/Install Method                                                          |
| --------------- | ------------------------------------------------------------------------------ |
| Clash Verge Rev | [GitHub Releases](https://github.com/clash-verge-rev/clash-verge-rev/releases) |

### Setting up Personal Preferences

Requires:

| Software         | Source/Install Method                                             | Note                                                                                                                                                                                                                                                                                                         |
| ---------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Windows Terminal | [Microsoft Store](https://apps.microsoft.com/detail/9n0dx20hk701) | System bundled, if not, you can install it manually.                                                                                                                                                                                                                                                         |
| gsudo            | `winget install gerardog.gsudo --scope machine`                   | Run Windows Terminal as admin, because gsudo isn't installed yet, we don't have `sudo` command now.<br><br>If you are using Windows 11, please put `C:\Program Files\WinGet\Links` in path the very front to avoid being covered by built-in `sudo` command under `C:\Windows\system32` which is not useful. |
| Nushell          | `sudo winget install nushell --scope machine`                     | Command `sudo` is powered by gsudo now.                                                                                                                                                                                                                                                                      |
| Starship         | `sudo winget install Starship.Starship --scope machine`           | A rust-powered shell prompt.                                                                                                                                                                                                                                                                                 |
| Bun              | `sudo winget install Oven-sh.Bun --scope machine`                 | /                                                                                                                                                                                                                                                                                                            |

Running the commands below:

```nu
# Install useful global node package
# PM Adapter & Dependencies Updater
bun i @antfu/ni taze -g
# Project Creator & Build Tools
bun i @sxzz/create esbuild vite -g
# Version Control Helper
bun i czg bumpp changelogithub -g
# NeoVim Setup Requires
bun i tree-sitter-cli -g

# Install my personal preferences
bun i starship-butler -g
butler cfsys -f
# Or you don't want to override your existing configs:
butler cfsys
```

### Install Software Preferred

Install the basic software below in order:

| Software                        | Source/Install Method                                                                   | Note                                                                                                                                                                                                                                        |
| ------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brave                           | [Official Website](https://brave.com/download/)                                         | [Extensions](#brave-browser)                                                                                                                                                                                                                |
| RayCast                         | [Official Website](https://www.raycast.com/)                                            | Basic Extensions: _Installed Extensions_, _Google Translate_, _Spell_, _GitHub_, _MyIP_, _Speedtest_, _Kill Process_, _Port Manager_<br><br>Dev Extensions: _DevDocs_, _Svgl_, _Search MDN_, _Search npm Packages_, _Random Data Generator_ |
| Auto Dark Mode                  | [Microsoft Store](https://apps.microsoft.com/detail/xp8jk4hzbvf435)                     | /                                                                                                                                                                                                                                           |
| NanaZip                         | [Microsoft Store](https://www.microsoft.com/store/apps/9N8G7TSCL18R)                    | /                                                                                                                                                                                                                                           |
| ~~KeePass 2~~                   | ~~[Official Website](https://keepass.info/download.html)~~                              | ~~Extensions: _ColoredPassword_, _HaveIBeenPwned_, _KeePassHttp_~~                                                                                                                                                                          |
| KeePassXC                       | [Official Website](https://keepassxc.org/download/)                                     | **In migration...**                                                                                                                                                                                                                         |
| Visual Studio Code              | [Official Website](https://code.visualstudio.com/Download)                              | /                                                                                                                                                                                                                                           |
| Cursor                          | [Official Website](https://www.cursor.com/downloads)                                    | /                                                                                                                                                                                                                                           |
| Zed                             | [Official Website](https://zed.dev/)                                                    | **Still experimental**                                                                                                                                                                                                                      |
| IDM                             | [Official Website](https://www.internetdownloadmanager.com/download.html)               | /                                                                                                                                                                                                                                           |
| Git                             | [Official Website](https://git-scm.com/download/win)                                    | /                                                                                                                                                                                                                                           |
| Context Menu Manager            | [GitHub Releases](https://github.com/BluePointLilac/ContextMenuManager/releases)        | For classic context menu                                                                                                                                                                                                                    |
| Windows 11 Context Menu Manager | [GitHub Releases](https://github.com/branhill/windows-11-context-menu-manager/releases) | For Windows 11 new context menu                                                                                                                                                                                                             |
| DISM++                          | [GitHub Releases](https://github.com/Chuyu-Team/Dism-Multi-language/releases)           | /                                                                                                                                                                                                                                           |
| Driver Store Explorer           | [GitHub Releases](https://github.com/lostindark/DriverStoreExplorer/releases)           | /                                                                                                                                                                                                                                           |
| Revo Uninstaller                | [Official Website](https://www.revouninstaller.com/zh/revo-uninstaller-free-download/)  | /                                                                                                                                                                                                                                           |
| DeskPins                        | [Official Website](https://efotinis.neocities.org/deskpins/)                            | /                                                                                                                                                                                                                                           |

Install the tool software below in order:

| Software         | Source/Install Method                                                          |
| ---------------- | ------------------------------------------------------------------------------ |
| Weixin           | [Official Website](https://pc.weixin.qq.com/?t=win_weixin&platform=wx&lang=en) |
| QQ               | [Official Website](https://im.qq.com/pcqq/index.shtml)                         |
| Telegram         | [Official Website](https://desktop.telegram.org/)                              |
| ~~WPS Office~~   | ~~[Netdisk](https://www.123pan.com/s/sXtA-iLVEh.html)~~                        |
| PixPin           | [Official Website](https://pixpin.com/)                                        |
| LX Music Desktop | [GitHub Releases](https://github.com/lyswhut/lx-music-desktop/releases)        |
| PotPlayer        | [Microsoft Store](https://apps.microsoft.com/detail/xp8bsbgqw2dks0)            |
| NVIDIA App       | [Official Website](https://www.nvidia.com/en-us/software/nvidia-app/)          |
| Steam            | [Official Website](https://store.steampowered.com/about)                       |
| Epic Games       | [Official Website](https://store.epicgames.com/download)                       |
| OBS Studio       | [Official Website](https://obsproject.com/download)                            |
| Cherry Studio    | [Official Website](https://www.cherry-ai.com/download)                         |

Install the dev software (WSL / SDK / IDE) below in order:

| Software                 | Source/Install Method                                                              | Note                                                                                                                                    |
| ------------------------ | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| WSL                      | `wsl --install`                                                                    | /                                                                                                                                       |
| Rust                     | `winget install Rustlang.Rustup`                                                   | Automatically setup Rust toolchains                                                                                                     |
| GraalVM                  | [Official Website](https://www.graalvm.org/downloads/)                             | /                                                                                                                                       |
| Python                   | `sudo winget install Python.Python.3.14 --scope machine -i`                        | I prefer to disable **"tcl/tk and IDLE"** option                                                                                        |
| Mingw-w64                | [GitHub Releases](https://github.com/niXman/mingw-builds-binaries/releases/latest) | **GCC (GNU Compiler Collection)** migration for Windows<br><br>I prefer to choose **"Posix thread model"** and **"UC runtime"** options |
| Neovim                   | `sudo winget install Neovim.Neovim --scope machine`                                | /                                                                                                                                       |
| LazyVim                  | [Official Website](https://www.lazyvim.org/installation)                           | Requires **GCC**                                                                                                                        |
| Visual Studio            | [Official Website](https://visualstudio.microsoft.com/downloads/)                  | Bundles **MSVC (Microsoft Visual C++) compiler**                                                                                        |
| JetBrains Toolbox        | [Official Website](https://www.jetbrains.com/toolbox-app/)                         | /                                                                                                                                       |
| JetBrains IntelliJ IDEA  | Install from JetBrains Toolbox                                                     | /                                                                                                                                       |
| ~~Navicat Premium Lite~~ | ~~[Official Website](https://www.navicat.com/download/navicat-premium-lite)~~      | /                                                                                                                                       |
| ~~Docker Desktop~~       | ~~[Official Website](https://www.docker.com/products/docker-desktop/)~~            | /                                                                                                                                       |

(Optional) Install other software below:

| Software                   | Source/Install Method                                                                  |
| -------------------------- | -------------------------------------------------------------------------------------- |
| Visual C++ Redistributable | [Official Website](https://learn.microsoft.com/cpp/windows/latest-supported-vc-redist) |
| AIDE64                     | /                                                                                      |
| Crystal Disk Info          | [Official Website](https://crystalmark.info/software/crystaldiskinfo/)                 |
| KeyboardSplitter           | [GitHub Releases](https://github.com/djlastnight/KeyboardSplitterXbox/releases)        |
| PDF SAM                    | [Official Website](https://pdfsam.org/download-pdfsam-basic/)                          |

### Brave Browser

I hate Chrome because it's too opinionated, I hate Edge because it's too heavy.

Though we have to use Chrome for development, and Edge is deeply bundled with Windows, so we have to suffer from them, but for daily use, I just want a Chromium based browser, who is tiny, clean and customizable.

I choose Brave currently.

Useful extensions:

> [!NOTE]
>
> "Tampermonkey" extension requires you to open the develop mode to running external JavaScript.

`~` in the below tables means the same as above.

| Extension                       | Source/Install Method                                                                                                  | Note                                                                                                                                          |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Tampermonkey                    | [Chrome Extension Marketplace](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) | Used scripts: [_Download VS Code Extension VSIX Packages_](https://greasyfork.org/en/scripts/530462-download-vs-code-extension-vsix-packages) |
| ~~ChromeKeePass~~               | ~~[~](https://chromewebstore.google.com/detail/chromekeepass/dphoaaiomekdhacmfoblfblmncpnbahm)~~                       | ~~/~~                                                                                                                                         |
| KeePassXC-Browser               | [~](https://chromewebstore.google.com/detail/keepassxc-browser/oboonakemofpalcgghocfoadofidjkkk)                       | **In migration...**                                                                                                                           |
| Dark Reader                     | [~](https://chromewebstore.google.com/detail/dark-reader/eimadpbcbfnmbkopoojfekhnkhdbieeh)                             | /                                                                                                                                             |
| Immersive Translate             | [~](https://chromewebstore.google.com/detail/immersive-translate-trans/bpoadfkcbjbfhfodiogcnhhhpibjhbnh)               | /                                                                                                                                             |
| Grammarly: AI Writing Assistant | [~](https://chromewebstore.google.com/detail/grammarly-ai-writing-assi/kbfnbcaeplbcioakkpcpgfkobkghlhen)               | /                                                                                                                                             |

Useful extensions for developers:

| Extension                        | Source/Install Method                                                                                                   | Note                                                                                                                                             |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Vue.js Devtools (Community)      | [GitHub Releases](https://github.com/kxxxlfe/devtools/releases)                                                         | Used only for Vue 2 projects, Vue 3 projects should use [Vite plugin](https://devtools.vuejs.org/guide/vite-plugin) instead of browser extension |
| Cookie Editor                    | [Chrome Extension Marketplace](https://chromewebstore.google.com/detail/cookie-editor/ookdjilphngeeeghgngjabigmpepanpl) | /                                                                                                                                                |
| SEO META in 1 CLICK              | [~](https://chromewebstore.google.com/detail/seo-meta-in-1-click/bjogjfinolnhfhkbipphpdlldadpnmhc)                      | /                                                                                                                                                |
| Refined Github                   | [~](https://chromewebstore.google.com/detail/refined-github/hlepfoohegkhhmjieoechaddaejaokhf)                           | /                                                                                                                                                |
| File Icons for GitHub and GitLab | [~](https://chromewebstore.google.com/detail/file-icons-for-github-and/ficfmibkjjnpogdcfhfokmihanoldbfe)                | /                                                                                                                                                |

### Configure Windows Itself

(Optional) Use HEU KMS Activator to activate Windows

| Software          | Source/Install Method                                                  |
| ----------------- | ---------------------------------------------------------------------- |
| HEU KMS Activator | [GitHub Releases](https://github.com/zbezj/HEU_KMS_Activator/releases) |

At the end, login Microsoft Account, sync the system data, adjust system settings.

## Third Step: Maintain System

Programs should under:

- User scope path - `$LOCALAPPDATA/Programs/`
- Machine scope path
  - Standard path
    - `<DRIVER>:/Program Files/`
    - `<DRIVER>:/Program Files (x86)/`
  - No space path
    - `<DRIVER>:/ProgramData/`
  - Portable path
    - `<DRIVER>:/Program Files Portable/`

Projects should under:

- `~/i/` (Inspired by [antfu](https://github.com/antfu))

> [!NOTE]
>
> Use a symlink to link the projects folder to `~/i/` is a bad behavior, it can cause problems when resolving the project path.

Use Revo Uninstaller clean useless software at regular intervals.

Use DISM++ clean system at regular intervals.

Shut down and restart at regular intervals.
