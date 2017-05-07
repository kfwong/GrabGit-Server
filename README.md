# GrabGit-Server
GrabGit is a git repository inspector service developed by a group of students from National University of Singapore under the module CS3219 Software Engineering Principles and Patterns. This server is an RESTful endpoint service for the main application.

![architecture-diagram](https://github.com/kfwong/GrabGit-Server/raw/master/arch-diagram.png)

## Companion Services
Controller Server: This repository.

Web App URL (Github Pages): [https://turtle96.github.io/GrabGit/](https://turtle96.github.io/GrabGit/)

GrabGit Repository (Frontend): [https://github.com/turtle96/GrabGit](https://github.com/turtle96/GrabGit)

Telegram Chatbot Repository: [https://github.com/turtle96/grabGit-chatbot](https://github.com/turtle96/grabGit-chatbot)

## Installation

### Prerequisite
- Python 2.7+
- NodeJS
- NPM

### Installation Guide
1. Clone this repository to your server.
2. Run `npm install` in the project's root.
3. Run `node bin/www` in the project's root.
4. The node server should now be running at port 3000.

### Alternative Installation
Our team make use of the `forever` npm module to run multiple node at the same time in the background.
Check out [https://www.npmjs.com/package/forever](https://www.npmjs.com/package/forever) for its usage.

## Available Endpoints
All endpoints are written in routes/api.js.

**Important (1):** Normally, all major browser should deny all cross-site origin request, since our frontend views and server controller is separated from each other. This server script added a HTTP header `'Access-Control-Allow-Origin *` to all endpoints response.

**Important (2):** Major browser will block mixed HTTP & HTTPS requests if the controller server is not protected by SSL/TLS. Either configure a HTTPS request protocol or use Google Chrome browser to load unsafe script.


| Method | Endpoint                                          | POST Params | GET Params | URL Params                                | Description                                                                                                                                                                                 |
|--------|---------------------------------------------------|-------------|------------|-------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GET    | /repos/register                                   |             |            |                                           | [Deprecated] Display a form for user to register a repo. The server will clone a bare repository into the folder under "<project_root>/git".                                                |
| POST   | /repos/regiser                                    | repoUrl     |            |                                           | Register a repo. Currently only support Github repository URL.                                                                                                                              |
| GET    | /repos/:repoOwner/:repoName                       |             | command    | :repoOwner, :repoName                     | [Deprecated] Allow executing arbitrary git command. For testing purpose only. eg: https://example.com/repos/myrepo/myname?command=log --oneline                                             |
| GET    | /repos/:repoOwner/:repoName/files                 |             |            | :repoOwner, :repoName                     | Display all files recursively belong to this repo.                                                                                                                                          |
| GET    | /repos/:repoOwner/:repoName/1d                    |             | file       | :repoOwner, :repoName                     | Result for task (d). Equivalent to `git blame -w -M --line-porcelain`. The blame ignore whitespace and rename/move commits, return procelain formatted result for easy machine consumption. |
| GET    | /repos/:repoOwner/:repoName/:fromYear/:toYear/1bc |             |            | :repoOwner, :repoName, :fromYear, :toYear | Result for task (b) & (c). Execute 1bc.sh behind the scene with to/from year constraint (date format in yyyy). Return .json format file.                                                    |
| GET    | /repos/:repoOwner/:repoName/1bc                   |             |            | :repoOwner, :repoName                     | Similar to above endpoint. Execute 1bc_all.sh behind the scene without time constraint.                                                                                                     |
| GET    | /repos/:repoOwner/:repoName/1e                    |             |            | :repoOwner, :repoName                     | Result for task (e). Execute 1e.sh behind the scene and return a .csv format file.                                                                                                          |
| GET    | /repos/:repoOwner/:repoName/1a                    |             |            | :repoOwner, :repoName                     | Result for task (a). Execute 1a.sh behind the scene. Return a .csv format file.                                                                                                             |


## Tasks
a) For the given GIT repo show the contribution of all team members. (The granularity
for the contribution can be one or many of the parameters like number of commits,
insertion, deletions, etc.)

b) For a given team member show the commit history. The duration for the
visualization should be allowed to be taken as input by the user ranging from start of
the project (or any reasonable start date) to current date.

c) GIT-Guard should allow user to compare the efforts of or more team members by
comparing the visualization in 1(b) over a period of time.

d) GIT-Guard should show the commit history of all the users, for a specific file in the
repo. It should also provide an option to select a code chunk (specific line numbers)
and show the history of edits on those lines.

e) Show a visualization of number of lines of code in the final project version by each
team member. (similar to one of the views in GIT -Inspector)

## Credits
Dylan Chew - author for (a) and its git command script

Jazlyn Ang - author for (b), 1(c) and its git command & python script

Wong Kang Fei - Managing GrabGit-Server, author for (d)

Vivian Low - author for (e) and its git command script
