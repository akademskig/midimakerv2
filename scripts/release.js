const yargs = require("yargs")
const cp = require("child_process")

const args = yargs
    .option('release', {
        alias: "r",
        describe: "version",
        choices: ['major', 'minor', 'patch'],
        require: true
    })
    .help('help')
    .argv

const init = (version) => {
    console.log(version)
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

if (args.release) {
    console.log(init(args.release))
    init(args.release).then(()=>console.log("Release done")).catch(err => 
        { 
            console.error(err)
            process.exit(1) 
        })
}