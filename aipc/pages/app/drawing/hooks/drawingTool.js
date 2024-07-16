import mosaic from '@/assets/images/mosaic.png'

export default class DrawBoardTool {
    static _stage = null
    // 画布上下文实例
    static _ctx = null
    // 画布元素实例
    static _canvas = null
    // 画布历史步骤列表
    static _stepList = null
    static _mosaic = null

    /**
     * 初始化canvas上下文
     * @param ctx canvas上下文
     */
    init = (stage) => {
        this._ctx = stage.ctx
        this._canvas = stage.canvas
        this._stepList = stage.stepList
        this._stage = stage

        // 引入买塞克图片
        const image = new Image()
        image.src = mosaic
        this._mosaic = image
    }

    /* ---------------------------------以下为历史记录操作方法 */

    /**
     * 保存当前画布内容
     */
    saveCurrentPaste = () => {
        const arr = this._stepList || []
        if (this._stage.stepIndex < arr.length - 1) {
            arr.splice(this._stage.stepIndex + 1)
        }
        /* 给数组添加当前画布 */
        arr.push(
            this._ctx.getImageData(
                0,
                0,
                this._canvas.width,
                this._canvas.height
            )
        )
        /* 赋值全局 */
        this._stepList = arr

        this._stage.stepIndex++
        this._stage.stepLen = arr.length
    }

    /**
     * put重现某个画布内容
     */
    reappearPaste = () => {
        const i = this._stage.stepIndex
        if (i < 0) return
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
        this._ctx.putImageData(this._stepList[i], 0, 0)
    }

    /* ---------------------------------以下为图形操作方法 */
    /**
     * 套索
     * @param points 点数组
     * @param stroke 颜色
     * @param strokeWidth 线粗细
     * @param close 结束绘制
     */
    lasso = (points, stroke, strokeWidth = 1.5, close = false) => {
        this.reappearPaste()
        const len = points.length

        // 开始绘制路径
        this._ctx.beginPath()
        this._ctx.moveTo(points[0], points[1])

        // 绘制每个贝塞尔曲线段
        for (let i = 2; i < len - 3; i += 4) {
            this._ctx.bezierCurveTo(
                points[i],
                points[i + 1], // 控制点1
                points[i + 2],
                points[i + 3], // 控制点2
                points[i + 4],
                points[i + 5]
            ) // 结束点
        }

        // 如果 close 为 true，闭合路径
        if (close) {
            this._ctx.closePath()
        }

        // 设置线条样式并绘制路径
        this._ctx.strokeStyle = stroke
        this._ctx.lineWidth = strokeWidth
        this._ctx.stroke()

        this._ctx.fillStyle = this._ctx.createPattern(
            this._mosaic,
            'repeat'
        )
        this._ctx.fill()
    }

    /**
     * 矩形
     * @param x x坐标
     * @param y y坐标
     * @param w 宽
     * @param h 高
     * @param c 颜色
     */
    rect = ({ x, y, w, h, c }) => {
        this.reappearPaste()
        this._ctx.strokeStyle = c
        this._ctx.rect(x, y, w, h)
        this._ctx.lineWidth = 2
        this._ctx.stroke()
        this._ctx.beginPath()

        const pattern = this._ctx.createPattern(this._mosaic, 'repeat')
        this._ctx.fillStyle = pattern
        this._ctx.fillRect(x, y, w, h) // 绘制矩形并填充图片
    }
}
