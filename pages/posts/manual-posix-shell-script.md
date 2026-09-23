---
title: POSIX Shell Script Manual
date: 2025-12-01T15:50+08:00
update: 2026-09-21T10:32+08:00
lang: en
duration: 20min
type: manual
group: Shell
order: 1
---

[[toc]]

## Why POSIX Shell Command Language?

Portable. The standard shell command language, which can run on **almost every** Unix-like operating system.

## What Is `sh`?

`sh` is a REPL (Read-Eval-Print Loop) environment to run POSIX Shell command language.

`sh` is a name or an agreement, not a specific program; on different operating systems, `sh` is also different:

| Operating System | Implementation |
| -- | -- |
| Debian / Ubuntu | `dash` |
| Alpine Linux | `busybox ash` |
| macOS | `bash --posix` |
| RHEL / CentOS / Fedora | `bash` |
| Arch Linux | `bash` |
| FreeBSD | `sh` (Derived from `ash`) |
| NixOS | `sh` |

> [!Note]
>
> On _Windows_, you can run POSIX shell scripts via **Windows Subsystem for Linux (WSL)** or **Git Bash**.

## First POSIX Shell Script

POSIX shell script uses the `.sh` file extension.

You can create and run your first script by following these steps:

1. Open your terminal and ensure you are running `sh`:

    ```sh
    sh
    ```

    > [!Note]
    >
    > "Terminal" and "shell" are different things: the terminal is the interface for users to interact with the shell, and the shell is the command-line interpreter that executes commands. So you can run `sh` in different terminals, like _Terminal.app_ on macOS, _GNOME Terminal_ on Linux, or _Windows Terminal_ on Windows.

2. Create a new file named `hello.sh` using a text editor like `vi`:

   ```sh
   vi hello.sh
   ```

3. Add the following lines to the file:

   ```sh
   #!/bin/sh
   echo 'Hello, POSIX!'
   ```

4. Save and exit the editor (in `vi`, press `Esc`, type `:wq`, and hit `Enter`), and go back to `sh`.
5. Give the script execution permission by running the following command:

   ```sh
   chmod +x hello.sh
   ```

6. Run the script with the following command:

   ```sh
   ./hello.sh
   ```

   > [!Note]
   >
   > You should prefix the script with `./` to indicate that it is located in the current directory, or Linux will search for it in the system's PATH, resulting in a "command not found" error.

7. You should see the output:

   ```txt
   Hello, POSIX shell!
   ```

## Shebang (`#!`)

You may have noticed the first line of the script:

```sh
#!/bin/sh // [!code highlight]
echo 'Hello, POSIX shell!'
```

This line is called a **shebang** (or hashbang); it tells the system which **shell interpreter** to use to execute the script, and its syntax is `#!{{path_to_interpreter}}`. Which means: you can execute your script with other compatible shell interpreters, like `#!/bin/bash` or `#!/bin/zsh`.

But anyway, running a POSIX shell script with `sh` itself is the best choice. Most people who love the modern shell experience with _Zsh_, _Fish_, or others may only use those modern shells as interactive shells, and still use `sh` as the script interpreter for the best compatibility and stability.

## Statement

In POSIX shell command language, a statement can be a command call, variable declaration, or some special syntax like `if`, `case`, etc.:

```sh
#!/bin/sh
# Command call statement
git commit -m 'Update README.md'
# Variable declaration statement
name='POSIX shell'
# `if` statement
if [ -z $input ]; then
  echo 'Input is zero!'
fi
# ...
```

### Statement Separator

POSIX shell allows you to write multiple statements on one line, separating them with a semicolon `;`. It can be omitted if each command is on a separate line:

```sh
#!/bin/sh
echo 'Hello'; echo 'POSIX shell!'
echo 'Welcome to POSIX shell scripting.'
```

## Variable

### Define Variable

POSIX shell allows us to define variables to store values.

The syntax for defining a variable is very simple: **`{{variable_name}}={{value}}`**. Notice, any spaces around the `=` sign is not allowed:

```sh
#!/bin/sh
# ✅
name='World'
# 🚫
name_with_space = 'World'
```

As usual, you cannot / should not use shell reserved keywords, commands, special characters, or spaces for variable names, nor start a variable name with a number:

