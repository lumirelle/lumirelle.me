---
title: Bash Script Manual
date: 2025-12-01T15:50+08:00
update: 2026-03-30T15:21+08:00
lang: en
duration: 30min
type: note
---

[[toc]]

## What Is Bash?

**Bash (Bourne Again Shell)** is a widely used Unix **interactive shell** and even **a script language**, it's also the default integrated shell for most _Linux_ distributions and _macOS_.

Bash is a REPL (Read-Eval-Print Loop), which means we can execute commands directly, then wait for the output, then entering next command, and so on. It also allows us to write a bunch of predefined commands (even with enhanced control statements) in a plain text file, then execute this file directly, which is **"Bash script"**.

> [!Note]
>
> On _Windows_, you can use Bash through **Windows Subsystem for Linux (WSL)** or **Git Bash**.

## First Bash Script

> [!Note]
>
> Some _Linux_ basic knowledges are required to understand this manual, like command `chmod`, `ls`, `cd`, etc.

Bash uses the `.sh` file extension.

You can create and run your first Bash script by following steps:

1. Open your terminal and ensure you are running Bash:

    ```bash
    bash
    ```

    > [!Note]
    >
    > "Terminal" and "shell" are different things, terminal is the interface for users to interact with the shell, and shell is the command-line interpreter that executes commands. So you can run Bash in different terminals, like _Terminal.app_ on macOS, _GNOME Terminal_ on Linux, or _Windows Terminal_ on Windows.

2. Create a new file named `hello.sh` using a text editor like `vi`:

   ```bash
   vi test.sh
   ```

3. Add the following lines to the file:

   ```bash
   #!/bin/bash
   echo 'Hello, Bash!'
   ```

4. Save and exit the editor (in `vi`, press `Esc`, type `:wq`, and hit `Enter`), come back to Bash.
5. Make the script executable by running:

   ```bash
   chmod +x hello.sh
   ```

6. Run the script with the following command:

   ```bash
   ./hello.sh
   ```

   > [!Note]
   >
   > You should prefix the script with `./` to indicate that it is located in the current directory, or Linux will search for it in the system's PATH, resulting in a "command not found" error.

7. You should see the output:

   ```txt
   Hello, Bash!
   ```

## Shebang (`#!`)

You may have noticed the first line of the script:

```bash
#!/bin/bash // [!code highlight]
echo 'Hello, Bash!'
```

This line is called a **shebang** (or hashbang), it tells the system which **shell interpreter** to use to execute the script, and it's syntaxed as `#!<path_to_interpreter>`. Which means: you can execute your Bash script with other compatible shell interpreters, like `#!/bin/sh` or `#!/bin/zsh`.

But anyway, running Bash script with Bash itself is the best choice. Most of people who love modern shells like _ZSh_, _Fish_, etc. are using them only as the interactive shell, and they still using Bash as the script interpreter, for best compatibility and stability.

## Statement

In bash, a statement can be a command call, variable declaration, etc.:

```bash
#!/bin/bash
# Command call statement
git commit -m 'Update README.md'
# Variable declaration statement
name='Bash'
# ...
```

### Statement Separator

Bash allows you to write multiple statements in one line, and separate them with a semicolon `;`. It can be omitted if each command is on a separate line:

```bash
#!/bin/bash
echo 'Hello'; echo 'Bash!'
echo 'Welcome to Bash scripting.'
```

## Variable

### Define Variable

Bash allows us to define variables in Bash to store values.

The syntax for defining a variable is very simple: **`<variable_name>=<value>`**. Notice, any spaces around the `=` sign is not allowed:

```bash
#!/bin/bash
# ✔️
name='World'
# ❌
name_with_space = 'World'
```

As usual, you cannot / shouldnot use Bash preserved keywords, commands, special characters, space, or start with a number for variable names:

```bash
#!/bin/bash
# Bash preserved keywords, no error, but it's puzzling!
if=5
# Commands, no error, but it's also puzzling!
git='Hello'
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

To access the value of a variable, you need to **prefix it with a `$`** sign, this means **"evaluate"**:

```bash
#!/bin/bash
name='World'
echo "Hello, $name!"
```

If there are some extra texts right after the variable, you should use curly braces `{}` to enclose the variable name, so that Bash can correctly identify it's name:

```bash
#!/bin/bash
name='World'
echo "Hello, ${name}s!"
```

### Access with Default Value

You can also access a variable with default value using the following syntax:

- `${<variable>:-<default_value>}`: If `value` is **unset or null**, return `default_value`, otherwise return the value of `variable`.

  ```bash
  #!/bin/bash
  name=${USER:-'Guest'}
  echo "Hello, $name!"
  ```

- `${<variable>:=<default_value>}`: If `value` is **unset or null**, **assign** `default_value` to `variable`, and then return the value of `variable`.

  ```bash
  #!/bin/bash
  name=${USER:='Guest'}
  echo "Hello, $name!"
  ```

- `${<variable>:+<alternate_value>}`: If `value` is **set and not null**, return `alternate_value`, otherwise return empty value.

  ```bash
  #!/bin/bash
  name=${USER:+'Registered User'}
  echo "Hello, $name!"
  ```

- `${<variable>:?<error_message>}`: If `value` is **unset or null**, print `error_message` and exit the script.

  ```bash
  #!/bin/bash
  name=${USER:?'Error: USER variable is not set!'}
  echo "Hello, $name!"
  ```

### Unset Variable

Bash allows you to unset (delete) a variable by using the `unset` command:

```bash
#!/bin/bash
name='World'
echo "Hello, $name!"  # -> Hello, World!

