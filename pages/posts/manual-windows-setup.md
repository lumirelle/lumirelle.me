---
title: Windows Setup Manual
date: 2025-08-24T19:40:00+08:00
update: 2026-02-25T14:25+08:00
lang: en
duration: 12min
type: note
---

[[toc]]

## Foreword

I know Windows is the best OS to play games, but the worst OS to develop.

If we have no choice, the only one thing we can do is trying our best to make Windows being better for our development.

## First Step: Reinstall Clean Windows

We can use [Ventoy](https://www.ventoy.net/en/download.html) to make a bootable USB drive to reinstall Windows. This allows us to decide which versiona/edition of Windows to use.

Before that, we need install and set up Ventoy in your USB flash drive with a Windows ISO file.

### Install and Set up Ventoy

Insert your USB flash driver, follow the steps in the [official document](https://www.ventoy.net/en/doc_start.html) to install and set up Ventoy.

### Download Windows ISO

For developers, it's recommended to use the latest professional edition of Windows.

From Microsoft (Official):

- [Windows 11 ISO > Download Windows 11 Disk Image (ISO) for xxx devices](https://www.microsoft.com/en-us/software-download/windows11)

From Mass Grave (Unofficial):

- [Windows 11 ISO](https://massgrave.dev/windows_11_links)
- [Windows 10 ISO](https://massgrave.dev/windows_10_links)

### Make a Bootable USB Drive

Move the downloaded Windows ISO file to the USB flash drive (any partition).

> [!Note]
>
> If you have multiple partitions on your USB flash drive, please remember the partition where Ventoy is installed, because you need to choose the right partition in the boot menu later.

Insert the USB flash drive, restart your computer and enter BIOS:

1. Make sure you disable the "Secure Boot" option in BIOS, if not, you will be not allowed to boot Ventoy, and get an "security violation" error. You can enable it after the installation if you want;
2. Choose your USB flash drive (with the right partition where Ventoy is installed if there are more than one) in the boot menu;
3. After Ventoy starts up, choose the Windows ISO and just starts the reinstall process.

Then, customize your Windows installation options and wait for the installation to complete.

For my own case, I prefer to use Windows 11 Pro edition (without "N"), and create one and only one partition for each disk.

What's more, for better Windows user account naming, I prefer to use local account instead Microsoft account to set up Windows (Just press `Shift+F10` to open command prompt, and run the command below to create a local account on the pop-up window, **before you entering the account setup step**):

```cmd
start ms-cxh:localonly
```

## Second Step: Setting up System Preferences

Just follow the steps below, clean up the annoyed system bundled software, and install tools you preferred. 😍

### Learn How to Use winget

Search:

```nu
# Search both name and ID
winget search <QUERY>
# Search name only
winget search --name <QUERY>
# Search ID only
winget search --id <QUERY>
```

Install (User scope):

```nu
# `add` is an alias of command `install`
winget add <QUERY>
```

Install (Machine scope, requires admin permission):

```nu
# In windows, `sudo` command is powered by `gsudo`
sudo winget add <QUERY> --scope machine
```

Install on specific location:

```nu
winget add <QUERY> --location '/PATH/YOU/LIKE'
# Or
winget add <QUERY> -l '/PATH/YOU/LIKE'
```

Install with interactive mode (Default is non-interactive mode):

```nu
winget add <QUERY> --interactive
# Or
winget add <QUERY> -i
```

Install with no UI mode (Default is UI mode):

```nu
winget add <QUERY> --silent
# Or
winget add <QUERY> -h
```

Install with exact ID match:

```nu
winget add --exact --id <PACKAGE_ID>
# Or
winget add -e -id <PACKAGE_ID>
```

Install specific version (Default is latest version):

```nu
winget add <QUERY> --version <VERSION>
# Or
winget add <QUERY> -v <VERSION>
```

Uninstall:

```nu
# `rm` is an alias of command `uninstall`
winget rm <QUERY>
```

For more information:

```nu
winget <command> --help
# Or
winget <command> -?
```

### Prerequisite Software

These software are helpful for the next steps, you can install them first:

| Software                  | Source/Install Method                                                               | Note                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Windows Terminal          | [Microsoft Store](https://apps.microsoft.com/detail/9n0dx20hk701)                   | Windows bundled terminal.<br><br>If not bundled, you can install it manually.                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Clash Verge Rev           | [GitHub Releases](https://github.com/clash-verge-rev/clash-verge-rev/releases)      | Network proxy Manager.<br><br>You can use your own profile with "System proxy" mode to make it usable, we will futher configure it [later](#setting-up-personal-preferences), or just skip this if you are in the area without network limitations.<br><br>You can also use your preferred one.                                                                                                                                                                                                                                |
| gsudo                     | `winget add -e --id gerardog.gsudo --scope machine`                                 | `sudo` for Windows.<br><br>This installation itself requires running the shell as admin.<br><br>The simplest workaround is to open _Windows Terminal_, click the shells dropdown then right-click on the target shell, you can see the option "Run as administrator".<br><br>If you are using Windows 11, make sure you already put `C:\Program Files\WinGet\Links` in the very front of system environment variable `Path` to avoid being covered by built-in `sudo` command under `C:\Windows\system32` which is not useful. |
| Nushell                   | `winget add -e --id Nushell.Nushell --scope machine`                                | Cross-platform shell powered by _Rust_.<br><br>Requires running the shell as admin too.                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Starship                  | `winget add -e --id Starship.Starship --scope machine`                              | Shell prompt powered by _Rust_ too.<br><br>Requires running the shell as admin too.                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Git                       | `winget add -e --id Git.Git --scope machine`                                        | Nothing is more important that _Git_ for a developer, right?<br><br>Requires running the shell as admin too.                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Bun                       | `winget add -e --id Oven-sh.Bun --scope machine`                                    | A faster JavaScript runtime, bundler, and package manager all in one, alternative to _Node.js_ ecosystem.<br><br>Requires running the shell as admin too.<br><br>You can use your preferred one.<br><br>Don't forget to add `~/.bun/bin` to your system environment variable `Path`                                                                                                                                                                                                                                            |
| KeePassXC                 | [Official Website](https://keepassxc.org/download/)                                 | Password manager, you can replace with your preferred one.                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Internet Download Manager | [Official Website](https://www.internetdownloadmanager.com/download.html)           | Download manager, for better download experience.                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Visual Studio Code        | [Official Website](https://code.visualstudio.com/Download)                          | A: Best IDE!<br>B: It's not IDE, it's just a text editor!<br>...                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Rime                      | [Official Website](https://rime.im/download/)                                       | Input method, with [wanxiang schema](https://github.com/amzxyz/rime_wanxiang/releases) (We use `rime-wanxiang-base.zip` and `wanxiang-lts-zh-hans.gram`).<br><br>If you are not using Chinese, you can skip it.                                                                                                                                                                                                                                                                                                                |
| Revo Uninstaller          | [Official Website](https://www.revouninstaller.com/revo-uninstaller-free-download/) | Software uninstaller.<br><br>_Free_ or _Pro_, as your need.                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

> [!Note]
>
> Don't forget to restart your computer to make this software work properly after installation!

### Personal Preferences

> [!Note]
>
> This is the setting up of my personal preferences, if you does not interest in this, you can skip this part.

Running the commands below in _Nushell_:

```nu
# Install useful global package
# Package manager
bun i @antfu/ni taze -g
# Project manager
bun i @sxzz/create -g
# (Optional) Neovim prerequisite
bun i tree-sitter-cli -g

# Install my personal preferences
bun i starship-butler -g
# Install with specific preset(s):
butler preset -i <preset_id_pattern> [-i <preset_id_pattern> ...]
# Or applay all presets and skip your existing configs:
butler preset -a
# Or you want to override your existing configs,
# recommended for fresh Windows installation:
butler preset -af
```

### Clean up Annoyed System Bundled Software

1. Uninstall system bundled software (like _Microsoft One Drive_, _Outlook_...) you don't need at all;
2. Close the UAC (User Account Control) as your need;
3. **(Optional)** Close all of anti-virus features of _Windows Defender_, and use [Huorong](https://www.huorong.cn/person) instead, which is much quieter and non-invasive:

   | Software | Source/Install Method                    |
   | -------- | ---------------------------------------- |
   | Huorong  | [Huorong](https://www.huorong.cn/person) |

   After that, use _Windows 11 Setting Easily_ (support Windows 10 too) to close _Windows Defender_ completely, and restart your computer. You will see there is only the _Windows Defender_ service exists at the end, that's means _Windows Defender_ is being disabled entirely.

   | Software                  | Source/Install Method                                                |
   | ------------------------- | -------------------------------------------------------------------- |
   | Windows 11 Setting Easily | [Post on Bilibili](https://www.bilibili.com/opus/904672369138729017) |

   > [!Note]
   >
   > You should close _Windows Defender_ first, because it will recognize _Windows 11 Setting Easily_ as a potential threat and clean it.

### Useful Software

Install the basic software below in order:

| Software                        | Source/Install Method                                                                   | Note                                                                                                                                                                                                                                                                                         |
| ------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Brave                           | [Official Website](https://brave.com/download/)                                         | [Extensions](#brave-browser)                                                                                                                                                                                                                                                                 |
| RayCast                         | [Microsoft Store](https://apps.microsoft.com/detail/9pfxxshc64h3)                       | Basic Extensions: _Installed Extensions_, _Google Translate_, _GitHub_, _MyIP_, _Speedtest_, _Kill Process_, _Port Manager_.<br><br>Dev Extensions: _Visual Studio Code_, _Zed_, _Regex Tester_, _DevDocs_, _Svgl_, _Search MDN_, _Search npm Packages_, _Random Data Generator_, _Json2TS_. |
| Auto Dark Mode                  | [Microsoft Store](https://apps.microsoft.com/detail/xp8jk4hzbvf435)                     | Save my eyes!                                                                                                                                                                                                                                                                                |
| NanaZip                         | [Microsoft Store](https://apps.microsoft.com/detail/9n8g7tscl18r)                       | /                                                                                                                                                                                                                                                                                            |
| DeskPins                        | [Official Website](https://efotinis.neocities.org/deskpins/)                            | Pin any window to the desktop.                                                                                                                                                                                                                                                               |
| PixPin                          | [Microsoft Store](https://apps.microsoft.com/detail/xp89f3cgsrzhc7)                     | Screen capture.<br><br>I use `<PrtSc>` to take screenshots and copy, `<Ctrl-PrtSc>` to only take screenshots, `<Shift-PrtSc>` to pin screenshots. This requires disable the built-in Windows screenshot feature "Use the Print screen key to open screen capture".                           |
| Context Menu Manager            | [GitHub Releases](https://github.com/BluePointLilac/ContextMenuManager/releases)        | For classic context menu.                                                                                                                                                                                                                                                                    |
| Windows 11 Context Menu Manager | [GitHub Releases](https://github.com/branhill/windows-11-context-menu-manager/releases) | For Windows 11 new context menu.                                                                                                                                                                                                                                                             |
| Driver Store Explorer           | [GitHub Releases](https://github.com/lostindark/DriverStoreExplorer/releases)           | Clear unused/outdated device drivers.                                                                                                                                                                                                                                                        |
| DISM++                          | [GitHub Releases](https://github.com/Chuyu-Team/Dism-Multi-language/releases)           | Clear disk.                                                                                                                                                                                                                                                                                  |

Install the tool software below in order:

| Software             | Source/Install Method                                                       | Note                                                                                                     |
| -------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| WeChat               | [Official Website](https://pc.weixin.qq.com/?lang=en_US)                    | /                                                                                                        |
| QQ                   | [Official Website](https://im.qq.com/pcqq/index.shtml)                      | /                                                                                                        |
| Telegram             | [Official Website](https://desktop.telegram.org/)                           | /                                                                                                        |
| Cursor               | [Official Website](https://www.cursor.com/downloads)                        | Better AI experience than _Visual Studio Code_, but low compatibility and slow performance in some case. |
| Zed                  | [Official Website](https://zed.dev/)                                        | **Still experimental.**                                                                                  |
| ~~WPS Office~~       | ~~[Netdisk](https://www.123pan.com/s/sXtA-iLVEh.html)~~                     | ~~/~~                                                                                                    |
| ~~LX Music Desktop~~ | ~~[GitHub Releases](https://github.com/lyswhut/lx-music-desktop/releases)~~ | ~~/~~                                                                                                    |
| ~~PotPlayer~~        | ~~[Microsoft Store](https://apps.microsoft.com/detail/xp8bsbgqw2dks0)~~     | ~~/~~                                                                                                    |
| NVIDIA App           | [Official Website](https://www.nvidia.com/en-us/software/nvidia-app/)       | /                                                                                                        |
| Steam                | [Official Website](https://store.steampowered.com/about)                    | /                                                                                                        |
| Epic Games           | [Official Website](https://store.epicgames.com/download)                    | /                                                                                                        |
| OBS Studio           | [Official Website](https://obsproject.com/download)                         | /                                                                                                        |

Install the dev software (WSL / SDK / IDE) below in order:

| Software                 | Source/Install Method                                                                                                                                                             | Note                                                                                                                                                                                             |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| WSL                      | `wsl --install`                                                                                                                                                                   | Requires reboot.                                                                                                                                                                                 |
| Bun                      | `sudo winget add -e --id Oven-sh.Bun --scope machine`                                                                                                                             | A faster JavaScript runtime, bundler, and package manager all in one.<br><br>If you already install this before, you can skip this time.                                                         |
| Node.js                  | [Official Website](https://nodejs.org/en/download/)<br><br>Setup: `npm i corepack@latest npm@latest esbuild @antfu/nip pnpm-patch-i -g`<br><br>Enable corepack: `corepack enable` | I prefer the **portable edition**.                                                                                                                                                               |
| Zig                      | `sudo winget add -e --id zig.zig --scope machine`                                                                                                                                 | I prefer this than _Rust_.                                                                                                                                                                       |
| ~~Rust~~                 | ~~`sudo winget add -e --id Rustlang.Rustup --scope machine`~~                                                                                                                     | ~~Automatically setup _Rust_ toolchains (We will manually install MSVC later).~~                                                                                                                 |
| GraalVM                  | [Official Website](https://www.graalvm.org/downloads/)                                                                                                                            | Alternative to _JVM_ with native support.                                                                                                                                                        |
| ~~Python~~               | ~~`sudo winget add -e --id Python.Python.3.14 --scope machine -i`~~                                                                                                               | ~~I prefer to disable "tcl/tk and IDLE" option.~~                                                                                                                                                |
| Mingw-w64                | [GitHub Releases](https://github.com/niXman/mingw-builds-binaries/releases/latest)                                                                                                | **GCC (GNU Compiler Collection)** implementation on Windows<br><br>I prefer to choose **Posix thread model** and **UC runtime**.                                                                 |
| Neovim                   | `sudo winget add -e --id Neovim.Neovim --scope machine`                                                                                                                           | /                                                                                                                                                                                                |
| LazyVim                  | [Official Website](https://www.lazyvim.org/installation)                                                                                                                          | Requires **GCC**.~~<br /><br />With extras: lang.docker, lang.java, lang.json, lang.markdown, lang.nushell, lang.python, lang.rust, lang.toml, lang.typescript, lang.vue, lang.yaml, lang.zig.~~ |
| Visual Studio            | [Official Website](https://visualstudio.microsoft.com/downloads/)                                                                                                                 | Bundles **MSVC (Microsoft Visual C++) compiler**.                                                                                                                                                |
| JetBrains Toolbox        | [Official Website](https://www.jetbrains.com/toolbox-app/)                                                                                                                        | /                                                                                                                                                                                                |
| JetBrains IntelliJ IDEA  | Install from JetBrains Toolbox.                                                                                                                                                   | /                                                                                                                                                                                                |
| ~~Navicat Premium Lite~~ | ~~[Official Website](https://www.navicat.com/download/navicat-premium-lite)~~                                                                                                     | /                                                                                                                                                                                                |
| Podman Desktop           | [Official Website](https://podman-desktop.io/downloads/windows)                                                                                                                   | /                                                                                                                                                                                                |
| hyperfine                | `sudo winget add -e --id sharkdp.hyperfine --scope machine`                                                                                                                       | Benchmarking. tool.                                                                                                                                                                              |

(Optional) Install other software below:

| Software                   | Source/Install Method                                                                  |
| -------------------------- | -------------------------------------------------------------------------------------- |
| Visual C++ Redistributable | [Official Website](https://learn.microsoft.com/cpp/windows/latest-supported-vc-redist) |
| AIDE64                     | /                                                                                      |
| Crystal Disk Info          | [Official Website](https://crystalmark.info/software/crystaldiskinfo/)                 |
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

| Extension                       | Source/Install Method                                                                                                  | Note                                                                                                                                                                                                                                     |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tampermonkey                    | [Chrome Extension Marketplace](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) | Used scripts: [_Download VS Code Extension VSIX Packages_](https://greasyfork.org/en/scripts/530462-download-vs-code-extension-vsix-packages), [_@sxzz/userscripts_](https://github.com/sxzz/userscripts)                                |
| KeePassXC-Browser               | [~](https://chromewebstore.google.com/detail/keepassxc-browser/oboonakemofpalcgghocfoadofidjkkk)                       | /                                                                                                                                                                                                                                        |
| Dark Reader                     | [~](https://chromewebstore.google.com/detail/dark-reader/eimadpbcbfnmbkopoojfekhnkhdbieeh)                             | Save my eyes too!!!                                                                                                                                                                                                                      |
| Immersive Translate             | [~](https://chromewebstore.google.com/detail/immersive-translate-trans/bpoadfkcbjbfhfodiogcnhhhpibjhbnh)               | /                                                                                                                                                                                                                                        |
| Grammarly: AI Writing Assistant | [~](https://chromewebstore.google.com/detail/grammarly-ai-writing-assi/kbfnbcaeplbcioakkpcpgfkobkghlhen)               | /                                                                                                                                                                                                                                        |
| Vimium C - All by Keyboard      | [~](https://chromewebstore.google.com/detail/vimium-c-all-by-keyboard/hfjbmagddngcpeloejdejnfgbamkjaeg)                | For better UX, you should enable "Search in bookmarks or add new items", "Run on chrome://_/_ pages" and "Run on Chrome's native New Tab Page", with `#extensions-on-chrome-urls` browser flag (open new tab with url: `chrome://flags`) |

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
