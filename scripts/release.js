const yargs = require("yargs")
const cp = require("child_process")

const args = yargs
    .option('bump', {
        alias: "b",
        describe: "bump version",
        choices: ['major', 'minor', 'patch'],
    })
    .option('version', {
        alias: "v",
        describe: "tag defined version",
    })
    .help('help')
    .argv

const init = (version) => {
    const promiseMain = new Promise((resolve, reject) => {
        return cp.exec(`cd ${process.cwd()} && npm version ${version} `,(err) => reject(err) 
            ,() =>
            resolve() )
    })
    const promiseBackend = new Promise((resolve, reject) => {
        return cp.exec(`cd ${process.cwd()}/trua-backend && npm version ${version} `, () =>
            resolve()
            , (err) => reject())
    })
    const promiseFrontend = new Promise((resolve, reject) => {
        return cp.exec(`cd ${process.cwd()}/trua-frontend && npm version ${version} `, () =>
            resolve()
            , (err) => reject())
    })
    return Promise.all([promiseMain, promiseFrontend, promiseBackend]);

}

if (args.bump || args.version) {
    const version = args.bump || args.version
    init(version).then(()=>console.log("Release done")).catch(err => 
        { 
            console.error(err)
            process.exit(1) 
        })
}