# bstalk

Deploy your beanstalkapp.com projects from CLI (and other cool stuff)


## Install

```
npm install -g bstalk
```


## Update

```
npm update -g bstalk
```

## Usage
```
 bstalk -h

  Usage: bstalk <command> [options]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

  Commands:

    bstalk --version                       Print version
    bstalk config                          Create config file
    bstalk openconfig                      Open config file for edition
    bstalk repos                           Display list of all repositories
    bstalk create <repo> [color]           Create a git <repo> with specified [color]
    bstalk envs <repo>                     Displays configured environments for <repo>
    bstalk deploy <repo> <env> [comment]   Deploy environment last revision on <env> for <repo>
```


### Create a repo
[![asciicast](https://asciinema.org/a/80897.png)](https://asciinema.org/a/80897)

### Deploy a repo
[![asciicast](https://asciinema.org/a/80899.png)](https://asciinema.org/a/80899)

## Credits
- [Nassif Bourguig](https://github.com/nbourguig)
- [All Contributors](../../contributors)