unset name
echo "Hello, $name!"  # -> Hello, !
```

Of course, [readonly variable](#work-with-declare-command) cannot be unset.

### Work with `declare` Command

`declare` command can be used to **define variables with some special logic (including changing data types)** or **print variables' information**.

To define special variables:

- `declare -i <variable_name>=<value>`: Define an **integer** variable, all assigned values will be evaluated as arithmetic expressions:

  ```bash
  #!/bin/bash
  declare -i count=10
  count=$count+5
  echo $count # -> 15
  # if you define `count` without `-i`, the result will be string concat: `10+5`
  ```

- `declare -l <variable_name>=<value>`: Define a **lowercase** string variable, all assigned values will be converted to lowercase string.

  ```bash
  #!/bin/bash
  declare -l lname='HELLO'
  echo $lname # -> hello
  ```

- `declare -u <variable_name>=<value>`: Define an **uppercase** string variable, all assigned values will be converted to uppercase string.

  ```bash
  #!/bin/bash
  declare -u uname='hello'
  echo $uname # -> HELLO
  ```

- `declare -a <variable_name>=<value>`: Define an [**indexed array**](#indexed-array) variable.

  ```bash
  #!/bin/bash
  declare -a fruits=('Apple' 'Banana' 'Blueberry')
  echo ${fruits[@]} # -> Apple Banana Blueberry
  ```

- `declare -A <variable_name>=<value>`: Define an [**associative array (object)**](#associative-array) variable.

  ```bash
  #!/bin/bash
  declare -A colors
  colors['apple']='red'
  colors['banana']='yellow'
  colors['blueberry']='blue'
  echo ${colors[@]} # -> red blue yellow
  ```

- `declare -r <variable_name>=<value>`: Define a **readonly** variable, so that its value cannot be changed later.

  ```bash
  #!/bin/bash
  declare -r PI=3.14
  PI=3.14159 # -> -bash: PI: readonly variable
  ```

- `declare -x <variable_name>=<value>`: Define an **exported** variable, which will be available to child processes.

  ```bash
  #!/bin/bash
  declare -x MY_VAR='Hello'
  bash -c 'echo $MY_VAR' # -> Hello
  ```

- ...

To print variables' information:

- `declare`: Print the information of all **variables and functions** in the current shell.
- `declare -p <variable_name>`: Print the information of **specific variable**.
- `declare -f [variable_name]`: Print the information of **all / specific function(s)** in the current shell.
- `declare -F [variable_name]`: Print **function name(s)** of all / specific functions in the current shell.
- ...

### Work with `let` Command

`let` command can be used to **evaluate arithmetic expressions**:

```bash
#!/bin/bash
let 'count = 5 + 1'
echo $count # -> 6
```

And multiple operations can be performed in one `let` command by separating them with spaces:

```bash
#!/bin/bash
let count=10
let v1=count+5 v2=count*2
echo $v1 # -> 15
echo $v2 # -> 20
```

> [!Caution]
>
> The variable defined by `let` command still in string type. If you applied arithmetic operations directly on them, maybe you will get unexpected results:
>
> ```bash
> #!/bin/bash
> let 'count = 5 + 1'
> echo $count # -> 6
> count=$count+2
> echo $count # -> 6+2, not 8
> ```

### Work with `readonly` Command

`readonly` command can be used to **define readonly variables** or **print readonly variables' information**.

To define a readonly variable:

- `readonly <variable_name>=<value>`: Define a **readonly** variable, just like what `declare -r` does.

  ```bash
  #!/bin/bash
  readonly PI=3.14
  PI=3.14159 # -> -bash: PI: readonly variable
  ```

To print readonly variables' information:

- `readonly -p`: Print the information of **all readonly variables** in the current shell.
- ...

### Work with `export` Command

`export` command can be used to **define exported variables**, just like `declare -x`.

```bash
#!/bin/bash
export MY_VAR='Hell'
bash -c "echo $MY_VAR" # -> Hello
```

### Special Variables

Bash has several special built-in variables that provide useful information in shell/script environment.

In shell environment:

- `$?`: The **exit status** of the last executed command.
- `$$`: The **process ID** of the current shell.
- `$!`: The **process ID** of the last (async) background command.
- `$_`: The **last argument** of the previous command.
- `$-`: The **current shell options**.
- ...

In script environment, including all above, plus with:

- `$0`: The **name of the script**.
- `$1`, `$2`, ...: The first, second, ... **command-line arguments** passed to the script.

  > [!Note]
  >
  > If the arguments are more than 9, you need to bracket them like `${10}`, `${11}`.

- `$#`: The **number of command-line arguments** passed to the script.
- `$@`: All command-line arguments passed to the script as **separate words**.

  ```bash
  #!/bin/bash
  for i in "$@"; do echo "@ '$i'"; done
  # -> @ 'arg1'
  #    @ 'arg two'
  #    @ 'arg3'
  ```

  ```bash
  ./test.sh arg1 'arg two' arg3
  ```