```sh
#!/bin/sh

# 🤔
# Shell preserved keywords, no error, but it's puzzling!
if=5
# Commands, no error, but it's also puzzling!
git='Hello'

# ❌
# Special characters, cause an error:
# -> var*name=Hello: Command not found
var*name='Hello'
# Space, cause an error:
# -> with_space: Command not found
with_space = 'World'
# Start with a number, cause an error:
# -> 9var=Hello: Command not found
9var='Hello'
```

### Access Variable

To access the value of a variable, you need to **prefix it with a `$`** sign, which means **"evaluate"**:

```sh
#!/bin/sh
name='World'
echo "Hello, $name!"
```

If there are some extra texts right after the variable, you should use curly braces `{}` to enclose the variable name, so that POSIX shell can correctly identify its name:

```sh
#!/bin/sh
name='World'
echo "Hello, ${name}s!"
```

### Access with Default Value

You can also access a variable with a default value using the following syntax:

- `${{{variable}}:-{{default_value}}}`: If `value` is **unset or null**, return `default_value`; otherwise return the value of `variable`.

  ```sh
  #!/bin/sh
  name=${username:-'Guest'}
  echo "Hello, $name!"
  echo "Hello, $username!"
  ```

- `${{{variable}}:={{default_value}}}`: If `value` is **unset or null**, **assign** `default_value` to `variable`, and then return the value of `variable`.

  ```sh
  #!/bin/sh
  name=${username:='Guest'}
  echo "Hello, $name!"
  echo "Hello, $username!"
  ```

- `${{{variable}}:+{{alternate_value}}}`: If `value` is **set and not null**, return `alternate_value`; otherwise return an empty value.

  ```sh
  #!/bin/sh
  name=${username:+'Registered User'}
  echo "Hello, $name!"
  echo "Hello, $username!"
  ```

- `${{{variable}}:?{{error_message}}}`: If `value` is **unset or null**, print `error_message` and exit the script.

  ```sh
  #!/bin/sh
  name=${username:?'Error: username variable is not set!'}
  echo "Hello, $name!"
  echo "Hello, $username!"
  ```

### Unset Variable

POSIX shell allows you to unset (delete) a variable by using the `unset` command:

```sh
#!/bin/sh
name='World'
echo "Hello, $name!"  # -> Hello, World!

unset name
echo "Hello, $name!"  # -> Hello, !
```

