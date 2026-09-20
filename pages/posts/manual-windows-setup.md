---
title: Windows Setup Manual
date: 2025-08-24T19:40+08:00
update: 2026-09-20T11:26+08:00
lang: en
duration: 21min
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
  grid-template-columns: 1fr;
  grid-auto-flow: column;
  grid-auto-columns: 2fr;
}
.prose table th, .prose table td {
  overflow-x: auto;
}
</style>

[[toc]]

## Foreword

> [!Caution]
>
> Please never reinstall Windows when you don’t have time. You certainly don't want your girlfriend to make you spend the night with your computer, right?

I know Windows is the best OS for playing games, but the worst one to develop on.

But anyway, if we have no choice, the only thing we can do is try our best to make Windows better for development. 🥰

## First Step: Reinstall a Clean Copy of Windows

The only way to get a clean Windows experience is to reinstall it.

We can use [_Ventoy_](https://www.ventoy.net/en/download.html) and a _Windows operating system image file (ISO)_ to make a _bootable USB drive_ and reinstall Windows. This way, we can freely choose the operating system edition we want (Home, Education, Pro, etc.).

### Install & Set Up Ventoy

First, insert your USB flash drive.

If you want to store some extra files on your USB flash drive, such as essential software (like [_Clash Verge Rev_](#prerequisite-software)), you can divide the drive into two partitions.

Partitioning will not affect Ventoy's ability to find the image files, but **remember which partition you installed Ventoy itself on**. While booting the installer from the BIOS, you need to select the correct partition.

Finally, just follow [Ventoy's official installation guide](https://www.ventoy.net/en/doc_start.html) to complete the installation and setup.

### Download Windows ISO

> [!Note]
>
> I've only listed links for the Windows 11 image, because I'm currently using Windows 11 exclusively.
>
> If you want to switch back to Windows 10 / 7 / etc., you can find the image links yourself on [Microsoft's official website](https://www.microsoft.com/en-us/software-download/) or [Mass Grave](https://massgrave.dev/).

For developers, it's recommended to use the latest **Professional edition** of Windows.

To see the version information of Windows:

- Stable: [Windows 11 Release Information](https://learn.microsoft.com/en-us/windows/release-health/windows11-release-information/)
- Insider Program: [Flight Hub](https://learn.microsoft.com/en-us/windows-insider/flight-hub/)

To download a Windows ISO:

- Microsoft (Official): [Windows 11 ISO > Download Windows 11 Disk Image (ISO) for ... devices](https://www.microsoft.com/en-us/software-download/windows11)
- Mass Grave (Unofficial): [Windows 11 ISO](https://massgrave.dev/windows_11_links)

### Make a Bootable USB Drive

Just put the downloaded Windows ISO file onto the USB flash drive.

It doesn't matter which partition you put it on; Ventoy can handle it.

### Before You Wipe

My preference is simple: **I wipe every disk on reinstall and keep nothing from the old system**. If there is something I need, I export it to the USB flash drive that carries Ventoy (see above) before I start.

Know what that costs you:

- Once wiped, the old data is gone for good — no tool or recovery service will reliably bring it back.
- The old system is very likely encrypted, because Windows turns on **Device Encryption** (BitLocker) by default on modern machines, and the recovery key is kept in the Microsoft account that the *old* installation signed in with. Wiping the system drive does not touch other disks encrypted the same way, so if you have any, keep that account reachable.

> [!Caution]
>
> Check this **before** you wipe, not after: if you own another encrypted disk or an old backup, make sure you can still sign in to the Microsoft account it was registered with.

References:

- [Device Encryption in Windows](https://support.microsoft.com/en-us/windows/security/encryption/device-encryption-in-windows)
- [Find your BitLocker recovery key](https://account.microsoft.com/devices/recoverykey)

### Reinstall Windows

First, restart your computer and enter the _BIOS_: press the appropriate key repeatedly before the startup logo shows up, until you see the BIOS menu. The actual key depends on your _motherboard / computer model_, and is usually one of `ESC` / `F11` / `F12` / `Delete`.

Next, prepare for the reinstallation process with the steps below:

1. Choose your USB flash drive (**with the right partition** where Ventoy is installed if there is more than one partition) in the boot menu.
2. If you see the **"Security Violation"** error, don't worry, it's manageable. Please refer to the [Ventoy guide](https://www.ventoy.net/en/doc_secure.html) to enroll Ventoy's Secure Boot key and solve this problem.
3. After you enter the Ventoy GUI, choose your Windows ISO file to start the reinstallation process.

Then, customize your Windows installation options and wait for the process to complete.

In my case, I prefer to use the **Windows 11 Professional Edition (without the "N" flag)** and to **create only one partition per disk**. Different people may have different preferences, but I prefer this because the Professional edition ships with the most useful presets out of the box for developers and gamers, and on modern systems, creating multiple partitions on a single disk really has no benefit.

What's more, in order to get a "clean & customized" username on Windows, please **use a local account** to set up Windows instead of a Microsoft account, which saves you from the ugly numeric username generated from your Microsoft account email. When you get stuck on the Microsoft account login page, just press `Shift+F10` to open a command prompt and run the command below to create a local account in the window that pops up:

```cmd
start ms-cxh:localonly
```

> [!Caution]
>
> My advice is **not** to use _OOBE_ to bypass the Microsoft account login instead of using a **local account**: it will also bypass the **online updates**, and you may forget to apply, or even skip, the necessary security updates after the reinstallation, which may cause the freshly installed Windows to break — maybe some drivers will be broken, or some core system components, etc.
>
> It's a lesson learned in blood and tears...
>
> Of course, the online update of Windows is very slow — it basically takes 1 ~ 2 hours, because it downloads not only the necessary components but also some useless ones. Don't worry and just be patient; we will remove them all later.
>
> Believe me, all these choices are for the best stability and cleanliness of the system. 🥺

## Second Step: Set Up the Environment

### Prerequisite Software

(Optional) If the area you live in has some **"mysterious"** network restrictions, you may need to prepare proxy software before any other network-dependent step — for example, by downloading it onto your USB flash drive ahead of time:

| Software | Source/Install Command | Note |
| -- | -- | -- |
| Clash Verge Rev | Download it from the [GitHub releases page](https://github.com/Clash-Verge-rev/clash-verge-rev/releases) onto your USB flash drive.<br><br>You'd better prepare it before the reinstallation. | <TextTag text="Chezmoi-ed" /> Network proxy manager. |

### Configure Windows Itself

#### Replace Windows Defender

I hate _Windows Defender_, because it triggers false positives far too often and deletes my software by accident...

First, we need to disable it entirely:

1. Open ["Virus & threat protection settings"](windowsdefender://threatsettings/) and turn off all switches to disable every antivirus feature of Windows Defender.
2. Use [_Defender Control v2.1_](https://www.sordum.org/9480/defender-control-v2-1/) to completely disable Windows Defender (backend services, etc.).

Optionally, we can choose a quieter antivirus program instead. I recommend [_Huorong_](https://www.huorong.cn/person), which is much quieter and less invasive.

| Software | Source/Install Command |
| -- | -- |
| Huorong | [Official Website](https://www.huorong.cn/person) |

> [!Note]
>
> You can choose any other antivirus software you like — anything but _Windows Defender_!!!

#### Adjust System Settings

First, adjust system settings via _Winutil_:

| Software | Source/Install Command | Note |
| -- | -- | -- |
| Winutil | PowerShell:<br>`irm "https://christitus.com/win" \| iex` | In the "Tweaks" tab, just apply the recommended settings if you are not sure about those switches~<br><br>In the "Config" tab, I enable the "Windows Subsystem for Linux" feature;<br><br> |

(Optional) If your Windows is not activated yet, you can use _HEU KMS Activator_ to activate it:

| Software | Source/Install Command |
| -- | -- |
| HEU KMS Activator | [GitHub Releases](https://github.com/zbezj/HEU_KMS_Activator/releases) |

> [!Note]
>
> Tools like _HEU KMS Activator_ bypass Windows licensing: using them may violate the Microsoft Software License Terms, and they are commonly flagged as malware by security vendors. Keep in mind that you just disabled _Windows Defender_ in the previous step, so run them only if you understand where they come from and accept the risk.

(Optional) Next, [update the OS to the latest version](ms-settings:windowsupdate), [sign in to your Microsoft account](ms-settings:yourinfo) & adjust other system settings in [Windows Settings](ms-settings://).

Finally, enable Windows' built-in `sudo` support and select the `inline` running method in the "Terminal" section under [System > Advanced](ms-settings:developers) in Settings.

### Install Software

> [!Note]
> Don't forget to restart your computer after this step so that the software mentioned below works properly!

#### Learn How to Use WinGet

I highly recommend using [WinGet](https://learn.microsoft.com/windows/package-manager/winget/) to manage your software on Windows. It is the official Windows package manager and helps you avoid fake and malicious software.

> [!Note]
> `{{xxx}}` is a placeholder, where `xxx` is the description text.

Search for a package:

```nu
# Search via name or ID
winget search {{query}}
# Search name only
winget search --name {{query}}
# Search ID only
winget search --id {{query}}
```

Install a package:

```nu
winget add {{query}}
```

Install a package (machine scope, **not recommended**, requires admin privileges):

```nu
# Windows system built-in `sudo`
sudo winget add {{query}} --scope machine
```

Install a package to a specific location:

```nu
winget add {{query}} --location /path/you/like/
# Or
winget add {{query}} -l /path/you/like/
```

Install a package in interactive mode (the default is non-interactive mode):

```nu
winget add {{query}} --interactive
# Or
winget add {{query}} -i
```

Install a package with no UI (the default shows a UI):

```nu
winget add {{query}} --silent
# Or
winget add {{query}} -h
```

Install a package with an exact ID match:

```nu
winget add --exact --id {{id}}
# Or
winget add -e --id {{id}}
```

Install a specific version (the default is the latest version):

```nu
winget add {{query}} --version {{version}}
# Or
winget add {{query}} -v {{version}}
```

Remove a package:

```nu
winget rm {{query}}
```

For more information:

```nu
winget {{command}} --help
# Or
winget {{command}} -?
```

#### Recommended Software

The software below is highly recommended and helpful for daily use and development; you can install them **in order and as needed**.

##### Terminal User Interface (TUI)

| Software | Source/Install Command | Note |
| -- | -- | -- |
| Windows Terminal | `winget add Microsoft.WindowsTerminal.Preview` | <TextTag text="Chezmoi-ed" text-xs /> The only choice for Windows so far (2026/8/31)...<br><br>What's more, I switched to the preview version (v1.25+) for Kitty keyboard protocol support. |
| Nushell | `winget add Nushell.Nushell` | <TextTag text="Chezmoi-ed" text-xs /> A cross-platform shell powered by Rust. |
| Git | `winget add Git.Git` | <TextTag text="Chezmoi-ed" text-xs /> Nothing is more important than _Git_ for a developer, right?<br><br>Is interactive mode needed? |
| Chezmoi | `winget add twpayne.chezmoi` | Dotfiles manager.<br><br>To init my dotfiles, please use: `chezmoi init git@github.com:lumirelle/dotfiles.git` |
| WinLibs | `winget add BrechtSanders.WinLibs.POSIX.UCRT` | A distribution of _GCC (GNU Compiler Collection)_ and its dependencies on Windows.<br><br>Some tools use MSVC as the default compiler on Windows but respect the `CC` & `CXX` flags, so it's recommended to set `CC` & `CXX` to `gcc` & `g++` respectively. |
| Mise | `winget add jdx.mise` | <TextTag text="Chezmoi-ed" text-xs /> Devtools manager.<br><br><strong>I use mise to manage system-scope user-called tools (other tools like shells that may be called by other software are still recommended to be installed globally) and project-scope tools.</strong><br><br>See [my global mise configuration](https://github.com/lumirelle/dotfiles/blob/main/dot_config/mise/config.toml) for more details about what devtools I use globally. |
| Tree Sitter CLI | `winget add tree-sitter.tree-sitter-cli` | An incremental parsing system for programming tools. |
| Apple PKL LSP | `mkdir ~/.local/bin/; curl -fsSL https://github.com/apple/pkl-lsp/releases/download/0.8.0/pkl-lsp-0.8.0.jar -o ~/.local/bin/pkl-lsp.jar` | Apple PKL LSP. |
| Neovim | `winget add Neovim.Neovim` | <TextTag text="Chezmoi-ed" text-xs /> Just much faster than Visual Studio Code. |
| Pi Coding Agent | `winget add EarendilWorks.pi` | <TextTag text="Chezmoi-ed" text-xs /> Just vibe! |
| Herdr | `winget add Herdr.Herdr.Preview` | <TextTag text="Chezmoi-ed" text-xs /> Terminal multiplexer. |
| Windows Subsystem for Linux | `wsl --install` or `wsl --update` | The best Linux distribution in the world and the best development environment for Windows. 🥰<br><br>Requires a reboot after installation.<br><br>See WSL setup [here](#third-step-set-up-the-wsl-environment). |

##### Graphical User Interface (GUI)

| Software | Source/Install Command | Note |
| -- | -- | -- |
| Auto Dark Mode | `winget add XP8JK4HZBVF435` | Save my eyes!<br><br>I prefer to set `Win+J` to switch color mode. |
| Twinkle Tray | `winget add 9PLJWWSV01LK` | Save my eyes!<br><br>Screen brightness manager. |
| Firefox | `winget add Mozilla.Firefox` | My daily browser. See extensions setup [here](#browser-setup). |
| Nutstore | `winget add Nutstore.Nutstore` | WebDAV.<br><br>I use it to sync my KeePass database among multiple devices.<br><br>**If you run into a crash right after opening Nutstore, it's recommended to restart your application or trigger a Nutstore update.** |
| KeePassXC | `winget add KeePassXCTeam.KeePassXC` | Password manager; you can replace it with your preferred one. |
| Internet Download Manager | `winget add Tonec.InternetDownloadManager` | Download manager, for a better downloading experience.<br><br>**It also installs a browser extension to handle browser downloads!** |
| Zed | `winget add ZedIndustries.Zed` | <TextTag text="Chezmoi-ed" text-xs /> **Still experimental, but with better performance than Visual Studio Code.**<br><br>I feel that its usage and design philosophy don't quite suit me, especially the configuration files... |
| Visual Studio Code | `winget add Microsoft.VisualStudioCode` | <TextTag text="Chezmoi-ed" text-xs /><br><br>A: Best IDE!<br>B: It's not an IDE, it's just a text editor!<br>... |
| Navicat Premium Lite | [Official Website](https://www.navicat.com/download/navicat-premium-lite) | / |
| Podman Desktop | `winget add RedHat.Podman-Desktop` | **Wow! WSL Containers are coming soon; maybe we won't need this in the future?** |
| RayCast | `winget add --source msstore --exact --id 9PFXXSHC64H3` | <details><summary>Extensions</summary><br>1. [Google Translate](raycast://extensions/gebeto/translate?source=webstore)<br>2. [Universal Website Search](raycast://extensions/pernielsentikaer/any-website-search?source=webstore)<br>3. [Svgl](raycast://extensions/1weiho/svgl?source=webstore)<br>4. [Kaomoji Search](raycast://extensions/yalishanda/kaomoji-search?source=webstore)<br><br>5. [Port Manager](raycast://extensions/lucaschultz/port-manager?source=webstore)<br><br>6. [Random Data Generator](raycast://extensions/loris/random?source=webstore)<br>7. [Placeholder](raycast://extensions/koinzhang/placeholder?source=webstore)<br>8. [Regex Tester](raycast://extensions/allenan/regex-tester?source=webstore)<br>8. [Json2TS](raycast://extensions/gbarba/json2ts?source=webstore)<br>9. [Word Count](raycast://extensions/itsmingjie/word-count?source=webstore)<br>10. [ray.so](raycast://extensions/garrett/ray-so?source=webstore)</details> |
| PixPin | `winget add PixPin.PixPin` | Screen capture tool.<br><br>I use `<PrtSc>` to take screenshots and copy, `<Ctrl-PrtSc>` to only take screenshots, `<Shift-PrtSc>` to pin screenshots. This requires disabling the built-in Windows screenshot feature, "Use the Print screen key to open screen capture". |
| OBS Studio | `winget add OBSProject.OBSStudio` | / |
| Thunderbird | `winget add Mozilla.Thunderbird` | Email manager. |
| WeChat | `winget add Tencent.WeChat.Universal` | Chat software. |
| QQ | `winget add Tencent.QQ.NT` | Chat software. |
| Enterprise WPS | [Official Website](https://ep.wps.cn/download) | Mysterious little code: TJ3GN-9NTGQ-GLF7C-YEN8X-TJWML |
| PDF SAM | [Official Website](https://pdfsam.org/download-pdfsam-basic/) | PDF converter. |
| Microsoft To Do | `winget add 9NBLGGH5R558` | Just to do! |
| Visual C++ Redistributable | [Official Website](https://learn.microsoft.com/cpp/windows/latest-supported-vc-redist) | MSVC Runtime. **Usually, we don't need to install this manually.** |
| NVIDIA App | [Official Website](https://www.nvidia.com/en-us/software/nvidia-app/) | / |
| Context Menu Manager | [GitHub Releases](https://github.com/BluePointLilac/ContextMenuManager/releases) | Brings back the classic context menu. |
| Windows 11 Context Menu Manager | [GitHub Releases](https://github.com/branhill/windows-11-context-menu-manager/releases) | For the new Windows 11 context menu. |
| Revo Uninstaller | Free:<br>`winget add RevoUninstaller.RevoUninstaller`<br><br>Pro:<br>`winget add RevoUninstaller.RevoUninstallerPro` | Software uninstaller.<br><br>_Free_ or _Pro_, as you need. |
| Driver Store Explorer | `winget add lostindark.DriverStoreExplorer` | Clean up unused/outdated device drivers. |
| DISM++ | `winget add ChuyuTeam.DISM++` | Clean up your disk. |
| CrystalDiskInfo | [Official Website](https://crystalmark.info/software/crystaldiskinfo/) | / |
| Steam | `winget add Valve.Steam` | / |
| Epic Games | `winget add EpicGames.EpicGamesLauncher` | / |

#### Browser Setup

I hate _Chrome_ because it's too opinionated, and I hate _Edge_ because it's too heavy.

I currently prefer _Firefox_. Firefox is my daily browser, while the system-bundled _Edge_ is my secondary browser for the special cases that require the _Chromium_ engine.

My browser extensions:

> [!NOTE]
> The "Tampermonkey" extension requires you to enable developer mode to run user scripts (JavaScript).

In the tables below, `~` means the same as above.

| Extension | Source/Install Command | Note |
| -- | -- | -- |
| Tampermonkey | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/) & [Chromium](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) | User scripts in use: [_@sxzz/userscripts_](https://github.com/sxzz/userscripts) |
| KeePassXC-Browser | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/keepassxc-browser/) & [Chromium](https://chromewebstore.google.com/detail/keepassxc-browser/oboonakemofpalcgghocfoadofidjkkk) | / |
| Dark Reader | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/darkreader/) & [Chromium](https://chromewebstore.google.com/detail/dark-reader/eimadpbcbfnmbkopoojfekhnkhdbieeh) | Save my eyes!!! |
| Read Frog | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/read-frog-open-ai-translator/) & [Chromium](https://chromewebstore.google.com/detail/read-frog-translate-learn/modkelfkcfjpgbfmnbnllalkiogfofhb) | / |
| Vimium C - All by Keyboard | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/vimium-c/) & [Chromium](https://chromewebstore.google.com/detail/vimium-c-all-by-keyboard/hfjbmagddngcpeloejdejnfgbamkjaeg) | For better UX, it's recommended to enable **"Search in bookmarks or add new items"**, **"Run on chrome://_/_ pages"** & **"Run on Chrome's native New Tab Page"**, with the [`#extensions-on-chrome-urls` browser flag](brave://flags/#extensions-on-chrome-urls) enabled |
| Refined Github | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/refined-github-/) & [Chromium](https://chromewebstore.google.com/detail/refined-github/hlepfoohegkhhmjieoechaddaejaokhf) | Requires your GitHub access token. |
| File Icons for GitHub and GitLab | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/github-file-icons/) & [Chromium](https://chromewebstore.google.com/detail/file-icons-for-github-and/ficfmibkjjnpogdcfhfokmihanoldbfe) | / |
| Npmx redirect | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/npmx-redirect/) & [Chromium](https://chromewebstore.google.com/detail/npmx-redirect/lbhjgfgpnlihfmobnohoipeljollhlnb) | Fuck Npm! Fuck Npm! |
| CSS Stacking Context inspector | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/css-stacking-context-inspector/) & [Chromium](https://chromewebstore.google.com/detail/css-stacking-context-insp/apjeljpachdcjkgnamgppgfkmddadcki) | / |
| Grammar and Spell Checker | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/languagetool/) & [Chromium](https://chromewebstore.google.com/detail/ai-grammar-checker-paraph/oldceeleldhonbafppcapldpdifcinji) | / |

Sometimes useful extensions:

| Extension | Source/Install Command | Note |
| -- | -- | -- |
| Vue.js Devtools (Community) | [GitHub Releases](https://github.com/kxxxlfe/devtools/releases) | Only used for Vue 2 projects; for Vue 3 projects, the [Vite plugin](https://devtools.vuejs.org/guide/vite-plugin) is recommended instead. |

I also like to customize the default browser fonts:

1. Go to [about:preferences#accessibility](about:preferences#accessibility).
2. Click "Advanced settings".
3. For "Latin" fonts, I prefer "Space Grotesk" (a sans-serif font) as both the serif and sans-serif font, and "Annotation Mono" as the monospace font.
4. For "Simplified Chinese" fonts, I prefer "Resource Han Rounded SC" (a sans-serif font) as both the serif and sans-serif font, and "Maple Mono WR CN" as the monospace font.
5. For "Traditional Chinese (Taiwan)" fonts, I prefer "Resource Han Rounded TW" (a sans-serif font) as both the serif and sans-serif font, and "Maple Mono WR CN" as the monospace font.
6. For "Traditional Chinese (Hong Kong)" fonts, I prefer "Resource Han Rounded HK" (a sans-serif font) as both the serif and sans-serif font, and "Maple Mono WR CN" as the monospace font.

To customize the font-family of Firefox DevTools, you can refer to my [GitHub gist](https://gist.github.com/lumirelle/919722d43a643b2a8f2f2ce8db697eda).

#### Uninstall Unnecessary Software

Use _Revo Uninstaller_ to uninstall all the software you don't like!

In particular, the **"Windows Programs"** tab lets you completely uninstall system-bundled software!

## Third Step: Set Up the WSL Environment

First, make sure your WSL installation is up to date:

```nu
wsl --update
```

Then, choose your favorite Linux distribution to install; I recommend _Arch_ for its up-to-date packages and _Debian_ for its popularity and stability:

```nu
# Arch
wsl --install archlinux --location {{install_location_you_prefer}}
# Debian
wsl --install Debian --location {{install_location_you_prefer}}
```

### Prerequisite WSL Software

> [!Note]
> The commands below use the _Arch_ distribution and its package manager, `pacman`, as examples.

Below software is required for daily use and development in WSL:

| Software | Source/Install Command | Note |
| -- | -- | -- |
| Unzip | `sudo pacman -S unzip` | / |
| Wget | `sudo pacman -S wget` | / |
| OpenSSH | `sudo pacman -S openssh` | / |
| Less | `sudo pacman -S less` | / |
| Base Devel | `sudo pacman -S base-devel` | Basic dev dependencies. |
| Fontconfig | `sudo pacman -S fontconfig` | / |
| (Optional) Noto Fonts CJK | `sudo pacman -S noto-fonts-cjk` | If you need to run **WSLg (WSL GUI) applications** with **CJK support**. |

### Arch Linux Specific Setup

If you prefer to use Arch Linux as your WSL distribution just like me, you'd better perform some specific setup, such as switching the default user away from `root`.

You should create your own user in the `wheel` group with a custom password:

```nu
useradd -m -G wheel {{username}}
passwd {{username}}
```

Then allow the `wheel` group to run `sudo`:

```nu
# Opening the `sudo` config in `vi`
visudo
# Then, uncomment line `%wheel ALL=(ALL:ALL) ALL` in `vi`,
# save and exit with `:wq`
```

Then set WSL's default user to the one you just created by opening `wsl.conf` with `vi`:

```nu
vi /etc/wsl.conf
```

Append the config below:

```ini
[user]
default={{username}}
```

Then save and exit with `:wq` as well.

Finally, you can switch to the newly created user:

```nu
su - {{username}}
```

### Recommended WSL Software

> [!Note]
> The commands below use the _Arch_ distribution and its package manager, `pacman`, as examples.

Below software is highly recommended and helpful for development with Linux; you may want to install them **in the order you need**:

| Software | Source/Install Command | Note |
| -- | -- | -- |
| Yay | <pre><code>git clone https://aur.archlinux.org/yay-bin.git<br>cd yay-bin<br>makepkg -si</code></pre> | AUR helper (package manager), used to install packages from the AUR instead of the official Arch repositories. |
| Nushell | `sudo pacman -S nushell` | <TextTag text="Chezmoi-ed" text-xs /> A cross-platform shell powered by Rust. |
| Chezmoi | `sudo pacman -S chezmoi` | Dotfiles manager.<br><br>To init my dotfiles, please use: `chezmoi init git@github.com:lumirelle/dotfiles.git` |
| Git | `sudo pacman -S git` | <TextTag text="Chezmoi-ed" text-xs /> Nothing is more important than _Git_ for a developer, right?<br><br>Is interactive mode needed? |
| Mise | `sudo pacman -S mise` | <TextTag text="Chezmoi-ed" text-xs /> Devtools manager.<br><br><strong>I use mise to manage system-scope user-called tools (other tools like shells that may be called by other software are still recommended to be installed globally) and project-scope tools.</strong><br><br>See [my global mise configuration](https://github.com/lumirelle/dotfiles/blob/main/dot_config/mise/config.toml) for more details about what devtools I use globally. |
| Tree Sitter CLI | `sudo pacman -S tree-sitter-cli` | An incremental parsing system for programming tools. |
| Apple PKL LSP | `mkdir ~/.local/bin/; curl -fsSL https://github.com/apple/pkl-lsp/releases/download/0.8.0/pkl-lsp-0.8.0.jar -o ~/.local/bin/pkl-lsp.jar` | Apple PKL LSP. |
| Neovim | `sudo pacman -S neovim` | <TextTag text="Chezmoi-ed" text-xs /> Just much faster than Visual Studio Code. |
| Pi Coding Agent | `yay -S pi-coding-agent-bin` | <TextTag text="Chezmoi-ed" text-xs /> Just vibe! |
| Herdr | `yay -S herdr-bin` | <TextTag text="Chezmoi-ed" text-xs /> Terminal multiplexer. |
| (Optional) Chromium | `sudo pacman -S chromium` | If you choose the Arch distribution and need to run Playwright with Chromium.<br><br>`playwright install-deps` only supports Ubuntu; as a workaround, we can install Playwright's dependencies by installing Chromium. |

## Fourth Step: Local LLM

If you want to try a local LLM on your Windows computer just like me, I highly recommend you try WSL + llama.cpp:

| Software | Source/Install Command | Note |
| -- | -- | -- |
| llama.cpp | `sudo pacman -S llama-cpp` | / |
| ggml-cuda | `sudo pacman -S ggml-cuda` | If you are using an NVIDIA GPU. |
| ggml-vulkan & vulkan-dzn | `sudo pacman -S ggml-vulkan vulkan-dzn` | If you are using an AMD GPU. |

And then you can deploy your local LLM with the command below:

```nu
llama-server -hf {{model-name}}:{{model-version}} ... {{additional-args}}
```

You can customize your own model and args, or just refer to my personal [LLM start-up scripts](https://github.com/lumirelle/llm).

## Fifth Step: Maintain the System

### Windows

Programs should live under:

- User scope - `~/AppData/Local/Programs/`
- Machine scope
  - Standard
    - `<DRIVER>:/Program Files/`
    - `<DRIVER>:/Program Files (x86)/`
  - No space
    - `<DRIVER>:/ProgramData/`
  - Portable
    - `<DRIVER>:/Program Files Portable/`

Use Revo Uninstaller to clean up useless software at regular intervals.

Use DISM++ to clean up the system at regular intervals.

Shut down and restart your computer at regular intervals.

### WSL

Projects should live under:

- `~/my/`: My projects:
  - `~/my/infra/`: My infrastructure projects.
  - `~/my/learning`: My learning records.
  - `~/my/demo/`: My demo projects.
  - `~/my/prod/`: My production projects.
  - `~/my/contrib/`: Open source projects I contribute to.
  - `~/my/llm`: My LLM-related projects.
  - ...
- `~/workon/`: Projects I work on.
  - ...

> [!Caution]
>
> Using a symlink to point to a project folder in another location is bad practice; it can cause problems when some devtools resolve the project path.

## Optional Step: Without WSL-based Development Environment

If you prefer to use Windows itself as your development environment, or you are not allowed to use WSL for some reason, you can follow the steps below to set up your development environment.

### Disable App Execution Aliases

Some versions of Windows have a feature called "App Execution Aliases", which is enabled by default.

With this feature enabled, Windows will automatically create a stub executable under `~/AppData/Local/Microsoft/WindowsApps/`, like `python.exe`, even if you have not installed the corresponding application.

What's more, the Windows app path `~/AppData/Local/Microsoft/WindowsApps/` is placed at the very front of the system environment variable `Path` by default, which means that if you install _Python_ in your own way (such as with `winget add`, or the installer from the official website), the system will still resolve `python` to the stub executable instead of yours, which is really annoying.

Before disabling this feature, let's just say: **"Fuck you, Windows! Fuck you, Microsoft!"**

To disable this "feature" (Yes, this is a real "feature" XD):

1. Open "Settings > Apps > Advanced app settings > App execution aliases".
2. Find "App Installer (python.exe)" & "App Installer (python3.exe)" and turn off the switch.

The same goes for other applications.
