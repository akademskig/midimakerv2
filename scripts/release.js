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
        commandsExec(options, version, "main package")
        resolve()
    })
    const promiseBackend = new Promise((resolve, reject) => {
        const options = {
            cwd: `${process.cwd()}/trua-backend`
        }
        commandsExec(options, version, "frontend-ts")
        resolve()
    })
    const promiseFrontend = new Promise((resolve, reject) => {
        const options = {
            cwd: `${process.cwd()}/trua-frontend`
        }
        commandsExec(options, version, "trua-backend")
        resolve()
    })
    return Promise.all([promiseMain, promiseBackend, promiseFrontend]);
}

const commandsExec = (options, version, package) => {
    spawnSync("git", ["stash"], options)
    let res = spawnSync("npm", ["version", version], options)
    console.log(`${package} updated to ${res.stdout.toString()}`)
    spawnSync("git", ["stash", "apply"], options)

}

if (args.bump || args["version-tag"]) {
    const version = args.bump || args.versionTag
    init(version).then(() => console.log(`Released version ${version}`)).catch(err => {
        console.error(err)
        process.exit(1)
    })
}