Of course, a [readonly variable](#work-with-readonly-command) cannot be unset.

### Work with `readonly` Command

The `readonly` command can be used to **define readonly variables** or **print readonly variables' information**.

To define a readonly variable:

- `readonly {{variable_name}}={{value}}`: Define a **readonly** variable.

  ```sh
  #!/bin/sh
  readonly PI=3.14
  PI=3.14159 # -> -sh: PI: readonly variable
  ```

To print readonly variables' information:

- `readonly -p`: Print the information of **all readonly variables** in the current shell.
- ...

### Work with `export` Command

The `export` command can be used to **define exported variables**.

```sh
#!/bin/sh
export MY_VAR='Hell'
sh -c "echo $MY_VAR" # -> Hello
```

### Special Variables

POSIX shell has several special built-in variables that provide useful information in shell/script environment.

In the shell environment:

- `$?`: The **exit code** of the last executed command.
- `$$`: The **process ID** of the current shell.
- `$!`: The **process ID** of the last background (async) command (`&`).
- `$_`: The **last argument** of the previous command.
- `$-`: The **current shell options**.
- ...

In the script environment, including all of the above, plus:

- `$0`: The **name of the shell or script**.
- `$1`, `$2`, ...: The first, second, ... **command-line arguments** passed to the script.

  > [!Note]
  >
  > If there are more than 9 arguments, you need to wrap them in braces like `${10}`, `${11}`.

- `$#`: The **number of command-line arguments** passed to the script.
- `$@`: All command-line arguments passed to the script as **separate words**.

  ```sh
  #!/bin/sh
  for i in "$@"; do echo "@ '$i'"; done
  # -> @ 'arg1'
  #    @ 'arg two'
  #    @ 'arg3'
  ```

  ```sh
  ./test.sh arg1 'arg two' arg3
  ```

- `$*`: All command-line arguments passed to the script as **a single word**.

  ```sh
  #!/bin/sh
  for i in "$*"; do echo "* '$i'"; done
  # -> * 'arg1 arg two arg3'
  ```

  ```sh
  ./test.sh arg1 'arg two' arg3
  ```

- ...

## Data Type

POSIX shell has only one data type: **"string" (or so-called "word")**.

### Plain Text String

A plain text will be treated as a string by default, with no need for quotes:

```sh
#!/bin/sh
# A plain text is treated as a string by default, no need of quotes
str1=HelloWorld
str1=$str1+1
echo $str1 # -> HelloWorld+1

str2=1
str2=$str2+1
echo $str2 # -> 1+1
```

Only if there are spaces in the text, you need to use quotes to enclose it:

```sh
#!/bin/sh
str='Hello World'
echo $str # -> Hello World
```

> [!Note]
>
> In my opinion, surrounding strings with quotes whenever possible is the best practice. This helps the code to be more readable and maintainable.

### Single Quotes vs Double Quotes

POSIX shell allows us to use both **single quotes** and **double quotes** to enclose a string, but they behave differently when it comes to special characters:

- Using **Single Quotes**: Strings defined with single quotes will treat **everything literally**, including special characters like `$`, `\`, and backticks `` ` ``.

  ```sh
  #!/bin/sh
  str='Hello, $USER! \n Today is `date`.'
  echo $str # -> Hello, $USER!
             #    Today is `date`.
  ```

- Using **Double Quotes**: Strings defined with double quotes will **interpret** special characters like `$`, `\`, and backticks `` ` ``.

  ```sh
  #!/bin/sh
  str="Hello, $USER! \n Today is `date`."
  echo $str # -> Hello, xxx!
            #    Today is Mon Dec 2 10:00:00 UTC 2025.
  ```

### Get Length of String

POSIX shell has a built-in way to get the length of a string value: `${#{{variable_name}}}`:

```sh
#!/bin/sh
str="Hello, World!"
echo ${#str} # -> 13
```

### Substring Extraction

To extract a substring from a string variable, you can use the syntax `${{{variable_name}}:{{position}}:[{{length}}]}`:

> [!Note]
>
> The `position` starts from `0`, and if `length` is omitted, it will extract until the end of the string.

```sh
#!/bin/sh
str="Hello, World!"
echo ${str:7:5} # -> World
echo ${str:7}   # -> World!
```

### Concat Strings

To concat strings, you can simply put them together:

```sh
str1='Hello'
str2='World'
str3='!'
echo $str3 # -> !

str3=$str1$str2
echo $str3 # -> HelloWorld

str3=$str3$str3
echo $str3 # -> HelloWorldHelloWorld
```

### Mathematical Calculation

Although POSIX shell recognizes everything only as a string, there is still the **mathematical operation `$(())`** to help people perform mathematical calculations:

```sh
#!/bin/sh
a=1
b=2
add() {
  echo $(($1 + $2))
}
echo $(add $a $b) # -> 3
```

The above example uses a function (custom command) and the evaluation operator `$()` to capture the stdout; you can refer to them in [this section](#return-code-capture-stdout)

## Function (Custom Command)

POSIX shell allows you to define functions to organize your code into reusable blocks.

What's more, a function in POSIX shell is a **custom command**.

### Define Function

To define a function in POSIX shell, the simplest syntax is:

```sh
#!/bin/sh
greet() {
  echo "Hello, $1!"
  echo 'Welcome to POSIX shell.'
}
```

### Unset Functions

Just like variables, you can unset (delete) a function by using the `unset -f` command:

```sh
#!/bin/sh
greet() {
  echo "Hello, $1!"
  echo 'Welcome to POSIX shell.'
}
greet 'Alice' # -> Hello, Alice!
              #    Welcome to POSIX shell.
unset -f greet
greet 'Bob'   # -> -sh: greet: not found
```

### Parameters

Just like scripts, functions can also accept arguments, which we call **parameters**, and which can be accessed using special context variables:

- `$0`: The **name of the function**.
- `$1`, `$2`, ...: The first, second, ... **parameters** passed to the function.

  > [!Note]
  >
  > If there are more than 9 parameters, you need to use `${10}`, `${11}`, ... to access them.

- `$#`: The **number of parameters** passed to the function.
- `$@`: All parameters passed to the function as **separate words**.
- `$*`: All parameters passed to the function as **a single word**.
- ...

### Call Function

To call a function, just like calling a command, the arguments can be passed after the function name and should be separated by spaces:

```sh
#!/bin/sh
greet() {
  echo "Hello, $1!"
  echo 'Welcome to POSIX shell.'
}
greet 'Alice'
```

### Return Code & Capture Stdout <a name="return-code-capture-stdout"></a>

The return code of a function is the same as the **"command exit code"** in POSIX shell; it can only be in the range of 0~255, so we cannot use it to return results:

```sh
#!/bin/sh
# 🚫
add() {
  return $(($1 + $2))
}
add 5 295 # => 300
result=$?
echo "The sum is: $result"  # -> The sum is: 44 ❌
```

To return results, we'd better use the evaluation operator `$()` to capture the `stdout`:

```sh
#!/bin/sh
# ✅
add_fixed() {
  printf '%s' $(($1 + $2))
}
result_fixed=$(add_fixed 5 295)
echo "The sum is: $result_fixed"  # -> The sum is: 300 ✅
```

### Variable Scope

POSIX shell has no variable scope; in other words, all variables in POSIX shell are global:

```sh
#!/bin/sh
variable='I am a string.'
echo $variable  # -> I am a string.

my_function() {
  variable="Hahaha, hacked!"
}
my_function
echo $variable  # -> Hahaha, hacked!
```

In order to avoid conflicts and unexpected behavior, it's recommended to add the prefix `__` to private variables, which can help people distinguish them from global variables:

```sh
#!/bin/sh
global=123
my_function() {
  __private=456
}
echo $global  # -> 123 ✅
echo $__private # Oops, you should not try to access a private variable! 🚫
```

## Conditional Judgment & Statement

In the POSIX shell world, the **return / exit code** of a function / command is used to represent `true` or `false`:

- `0` means **no errors**, corresponding to `true`
- `1` means **an error occurred**, corresponding to `false`

### Test Conditional Judgment

POSIX shell provides a built-in command named `test` to evaluate a conditional `test_case` expression; it has two different syntaxes:

```sh
test {{test_case}}
[ {{test_case}} ]
```

> [!Caution]
> The spaces around `{{test_case}}` are required!

To inspect the result, you can use the [special variable](#special-variables) `$?`:

```sh
#!/bin/sh
test -f none-exist-file.txt
echo $? # -> 1, means false

test 5 -lt 10
echo $? # -> 0, means true
```

#### Commonly Used Test Cases

> [!Note]
> For variables used in test cases, it's recommended to always surround them with a pair of double quotes:
>
> ```sh
> #!/bin/sh
> # 🚫, may cause some wired bugs,
> # because some shell interpreters will
> # recognize `[ -z $variable1 ]` as `[ -z ]`
> # if `$variable1` is undefined
> if [ -z $variable1 ]; then
>   echo 'Variable 1 is zero!'
> fi
>
> # ✅, those shell interpreters will
> # recognize `[ -z "$variable1" ]` as `[ -z "" ]`
> # if `$variable1` is undefined
> if [ -z "$variable1" ]; then
>   echo 'Variable 1 is zero!'
> fi
> ```

Here are some commonly used test cases you may use in POSIX scripts:

File type test cases:

- `-e {{file}}`: `0` if `{{file}}` exists
- `-s {{file}}`: `0` if `{{file}}` exists and is not empty
- `-d {{file}}`: `0` if `{{file}}` exists and is a directory
- `-f {{file}}`: `0` if `{{file}}` exists and is a regular file
- `-h {{file}}`: `0` if `{{file}}` exists and is a symbolic link
- `-r {{file}}`: `0` if `{{file}}` is readable
- `-w {{file}}`: `0` if `{{file}}` is writable
- `-x {{file}}`: `0` if `{{file}}` is executable
- ...

File age test cases:


- `{{file_1}} -nt {{file_2}}`: `0` if `{{file_1}}` is newer than `{{file_2}}`
- `{{file_1}} -ot {{file_2}}`: `0` if `{{file_1}}` is older than `{{file_2}}`
- ...

String test cases:

- `-z {{string}}`: `0` if the length of `{{string}}` is zero
- `-n {{string}}`: `0` if the length of `{{string}}` is nonzero
- `{{string_1}} = {{string_2}}`: `0` if `{{string_1}}` is equal to `{{string_2}}`
- `{{string_1}} != {{string_2}}`: `0` if `{{string_1}}` is not equal to `{{string_2}}`
- ...

Number test cases:

- `{{number_1}} -eq {{number_2}}`: `0` if `{{number_1}}` is equal to `{{number_2}}`
- `{{number_1}} -ne {{number_2}}`: `0` if `{{number_1}}` is not equal to `{{number_2}}`
- `{{number_1}} -lt {{number_2}}`: `0` if `{{number_1}}` is less than `{{number_2}}`
- `{{number_1}} -le {{number_2}}`: `0` if `{{number_1}}` is less than or equal to `{{number_2}}`
- `{{number_1}} -gt {{number_2}}`: `0` if `{{number_1}}` is greater than `{{number_2}}`
- `{{number_1}} -ge {{number_2}}`: `0` if `{{number_1}}` is greater than or equal to `{{number_2}}`

To invert the result of a test case, you can prefix `{{test_case}}` with `!` (space is required):

- `! {{test_case}}`: `0` if `{{test_case}}` is `1`

#### Combine Test Judgments

You can combine multiple test conditions like this:

- `{{test_condition_1}} && {{test_condition_2}}`: `0` if both `{{test_condition_1}}` and `{{test_condition_2}}` are `0`
- `{{test_condition_1}} || {{test_condition_2}}`: `0` if either `{{test_condition_1}}` or `{{test_condition_2}}` is `0`

If you want to change the precedence of test judgments, you can use the following syntax:

- `{ {{combined_test_judgments}}; } && {other_test_judgment}`: Make `{{combined_test_judgments}}` have high precedence

### If Conditional Statement

The full syntax of an `if` statement is:

```sh
if {{function_or_command_call1}}; then
  # commands to execute if `{{function_or_command_call1}}` returns `0`
elif {{function_or_command_call2}}; then
  # commands to execute if `{{function_or_command_call2}}` returns `0`
else
  # commands to execute if none of the above conditions return `0`
fi
```

What an `if` statement judges is the function return code / command exit code.

For example:

```sh
#!/bin/sh
a=5
b=10
if [ "$a" -lt "$b" ]; then
  echo "$a is less than $b"
elif [ "$a" -eq "$b" ]; then
  echo "$a is equal to $b"
else
  echo "$a is greater than $b"
fi
# -> 5 is less than 10

my_function() {
  return 0
}
if my_function; then
  echo 'My function returns 0'
else
  echo 'My function returns 1'
fi
# -> My function returns 0
```

### Case Conditional Statement

POSIX shell uses the `case` statement to execute commands based on [regular expression matching](#glob-patterns), like the `switch` statement in other programming languages but more powerful:

```sh
case {{variable}} in
  {{pattern1}})
    # commands to execute if variable matches `{{pattern1}}`
    ;;
  {{pattern2}})
    # commands to execute if variable matches `{{pattern2}}`
    ;;
  *)
    # commands to execute if variable does not match any pattern
    ;;
esac
```

## Loops

### For In Loops

POSIX shell also supports iterating over words by `for ... in ...` syntax:

```sh
for item [in words...]; do
  # commands to execute for each item
done
```

If `words` is omitted, it will iterate over the special variable `$@` (all command-line arguments passed to the script as separate words) by default, but you **shouldn't do this** in practice to avoid confusion.

If `words` is **unquoted text containing multiple words**, the `for ... in ...` loop will iterate over each word separately; so if you want to iterate over items with spaces, you should quote them:

```sh
#!/bin/sh
for fruit in Apple Pie Banana Split Blueberry Muffin; do
  echo $fruit
done
# -> Apple
#    Pie
#    Banana
#    Split
#    Blueberry
#    Muffin

for fruit in 'Apple Pie' 'Banana Split' 'Blueberry Muffin'; do
  echo $fruit
done
# -> Apple Pie
#    Banana Split
#    Blueberry Muffin

for fruit in 'Apple Pie Banana Split Blueberry Muffin'; do
  echo $fruit
done
# -> Apple Pie Banana Split Blueberry Muffin
```

> [!Note]
>
> By using this feature, you can easily count the number of words in a file:
>
> ```sh
> #!/bin/sh
> word_count=0
> for word in $(cat filename.txt); do
>   word_count=$((word_count + 1))
> done
> echo "Total words: $word_count"
> ```
>
> But the cost is that you should **pay more attention to quoted and unquoted** strings:
>
> ```sh
> #!/bin/sh
> list='Apple Pie
> Banana Split
> Blueberry Muffin'
>
> for item in $list; do
>   echo $item
> done
> # -> Apple
> #    Pie
> #    Banana
> #    Split
> #    Blueberry
> #    Muffin
>
> oldifs=$IFS
> IFS='
> '
> for item in $list; do
>   echo $item
> done
> IFS=$oldifs
> # -> Apple Pie
> #    Banana Split
> #    Blueberry Muffin
> ```

[Pathname expansion](#glob) also works with `for ... in` loops, and can be used to generate `words`; it will **expand to the matched files from the current directory** before the loop starts:

```sh
#!/bin/sh
for file in *.sh; do
  echo "Found shell script file: $file"
done
# -> Found shell script file: a.sh
#    Found shell script file: b.sh
#    ...
```

### While Loop

The syntax of a `while` loop is nothing special, and the condition expression follows the same rules of [`if` statement](#if-conditional-statement): It judges the function return code / command exit code too.

```sh
while {{function_or_command_call}}; do
  # commands to execute in each iteration
done
```

For example:

```sh
#!/bin/sh
idx=0
while [ "$idx" -lt 2 ]; do
  idx=$(($idx + 1))
  echo $idx
done
# -> 1
#    2
```

### Until Loop

The `until` loop is the opposite of the `while` loop; it will keep executing the commands until the condition becomes true:

```sh
until {{function_or_command_call}}; do
  # commands to execute in each iteration
done
```

For example:

```sh
#!/bin/sh
idx=0
until [ "$idx" -ge 2 ]; do
  idx=$(($idx + 1))
  echo $idx
done
# -> 1
#    2
```

### Continue and Break

POSIX shell also provides the `continue` and `break` commands to control the flow of loops:

- `continue`: Skip the current iteration and move to the next iteration of the loop.
- `break`: Exit the loop immediately.

## Glob

In POSIX shell, globs (short for global patterns) are special wildcard patterns used for filename/pathname matching.

### Glob Patterns

> [!Note]
> 1.  Globs do not match hidden files (files or folders whose name starts with `.`) unless you explicitly include the dot: `.*` or `.[!.]*.`
> 2.  If a glob pattern is not quoted, it will be expanded; this is called **"pathname expansion"**. Pathname expansion happens **before command execution**, so it’s purely a shell feature.
>     For example:
>
>     ```sh
>     #!/bin/sh
>     echo *.sh  # -> hello.sh world.sh
>     echo "*.sh" # -> *.sh
>     echo '*.sh' # -> *.sh
>     ```

POSIX shells support the following **basic glob patterns**:

- `*`: Matches any string, including the empty string
- `?`: Matches any single character
- `[abc]`: Matches any one of the characters `a`, `b`, or `c`
- `[a-z]`: Matches any one character in the range `a` to `z`
- `[^abc]` or `[!abc]`: Matches any one character that is not `a`, `b`, or `c`
- `|`: Or

There are also some **advanced glob patterns** (with `shopt -s extglob` enabled):

- `?({{pattern}})`: Matches zero or one occurrence of the `{{pattern}}`
- `*({{pattern}})`: Matches zero or more occurrences of the `{{pattern}}`
- `+({{pattern}})`: Matches one or more occurrences of the `{{pattern}}`
- `@({{pattern}})`: Matches exactly one occurrence of the `{{pattern}}`
- `!({{pattern}})`: Matches anything that does not match the `{{pattern}}`

There are also additional **preset character classes**; they must be used within a set, for example: `[{{character_class}}]`:

- `[:alnum:]`: Matches any alphanumeric character (equivalent to `[A-Za-z0-9]`)
- `[:alpha:]`: Matches any alphabetic character (equivalent to `[A-Za-z]`)
- `[:upper:]`: Matches any uppercase letter (equivalent to `[A-Z]`)
- `[:lower:]`: Matches any lowercase letter (equivalent to `[a-z]`)
- `[:digit:]`: Matches any digit character (equivalent to `[0-9]`)
- `[:xdigit:]`: Matches any hexadecimal digit character (equivalent to `[A-Fa-f0-9]`)
- `[:space:]`: Matches any whitespace character (equivalent to `[ \t\r\n\f]`)
- `[:punct:]`: Matches any punctuation character (equivalent to `[\!\"#$%\&\'\(\)*+,-./:\;\<=\>?@[\\\]^_{\|}~]`)
- `[:cntrl:]`: Matches any control character (in the range of ASCII `0-31, 127`)
- `[:print:]`: Matches any printable (non-control) character (in the range of ASCII `32-126`)
- ...


## Built-in Commands

### `seq` Command

The `seq` command can be used to **generate a sequence of numbers**.

The syntax of `seq` command is:

```sh
seq [<options>] [first=1] [step=1] <last>
```

For example, to generate a sequence of numbers from 1 to 5:

```sh
#!/bin/sh
echo $(seq 5)
# -> 1
#    2
#    3
#    4
#    5
```

You can also specify the start number, end number, and step value:

```sh
#!/bin/sh
echo $(seq 2 2 10)
# -> 2
#    4
#    6
#    8
#    10
```
