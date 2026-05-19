---
title: Windows Setup Manual
date: 2025-08-24T19:40+08:00
update: 2026-05-12T09:28+08:00
lang: en
duration: 18min
type: manual
---

[[toc]]

## Foreword

> [!Caution]
>
> Please never to reinstall Windows when you don’t have time. You certainly don't want your girlfriend to let you spend the night with your computer, right?

I know Windows is the best OS for us to play games, but the worst OS to develop.

But if we have no choice, the only one thing we can do is trying our best to make Windows being better for our development. 🥰

## First Step: Reinstall a Clean Windows

The only way to make everything clean and fresh in Windows is to reinstall it.

We can use [_Ventoy_](https://www.ventoy.net/en/download.html) with a _Windows ISO file_ to make a _bootable USB drive_ to reinstall Windows. This allows us to decide which edition & version of Windows to use.

### Install & Setup Ventoy

First, insert your USB flash driver.

If you want to store some additional files into that USB flash driver, like the necessary softwares (like [_Clash Verge Rev_](#prerequisite-software)), you can separate this driver into two partitions, but **make sure you really remember that which partition stores Ventoy**: When you enter the BIOS, you will be asked to select the right one to start up Ventoy.

Finally, just follow the [Ventoy's official installation guide](https://www.ventoy.net/en/doc_start.html) to complete the installation of Ventoy into your USB flash driver.

### Download Windows ISO

> [!Note]
>
> I only list the links for Windows 11, because I only use Windows 11 now.
>
> If you want to use back Windows 10 / 7 / etc., you can also try to find them from [Microsoft official website](https://www.microsoft.com/en-us/software-download/) or [Mass Grave](https://massgrave.dev/) by yourself.

For developers, it's recommended to use the latest **professional edition** of Windows.

To see the version information of Windows:

- Stable: [Windows 11 Release Information](https://learn.microsoft.com/en-us/windows/release-health/windows11-release-information/)
- Insider Program: [Flight Hub](https://learn.microsoft.com/en-us/windows-insider/flight-hub/)

To download Windows ISO:

- Microsoft (Official): [Windows 11 ISO > Download Windows 11 Disk Image (ISO) for ... devices](https://www.microsoft.com/en-us/software-download/windows11)
- Mass Grave (Unofficial): [Windows 11 ISO](https://massgrave.dev/windows_11_links)

### Make a Bootable USB Drive

Just move the downloaded Windows ISO file to the USB flash drive.

It's doesn't matter which partition you put it in, Ventoy can handle it.

### Reinstall Windows

First, restart your computer and enter _BIOS_. Just quickly and non-stop clicking on the appropriate key before the startup logo shows up, until you see the BIOS menu. The key depends on your _motherboard / computer model_, and usually is one of `ESC` / `F11` / `F12` / `Delete`.

Next, start the reinstallation process with the steps below:

1. Choose your USB flash drive (**with the right partition** where Ventoy is installed if there are more than one) in the boot menu;
2. If you see the **"Security Violation"** error first time you boot from it, don't worry, it's contrallable. Please refer to [Ventoy guides](https://www.ventoy.net/en/doc_secure.html) to enroll the Ventoy's secure boot key to solve this problem;
3. After Ventoy starts up, just choose the Windows ISO to start the reinstallation process.

Then, customize your Windows installation options and wait for the process to complete.

For my own case, I prefer to use **Windows 11 Professional Edition (without "N" flag)**, and **create one and only one partition for each disk device**. Different pepole may have different preferences, I prefer them because: Professional edition has more out of box presets for developers & players, and for modern systems, make multiple partitions on one disk is really no reason and no benefit.

What's more, for a cleaner Windows username, I prefer to **use local account** to setup Windows, instead of Microsoft account, which allows us to have a custom username. Just press `Shift+F10` to open command prompt, and run the command below to create a local account on the pop-up window, when you are stucking on the login page of Microsoft account:

```cmd
start ms-cxh:localonly
```

> [!Caution]
>
> My advice is not to use _OOBE_ to bypass Microsoft account login, especially the **online updates**, because you may forget to or even not to apply the necessary security updates any more after reinstalling, which may cause this fresh installed Windows to go wrong: Maybe some of drivers will be broken, or some of core system components will be broken, etc.
>
> It's a lesson in blood and tears...
>
> Of course, the online update of Windows is very slow, basically takes 1 ~ 2 hours, because it will download not only the necessary components, but also some useless ones. Don't worry, we will entirely remove them later.
>
> Believe me, all these choices are for best stability and cleaness of the system. 🥺

## Second Step: Setup System Preferences

### Prerequisite Software

(Optional) If your area has some "mysterious" network restrictions, you should prepare a proxy software before all of below steps:

| Software | Source/Install Command | Note |
| -- | -- | -- |
| Clash Verge Rev | Download from [GitHub Release](https://github.com/Clash-Verge-rev/clash-verge-rev/releases) into your USB flash driver.<br><br>You'd better prepare it before reinstallation. | Network proxy manager.<br><br>We will futher configure it [later](#personal-preferences). |

### Configure Windows Itself

#### Replace Windows Defender

I hate _Windows Defender_, because it's too often to be a false positive, deleting my software...

First, we need to disable it entirely:

1. Opening ["Virus & threat protection settings"](windowsdefender://threatsettings/), turn off all switches to close all of anti-virus features of Windows Defender;
2. Use [_Defender Control v2.1_](https://www.sordum.org/9480/defender-control-v2-1/) to entirely disable Windows Defender (backend services, etc.).

Next, we can choose a quieter anti-virus software instead. I recommend [_Huorong_](https://www.huorong.cn/person), which is much quieter and non-invasive.

| Software | Source/Install Command |
| -- | -- |
| Huorong | [Official Website](https://www.huorong.cn/person) |

> [!Note]
>
> You can choose the anti-virus software you like, except for _Windows Defender_!!!

#### Adjust System Settings

First, adjust system settings with _Winutil_:

| Software | Source/Install Command | Note |
| -- | -- | -- |
| Winutil | PowerShell:<br>`irm "https://christitus.com/win" \| iex` | In "Tweaks" tab, just to apply the recommended settings simply, if you are not sure about those switches~<br><br>In "Config" tab, I will enable "Windows Subsystem fo Linux" feature;<br><br>  |

(Optional) If your Windows is not activated yet, you can use _HEU KMS Activator_ to activate it:

| Software | Source/Install Command |
| -- | -- |
| HEU KMS Activator | [GitHub Releases](https://github.com/zbezj/HEU_KMS_Activator/releases) |

(Optional) Next, [update the OS](ms-settings:windowsupdate), [login Microsoft Account](ms-settings:yourinfo) & adjust other system settings in [Windows Settings](ms-settings://).

### Setup Softwares

Don't forget to restart your computer to make these softwares work properly after the end of this step!

#### Learn How to Use WinGet

I highly recommend you to use [WinGet](https://learn.microsoft.com/windows/package-manager/winget/) to manage your softwares, it is the official Windows package manager, and helps you to avoid fake & malicious softwares.

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
winget install <QUERY>
# `add` is an alias of command `install`
winget add <QUERY>
```

Install (Machine scope, requires admin privileges):

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
winget add -e --id <PACKAGE_ID>
```

Install specific version (Default is latest version):

```nu
winget add <QUERY> --version <VERSION>
# Or
winget add <QUERY> -v <VERSION>
```

Uninstall:

```nu
winget uninstall <QUERY>
# `rm` is an alias of command `uninstall`
winget rm <QUERY>
```

For more information:

```nu
winget <command> --help
# Or
winget <command> -?
```

#### Recommended Softwares

Below softwares are highly recommended and helpful for the future steps, you can install them first and in order:

| Software | Source/Install Command | Note |
| -- | -- | -- |
| Windows Terminal | System bundled | Simple, useful, without so many lua configs... |
| gsudo | `winget add --source winget --exact --id gerardog.gsudo --scope machine` | `sudo` for Windows.<br><br>This installation itself requires running the shell as admin.<br><br>The simplest way to running as admin is to open _Windows Terminal_, click the shells dropdown icon, then right-click on the target shell, you can see the option "Run as administrator".<br><br>If you are using Windows 11, make sure you already put `C:\Program Files\WinGet\Links` in the very front of system environment variable `Path` to avoid being covered by built-in `sudo` command under `C:\Windows\system32` which is not so useful. |
| Brave | `sudo winget add --source winget --exact --id Brave.Brave --scope machine` | My daily use browser. See extensions setup [here](#browser-setup). |
| Nushell | `sudo winget add --source winget --exact --id Nushell.Nushell --scope machine` | Cross-platform shell powered by _Rust_ to make the consistent experience. |
| Starship | `sudo winget add --source winget --exact --id Starship.Starship --scope machine` | Cross-platform shell prompt powered by _Rust_ too. |
| Git | `sudo winget add --source winget --exact --id Git.Git --scope machine` | Nothing is more important that _Git_ for a developer, right? |
| Bun | `sudo winget add --source winget --exact --id Oven-sh.Bun --scope machine` | A faster all in one JavaScript runtime, bundler, and package manager, alternative to _Node.js_ ecosystem.<br><br>You can use your preferred one.<br><br>**Don't forget to add `~/.bun/bin` to your system environment variable `Path`** |
| (Optional) Nutstore | `sudo winget add --source winget --exact --id Nutstore.Nutstore --scope machine ` | WebDav.<br><br>I use it to sync my KeePass database among multiple devices.<br><br>**If you are facing the problem of clashing right after you openning Nutstore, it's recommended to restart you application or trigger the update of Nutstore.** |
| (Optional) KeePassXC | `sudo winget add --source winget --exact --id KeePassXCTeam.KeePassXC --scope machine` | Password manager, you can replace with your preferred one. |
| Internet Download Manager | `sudo winget add --source winget --exact --id Tonec.InternetDownloadManager --scope machine` | Download manager, for better download experience.<br><br>**It also installs browser extension to handle the browser downloading!** |
| Visual Studio Code | `sudo winget add --source winget --exact --id Microsoft.VisualStudioCode` | A: Best IDE!<br>B: It's not IDE, it's just a text editor!<br>...<br><br>It's recommended to **use user scope** installation. |
| Zed | `sudo winget add --source winget --exact --id ZedIndustries.Zed` | **Still experimental, but better performance than Visual Studio Code.**<br><br>It's recommended to **use user scope** installation too. |
| (Optional) Rime | `sudo winget add --source winget --exact --id Rime.Weasel --scope machine` | Chinese input Command, with [wanxiang schema](https://github.com/amzxyz/rime_wanxiang/releases) (I use `rime-wanxiang-base.zip` and `wanxiang-lts-zh-hans.gram`).<br><br>If you are not using Chinese, you can skip it. |
| RayCast | `sudo winget add --source msstore --exact --id 9PFXXSHC64H3` | Basic Extensions: _Installed Extensions_, _MyIP_, _Speedtest_, _Kill Process_, _Port Manager_.<br><br>Dev Extensions: _Shell_, _Visual Studio Code_, _Zed_, _Regex Tester_, _GitHub_, _Svgl_, _Search MDN_, _Tailwind CSS_, _Search npm Packages_, _Random Data Generator_, _Json2TS_. |
| Revo Uninstaller | Free:<br>`sudo winget add --source winget --exact --id RevoUninstaller.RevoUninstaller --scope machine`<br><br>Pro:<br>`sudo winget add --source winget --exact --id RevoUninstaller.RevoUninstallerPro --scope machine` | Software uninstaller.<br><br>_Free_ or _Pro_, as your need. |

#### Browser Setup

I hate _Chrome_ because it's too opinionated, I hate _Edge_ because it's too heavy.

For daily use, I just want a _Chromium_-based browser, who is tiny, clean and customizable. I choose _Brave_ currently.

Daily use extensions:

> [!NOTE]
>
> "Tampermonkey" extension requires you to open the develop mode to running user scripts (JavaScript).

`~` in the below tables means the same as above.

| Extension | Source/Install Command | Note |
| -- | -- | -- |
| Tampermonkey | [Chrome Extension Marketplace](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) | Used user scripts: [_@sxzz/userscripts_](https://github.com/sxzz/userscripts) |
| KeePassXC-Browser | [~](https://chromewebstore.google.com/detail/keepassxc-browser/oboonakemofpalcgghocfoadofidjkkk) | / |
| Dark Reader | [~](https://chromewebstore.google.com/detail/dark-reader/eimadpbcbfnmbkopoojfekhnkhdbieeh) | Save my eyes!!! |
| Immersive Translate | [~](https://chromewebstore.google.com/detail/immersive-translate-trans/bpoadfkcbjbfhfodiogcnhhhpibjhbnh) | / |
| Vimium C - All by Keyboard | [~](https://chromewebstore.google.com/detail/vimium-c-all-by-keyboard/hfjbmagddngcpeloejdejnfgbamkjaeg) | For better UX, it's recommended to enable **"Search in bookmarks or add new items"**, **"Run on chrome://_/_ pages"** & **"Run on Chrome's native New Tab Page"**, with [`#extensions-on-chrome-urls` browser flag](brave://flags/#extensions-on-chrome-urls) enabled |
| Refined Github | [~](https://chromewebstore.google.com/detail/refined-github/hlepfoohegkhhmjieoechaddaejaokhf) | Requires your GitHub access token. |
| File Icons for GitHub and GitLab | [~](https://chromewebstore.google.com/detail/file-icons-for-github-and/ficfmibkjjnpogdcfhfokmihanoldbfe) | / |
| Npmx redirect | [~](https://chromewebstore.google.com/detail/npmx-redirect/lbhjgfgpnlihfmobnohoipeljollhlnb) | Fuck Npm! Fuck Npm! |

Sometime useful extensions:

| Extension | Source/Install Command | Note |
| -- | -- | -- |
| Vue.js Devtools (Community) | [GitHub Releases](https://github.com/kxxxlfe/devtools/releases) | Used only for Vue 2 projects, Vue 3 projects are recommended to use [Vite plugin](https://devtools.vuejs.org/guide/vite-plugin) instead. |

#### Additional Softwares

Install the tool softwares below as you need:

| Software | Source/Install Command | Note |
| -- | -- | -- |
| DeskPins | `sudo winget add --source winget --exact --id EliasFotinis.DeskPins --scope machine` | Pin any window to the desktop. |
| PixPin | `sudo winget add --source winget --exact --id PixPin.PixPin --scope machine` | Screen capture.<br><br>I use `<PrtSc>` to take screenshots and copy, `<Ctrl-PrtSc>` to only take screenshots, `<Shift-PrtSc>` to pin screenshots. This requires disable the built-in Windows screenshot feature "Use the Print screen key to open screen capture". |
| Context Menu Manager | [GitHub Releases](https://github.com/BluePointLilac/ContextMenuManager/releases) | For classic context menu. |
| Windows 11 Context Menu Manager | [GitHub Releases](https://github.com/branhill/windows-11-context-menu-manager/releases) | For Windows 11 new context menu. |
| Driver Store Explorer | `sudo winget add --source winget --exact --id lostindark.DriverStoreExplorer --scope machine` | Clear unused/outdated device drivers. |
| DISM++ | `sudo winget add --source winget --exact --id ChuyuTeam.DISM++ --scope machine` | Clear disk. |
| WeChat | `sudo winget add --source winget --exact --id Tencent.WeChat.Universal --scope machine` | / |
| QQ | `sudo winget add --source winget --exact --id Tencent.QQ.NT --scope machine` | / |
| Enterprise WPS | [Official Website](https://ep.wps.cn/download) | Mysterious little code: TJ3GN-9NTGQ-GLF7C-YEN8X-TJWML |
| NVIDIA App | [Official Website](https://www.nvidia.com/en-us/software/nvidia-app/) | / |
| Steam | `sudo winget add --scope machine --source winget --exact --id Valve.Steam` | / |
| Epic Games | `sudo winget add --scope machine --source winget --exact --id EpicGames.EpicGamesLauncher` | / |
| OBS Studio | `sudo winget add --scope machine --source winget --exact --id OBSProject.OBSStudio` | / |

Install the dev softwares below as you need **(in order)**:

| Software | Source/Install Command | Note |
| -- | -- | -- |
| WSL | `wsl --install` | Requires reboot. |
| Podman Desktop | `sudo winget add --scope machine --source winget --exact --id RedHat.Podman-Desktop` | / |
| Bun | `sudo winget add --scope machine --source winget --exact --id Oven-sh.Bun` | A faster JavaScript runtime, bundler, and package manager all in one.<br><br>If you already install this before, you can skip this time. |
| Node.js | `sudo winget add --scope machine --source winget --exact --id OpenJS.NodeJS.LTS`<br><br>Setup: `npm i corepack@latest npm@latest esbuild tree-sitter-cli -g`<br><br>Enable corepack: `corepack enable` | The legacy JavaScript runtime, which is the most stable one. |
| Zig | `sudo winget add --scope machine --source winget --exact --id zig.zig` | I prefer this than _Rust_. |
| GraalVM | [Official Website](https://www.graalvm.org/downloads/) | Alternative to _JVM_ with native support. |
| Mingw-w64 | [GitHub Releases](https://github.com/niXman/mingw-builds-binaries/releases/latest) | **GCC (GNU Compiler Collection)** implementation on Windows<br><br>I prefer to choose **Posix thread model** and **UC runtime**. |
| Neovim | `sudo winget add --scope machine --source winget --exact --id Neovim.Neovim` | / |
| LazyVim | [Official Website](https://www.lazyvim.org/installation) | Requires **GCC**.<br /><br />With extras: _coding.mini-surround_, _vscode._ |
| ~~Visual Studio~~ | ~~[Official Website](https://visualstudio.microsoft.com/downloads/)~~ | ~~Bundles **MSVC (Microsoft Visual C++) compiler**. Do we need this?~~ |
| ~~JetBrains Toolbox~~ | ~~[Official Website](https://www.jetbrains.com/toolbox-app/)~~ | ~~Do we need this?~~ |
| ~~JetBrains IntelliJ IDEA~~ | ~~Install from JetBrains Toolbox.~~ | ~~Do we need this?~~ |
| Navicat Premium Lite | [Official Website](https://www.navicat.com/download/navicat-premium-lite) | / |
| hyperfine | `sudo winget add --scope machine --source winget --exact --id sharkdp.hyperfine` | Benchmarking tool. |
| Visual C++ Redistributable | [Official Website](https://learn.microsoft.com/cpp/windows/latest-supported-vc-redist) | MSVC Runtime. Usually, we don't need to install this manually. |

Some one-time use software:

| Software | Source/Install Command |
| -- | -- |
| Crystal Disk Info | [Official Website](https://crystalmark.info/software/crystaldiskinfo/) |
| PDF SAM | [Official Website](https://pdfsam.org/download-pdfsam-basic/) |

#### Uninstall Unnecessary Softwares

Use _Revo Uninstaller_ to uninstall all the software you don't like!

In particular, **"Windows Programs"** tab let you can completely uninstall system bundled softwares!

### Personal Preferences

> [!Note]
>
> Don't forget to restart your computer to make the softwares work properly after the previous step!

> [!Note]
>
> This is the setting up of my personal preferences, if you does not interest in this, you can skip this part.

Running the commands below in the shell:

```shell
# (Optional) Install useful global Bun package as your need
# Package manager's manager & Package updater
bun i @antfu/ni taze -g
# Project scaffolding
bun i @sxzz/create -g

# (Optional) Install my personal preset manager
bun i starship-butler -g
# List available preset IDs:
butler preset -l
# Apply specific preset(s):
butler preset -i <preset_id_pattern> [-i <preset_id_pattern> ...]
# Or apply all presets and skip your existing configs:
butler preset -a
# Or you want to override your existing configs,
# recommended for fresh Windows installation:
butler preset -af
# Override without manually confirm, dangerous!
butler preset -afy
```

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

- `~/dev/`: Non-work projects, for example:
  - `~/dev/app/`: My application projects;
  - `~/dev/lib/`: My library projects;
  - `~/dev/oss/`: Open source projects;
  - ...
- `~/work/`: Work projects.
  - ...

> [!Caution]
>
> Use a symlink to link the projects folder to `~/dev/i/` is a bad behavior, it can cause problems when resolving the project path.

Use Revo Uninstaller clean useless software at regular intervals.

Use DISM++ clean system at regular intervals.

Shut down and restart at regular intervals.
