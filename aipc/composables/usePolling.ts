import { ref } from 'vue'

interface Options {
    key?: string;
    time?: number;
    totalTime?: number;
    count?: number;
    callback?(): void;
}
let pollingDict: any = {}

export default function usePolling(fun, options: Options) {
    const {
        key,
        time = 2000,
        totalTime,
        count,
        callback = () => false
    } = options

    let timer = null
    let endTime = null
    let totalCount = 0

    const result = ref(null)
    const error = ref(null)

    const run = () => {
        console.log('count2:', count)
        if (endTime && endTime <= Date.now()) {
            end()
            callback()
            return
        }
        if (count && totalCount >= count) {
            end()
            callback()
            return
        }
        totalCount++
        timer = setTimeout(() => {
            fun()
                .then((res) => {
                    result.value = res
                    run()
                })
                .catch((err) => {
                    error.value = err
                })
        }, time)
    }

    const start = () => {
        end();                      // add this line
        if (key && pollingDict[key]) {
            pollingDict[key].end()
            delete pollingDict[key]
        }
        endTime = totalTime ? Date.now() + totalTime : null
        run()
        if (key) {
            pollingDict[key] = { end }
        }
    }

    const end = () => {
        if (timer) {
            clearTimeout(timer)
            timer = null
            endTime = null
            totalCount = 0
            if (key) delete pollingDict[key]
        }
    }

    return {
        start,
        end,
        error,
        result,
    }
}