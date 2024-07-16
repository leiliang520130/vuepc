export class Balance {
    init(name: string, pay: any) {
        pay[name] = this
    }
    run(options: any) {
        return new Promise((resolve, reject) => {
            resolve('')
        })
    }
}
