const yargs = require("yargs")
const { spawnSync } = require("child_process")

const args = yargs
    .option('bump', {
        alias: "b",
        describe: "bump version",
        choices: ['major', 'minor', 'patch'],
    })
    .option('version-tag', {
        alias: "v",
        describe: "tag defined version",
        string: true
    })
    .help('help')
    .argv

const init = (version) => {
    const promiseMain = new Promise((resolve, reject) => {
        const options = {
            cwd: process.cwd()
        }
        commandsExec(options, version)
        resolve()
    })
    const promiseBackend = new Promise((resolve, reject) => {
        const options = {
            cwd: `${process.cwd()}/trua-backend`
        }
        commandsExec(options, version)
        resolve()
    })
    const promiseFrontend = new Promise((resolve, reject) => {
        const options = {
            cwd: `${process.cwd()}/trua-frontend`
        }
        commandsExec(options, version)
        resolve()
    })
    return Promise.all([promiseMain, promiseBackend, promiseFrontend]);
}

const commandsExec = (options, version) => {
    spawnSync("git", ["stash"], options)
    spawnSync("npm", ["version", version], options)
    spawnSync("git", ["stash", "apply"], options)

}

if (args.bump || args["version-tag"]) {
    const version = args.bump || args.versionTag
    init(version).then(() => console.log(`Released version ${version}`)).catch(err => {
        console.error(err)
        process.exit(1)
    })
}