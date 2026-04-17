---
title: Windows Setup Manual
date: 2025-08-24T19:40+08:00
update: 2026-04-17T10:53+08:00
lang: en
duration: 15min
type: note
---

[[toc]]

## Foreword

I know Windows is the best OS to play games, but the worst OS to develop.

If we have no choice, the only one thing we can do is trying our best to make Windows being better for our development. 🥰

## First Step: Reinstall a Clean Windows

We can use [Ventoy](https://www.ventoy.net/en/download.html) with a Windows ISO file to make a bootable USB drive to reinstall Windows. This allows us to decide which versiona/edition of Windows to use.

Before that, we need install and set up Ventoy in your USB flash drive with a Windows ISO file.

### Install & Setup Ventoy

Insert your USB flash driver, then just follow the steps in [Ventoy official document](https://www.ventoy.net/en/doc_start.html).

### Download Windows ISO

> [!Note]
>
> I only show the links for Windows 11, because I only use Windows 11.
>
> If you want to use back Windows 10 / 7 / etc., you can also try to find them from [Microsoft official website](https://www.microsoft.com/en-us/software-download/) or [Mass Grave](https://massgrave.dev/) by yourself.

For developers, it's recommended to use the latest **professional edition** of Windows.

To download ISO from Microsoft (Official):

- [Windows 11 ISO > Download Windows 11 Disk Image (ISO) for XXX devices](https://www.microsoft.com/en-us/software-download/windows11)

To download ISO from Mass Grave (Unofficial):

- [Windows 11 ISO](https://massgrave.dev/windows_11_links)

### Make a Bootable USB Drive

First, move the downloaded Windows ISO file to the USB flash drive (any partition).

> [!Caution]
>
> If you have **multiple partitions** on your USB flash drive, please **remember the partition where Ventoy is installed**, because you need to choose the right partition in the boot menu later.

Then, insert the USB flash drive, restart your computer and enter BIOS:

1. Make sure you **disable the "Secure Boot" option** in BIOS, if not, you will be not allowed to boot Ventoy, and get an "security violation" error. You can re-enable it after the installation as your need;
2. Choose your USB flash drive (**with the right partition** where Ventoy is installed if there are more than one) in the boot menu;
3. After Ventoy starts up, just choose the Windows ISO to start the reinstall.

Then, customize your Windows installation options and wait for the installation to complete.

For my own case, I prefer to use **Windows 11 Pro edition (without "N" mark)**, and **create one and only one partition for each disk**. Different pepole may have different preferences, I use them because: Pro edition has more out of box presets for developers, and for modern systems, make multiple partitions on one disk is really no reason and no benefit.

What's more, for better Windows user account naming, I prefer to **use local account** to setup Windows, instead of Microsoft account. Just press `Shift+F10` to open command prompt, and run the command below to create a local account on the pop-up window, **before you entering the account setup step (If you have entered that step, please return to the previous one)**:

```cmd
start ms-cxh:localonly
```

## Second Step: Setup System Preference

Just follow the steps below, clean up the annoyed system bundled softwares, and install the softwares you preferred. 😍

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

These software are helpful for the next steps, you should install them first in order:

<details>
  <summary>A fully one-time installing script here:</summary>

  ```ps1
  Set-StrictMode -Version Latest
  $ErrorActionPreference = 'Stop'

  function Test-IsAdministrator {
      $currentIdentity = [Security.Principal.WindowsIdentity]::GetCurrent()
      $principal = New-Object Security.Principal.WindowsPrincipal($currentIdentity)
      return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
  }

  function Ensure-Command {
      param(
          [Parameter(Mandatory = $true)]
          [string]$Name
      )
      if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
          throw "Command not found: $Name"
      }
  }

  if (-not (Test-IsAdministrator)) {
      throw 'Please run this script in an elevated PowerShell terminal (Run as Administrator).'
  }

  Ensure-Command -Name 'winget'

  $packages = @(
      @{ Id = 'gerardog.gsudo'; Name = 'gsudo' }
      @{ Id = 'ClashVergeRev.ClashVergeRev'; Name = 'Clash Verge Rev' }
      @{ Id = 'Nushell.Nushell'; Name = 'Nushell' }
      @{ Id = 'Starship.Starship'; Name = 'Starship' }
      @{ Id = 'Git.Git'; Name = 'Git' }
      @{ Id = 'Oven-sh.Bun'; Name = 'Bun' }
      @{ Id = 'Nutstore.Nutstore'; Name = 'Nutstore' }
      @{ Id = 'KeePassXCTeam.KeePassXC'; Name = 'KeePassXC' }
      @{ Id = 'Tonec.InternetDownloadManager'; Name = 'Internet Download Manager' }
      @{ Id = 'Microsoft.VisualStudioCode'; Name = 'Visual Studio Code' }
      @{ Id = 'ZedIndustries.Zed'; Name = 'Zed' }
      @{ Id = 'Rime.Weasel'; Name = 'Rime (Weasel)' }
      @{ Id = 'RevoUninstaller.RevoUninstaller'; Name = 'Revo Uninstaller' }
  )

  Write-Host 'Installing prerequisite software via winget (machine scope)...' -ForegroundColor Cyan

  foreach ($pkg in $packages) {
      Write-Host "\n==> Installing $($pkg.Name) [$($pkg.Id)]" -ForegroundColor Yellow

      winget install `
          --exact `
          --id $pkg.Id `
          --scope machine `
          --source winget `
          --accept-package-agreements `
          --accept-source-agreements `
          --disable-interactivity

      if ($LASTEXITCODE -ne 0) {
          throw "Failed to install: $($pkg.Name) [$($pkg.Id)]"
      }
  }

  Write-Host '\nAll prerequisite packages installed successfully.' -ForegroundColor Green
  Write-Host 'Reminder: restart Windows after installation.' -ForegroundColor Green
  Write-Host 'Reminder: put "C:\Program Files\WinGet\Links" at the front of system Path if needed.' -ForegroundColor Green
  Write-Host 'Reminder: add "%USERPROFILE%\.bun\bin" to system Path for Bun.' -ForegroundColor Green
  ```

</details>

| Software | Source/Install Method | Note |
| -- | -- | -- |
| Windows Terminal | System bundled | Simple, without so many lua configs... |
| gsudo | `winget add -e --id gerardog.gsudo --scope machine` | `sudo` for Windows.<br><br>This installation itself requires running the shell as admin.<br><br>The simplest way to running as admin is to open _Windows Terminal_, click the shells dropdown icon, then right-click on the target shell, you can see the option "Run as administrator".<br><br>If you are using Windows 11, make sure you already put `C:\Program Files\WinGet\Links` in the very front of system environment variable `Path` to avoid being covered by built-in `sudo` command under `C:\Windows\system32` which is not useful. |
| Clash Verge Rev | `sudo winget add -e --id ClashVergeRev.ClashVergeRev --scope machine` | Network proxy Manager.<br><br>You can use your own profile with "System proxy" mode to make it usable, we will futher configure it [later](#personal-preferences), or just skip this if you are in the area without network limitations.<br><br>You can also use your preferred one. |
| Nushell | `sudo winget add -e --id Nushell.Nushell --scope machine` | Cross-platform shell powered by _Rust_.<br><br>Requires running the shell as admin too. |
| Starship | `sudo winget add -e --id Starship.Starship --scope machine` | Shell prompt powered by _Rust_ too.<br><br>Requires running the shell as admin too. |
| Git | `sudo winget add -e --id Git.Git --scope machine` | Nothing is more important that _Git_ for a developer, right?<br><br>Requires running the shell as admin too. |
| Bun | `sudo winget add -e --id Oven-sh.Bun --scope machine` | A faster JavaScript runtime, bundler, and package manager all in one, alternative to _Node.js_ ecosystem.<br><br>Requires running the shell as admin too.<br><br>You can use your preferred one.<br><br>Don't forget to add `~/.bun/bin` to your system environment variable `Path` |
| Nutstore | `sudo winget add -e --id Nutstore.Nutstore --scope machine` | WebDav. |
| KeePassXC | `sudo winget add -e --id KeePassXCTeam.KeePassXC --scope machine` | Password manager, you can replace with your preferred one. |
| Internet Download Manager | `sudo winget add -e --id Tonec.InternetDownloadManager --scope machine` | Download manager, for better download experience. |
| Visual Studio Code | `sudo winget add -e --id Microsoft.VisualStudioCode --scope machine` | A: Best IDE!<br>B: It's not IDE, it's just a text editor!<br>... |
| Zed | `sudo winget add -e --id ZedIndustries.Zed --scope machine` | **Still experimental.** |
| Rime | `sudo winget add -e --id Rime.Weasel --scope machine` | Input method, with [wanxiang schema](https://github.com/amzxyz/rime_wanxiang/releases) (We use `rime-wanxiang-base.zip` and `wanxiang-lts-zh-hans.gram`).<br><br>If you are not using Chinese, you can skip it. |
| Revo Uninstaller | `sudo winget add -e --id RevoUninstaller.RevoUninstaller --scope machine` | Software uninstaller.<br><br>_Free_ or _Pro_, as your need. |

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

# Install my personal preset manager
bun i starship-butler -g
# List available preset IDs:
butler preset -l
# Apply specific preset(s):
butler preset -i <preset_id_pattern> [-i <preset_id_pattern> ...]
# Or applay all presets and skip your existing configs:
butler preset -a
# Or you want to override your existing configs,
# recommended for fresh Windows installation:
butler preset -af
```

### Configure Windows Itself

(Optional, if your system is not activated yet) Firstly, use _HEU KMS Activator_ to activate Windows:

| Software | Source/Install Method |
| -- | -- |
| HEU KMS Activator | [GitHub Releases](https://github.com/zbezj/HEU_KMS_Activator/releases) |

Next, clean up the system bundled software, uninstall system bundled software (like _Microsoft One Drive_, _Outlook_...) you don't need at all by _Revo Uninstaller_.

After that, adjust system settings with _Winutil_:

| Software | Source/Install Method |
| -- | -- |
| Winutil | `irm "https://christitus.com/win" \| iex` |

Then, close all of anti-virus features of _Windows Defender_, and use [Huorong](https://www.huorong.cn/person) instead, which is much quieter and non-invasive:

   | Software | Source/Install Method |
   | -- | -- |
   | Huorong | [Huorong](https://www.huorong.cn/person) |

   > [!Note]
   >
   > You can choose the anti-virus software you like, except for _Windows Defender_.

(Optional) At the end, login Microsoft Account, sync the system data, adjust system settings.

### Useful Software

Install the basic software below as you need:

| Software | Source/Install Method | Note |
| -- | -- | -- |
| Brave | `sudo winget add -e --id Brave.Brave --scope machine` | My daily use browser. See extensions setup [here](#daily-use). |
| RayCast | `sudo winget add -e --id 9PFXXSHC64H3 --scope machine --source msstore` | Basic Extensions: _Installed Extensions_, _MyIP_, _Speedtest_, _Kill Process_, _Port Manager_.<br><br>Dev Extensions: _Shell_, _Visual Studio Code_, _Zed_, _Regex Tester_, _GitHub_, _Svgl_, _Search MDN_, _Tailwind CSS_, _Search npm Packages_, _Random Data Generator_, _Json2TS_. |
| Auto Dark Mode | `sudo winget add -e --id ArminOsaj.AutoDarkMode --scope machine` | Save my eyes! |
| ~~NanaZip~~ | ~~[Microsoft Store](https://apps.microsoft.com/detail/9n8g7tscl18r)~~ | ~~It seems like the latest Windows 11 have built-in compression support~~ |
| DeskPins | `sudo winget add -e --id EliasFotinis.DeskPins --scope machine` | Pin any window to the desktop. |
| PixPin | `sudo winget add -e --id PixPin.PixPin --scope machine` | Screen capture.<br><br>I use `<PrtSc>` to take screenshots and copy, `<Ctrl-PrtSc>` to only take screenshots, `<Shift-PrtSc>` to pin screenshots. This requires disable the built-in Windows screenshot feature "Use the Print screen key to open screen capture". |
| Context Menu Manager | [GitHub Releases](https://github.com/BluePointLilac/ContextMenuManager/releases) | For classic context menu. |
| Windows 11 Context Menu Manager | [GitHub Releases](https://github.com/branhill/windows-11-context-menu-manager/releases) | For Windows 11 new context menu. |
| Driver Store Explorer | `sudo winget add -e --id lostindark.DriverStoreExplorer --scope machine` | Clear unused/outdated device drivers. |
| DISM++ | `sudo winget add -e --id ChuyuTeam.DISM++ --scope machine` | Clear disk. |

Install the tool software below as you need:

| Software | Source/Install Method | Note |
| -- | -- | -- |
| WeChat | `sudo winget add -e --id Tencent.WeChat.Universal --scope machine` | / |
| QQ | `sudo winget add -e --id Tencent.QQ.NT --scope machine` | / |
| WPS Office | `sudo winget add -e --id Kingsoft.WPSOffice --scope machine` | / |
| ~~LX Music Desktop~~ | ~~[GitHub Releases](https://github.com/lyswhut/lx-music-desktop/releases)~~ | ~~Do we need this?~~ |
| ~~PotPlayer~~ | ~~[Microsoft Store](https://apps.microsoft.com/detail/xp8bsbgqw2dks0)~~ | ~~Do we need this?~~ |
| NVIDIA App | [Official Website](https://www.nvidia.com/en-us/software/nvidia-app/) | / |
| Steam | `sudo winget add -e --id Valve.Steam --scope machine` | / |
| Epic Games | `sudo winget add -e --id EpicGames.EpicGamesLauncher --scope machine` | / |
| OBS Studio | `sudo winget add -e --id OBSProject.OBSStudio --scope machine` | / |

Install the dev software (ENV / SDK / IDE / Testing) below as you need (in order):

| Software | Source/Install Method | Note |
| -- | -- | -- |
| WSL | `wsl --install` | Requires reboot. |
| Podman Desktop | `sudo winget add -e --id RedHat.Podman-Desktop --scope machine` | / |
| Bun | `sudo winget add -e --id Oven-sh.Bun --scope machine` | A faster JavaScript runtime, bundler, and package manager all in one.<br><br>If you already install this before, you can skip this time. |
| Node.js | `sudo winget add -e --id OpenJS.NodeJS.LTS --scope machine`<br><br>Setup: `npm i corepack@latest npm@latest esbuild -g`<br><br>Enable corepack: `corepack enable` | The legacy JavaScript runtime, which is the most stable one. |
| Zig | `sudo winget add -e --id zig.zig --scope machine` | I prefer this than _Rust_. |
| GraalVM | [Official Website](https://www.graalvm.org/downloads/) | Alternative to _JVM_ with native support. |
| Mingw-w64 | [GitHub Releases](https://github.com/niXman/mingw-builds-binaries/releases/latest) | **GCC (GNU Compiler Collection)** implementation on Windows<br><br>I prefer to choose **Posix thread model** and **UC runtime**. |
| Neovim | `sudo winget add -e --id Neovim.Neovim --scope machine` | / |
| LazyVim | [Official Website](https://www.lazyvim.org/installation) | Requires **GCC**.<br /><br />With extras: _coding.mini-surround_, _vscode._ |
| ~~Visual Studio~~ | ~~[Official Website](https://visualstudio.microsoft.com/downloads/)~~ | ~~Bundles **MSVC (Microsoft Visual C++) compiler**. Do we need this?~~ |
| ~~JetBrains Toolbox~~ | ~~[Official Website](https://www.jetbrains.com/toolbox-app/)~~ | ~~Do we need this?~~ |
| ~~JetBrains IntelliJ IDEA~~ | ~~Install from JetBrains Toolbox.~~ | ~~Do we need this?~~ |
| ~~Navicat Premium Lite~~ | ~~[Official Website](https://www.navicat.com/download/navicat-premium-lite)~~ | / |
| hyperfine | `sudo winget add -e --id sharkdp.hyperfine --scope machine` | Benchmarking tool. |
| Visual C++ Redistributable | [Official Website](https://learn.microsoft.com/cpp/windows/latest-supported-vc-redist) | MSVC Runtime. Usually, we don't need to install this manually. |

Some one-time use software:

| Software | Source/Install Method |
| -- | -- |
| Crystal Disk Info | [Official Website](https://crystalmark.info/software/crystaldiskinfo/) |
| PDF SAM | [Official Website](https://pdfsam.org/download-pdfsam-basic/) |

### Browser Setup

#### Daily Use

I hate _Chrome_ because it's too opinionated, I hate _Edge_ because it's too heavy.

For daily use, I just want a _Chromium_-based browser, who is tiny, clean and customizable. I choose _Brave_ currently.

Useful extensions:

> [!NOTE]
>
> "Tampermonkey" extension requires you to open the develop mode to running external JavaScript.

`~` in the below tables means the same as above.

| Extension | Source/Install Method | Note |
| -- | -- | -- |
| Tampermonkey | [Chrome Extension Marketplace](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) | Used scripts: [_Download VS Code Extension VSIX Packages_](https://greasyfork.org/en/scripts/530462-download-vs-code-extension-vsix-packages), [_@sxzz/userscripts_](https://github.com/sxzz/userscripts) |
| KeePassXC-Browser | [~](https://chromewebstore.google.com/detail/keepassxc-browser/oboonakemofpalcgghocfoadofidjkkk) | / |
| Dark Reader | [~](https://chromewebstore.google.com/detail/dark-reader/eimadpbcbfnmbkopoojfekhnkhdbieeh) | Save my eyes too!!! |
| Immersive Translate | [~](https://chromewebstore.google.com/detail/immersive-translate-trans/bpoadfkcbjbfhfodiogcnhhhpibjhbnh) | / |
| Grammarly: AI Writing Assistant | [~](https://chromewebstore.google.com/detail/grammarly-ai-writing-assi/kbfnbcaeplbcioakkpcpgfkobkghlhen) | / |
| Vimium C - All by Keyboard | [~](https://chromewebstore.google.com/detail/vimium-c-all-by-keyboard/hfjbmagddngcpeloejdejnfgbamkjaeg) | For better UX, you should enable "Search in bookmarks or add new items", "Run on chrome://_/_ pages" and "Run on Chrome's native New Tab Page", with `#extensions-on-chrome-urls` browser flag (open new tab with url: `chrome://flags`) |
| Refined Github | [~](https://chromewebstore.google.com/detail/refined-github/hlepfoohegkhhmjieoechaddaejaokhf) | / |
| File Icons for GitHub and GitLab | [~](https://chromewebstore.google.com/detail/file-icons-for-github-and/ficfmibkjjnpogdcfhfokmihanoldbfe) | / |
| Npmx redirect | [~](https://chromewebstore.google.com/detail/npmx-redirect/lbhjgfgpnlihfmobnohoipeljollhlnb) | Fuck Npm! Welcome Npmx! |

#### Development

Now I'm try to development with VSCode's integrated browser. If there are some features it does not support, I may choose my daily use browser as fallback.

> [!Note]
>
> These extensions are not necessary, but sometime useful.

As VSCode's integrated browser is powered by webview, which does not support browser extension,  I installed these extensions on my daily use browser:

| Extension | Source/Install Method | Note |
| -- | -- | -- |
| Vue.js Devtools (Community) | [GitHub Releases](https://github.com/kxxxlfe/devtools/releases) | Used only for Vue 2 projects, Vue 3 projects should use [Vite plugin](https://devtools.vuejs.org/guide/vite-plugin) instead of browser extension |
| ~~Cookie Editor~~ | ~~[Chrome Extension Marketplace](https://chromewebstore.google.com/detail/cookie-editor/ookdjilphngeeeghgngjabigmpepanpl)~~ | ~~/~~ |
| ~~SEO META in 1 CLICK~~ | ~~[~](https://chromewebstore.google.com/detail/seo-meta-in-1-click/bjogjfinolnhfhkbipphpdlldadpnmhc)~~ | ~~/~~ |

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

- `~/dev/i/`: Personal projects

  Organize related projects into a workspace, for example:

  - `~/dev/i/oss/`: Open source projects.

- `~/dev/x/`: Work projects.

  - ...

> [!NOTE]
>
> Use a symlink to link the projects folder to `~/dev/i/` is a bad behavior, it can cause problems when resolving the project path.

Use Revo Uninstaller clean useless software at regular intervals.

Use DISM++ clean system at regular intervals.

Shut down and restart at regular intervals.