- `$*`: All command-line arguments passed to the script as **a single word**.

  ```bash
  #!/bin/bash
  for i in "$*"; do echo "* '$i'"; done
  # -> * 'arg1 arg two arg3'
  ```

  ```bash
  ./test.sh arg1 'arg two' arg3
  ```

- ...

## Data Type

Likes most of script languages, Bash is dynamically typed, that's means a common variable (not declared by `declare` or related commands, they will add special logic to the variable, we mentioned this before) can hold values of different data types at different times during execution.

There are totally four data types in Bash: **string**, **number** and **array**.

### String

#### Plain Text String

In Bash, a plain text will be treated as a string by default, no need of quotes. What's more, the `+` operator for strings will concat them instead of doing arithmetic operations, even if the string looks like a number:

```bash
#!/bin/bash
# A plain text is treated as a string by default, no need of quotes
str1=HelloWorld
str1=$str1+1
echo $str1 # -> HelloWorld+1

# Even if the string looks like a number, it will still be treated as a string,
# and `+` operator will concat them instead of doing arithmetic operations
str2=1
str2=$str2+1
echo $str2 # -> 1+1
```

Only if there are spaces in the text, you need to use quotes to enclose it:

```bash
#!/bin/bash
str='Hello World'
echo $str # -> Hello World
```

> [!Note]
>
> For my own opinion, surrounding strings with quotes as possible is the best practice in Bash scripting. This helps the code to get more readable and maintainable.

#### Quotes vs Double Quotes

Bash allows us use both **quotes** and **double quotes** to enclose a string, but they behave differently when it comes to special characters:

- Using **Single Quotes**: Strings defined with single quotes will treat **everything literally**, including special characters like `$`, `\`, and backticks `` ` ``.

  ```bash
  #!/bin/bash
  str='Hello, $USER! \n Today is `date`.'
  echo -e $str  # -> Hello, $USER! \n Today is `date`.
  ```

- Using **Double Quotes**: Strings defined with double quotes will **interpret** special characters like `$`, `\`, and backticks `` ` ``.

  ```bash
  #!/bin/bash
  str="Hello, $USER! \n Today is `date`."
  echo -e $str # -> Hello, xxx!
               #    Today is Mon Dec 2 10:00:00 UTC 2025.
  ```

#### Get Length of String

Bash has a built-in way to get the length of a value, **not only string value**: `${#<variable_name>}`, and it follows the rules below:

