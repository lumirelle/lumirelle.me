---
title: Bash Script Manual
date: 2025-12-01T15:50+08:00
update: 2025-12-01T15:50+08:00
lang: en
duration: n/a
type: blog+note
---

[[toc]]

## What is Bash?

**Bash (Bourne Again Shell)** is a widely used Unix shell and even a scripting language, it's also the default integrated shell for most Linux distributions and macOS.

On Windows, you can use Bash through the **Windows Subsystem for Linux (WSL)** or **Git Bash**, this manual will use WSL as an example.

## First Bash Script

> [!Note]
>
> Some Linux basic knowledge is required to understand this manual, like `chmod`, `ls`, `cd`, etc.

Bash scripts are plain text files containing a series of commands that can be executed by the Bash interpreter.

You can create and run your first Bash script by following these steps:

1. Open your WSL terminal (e.g., Ubuntu), it will open Bash by default.
2. Create a new file named `hello.sh` using a text editor like `vi`:

   ```bash
   vi test.sh
   ```

3. Add the following lines to the file:

   ```bash
   #!/bin/bash
   echo "Hello, Bash!"
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

   ```
   Hello, Bash!
   ```

## Shebang (`#!`)

You may have noticed the first line of the script:

```bash
#!/bin/bash // [!code highlight]
echo "Hello, Bash!"
```

This line is called a **shebang** (or hashbang), it tells the system which shell interpreter to use to execute the script, and it's syntaxed as `#!path_to_interpreter`.

In this manual, we are talking about Bash scripts, so we will always use `#!/bin/bash` to specify the Bash interpreter.

## Statement Separator

In Bash, you can use the semicolon `;` to separate multiple commands on the same line.

```bash
#!/bin/bash
echo "Hello"; echo "Bash!"
```

## Variables

### Define Variables

Like other scripting languages, you can also define variables in Bash to store data values.

The syntax for defining a variable is **`variable_name=value`**, without spaces around the `=` sign:

```bash
#!/bin/bash
name="World"
```

As usual, you cannot/shouldnot use keywords, special characters, space, or start with a number for variable names:

```bash
#!/bin/bash
with_space = "World" # -> with_space: Command not found
if=5                 # No error, but it's puzzling!
var*name="Hello"     # -> var*name=Hello: Command not found
var name="Hello"     # -> Command 'var' not found, but there are 24 similar ones.
9var="Hello"         # -> 9var=Hello: Command not found
```

### Access Variables

To access the value of a variable, you need to **prefix it with a `$`** sign:

```bash
#!/bin/bash
name="World"
echo "Hello, $name!"
```

If there are some extra texts right after the variable, you should use curly braces `{}` to enclose the variable name, so that Bash can correctly identify it:

```bash
#!/bin/bash
name="World"
echo "Hello, ${name}s!"
```

The best practice is **always using curly braces `{}` when accessing variables**, to avoid any potential ambiguity.

That's it!

### Access With Default Values

You can also access variables with default values using the following syntax:

- `${variable:-default_value}`: If `value` is **unset or null**, return `default_value`, otherwise return the value of `variable`.

  ```bash
  #!/bin/bash
  name=${USER:-"Guest"}
  echo "Hello, ${name}!"
  ```

- `${variable:=default_value}`: If `value` is **unset or null**, assign `default_value` to `variable`, and then return the value of `variable`.

  ```bash
  #!/bin/bash
  name=${USER:="Guest"}
  echo "Hello, ${name}!"
  ```

- `${variable:+alternate_value}`: If `value` is **set and not null**, return `alternate_value`, otherwise return empty value.

  ```bash
  #!/bin/bash
  name=${USER:+"Registered User"}
  echo "Hello, ${name}!"
  ```

- `${variable:?error_message}`: If `value` is **unset or null**, print `error_message` and exit the script.

  ```bash
  #!/bin/bash
  name=${USER:?"Error: USER variable is not set!"}
  echo "Hello, ${name}!"
  ```

### Unset Variables

Bash allows you to unset (delete) a variable by using the `unset` command:

