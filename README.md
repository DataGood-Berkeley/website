# Installation
> Requires NodeJS installed

`npm install`

# Development

`npm run watch`

# Architecture

> The architecture of the backend code

`./index.js`: Contains the endpoints for serving static files with the handlebars framework

`./src`: Contains source code material such as handlebars (`.hbs`) and sass (`.scss`) files; these files must be compiled first before it can be displayed as HTML/CSS respectively

`./public`: Contains files that do not need to be pre-compiled. Images located in this file should be compressed to a `.webp` to save space unless lossless resolution is required (such as the case with the logo). The `css` folder should be ignored as this is the path to the compiled sass files.

`./config`: Contains configuration files for the website as `.yml` files (YAML files)

# npm commands

> Node package manager commands located in `./package.json`

To run these npm commands, you can simply do `npm run <COMMAND_NAME>`

`prestart`: Pull from Github, install dependencies, and compile sass files before starting the program

`postinstall`: After installing dependencies, compile sass files

`build`: An alias to `build:sass`

`start`: Run the `./index.js` file as a NodeJS program. This is the primary command used in a **production environment**.

`test`: No operation

`watch:express`: Watch the `./index.js` file for changes; auto-reload the program (backend) when the file is modified

`build:sass`: Compile sass files

`watch:sass`: Watch sass files. If there are any changes, recompile sass files

`watch:browser`: Open the website onto a browser. If there are any changes to static files, reload the browser.

`watch`: Run `watch:express`, `watch:sass`, `watch:browser`. This is the primary command used in a **development environment**.

`lint`: Lint your JavaScript files.

`lint:fix`: Fix your JavaScript files to the best of the linter's ability.

NOTE: When you do `git commit`, the pre-commit lint will attempt to run. If the linter exits with an error, then the commit is aborted. Resolve all linting errors before trying to commit again. If there are issues committing with Github Desktop, try committing with the `git` command in a terminal.

# Website

https://datagood.berkeley.edu/

# Deploy Instructions

ssh into vampires.ocf.berkeley.edu