- If the value is a **string**, Bash will return the length of the string.
- If the value is a **integer**, Bash will treat it as a **string**.
- If the value is an **array**, Bash will return the number of elements in the array.

  > [!Note]
  >
  > To get the length of an array, there are some special behavior you should pay more attention to, see [Get Length of Array](#get-length-of-array) section for more detail.

So we can get the length of a string variable like this:

```bash
#!/bin/bash
str="Hello, World!"
echo ${#str} # -> 13
```

#### Substring Extraction

To extract a substring from a string variable, you can use the syntax `${<variable_name>:<position>:[<length>]}`:

> [!Note]
>
> The `position` starts from `0`, and if `length` is omitted, it will extract until the end of the string.

```bash
#!/bin/bash
str="Hello, World!"
echo ${str:7:5} # -> World
echo ${str:7}   # -> World!
```

#### Concat Strings

To concat strings to a new variable, you can simply put them together:

```bash
str1='Hello'
str2='World'

str3=$str1$str2
echo $str3 # -> HelloWorld
```

To concat another string to a existing string, you can use `+=` operator:

```bash
str1='Hello'
str1+='World'
echo $str1 # -> HelloWorld
```

### Number

Number in Bash can be used for arithmetic operations. It can be produced by:

1. Assign a arithmetic expression to a variable defined with `declare -i`:

    ```bash
    declare -i num1=5
    num1=num1+10
    echo $num1 # -> 15
    ```

2. Use `let` command to evaluate an arithmetic expression:

    ```bash
    let num2=5+10
    echo $num2 # -> 15
    ```

3. Use `$(())` syntax to evaluate an arithmetic expansion:

    ```bash
    num3=$((5 + 10))
    echo $num3 # -> 15
    ```

#### Evaluate Arithmetic Expression

By default, Bash treat text as string, even if it looks like a number or a arithmetic expression. To evaluate an arithmetic expression, you have to use a special `$((...))` syntax:

```bash
#!/bin/bash
echo '5 + 10' # -> 5 + 10
echo $((5 + 10)) # -> 15

echo '5 * 10' # -> 5 * 10
echo $((5 * 10)) # -> 50
```

### Array

Bash has two kinds of array: **indexed array** and **associative array**.

In this manual, if we talk about "arrays", it means both indexed array and associative array, unless otherwise specified.

Additionally, we can just treat a associative array as a string indexed array, even a object (A OOP (Object-Oriented Programming) concept).

#### Indexed Array

Indexed arrays are the common arrays we often talk about:

```bash
#!/bin/bash
declare -a fruits
fruits[0]='Apple'
fruits[1]='Banana'
fruits[2]='Blueberry'
```

You can also define indexed arrays in a more concise way:

```bash
#!/bin/bash
declare -a fruits=('Apple' 'Banana' 'Blueberry')
```

Even with custom element index:

```bash
#!/bin/bash
declare -a fruits1=([2]='Blueberry' [0]='Apple' [1]='Banana')
# => fruits[0]='Apple'
#    fruits[1]='Banana'
#    fruits[2]='Blueberry'
declare -a fruits2=('Blueberry' [5]='Apple' 'Banana')
# => fruits[0]='Blueberry'
#    fruits[5]='Apple'
#    fruits[6]='Banana'
```

#### Associative Array

Associative arrays are like dictionaries, maps or objects in other programming languages, they use key-value pairs, can only create elements one by one:

```bash
#!/bin/bash
declare -A colors
colors['apple']='red'
colors['banana']='yellow'
colors['blueberry']='blue'
```

#### Access Array Element

To access values in an indexed array, use the syntax `${<array_name>[<index>]}`:

```bash
#!/bin/bash
declare -a fruits=('Apple' 'Banana' 'Blueberry')
echo ${fruits[0]}  # -> Apple
echo ${fruits[1]}  # -> Banana
echo ${fruits[2]}  # -> Blueberry
```

To access values in an associative array, use the syntax `${<array_name>[<key>]}`:

```bash
#!/bin/bash
declare -A colors
colors['apple']='red'
colors['banana']='yellow'
colors['blueberry']='blue'
echo ${colors['apple']}   # -> red
echo ${colors['banana']}  # -> yellow
echo ${colors['blueberry']}  # -> blue
```

Specially, if you access the **indexed array** with it's variable name directly, it will return the value of the **first element**, but **associative arrays** will return **empty value**, because this equivalent to `${colors[0]}`, and there is no element with index `0` in the associative array:

```bash
#!/bin/bash
declare -a fruits=('Apple' 'Banana' 'Blueberry')
echo ${fruits}  # -> Apple

declare -A colors
colors['apple']='red'
colors['banana']='yellow'
colors['blueberry']='blue'
echo ${colors}  # -> (empty value)
```

`${<array_name>[@]}` and `${<array_name>[*]}` can be used to access **all elements** in both indexed and associative arrays, just behaves like the special variables `$@` and `$*`. `${<array_name>[@]}` will treat each element as a separate word, while `${<array_name>[*]}` will treat all elements as a single word:

```bash
#!/bin/bash
declare -a fruits=('Apple Pie' 'Banana Split' 'Blueberry Muffin')

#             'Apple Pie' 'Banana Split' 'Blueberry Muffin'
#             |
#             V
for fruit in "${fruits[@]}"; do
  echo $fruit
done
# -> Apple Pie
#    Banana Split
#    Blueberry Muffin

#             'Apple Pie Banana Split Blueberry Muffin'
#             |
#             V
for fruit in "${fruits[*]}"; do
  echo $fruit
done
# -> Apple Pie Banana Split Blueberry Muffin
```

What's more, **quote them with double quotes `"`** is required to **ensure the correct separation of result**:

```bash
#!/bin/bash
declare -a fruits=('Apple Pie' 'Banana Split' 'Blueberry Muffin')

#             Apple Pie Banana Split Blueberry Muffin
#             |
#             V
for fruit in ${fruits[@]}; do
  echo $fruit
done
# -> Apple
#    Pie
#    Banana
#    Split
#    Blueberry
#    Muffin

#             Apple Pie Banana Split Blueberry Muffin
#             |
#             V
for fruit in ${fruits[*]}; do
  echo $fruit
done
# -> Apple
#    Pie
#    Banana
#    Split
#    Blueberry
#    Muffin
```

#### Get Length of Array

For strings, you can simply use `${#<variable_name>}` to get the length of the string; However, for arrays, use the variable name directly will get the first element (for indexed arrays) or an empty value (for associative arrays), which is not what we want.

To get the length of an array, we need to access all of its elements: `${#<array_name>[@]}` or `${#<array_name>[*]}`.

```bash
#!/bin/bash
declare -a fruits=('Apple' 'Banana' 'Blueberry')
echo ${#fruits[@]}  # -> 3
echo ${#fruits[*]}  # -> 3

declare -A colors
colors['apple']='red'
colors['banana']='yellow'
colors['blueberry']='blue'
echo ${#colors[@]}  # -> 3
echo ${#colors[*]}  # -> 3
```

In advanced usage, you can also get the length of a specific element in an array by combining the two syntaxes:

```bash
#!/bin/bash
declare -a fruits=('Apple' 'Banana' 'Blueberry')
echo ${#fruits[0]}  # -> 5

declare -A colors
colors['apple']='red'
colors['banana']='yellow'
colors['blueberry']='blue'
echo ${#colors['banana']}  # -> 6
```

#### Get Filled Indexes/Keys of Array

You can use `${!array_name[@]}` or `${!array_name[*]}` to get all **filled indexes/keys** of an array, this is useful when you have sparse arrays:

```bash
#!/bin/bash
declare -a fruits=('Apple' 'Banana' 'Blueberry')
echo ${!fruits[@]}  # -> 0 1 2
echo ${!fruits[*]}  # -> 0 1 2

declare -A colors
colors['apple']='red'
colors['banana']='yellow'
colors['blueberry']='blue'
echo ${!colors[@]}  # -> apple banana blueberry
echo ${!colors[*]}  # -> apple banana blueberry
```

#### Remove Elements from Array

Just like removing variables, you can use the `unset` command to remove elements from an array (no need of `$` sign):

```bash
#!/bin/bash
declare -a fruits=('Apple' 'Banana' 'Blueberry')
unset fruits[1]
echo ${fruits[@]}  # -> Apple Blueberry
echo ${!fruits[@]}  # -> 0 2

declare -A colors
colors['apple']='red'
colors['banana']='yellow'
colors['blueberry']='blue'
unset colors['banana']
echo ${colors[@]}  # -> red blue
echo ${!colors[@]}  # -> apple blueberry
```

#### Array Element Extraction

Like string, to extract a part of elements from an array, you can use the syntax `${<variable_name>[@]:<position>:[<length>]}` or `${<variable_name>[*]:<position>:[<length>]}`:

> [!Note]
>
> The `position` starts from `0`, and if `length` is omitted, it will extract until the end of the array.

```bash
#!/bin/bash
declare -a fruits=('Apple' 'Banana' 'Blueberry' 'Durian' 'Elderberry')
echo ${fruits[@]:2:2} # -> Blueberry Durian
echo ${fruits[@]:2}   # -> Blueberry Durian Elderberry

declare -A colors
colors['apple']='red'
colors['banana']='yellow'
colors['blueberry']='blue'
colors['durian']='green'
colors['elderberry']='purple'
echo ${colors[@]:2:2} # -> blue green
echo ${colors[@]:2}   # -> blue green purple
```

#### Concat Indexed Arrays

To concat indexed arrays, you can use the syntax `<new_array>=("${<array1>[@]}" "${<array2>[@]}")`:

```bash
#!/bin/bash
declare -a fruits=('Apple' 'Banana')
declare -a more_fruits=('Blueberry' 'Durian')
fruits=("${fruits[@]}" "${more_fruits[@]}")
# -> @ Apple
#    @ Banana
#    @ Blueberry
#    @ Durian
for fruit in "${fruits[@]}"; do
  echo "@ $fruit"
done
```

To concat another indexed array to an existing one, you can use `+=` operator:

```bash
#!/bin/bash
declare -a fruits=('Apple' 'Banana')
fruits+=('Blueberry' 'Durian')
# -> @ Apple
#    @ Banana
#    @ Blueberry
#    @ Durian
for fruit in "${fruits[@]}"; do
  echo "@ $fruit"
done
```

## Function

Bash allows you to define functions to organize your code into reusable blocks.

### Define Function

To define a function in Bash, the simplest syntax is:

```bash
#!/bin/bash
greet() {
  echo "Hello, $1!"
  echo 'Welcome to Bash scripting.'
}
```

### Unset Functions

Just like variables, you can unset (delete) a function by using the `unset -f` command:

```bash
#!/bin/bash
greet() {
  echo "Hello, $1!"
  echo 'Welcome to Bash scripting.'
}
greet 'Alice' # -> Hello, Alice!
              #    Welcome to Bash scripting.
unset -f greet
greet 'Bob'   # -> -bash: greet: command not found
```

### Parameters

Just like scripts, functions can also accept arguments, which we called **parameters**, and can be accessed using special context variables:

- `$0`: The **name of the function**.
- `$1`, `$2`, ...: The first, second, ... **parameters** passed to the function.

  > [!Note]
  >
  > If the parameters are more than 9, you need to use `${10}`, `${11}`, ... to access them.

- `$#`: The **number of parameters** passed to the function.
- `$@`: All parameters passed to the function as **separate words**.
- `$*`: All parameters passed to the function as **a single word**.
- ...

### Call Function

To call a function, just like to call a command, the arguments can be passed after the function name and should be separated by spaces:

```bash
#!/bin/bash
greet() {
  echo "Hello, $1!"
  echo 'Welcome to Bash scripting.'
}
greet 'Alice'
```

### Return Value

Just like other scripting languages, functions can also return values using the `return` statement:

```bash
#!/bin/bash
add() {
  return $(($1 + $2))
}
add 5 10
result=$?
echo "The sum is: $result"  # -> The sum is: 15
```

### Function Variable Scope

By default, variables defined inside a function are **global**, which means they can be accessed and modified outside the function.

To avoid this, you can use the `local` keyword to define **local variables**:

```bash
#!/bin/bash
my_function() {
  local local_var="I am local"
  global_var="I am global"
}
my_function
echo $local_var   # -> (empty value)
echo $global_var  # -> I am global
```

## Conditional Judgment & Statement

### `test` Command Judgment

Bash provides a built-in command named `test` to evaluate conditional expressions, it has three different syntaxes:

```bash
test <expression>
[ <expression> ]
[[ <expression> ]] # Modern choice, recommended!
```

> [!Caution]
>
> The spaces around `<expression>` are required!

Why we recommend `[[` over `[`?

1. If one side of the expression expr evaluates to nothing (Null) then `[` will throw an error, `[[` will handle this automatically;
2. To test variables you should quote the `"<variable_name>"` as they may undergo word splitting or globbing, with New test `[[` this is not necessary

    ```bash
    [ "$DEMO" = 5 ]
    [[ $DEMO == 10 ]]
    ```
3. Some other benefits, like support for pattern matching, etc...

For example:

```bash
#!/bin/bash
a=5
b=10
test $a -lt $b
echo $?  # -> 0 (true)
[ $a -lt $b ]
echo $?  # -> 0 (true)
[[ $a -lt $b ]]
echo $?  # -> 0 (true)
```

In this manual, we always use `[[` for test cases, unless otherwise specified.

#### Commonly Tests

Here are some commonly test cases you may use in Bash scripts:

File type tests:

- `-e <file>`: True if `<file>` exists
- `-s <file> ]`: True if `<file>` exists and is not empty
- `-d <file>`: True if `<file>` exists and is a directory
- `-f <file>`: True if `<file>` exists and is a regular file
- `-h <file>`: True if `<file>` exists and is a symbolic link
- `-r <file>`: True if `<file>` is readable
- `-w <file>`: True if `<file>` is writable
- `-x <file>`: True if `<file>` is executable
- ...

File age tests:


- `<file_1> -nt <file_2>`: True if `<file_1>` is newer than `<file_2>`
- `<file_1> -ot <file_2>`: True if `<file_1>` is older than `<file_2>`
- ...

String tests:

> [!Note]
>
> Comparisons using `[[` perform **pattern matching** against the string on the right hand side unless you quote the 'string' on the right. This prevents any characters with special meaning in pattern matching from taking effect.
>
> ```bash
> #!/bin/bash
> str='Hello, World!'
> if [[ $str == Hello* ]]; then
>   echo 'Matched!' # -> Matched!
> fi
> if [[ $str == 'Hello*' ]]; then
>   echo 'Matched!' # -> (nothing)
> fi
> ```

- `-z <string>`: True if the length of `<string>` is zero
- `-n <string>`: True if the length of `<string>` is nonzero
- `<string_1> = <string_2>`: True if `<string_1>` is equal to `<string_2>`
- `<string_1> != <string_2>`: True if `<string_1>` is not equal to `<string_2>`
- `<string_1> < <string_2>`: True if `<string_1>` is less than `<string_2>` (in ASCII order)
- `<string_1> > <string_2>`: True if `<string_1>` is greater than `<string_2>` (in ASCII order)
- ...

Number tests:

- `<integer_1> -eq <integer_2>`: True if `<integer_1>` is equal to `<integer_2>`
- `<integer_1> -ne <integer_2>`: True if `<integer_1>` is not equal to `<integer_2>`
- `<integer_1> -lt <integer_2>`: True if `<integer_1>` is less than `<integer_2>`
- `<integer_1> -le <integer_2>`: True if `<integer_1>` is less than or equal to `<integer_2>`
- `<integer_1> -gt <integer_2>`: True if `<integer_1>` is greater than `<integer_2>`
- `<integer_1> -ge <integer_2>`: True if `<integer_1>` is greater than or equal to `<integer_2>`

#### Regular Expression String Test

> [!Note]
>
> **"Regular expression matching"** is different to to **"(glob) pattern matching"**!

A regular expression is a pattern that describes a set of strings. For example, `^[0-9]+$` is a regular expression that matches any string that consists of one or more digits. The basic syntax of regular expressions in Bash is:

- `^`: Matches the start of the string
- `$`: Matches the end of the string
- `?`: The preceding item is optional and will be matched at most once
- `*`: The preceding item will be matched zero or more times
- `+`: The preceding item will be matched one or more times
- `{N}`: The preceding item will be matched exactly N times
- `{N,}`: The preceding item will be matched at least N times
- `{N,M}`: The preceding item will be matched at least N times, but not more than M times
- `<regex_1>|<regex_2>`: Matches either `<regex_1>` or `<regex_2>`

Some preset character classes:

- `[[:alnum:]]`: Matches any alphanumeric character (equivalent to `[A-Za-z0-9]`)
- `[[:alpha:]]`: Matches any alphabetic character (equivalent to `[A-Za-z]`)
- `[[:upper:]]`: Matches any uppercase letter (equivalent to `[A-Z]`)
- `[[:lower:]]`: Matches any lowercase letter (equivalent to `[a-z]`)
- `[[:digit:]]`: Matches any digit character (equivalent to `[0-9]`)
- `[[:space:]]`: Matches any whitespace character (equivalent to `[ \t\r\n\f]`)
- ...

`test` command can work string tests with regular expressions using `=~` operator:

```bash
#!/bin/bash
str='12345'
if [[ $str =~ ^[0-9]+$ ]]; then
  echo 'The string is a number.' # -> The string is a number.
else
  echo 'The string is not a number.'
fi
```

#### Combine Tests

You can combine multiple tests like this:

- `! <test_case>`: True if `<test_case>` is false
- `( <test_case> )`: Returns the value of `<test_case>`. Useful to override the normal precedence of operators
- `<test_case_1> && <test_case_2>`: True if both `<test_case_1>` and `<test_case_2>` are true
- `<test_case_1> || <test_case_2>`: True if either `<test_case_1>` or `<test_case_2>` is true

### Arithmetic Judgment

You may notice we have to use `-gt`, `-lt`, etc. flags to compare numbers with `test` command judgement, this is because `>`, `<`, etc. signs are used for string comparison, which not totally compatible with number comparison, for example:

```bash
#!/bin/bash

# -> 03 not greater than 2
if [[ 03 > 2 ]]; then
  echo '03 greater than 2'
else
  echo '03 not greater than 2'
fi

# -> 03 greater than 2
if [[ 03 -gt 2 ]]; then
  echo '03 greater than 2'
else
  echo '03 not greater than 2'
fi
```

If you unlike the usage of those flags, prefer the usage of `>`, `<`, etc. signs, you can use `(( ... ))` syntax for arithmetic judgment:

<!-- @unocss-ignore -->

```bash
#!/bin/bash
a=5
b=10
if (( a < b )); then
  echo "$a is less than $b"
fi
```

### `if` Conditional Statement

The fully syntax of an `if` statement in Bash is:

```bash
if <condition_expression1>; then
  # commands to execute if <condition_expression1> is true
elif <condition_expression2>; then
  # commands to execute if <condition_expression2> is true
else
  # commands to execute if none of the above conditions are true
fi
```

The different thing is the `if` statement in Bash **does not support evaluate conditions natively**, you need to combine it with the conditional judgment to evaluate conditions. For example:

```bash
#!/bin/bash
a=5
b=10
if [[ $a -lt $b ]]; then
  echo "$a is less than $b"
elif [[ $a -eq $b ]]; then
  echo "$a is equal to $b"
else
  echo "$a is greater than $b"
fi

if (( a < b )); then
  echo "$a is less than $b"
elif (( a == b )); then
  echo "$a is equal to $b"
else
  echo "$a is greater than $b"
fi
```

### `case` Conditional Statement

Bash use `case` statement to execute commands based on [regular expression matching](#regular-expression-string-test), like `switch` statement in other programming languages but more powerful:

```bash
case <variable> in
  <pattern1>)
    # commands to execute if variable matches pattern1
    ;;
  <pattern2>)
    # commands to execute if variable matches pattern2
    ;;
  *)
    # commands to execute if variable does not match any pattern
    ;;
esac
```

#### No Break `case` Statement

After Bash 4.0, you can use `;;&` to create a no break `case` statement, which means after one match, it will continue to match the patterns left:

```bash
#!/bin/bash
REPLY="a"
case $REPLY in
  [[:upper:]])    echo "'$REPLY' is upper case." ;;&
  [[:lower:]])    echo "'$REPLY' is lower case." ;;&
  [[:alpha:]])    echo "'$REPLY' is alphabetic." ;;&
  [[:digit:]])    echo "'$REPLY' is a digit." ;;&
  [[:graph:]])    echo "'$REPLY' is a visible character." ;;&
  [[:punct:]])    echo "'$REPLY' is a punctuation symbol." ;;&
  [[:space:]])    echo "'$REPLY' is a whitespace character." ;;&
  [[:xdigit:]])   echo "'$REPLY' is a hexadecimal digit." ;;&
esac
```

The output will be:

```txt
'a' is lower case.
'a' is alphabetic.
'a' is a visible character.
'a' is a hexadecimal digit.
```

### `select` Conditional Statement

`select` statement is a special kind of `case` statement that allows you to create a simple menu for user selection:

```bash
select selected in <list>; do
  # commands to execute for the selected item
done
```

For example:

```bash
#!/bin/bash
PS3='Please select your favorite fruit (or <Ctrl+C> to quit): '
select fruit in Apple Banana Blueberry Durian Elderberry; do
  echo "You selected: $fruit"
done
```

When you run the script, it will display a numbered menu for selection. You can enter the number corresponding to your choice. It will re-display the menu until the user press `Ctrl+C` or [`break` executes](#continue-and-break).

## Loops

### `for` Loops

The syntax of a `for` loop in Bash looks like other scripting languages, but it use **[arithmetic judgment](#arithmetic-judgment)** to evaluate the loop expressions, so all expressions should follow the rules of arithmetic judgment:

```bash
for (( <initial_expression>; <condition_expression>; <step_expression> )); do
  # commands to execute in each iteration
done
```

### `for ... in ...` Loops

Bash also supports iterating over a list of items by `for ... in ...` syntax:

```bash
for item in list; do
  # commands to execute for each item
done
```

If `list` is omitted, it will iterate over the special variable `$@` (all command-line arguments passed to the script as separate words) by default, but you **shouldn't do this** in practice to avoid confusion.

If `list` is **a unquoted text contains multiple words**, `for ... in ...` loop will iterate over each word separately, so if you want to iterate over items with spaces, you should quote them:

```bash
#!/bin/bash
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
> ```bash
> #!/bin/bash
> word_count=0
> for word in $(cat filename.txt); do
>   word_count=$((word_count + 1))
> done
> echo "Total words: $word_count"
> ```
>
> But the cost is you should **pay more attention to quoted and unquoted** strings when working with `for ... in ...` loops. Especially with [variables](#access-array-element):
>
> ```bash
> #!/bin/bash
> array=('Apple Pie' 'Banana Split' 'Blueberry Muffin')
> for word in ${array[@]}; do
>   echo $word
> done
> # -> Apple
> #    Pie
> #    Banana
> #    Split
> #    Blueberry
> #    Muffin
>
> for word in "${array[@]}"; do
>   echo $word
> done
> # -> Apple Pie
> #    Banana Split
> #    Blueberry Muffin
> ```

[Glob patterns](#globbing) can also be used in the `list`, additionally, it will **expand to the matched files from the current directory** before the loop starts:

```bash
#!/bin/bash
for file in *.sh; do
  echo "Found shell script file: $file"
done
```

### `while` Loop

The syntax of a `while` loop is nothing special, but the condition expression should follow the same rules of [`if` statement](#if-conditional-statement):

```bash
while <condition>; do
  # commands to execute in each iteration
done
```

### `until` Loop

`until` loop is the opposite of `while` loop, it will keep executing the commands until the condition becomes true:

```bash
until <condition>; do
  # commands to execute in each iteration
done
```

### `continue` and `break`

Bash also provides `continue` and `break` statements to control the flow of loops:

- `continue`: Skip the current iteration and move to the next iteration of the loop.
- `break`: Exit the loop immediately.

## Globbing

In Bash, globs (short for global patterns) are special wildcard patterns **who are [plain text strings](#plain-text-string)** used for filename/pathname expansion:

- `*`: Matches any string, including the empty string
- `?`: Matches any single character
- `[abc]`: Matches any one of the characters `a`, `b`, or `c`
- `[a-z]`: Matches any one character in the range `a` to `z`
- `[^abc]` or `[!abc]`: Matches any one character that is not `a`, `b`, or `c`

Advanced glob patterns (with `shopt -s extglob` enabled):

- `?(pattern)`: Matches zero or one occurrence of the pattern
- `*(pattern)`: Matches zero or more occurrences of the pattern
- `+(pattern)`: Matches one or more occurrences of the pattern
- `@(pattern)`: Matches exactly one occurrence of the pattern
- `!(pattern)`: Matches anything that does not match the pattern

> [!Note]
>
> 1. Globs do not match hidden files `(.*)` unless you explicitly include the dot: `.*` or `.[!.]*.`
> 2. Globbing happens **before command execution**, so it’s purely a shell feature.

For example:

```bash
#!/bin/bash
echo *.sh  # -> hello.sh world.sh
echo "*.sh" # -> *.sh
echo '*.sh' # -> *.sh
```

## Built-in Commands

### `seq` Command

`seq` command can be used to **generate a sequence of numbers**.

The syntax of `seq` command is:

```bash
seq [<options>] [first=1] [step=1] <last>
```

For example, to generate a sequence of numbers from 1 to 5:

```bash
#!/bin/bash
echo $(seq 5)
# -> 1
#    2
#    3
#    4
#    5
```

You can also specify the start number, end number and step value:

```bash
#!/bin/bash
echo $(seq 2 2 10)
# -> 2
#    4
#    6
#    8
#    10
```
