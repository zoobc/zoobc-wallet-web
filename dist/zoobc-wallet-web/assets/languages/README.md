# ZooBC Language Files

## How to use

Use git submodule to copy this language translation.

```bash
$ git submodule add https://github.com/zoobc/zoobc-language-files.git yourpath
```

Example:
```bash
$ git submodule add https://github.com/zoobc/zoobc-language-files.git src/assets/languages
```

## How to add/update new translation

First, fork the ZooBC Language Files to your account.

Then create new remote at languages folder on your local project (whatever project which use this language translations).

After you made changes to the language files, commit them then push to your fork.

Example:

```bash
$ cd src/assets/languages

$ git remote add languages your_fork_url

$ git add .

$ git commit -m "Update some translations"

$ git push languages master
```

After that, you can make a PR to this ZooBC Language Files repo.

## How to refresh the translations from the remote repository

put your cursor to the root of project (not on the languages folder)

```bash
$ git submodule update --remote
```
