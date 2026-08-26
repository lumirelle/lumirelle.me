---
title: Windows Setup Manual
date: 2025-08-24T19:40+08:00
update: 2026-08-26T10:55+08:00
lang: en
duration: 18min
type: manual
group: Computer
order: 1
---

<style>
.prose table thead, .prose table tbody {
  display: block;
}
.prose table tr {
  display: grid;
  grid-template-columns: 1fr 2fr 2fr;
}
.prose table td {
  overflow-x: auto;
}
</style>

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

## Second Step: Setup Environment

### Prerequisite Software

(Optional) If your area has some **"mysterious"** network restrictions, you should prepare a proxy software before all of below steps:

| Software | Source/Install Command | Note |
| -- | -- | -- |
| Clash Verge Rev | Download from [GitHub Release](https://github.com/Clash-Verge-rev/clash-verge-rev/releases) into your USB flash driver.<br><br>You'd better prepare it before reinstallation. | <TextTag text="Chezmoi-ed" /> Network proxy manager. |

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
> You can choose any other anti-virus software you like, except for _Windows Defender_!!!

#### Adjust System Settings

First, adjust system settings with _Winutil_:

| Software | Source/Install Command | Note |
| -- | -- | -- |
| Winutil | PowerShell:<br>`irm "https://christitus.com/win" \| iex` | In "Tweaks" tab, just to apply the recommended settings simply, if you are not sure about those switches~<br><br>In "Config" tab, I will enable "Windows Subsystem fo Linux" feature;<br><br> |

(Optional) If your Windows is not activated yet, you can use _HEU KMS Activator_ to activate it:

| Software | Source/Install Command |
| -- | -- |
| HEU KMS Activator | [GitHub Releases](https://github.com/zbezj/HEU_KMS_Activator/releases) |

(Optional) Next, [update the OS](ms-settings:windowsupdate), [login Microsoft Account](ms-settings:yourinfo) & adjust other system settings in [Windows Settings](ms-settings://).

Finally, enable Windows system built-in `sudo` support and select `inline` running method in "Terminal" section from settings [System > Advanced](ms-settings:developers).

### Setup Softwares

> [!Note]
> Don't forget to restart your computer to make these softwares work properly after the end of this step!

#### Learn How to Use WinGet

I highly recommend you to use [WinGet](https://learn.microsoft.com/windows/package-manager/winget/) to manage your softwares, it is the official Windows package manager, and helps you to avoid fake & malicious softwares.

> [!Note]
> `{{xxx}}` means a placeholder, `xxx` is the description text.

Search package:

```nu
# Search via name or ID
winget search {{query}}
# Search name only
winget search --name {{query}}
# Search ID only
winget search --id {{query}}
```

Add package:

```nu
winget add {{query}}
```

Add package (Machine scope, **not recommended**, requires admin privileges):

```nu
# Windows system built-in `sudo`
sudo winget add {{query}}
```

Add package to specific location:

```nu
winget add {{query}} --location /path/you/like/
# Or
winget add {{query}} -l /path/you/like/
```

Add package with interactive mode (Default is non-interactive mode):

```nu
winget add {{query}} --interactive
# Or
winget add {{query}} -i
```

Add package with no UI mode (Default is UI mode):

```nu
winget add {{query}} --silent
# Or
winget add {{query}} -h
```

Add package with exact ID match:

```nu
winget add --exact --id {{id}}
# Or
winget add -e --id {{id}}
```

Add specific version (Default is latest version):

```nu
winget add {{query}} --version {{version}}
# Or
winget add {{query}} -v {{version}}
```

Remove package:

```nu
winget rm {{query}}
```

For more information:

```nu
winget {{command}} --help
# Or
winget {{command}} -?
```

#### Recommended Softwares

Below softwares are highly recommended and helpful for Windows, you can install them **in order and as your need**.

##### Terminal User Interface (TUI)

| Software | Source/Install Command | Note |
| -- | -- | -- |
| Windows Terminal | System bundled | <TextTag text="Chezmoi-ed" text-xs /> The only one choice for Windows until now (2026/7/10)... |
| Nushell | `winget add Nushell.Nushell` | <TextTag text="Chezmoi-ed" text-xs /> A cross-platform shell powered by Rust. |
| Starship | `winget add Starship.Starship` | <TextTag text="Chezmoi-ed" text-xs /> A cross-platform shell prompt powered by Rust too. |
| Zoxide | `winget add ajeetdsouza.zoxide` | Fuzzy-match `cd`. |
| Git | `winget add Git.Git` | <TextTag text="Chezmoi-ed" text-xs /> Nothing is more important that _Git_ for a developer, right?<br><br>Is interactive mode needed? |
| Chezmoi | `winget add twpayne.chezmoi` | Dotfiles manager.<br><br>To init my dotfiles, please use: `chezmoi init git@github.com:lumirelle/dotfiles.git` |
| WinLibs | `winget add BrechtSanders.WinLibs.POSIX.UCRT` | A distribution of _GCC (GNU Compiler Collection)_ and its dependencies on Windows. |
| Mise | `winget add jdx.mise` | <TextTag text="Chezmoi-ed" text-xs /> Devtools manager.<br><br><strong>I use mise to manage system-scope user-called tools (other tools like shells who may be called by other softwares are still recommended to be install globally) & project-scope tools.</strong><br><br>See [my global mise configuration](https://github.com/lumirelle/dotfiles/blob/main/dot_config/mise/config.toml) for more details about what devtools I use globally. |
| Tree Sitter CLI | `winget add tree-sitter.tree-sitter-cli` | An incremental parsing system for programming tools. |
| Neovim | `winget add Neovim.Neovim` | <TextTag text="Chezmoi-ed" text-xs /> Just much faster than Visual Studio Code. |
| Pi Coding Agent | `winget add EarendilWorks.pi` | <TextTag text="Chezmoi-ed" text-xs /> Just vibe!<br><br><details><summary>Extensions setup:</summary>- <code>pi install npm:pi-web-access</code><br>- <code>pi install npm:@narumitw/pi-btw</code><br>- <code>pi install npm:pi-herdr-subagents</code><br></details> |
| Herdr | `winget add Herdr.Herdr.Preview` | <TextTag text="Chezmoi-ed" text-xs /> Terminal mutiplexer. |
| Windows Subsystem for Linux | `wsl --install` | Best Linux distribution in the world, best development environment for Windows. 🥰<br><br>Requires reboot after installation.<br><br>See WSL setup [here](#third-step-setup-wsl-environment). |

##### Graphic User Interface (GUI)

| Software | Source/Install Command | Note |
| -- | -- | -- |
| Auto Dark Mode | `winget add XP8JK4HZBVF435` | Save my eyes!<br><br>I prefer to set `Win+J` to switch color mode. |
| Twinkle Tray | `winget add 9PLJWWSV01LK` | Save my eyes!<br><br>Screen brightness manager. |
| Firefox | `winget add Mozilla.Firefox` | My daily use browser. See extensions setup [here](#browser-setup). |
| Nutstore | `winget add Nutstore.Nutstore` | WebDav.<br><br>I use it to sync my KeePass database among multiple devices.<br><br>**If you are facing the problem of clashing right after you openning Nutstore, it's recommended to restart you application or trigger the update of Nutstore.** |
| KeePassXC | `winget add KeePassXCTeam.KeePassXC` | Password manager, you can replace with your preferred one. |
| Internet Download Manager | `winget add Tonec.InternetDownloadManager` | Download manager, for better download experience.<br><br>**It also installs browser extension to handle the browser downloading!** |
| Visual Studio Code | `winget add Microsoft.VisualStudioCode` | <TextTag text="Chezmoi-ed" text-xs /><br><br>A: Best IDE!<br>B: It's not IDE, it's just a text editor!<br>... |
| Zed | `winget add ZedIndustries.Zed` | <TextTag text="Chezmoi-ed" text-xs /> **Still experimental, but better performance than Visual Studio Code.**<br><br>I feel that its usage and design philosophy don't quite suit me, especially the configuration files... |
| Navicat Premium Lite | [Official Website](https://www.navicat.com/download/navicat-premium-lite) | / |
| Podman Desktop | `winget add RedHat.Podman-Desktop` | **Wow! WSL Container is comming soon, may be we don't need this in the future?** |
| RayCast | `winget add --source msstore --exact --id 9PFXXSHC64H3` | <details><summary>Extensions</summary><br>_1. [Browser Bookmarks](raycast://extensions/raycast/browser-bookmarks?source=webstore)_;<br>_2. [Hacker News](raycast://extensions/thomas/hacker-news?source=webstore)_;<br>_3. [GitHub](raycast://extensions/raycast/github?source=webstore)_;<br>_4. [Git Repos](raycast://extensions/moored/git-repos?source=webstore)_;<br>_5. [Search npm Packages](raycast://extensions/mrmartineau/search-npm?source=webstore) (npm)_;<br>_6. [Can I Use](raycast://extensions/thomaslombart/can-i-use?source=webstore)_;<br>_7. [Svgl](raycast://extensions/1weiho/svgl?source=webstore)_;<br><br>_8. [Regex Tester](raycast://extensions/allenan/regex-tester?source=webstore)_;<br>_9. [Random Data Generator](raycast://extensions/loris/random?source=webstore)_;<br>_10. [Json2TS](raycast://extensions/gbarba/json2ts?source=webstore)_;<br>_11. [Format JSON](raycast://extensions/destiner/json-format?source=webstore)_;<br>_12. [Word Count](raycast://extensions/itsmingjie/word-count?source=webstore)_<br><br>_13. [Raycast Explorer](raycast://extensions/raycast/raycast-explorer?source=webstore)_. </details> |
| PixPin | `winget add PixPin.PixPin` | Screen capture.<br><br>I use `<PrtSc>` to take screenshots and copy, `<Ctrl-PrtSc>` to only take screenshots, `<Shift-PrtSc>` to pin screenshots. This requires disable the built-in Windows screenshot feature "Use the Print screen key to open screen capture". |
| OBS Studio | `winget add OBSProject.OBSStudio` | / |
| Thunderbird | `winget add Mozilla.Thunderbird` | Email manager. |
| WeChat | `winget add Tencent.WeChat.Universal` | Chat software. |
| QQ | `winget add Tencent.QQ.NT` | Chat software. |
| Enterprise WPS | [Official Website](https://ep.wps.cn/download) | Mysterious little code: TJ3GN-9NTGQ-GLF7C-YEN8X-TJWML |
| PDF SAM | [Official Website](https://pdfsam.org/download-pdfsam-basic/) | PDF converter. |
| Microsoft To Do | `winget add 9NBLGGH5R558` | Just to do! |
| Visual C++ Redistributable | [Official Website](https://learn.microsoft.com/cpp/windows/latest-supported-vc-redist) | MSVC Runtime. **Usually, we don't need to install this manually.** |
| NVIDIA App | [Official Website](https://www.nvidia.com/en-us/software/nvidia-app/) | / |
| Context Menu Manager | [GitHub Releases](https://github.com/BluePointLilac/ContextMenuManager/releases) | For classic context menu. |
| Windows 11 Context Menu Manager | [GitHub Releases](https://github.com/branhill/windows-11-context-menu-manager/releases) | For Windows 11 new context menu. |
| Revo Uninstaller | Free:<br>`winget add RevoUninstaller.RevoUninstaller`<br><br>Pro:<br>`winget add RevoUninstaller.RevoUninstallerPro` | Software uninstaller.<br><br>_Free_ or _Pro_, as your need. |
| Driver Store Explorer | `winget add lostindark.DriverStoreExplorer` | Clear unused/outdated device drivers. |
| DISM++ | `winget add ChuyuTeam.DISM++` | Clear disk. |
| Crystal Disk Info | [Official Website](https://crystalmark.info/software/crystaldiskinfo/) | / |
| Steam | `winget add Valve.Steam` | / |
| Epic Games | `winget add EpicGames.EpicGamesLauncher` | / |

#### Browser Setup

I hate _Chrome_ because it's too opinionated, I hate _Edge_ because it's too heavy.

I preferred _Firefox_ currently. Firefox is my daily use browser, while system bundled _Edge_ is my secondary browser for some special cases which require _Chromium_ engine.

My browser extensions:

> [!NOTE]
> "Tampermonkey" extension requires you to open the develop mode to running user scripts (JavaScript).

`~` in the below tables means the same as above.

| Extension | Source/Install Command | Note |
| -- | -- | -- |
| Tampermonkey | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/) & [Chromium](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) | Used user scripts: [_@sxzz/userscripts_](https://github.com/sxzz/userscripts) |
| KeePassXC-Browser | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/keepassxc-browser/) & [Chromium](https://chromewebstore.google.com/detail/keepassxc-browser/oboonakemofpalcgghocfoadofidjkkk) | / |
| Dark Reader | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/darkreader/) & [Chromium](https://chromewebstore.google.com/detail/dark-reader/eimadpbcbfnmbkopoojfekhnkhdbieeh) | Save my eyes!!! |
| Read Frog | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/read-frog-open-ai-translator/) & [Chromium](https://chromewebstore.google.com/detail/read-frog-translate-learn/modkelfkcfjpgbfmnbnllalkiogfofhb) | / |
| Vimium C - All by Keyboard | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/vimium-c/) & [Chromium](https://chromewebstore.google.com/detail/vimium-c-all-by-keyboard/hfjbmagddngcpeloejdejnfgbamkjaeg) | For better UX, it's recommended to enable **"Search in bookmarks or add new items"**, **"Run on chrome://_/_ pages"** & **"Run on Chrome's native New Tab Page"**, with [`#extensions-on-chrome-urls` browser flag](brave://flags/#extensions-on-chrome-urls) enabled |
| Refined Github | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/refined-github-/) & [Chromium](https://chromewebstore.google.com/detail/refined-github/hlepfoohegkhhmjieoechaddaejaokhf) | Requires your GitHub access token. |
| File Icons for GitHub and GitLab | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/github-file-icons/) & [Chromium](https://chromewebstore.google.com/detail/file-icons-for-github-and/ficfmibkjjnpogdcfhfokmihanoldbfe) | / |
| Npmx redirect | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/npmx-redirect/) & [Chromium](https://chromewebstore.google.com/detail/npmx-redirect/lbhjgfgpnlihfmobnohoipeljollhlnb) | Fuck Npm! Fuck Npm! |
| CSS Stacking Context inspector | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/css-stacking-context-inspector/) & [Chromium](https://chromewebstore.google.com/detail/css-stacking-context-insp/apjeljpachdcjkgnamgppgfkmddadcki) | / |
| Grammar and Spell Checker | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/languagetool/) & [Chromium](https://chromewebstore.google.com/detail/ai-grammar-checker-paraph/oldceeleldhonbafppcapldpdifcinji) | / |

Sometime useful extensions:

| Extension | Source/Install Command | Note |
| -- | -- | -- |
| Vue.js Devtools (Community) | [GitHub Releases](https://github.com/kxxxlfe/devtools/releases) | Used only for Vue 2 projects, Vue 3 projects are recommended to use [Vite plugin](https://devtools.vuejs.org/guide/vite-plugin) instead. |

I also like to customize the default browser fonts:

1. Go to [about:preferences#accessibility](about:preferences#accessibility).
2. Click "Advanced settings".
3. Fonts for "Latin", I prefer "Fraunces 9pt" (A serif font) as both Serif & Sans-serif font, "Annotation Mono" as Monospace font.
4. Fonts for "Simplified Chinese", I prefer "Resource Han Rounded SC" (A Sans-serif font) as both Serif & Sans-serif font, "Maple Mono WR CN" as Monospace font.
5. Fonts for "Traditional Chinese (Taiwan)", I prefer "Resource Han Rounded TW" (A Sans-serif font) as both Serif & Sans-serif font, "Maple Mono WR CN" as Monospace font.
6. Fonts for "Traditional Chinese (Hong Kong)", I prefer "Resource Han Rounded HK" (A Sans-serif font) as both Serif & Sans-serif font, "Maple Mono WR CN" as Monospace font.

To customize font-family of Firefox Devtools, you can refer to my [GitHub gist](https://gist.github.com/lumirelle/919722d43a643b2a8f2f2ce8db697eda).

#### Uninstall Unnecessary Softwares

Use _Revo Uninstaller_ to uninstall all the software you don't like!

In particular, **"Windows Programs"** tab let you can completely uninstall system bundled softwares!

## Third Step: Setup WSL Environment

Firstly, you should ensure you have the latest WSL installation:

```nu
wsl --update
```

Then, choose your favorite Linux distribution to install, I recommend _Arch_ for its newest packages, _Debain_ for its popularity and stability:

```nu
# Arch
wsl --install archlinux --location {{install_location_you_prefer}}
# Debain
wsl --install Debain --location {{install_location_you_prefer}}
```

### Prerequisite WSL Softwares

> [!Note]
> Below commands use _Arch_ distribution & it's package manager `pacman` as examples.

Below softwares are prerequisite softwares for WSL use:

| Software | Source/Install Command | Note |
| -- | -- | -- |
| Unzip | `sudo pacman -S unzip` | / |
| Wget | `sudo pacman -S wget`| / |
| OpenSSH | `sudo pacman -S openssh` | / |
| Base Devel | `sudo pacman -S base-devel` | Basic dev dependencies. |
| Fontconfig | `sudo pacman -S fontconfig` | / |
| (Optional) Noto Fonts CJK | `sudo pacman -S noto-fonts-cjk` | If you need to run **WSLg (WSL GUI) applications** with **CJK support**. |

### Arch Linux Specific Setup

If you prefer to use Arch Linux as WSL distribution just like me, you'd better to perform some specific setup, such as switch default user from `root`.

You should create your own user in `wheel` user group with customized password:

```nu
useradd -m -G wheel {{username}}
passwd {{username}}
```

Then enable `sudo` command calling permission for wheel user group:

```nu
# Openning `sudo` config via `vi`
visudo
# Then, uncomment line `%wheel ALL=(ALL:ALL) ALL` in `vi`,
# save and exit with `:wq`
```

Then set default user of WSL to the user you newly created, openning `wsl.conf` with `vi`:

```nu
vi /etc/wsl.conf
```

Append below config:

```ini
[user]
default={{username}}
```

Then save and exit with `:wq` too.

Finally, you can switch to the newly created user:

```nu
su - {{username}}
```

### Recommended WSL Softwares

> [!Note]
> Below commands use _Arch_ distribution & it's package manager `pacman` as examples.

Below softwares are highly recommended and helpful for the development use with Linux, you should install them **in order** as you need:

| Software | Source/Install Command | Note |
| -- | -- | -- |
| Yay | <pre><code>git clone https://aur.archlinux.org/yay-bin.git<br>cd yay-bin<br>makepkg -si</code></pre> | AUR helper (package manager), used to install packages from AUR instead of Arch official pacman registry. |
| Nushell | `sudo pacman -S nushell` | <TextTag text="Chezmoi-ed" text-xs /> A cross-platform shell powered by Rust. |
| Starship | `sudo pacman -S starship` | <TextTag text="Chezmoi-ed" text-xs /> A cross-platform shell prompt powered by Rust too. |
| Zoxide | `sudo pacman -S zoxide` | Fuzzy-match `cd`. |
| Chezmoi | `sudo pacman -S chezmoi` | Dotfiles manager.<br><br>To init my dotfiles, please use: `chezmoi init git@github.com:lumirelle/dotfiles.git` |
| Git | `sudo pacman -S git` | <TextTag text="Chezmoi-ed" text-xs /> Nothing is more important that _Git_ for a developer, right?<br><br>Is interactive mode needed? |
| Mise | `sudo pacman -S mise` | <TextTag text="Chezmoi-ed" text-xs /> Devtools manager.<br><br><strong>I use mise to manage system-scope user-called tools (other tools like shells who may be called by other softwares are still recommended to be install globally) & project-scope tools.</strong><br><br>See [my global mise configuration](https://github.com/lumirelle/dotfiles/blob/main/dot_config/mise/config.toml) for more details about what devtools I use globally. |
| Tree Sitter CLI | `sudo pacman -S tree-sitter-cli` | An incremental parsing system for programming tools. |
| Neovim | `sudo pacman -S neovim` | <TextTag text="Chezmoi-ed" text-xs /> Just much faster than Visual Studio Code. |
| Pi Coding Agent | `yay -S pi-coding-agent-bin` | <TextTag text="Chezmoi-ed" text-xs /> Just vibe!<br><br><details><summary>Extensions setup:</summary>- <code>pi install npm:pi-web-access</code><br>- <code>pi install npm:@narumitw/pi-btw</code><br>- <code>pi install npm:pi-herdr-subagents</code><br></details> |
| Herdr | `yay -S herdr-bin` | <TextTag text="Chezmoi-ed" text-xs /> Terminal mutiplexer. |
| (Optional) Chromium | `sudo pacman -S chromium` | If you choose Arch distribution and need to run PlayWright with Chromium.<br><br>`playwright install-deps` only supports Ubuntu distribution, as a workaround, we can install PlayWright dependencies via installing Chromium. |

## Forth Step: Maintain System

### Windows

Programs should under:

- User scope - `~/AppData/Local/Programs/`
- Machine scope
  - Standard
    - `<DRIVER>:/Program Files/`
    - `<DRIVER>:/Program Files (x86)/`
  - No space
    - `<DRIVER>:/ProgramData/`
  - Portable
    - `<DRIVER>:/Program Files Portable/`

Use Revo Uninstaller clean useless software at regular intervals.

Use DISM++ clean system at regular intervals.

Shut down and restart at regular intervals.

### WSL

Projects should under:

- `~/my/`: My projects:
  - `~/my/infra/`: My infrastructure projects;
  - `~/my/demo/`: My demo projects;
  - `~/my/prod/`: My production projects;
  - `~/my/contrib/`: Open source projects I contribute to;
  - `~/my/docs/`: My docs;
  - ...
- `~/workon/`: Projects I work on;
  - ...

> [!Caution]
>
> Use a symlink to link the projects folder is a bad behavior, it can cause problems when some devtools are resolving the project path.

## Optional Step: Without WSL-based Development Environment

If you prefer to use Windows itself as your development environment, or you are not allowed to use WSL for some reasons,you can follow the steps below to setup your development environment.

### Disable App Execution Aliases

Some versions of Windows have a feature called "App Execution Aliases", which is enabled by default.

With this feature enabled, Windows will automatically create a stub executable in `~/AppData/Local/Microsoft/WindowsApps/`, like `python.exe`, even you have not installed the corresponding application.

What's more, the Windows app path `~/AppData/Local/Microsoft/WindowsApps/` is placed in the very front of the system environment variable `Path` by default, which means that if you install Python not via that stub executable, but via your preferred way, the system will still execute the stub executable instead of the real one, which is really annoying.

Before disabling this feature, let's say together: **"Fuck you, Windows!"**

To disable this feature for Python:

1. Open "Settings > Apps > Advanced app settings > App execution aliases";
2. Find "App Installer (python.exe)" & "App Installer (python3.exe)", and turn off the switch.

The same for other applications.