```bash
#!/bin/bash
name="World"
echo "Hello, ${name}!"  # -> Hello, World!

unset name
echo "Hello, ${name}!"  # -> Hello, !
```

Of course, readonly variables cannot be unset:

```bash
#!/bin/bash
readonly PI=3.14
unset PI  # -> -bash: unset: PI: cannot unset: readonly variable
```

### Work with `declare` command

`declare` command can be used to **define variables with some special logic** or **print variables' information**.

To define variables:

- `declare -i <variable_name>=<value>`: Define an **integer** variable, so that you can apply arithmetic operations on them directly.

  ```bash
  #!/bin/bash
  declare -i count=10
  count=${count}+5
  echo ${count} # -> 15
  # if you define `count` without `-i`, the result will be string concat: `10+5`
  ```

- `declare -l <variable_name>=<value>`: Define a **lowercase** string variable, all assigned values will be converted to lowercase string.

  ```bash
  #!/bin/bash
  declare -l lname="HELLO"
  echo ${lname} # -> hello
  ```

- `declare -u <variable_name>=<value>`: Define an **uppercase** string variable, all assigned values will be converted to uppercase string.

  ```bash
  #!/bin/bash
  declare -u uname="hello"
  echo ${uname} # -> HELLO
  ```

- `declare -a <variable_name>=<value>`: Define an [**indexed array**](#indexed-arrays) variable.

  ```bash
  #!/bin/bash
  declare -a fruits=("Apple" "Banana" "Blueberry")
  echo ${fruits[@]} # -> Apple Banana Blueberry
  ```

- `declare -A <variable_name>=<value>`: Define an [**associative array**](#associative-arrays) variable.

  ```bash
  #!/bin/bash
  declare -A colors
  colors["apple"]="red"
  colors["banana"]="yellow"
  colors["blueberry"]="blue"
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
  declare -x MY_VAR="Hello"
  bash -c 'echo $MY_VAR' # -> Hello
  ```

- ...

To print variables' information:

- `declare`: Print the information of all **variables and functions** in the current shell.
- `declare -p <variable_name>`: Print the information of **specific variable**.
- `declare -f [variable_name]`: Print the information of **all/specific function(s)** in the current shell.
- `declare -F [variable_name]`: Print **function name(s)** of all/specific functions in the current shell.
- ...

### Work with `let` command

`let` command can be used to **define integer variables**, just like `declare -i`.

And multiple operations can be performed in one `let` command by separating them with spaces:

```bash
#!/bin/bash
let count=10
let v1=count+5 v2=count*2
echo ${v1} # -> 15
echo ${v2} # -> 20
```

### Work with `readonly` command

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

### Work with `export` command

`export` command can be used to **define exported variables**, just like `declare -x`.

```bash
#!/bin/bash
export MY_VAR="Hello"
bash -c 'echo $MY_VAR' # -> Hello
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

In script environment, including all above plus:

- `$0`: The **name of the script**.
- `$1`, `$2`, ...: The first, second, ... **command-line arguments** passed to the script.

  > [!Note]
  >
  > If the arguments are more than 9, you need to use `${10}`, `${11}`, ... to access them.

- `$#`: The **number of command-line arguments** passed to the script.
- `$@`: All command-line arguments passed to the script as **separate words**.

  ```bash
  ./test.sh arg1 "arg two" arg3
  ```

  ```bash
  #!/bin/bash
  for i in "$@"; do echo "@ '$i'"; done
  # -> @ 'arg1'
  #    @ 'arg two'
  #    @ 'arg3'
  ```

- `$*`: All command-line arguments passed to the script as **a single word**.

  ```bash
  ./test.sh arg1 "arg two" arg3
  ```

  ```bash
  #!/bin/bash
  for i in "$*"; do echo "* '$i'"; done
  # -> * 'arg1 arg two arg3'
  ```

- ...

## Data Types

Likes other scripting languages, Bash is dynamically typed.

There are totally three data types in Bash: **string**, **integer**, **boolean** and **array**.

The only two data types which are worth to mention in Bash are **string** and **array**.

### String

#### Quotes vs Double Quotes

Bash has two ways to define a string literal value: using **quotes** or **double quotes**.

- Using Quotes: Strings defined with quotes will treat **everything literally**, including special characters like `$`, `\`, and backticks `` ` ``.

  ```bash
  #!/bin/bash
  str='Hello, $USER! \n Today is `date`.'
  echo -e ${str}  # -> Hello, $USER! \n Today is `date`.
  ```

- Using Double Quotes: Strings defined with double quotes will **interpret** special characters like `$`, `\`, and backticks `` ` ``.

  ```bash
  #!/bin/bash
  str="Hello, $USER! \n Today is `date`."
  echo -e ${str} # -> Hello, xxx!
                 #    Today is Mon Dec 2 10:00:00 UTC 2025.
  ```

#### Get Length of String

Bash has a built-in way to get the length of a value: `${#variable_name}`, and it follows the rules below:

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

To extract a substring from a string variable, you can use the syntax `${variable_name:position:[length]}`:

> [!Note]
>
> The `position` starts from `0`, and if `length` is omitted, it will extract until the end of the string.

```bash
#!/bin/bash
str="Hello, World!"
echo ${str:7:5} # -> World
echo ${str:7}   # -> World!
```

### Array

Bash has two kinds of array: **indexed arrays** and **associative arrays**.

In this manual, if we talk about "arrays", it means both indexed arrays and associative arrays, unless otherwise specified.

Additionally, we can just treat a associative arrays with string indexed arrays.

#### Indexed Arrays

Indexed arrays are the common arrays we often talk about:

```bash
#!/bin/bash
declare -a fruits
fruits[0]="Apple"
fruits[1]="Banana"
fruits[2]="Blueberry"
```

You can also define indexed arrays in a more concise way:

```bash
#!/bin/bash
declare -a fruits=("Apple" "Banana" "Blueberry")
```

Even with custom element index:

```bash
#!/bin/bash
declare -a fruits1=([2]="Blueberry" [0]="Apple" [1]="Banana")
# => fruits[0]="Apple"
#    fruits[1]="Banana"
#    fruits[2]="Blueberry"
```

Even with sparse indexes:

```bash
#!/bin/bash
declare -a fruits2=("Blueberry" [5]="Apple" "Banana")
# => fruits[0]="Blueberry"
#    fruits[5]="Apple"
#    fruits[6]="Banana"
```

#### Associative Arrays

Associative arrays are like dictionaries or maps in other programming languages, they use key-value pairs, can only create elements one by one:

```bash
#!/bin/bash
# Define an associative array, use 'declare -A'
declare -A colors
colors["apple"]="red"
colors["banana"]="yellow"
colors["blueberry"]="blue"
```

#### Access Array Elements

To access values in an indexed array, use the syntax `${array_name[index]}`:

```bash
#!/bin/bash
declare -a fruits=("Apple" "Banana" "Blueberry")
echo ${fruits[0]}  # -> Apple
echo ${fruits[1]}  # -> Banana
echo ${fruits[2]}  # -> Blueberry
```

To access values in an associative array, use the syntax `${array_name[key]}`:

```bash
#!/bin/bash
declare -A colors
colors["apple"]="red"
colors["banana"]="yellow"
colors["blueberry"]="blue"
echo ${colors["apple"]}   # -> red
echo ${colors["banana"]}  # -> yellow
echo ${colors["blueberry"]}  # -> blue
```

Specially, if you access the **indexed array** with it's variable name directly, it will return the value of the **first element**, but **associative arrays** will return **empty value**:

```bash
#!/bin/bash
declare -a fruits=("Apple" "Banana" "Blueberry")
echo ${fruits}  # -> Apple

declare -A colors
colors["apple"]="red"
colors["banana"]="yellow"
colors["blueberry"]="blue"
echo ${colors}  # -> (empty value)
```

`${array_name[@]}` and `${array_name[*]}` can be used to access **all values** in both indexed and associative arrays, they will spread the array into **multiple words**:

```bash
#!/bin/bash
declare -a fruits=("Apple" "Banana" "Blueberry")
echo ${fruits[@]}  # -> Apple Banana Blueberry
echo ${fruits[*]}  # -> Apple Banana Blueberry

declare -A colors
colors["apple"]="red"
colors["banana"]="yellow"
colors["blueberry"]="blue"
echo ${colors[@]}  # -> red blue yellow
echo ${colors[*]}  # -> red blue yellow
```

And quoted version `"${array_name[@]}"` and `"${array_name[*]}"` behave differently than unquoted versions `${fruits[@]}` when used in loops or assignments:

```bash
#!/bin/bash
declare -a fruits=("Apple Pie" "Banana Split" "Blueberry Muffin")
for fruit in "${fruits[@]}"; do
  echo $fruit
done
# -> Apple Pie
#    Banana Split
#    Blueberry Muffin

for fruit in ${fruits[@]}; do
    echo $fruit
done
# -> Apple
#    Pie
#    Banana
#    Split
#    Blueberry
#    Muffin

for fruit in "${fruits[*]}"; do
  echo $fruit
done
# -> Apple Pie Banana Split Blueberry Muffin

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

That's because:

```bash
"${fruits[@]}"  # => "Apple Pie" "Banana Split" "Blueberry Muffin"

${fruits[@]}    # => Apple Pie Banana Split Blueberry Muffin

"${fruits[*]}"  # => "Apple Pie Banana Split Blueberry Muffin"

${fruits[*]}    # => Apple Pie Banana Split Blueberry Muffin
```

And:

```bash
for i in "Apple Pie" "Banana Split" "Blueberry Muffin"; do
    echo $i
done
# -> Apple Pie
#    Banana Split
#    Blueberry Muffin

for i in "Apple Pie Banana Split Blueberry Muffin"; do
    echo $i
done
# -> Apple Pie Banana Split Blueberry Muffin

for i in Apple Pie Banana Split Blueberry Muffin; do
    echo $i
done
# -> Apple
#    Pie
#    Banana
#    Split
#    Blueberry
#    Muffin
```

Smart you will found out that the special variables `$@` and `$*` are behaved the same as quoted versions!

#### Get Length of Array

For strings, you can simply use `${#variable_name}` to get the length of the string; However, for arrays, use the variable name directly will get the first element (for indexed arrays) or an empty value (for associative arrays), which is not what we want.

So, to get the length of an array, you should use `${#array_name[@]}` or `${#array_name[*]}` instead:

```bash
#!/bin/bash
declare -a fruits=("Apple" "Banana" "Blueberry")
echo ${#fruits[@]}  # -> 3
echo ${#fruits[*]}  # -> 3

declare -A colors
colors["apple"]="red"
colors["banana"]="yellow"
colors["blueberry"]="blue"
echo ${#colors[@]}  # -> 3
echo ${#colors[*]}  # -> 3
```

In advanced usage, you can also get the length of a specific element in an array by combining the two syntaxes:

```bash
#!/bin/bash
declare -a fruits=("Apple" "Banana" "Blueberry")
echo ${#fruits[0]}  # -> 5

declare -A colors
colors["apple"]="red"
colors["banana"]="yellow"
colors["blueberry"]="blue"
echo ${#colors["banana"]}  # -> 6
```

#### Get Filled Indexes/Keys of Array

You can use `${!array_name[@]}` or `${!array_name[*]}` to get all **filled indexes/keys** of an array, this is useful when you have sparse arrays:

```bash
#!/bin/bash
declare -a fruits=("Apple" "Banana" "Blueberry")
echo ${!fruits[@]}  # -> 0 1 2
echo ${!fruits[*]}  # -> 0 1 2

declare -A colors
colors["apple"]="red"
colors["banana"]="yellow"
colors["blueberry"]="blue"
echo ${!colors[@]}  # -> apple banana blueberry
echo ${!colors[*]}  # -> apple banana blueberry
```

#### Remove Elements from Array

Just like removing variables, you can use the `unset` command to remove elements from an array:

```bash
#!/bin/bash
declare -a fruits=("Apple" "Banana" "Blueberry")
unset fruits[1]
echo ${fruits[@]}  # -> Apple Blueberry
echo ${!fruits[@]}  # -> 0 2

declare -A colors
colors["apple"]="red"
colors["banana"]="yellow"
colors["blueberry"]="blue"
unset colors["banana"]
echo ${colors[@]}  # -> red blue
echo ${!colors[@]}  # -> apple blueberry
```

#### Array Values Extraction

Like string, to extract a part of values from an array, you can use the syntax `${variable_name[@]:position:[length]}` or `${variable_name[*]:position:[length]}`:

> [!Note]
>
> The `position` starts from `0`, and if `length` is omitted, it will extract until the end of the array.

```bash
#!/bin/bash
declare -a fruits=("Apple" "Banana" "Blueberry" "Durian" "Elderberry")
echo ${fruits[@]:2:2} # -> Blueberry Durian
echo ${fruits[@]:2}   # -> Blueberry Durian Elderberry

declare -A colors
colors["apple"]="red"
colors["banana"]="yellow"
colors["blueberry"]="blue"
colors["durian"]="green"
colors["elderberry"]="purple"
echo ${colors[@]:2:2} # -> blue green
echo ${colors[@]:2}   # -> blue green purple
```

#### Append Elements to Indexed Array

To append elements to an **indexed array**, you can use `+=` operator:

```bash
#!/bin/bash
declare -a fruits=("Apple" "Banana")
fruits+=("Blueberry" "Durian")
echo ${fruits[@]}  # -> Apple Banana Blueberry Durian
```

## Functions

Bash allows you to define functions to organize your code into reusable blocks.

### Define Functions

To define a function in Bash, the simplest syntax is:

```bash
#!/bin/bash
greet() {
  echo "Hello, $1!"
  echo "Welcome to Bash scripting."
}
```

### Unset Functions

Just like variables, you can unset (delete) a function by using the `unset -f` command:

```bash
#!/bin/bash
greet() {
  echo "Hello, $1!"
  echo "Welcome to Bash scripting."
}
greet "Alice" # -> Hello, Alice!
              #    Welcome to Bash scripting.
unset -f greet
greet "Bob"   # -> -bash: greet: command not found
```

### Parameters

Just like scripts, functions can also accept command-line arguments, which can be accessed using special variables:

- `$0`: The **name of the script**.
- `$1`, `$2`, ...: The first, second, ... **arguments** passed to the function.

  > [!Note]
  >
  > If the arguments are more than 9, you need to use `${10}`, `${11}`, ... to access them.

- `$#`: The **number of arguments** passed to the function.
- `$@`: All arguments passed to the function as **separate words**.
- `$*`: All arguments passed to the function as **a single word**.
- ...

### Call Functions

To call a function, just like to call a command, the arguments can be passed after the function name and should be separated by spaces:

```bash
#!/bin/bash
greet() {
  echo "Hello, $1!"
  echo "Welcome to Bash scripting."
}
greet "Alice"
```

### Return Values

Just like other scripting languages, functions can also return values using the `return` statement:

```bash
#!/bin/bash
add() {
  local sum=$(($1 + $2))
  return $sum
}
add 5 10
result=$?
echo "The sum is: $result"  # -> The sum is: 15
```

### Variables Scope

By default, variables defined inside a function are **global**, which means they can be accessed and modified outside the function.

To avoid this, you can use the `local` keyword to define **local variables** inside a function:

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

## Conditional Statements

### `test` Command Judgment

Bash provides a built-in command named `test` to evaluate conditional expressions:

```bash
#!/bin/bash
a=5
b=10
test $a -lt $b
echo $?  # -> 0 (true)
```

Another syntax for `test` command is using square brackets `[` and `]`, which is more commonly used in Bash scripts:

```bash
#!/bin/bash
a=5
b=10
[ $a -lt $b ]
echo $?  # -> 0 (true)
```

> [!Caution]
>
> The spaces after `[` and before `]` are required!

If you need regex support, you can use double square brackets `[[` and `]]`:

```bash
#!/bin/bash
str="Hello123"
[[ $str =~ [A-Za-z]+[0-9]+ ]]
echo $?  # -> 0 (true)
```

> [!Caution]
>
> The spaces after `[[` and before `]]` are required too!

#### Commonly Test Cases

Here are some commonly test cases you may use in Bash scripts:

File status:

- `[ -e <file_name> ]`: File exists
- `[ -f <file_name> ]`: File exists and is a regular file
- `[ -d <file_name> ]`: File exists and is a directory
- `[ -r <file_name> ]`: File is readable
- `[ -w <file_name> ]`: File is writable
- `[ -x <file_name> ]`: File is executable
- `[ <file_1> -nt <file_2> ]`: File 1 is newer than File 2
- `[ <file_1> -ot <file_2> ]`: File 1 is older than File 2
- ...

String comparison:

- `[ -n <string> ]`: The length of string is greater than zero
- `[ -z <string> ]`: The length of string is zero
- `[ <string_1> == <string_2> ]`: String 1 is equal to String 2
- `[ <string_1> != <string_2> ]`: String 1 is not equal to String 2
- `[ <string_1> '<' <string_2> ]`: String 1 is less than String 2 (in ASCII order) (need to be quoted to avoid Bash treating `<` as redirection operator)
- `[ <string_1> '>' <string_2> ]`: String 1 is greater than String 2 (in ASCII order) (need to be quoted to avoid Bash treating `>` as redirection operator)
- ...

Integer comparison:

- `[ <integer_1> -eq <integer_2> ]`: Integer 1 is equal to Integer 2
- `[ <integer_1> -ne <integer_2> ]`: Integer 1 is not equal to Integer 2
- `[ <integer_1> -lt <integer_2> ]`: Integer 1 is less than Integer 2
- `[ <integer_1> -le <integer_2> ]`: Integer 1 is less than or equal to Integer 2
- `[ <integer_1> -gt <integer_2> ]`: Integer 1 is greater than Integer 2
- `[ <integer_1> -ge <integer_2> ]`: Integer 1 is greater than or equal to Integer 2

Regex match:

- `[[ <string> =~ <regex_pattern> ]]`: String matches the regex pattern (another string, but treated as a regex pattern)

#### Combine Test Cases

You can combine multiple test cases using logical operators:

- `[ ! <test_case> ]`: Logical NOT
- `[ <test_case_1> ] && [ <test_case_2> ]`: Logical AND
- `[ <test_case_1> ] || [ <test_case_2> ]`: Logical OR
- ...

> [!Caution]
>
> All of the spaces above are required!

For example:

```bash
#!/bin/bash
a=5
b=10
if [ ! $a -gt $b ] && [ $a -ne 0 ]; then
  echo "$a is not greater than $b and not zero"
fi
```

### Arithmetic Judgment

If you unlike the syntax of using `test` on integers, for example:

```bash
#!/bin/bash
a=5
b=10
if [ $a -lt $b ]; then
  echo "$a is less than $b"
fi
```

You can use arithmetic judgment with double parentheses `((` and `))`:

```bash
#!/bin/bash
a=5
b=10
if (( a < b )); then
  echo "$a is less than $b"
fi
```

### `if` Statement

The fully syntax of an `if` statement in Bash is:

```bash
if condition1; then
  # commands to execute if condition1 is true
elif condition2; then
  # commands to execute if condition2 is true
else
  # commands to execute if none of the above conditions are true
fi
```

Just like other scripting languages, the `elif` and `else` parts are optional, and condition can be boolean value directly. For example:

```bash
if true; then
  echo "This is true"
fi
```

The different thing is the `if` statement in Bash does not support evaluate conditions natively, you need to combine it with the `test` command judgment (or its variants with square brackets), arithmetic judgment to evaluate conditions. For example:

```bash
#!/bin/bash
a=5
b=10
if [ $a -lt $b ]; then
  echo "$a is less than $b"
elif [ $a -eq $b ]; then
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
