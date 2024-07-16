import { ref } from 'vue'
import DrawTool from './drawingTool'

interface callbacks {
    ondata?(result: string): void
}

export function useImageEditor(callbacks: callbacks) {
    // 画布默认数据
    const defaultCanvasAttr = reactive({
        width: null,
        height: null,
        name: 'Stage',
        children: []
    })

    // 绘制工具map
    const DrawToolMap = {
        RECT: 'rect',
        LASSO: 'lasso'
    }

    // 画布参数
    const state = shallowReactive({
        canvas: null, // 画布实力
        ctx: null, // 画布操作上下文实力

        lineType: DrawToolMap.RECT, // 绘制类型

        stepIndex: -1, // 步骤索引
        stepList: [], // 步骤s索引列表
        stepAttr: defaultCanvasAttr // 步骤数据
    })

    // 图片实力
    const image = ref(new Image())
    // 初始绘制工具
    const drawingTool = new DrawTool()
    // 绘制选区路径的集合
    const selectionPaths = ref([])
    // 绘制坐标
    let drawPoint = []
    // 鼠标是否按下
    let isMouseDown = false

    /**
     * 初始化canvas和图片
     */
    const initCanvas = (canvasId: string, imageUrl: string) => {
        state.canvas = document.getElementById(canvasId)
        state.canvas.style.cursor = 'crosshair'
        state.canvas.style['pointer-events'] = 'none'
        if (state.canvas) {
            state.ctx = state.canvas.getContext('2d')

            // 显示加载动画
            state.ctx.fillStyle = 'white'
            state.ctx.fillRect(0, 0, state.canvas.width, state.canvas.height)
            state.ctx.font = '20px Arial'
            state.ctx.fillStyle = 'black'
            state.ctx.fillText(
                '加载中...',
                state.canvas.width / 2 - 40,
                state.canvas.height / 2
            )

            // 设置 willReadFrequently 属性
            state.ctx.imageSmoothingEnabled = true // 为了提高性能，启用图像平滑处理
            state.ctx.imageSmoothingQuality = 'high' // 设置图像平滑处理质量

            // 图片加载完成
            image.value.onload = () => {
                state.canvas.style['pointer-events'] = 'auto'
                // 这里计算图片的大小进行图片不拉伸渲染
                const aspectRatio = image.value.width / image.value.height
                let newWidth, newHeight
                if (aspectRatio > state.canvas.width / state.canvas.height) {
                    newWidth = state.canvas.width
                    newHeight = state.canvas.width / aspectRatio
                } else {
                    newWidth = state.canvas.height * aspectRatio
                    newHeight = state.canvas.height
                }

                const x = (state.canvas.width - newWidth) / 2
                const y = (state.canvas.height - newHeight) / 2

                state.ctx.drawImage(image.value, x, y, newWidth, newHeight)
                // 初始化绘画工具
                drawingTool.init(state)
                // 保存第一贞
                drawingTool.saveCurrentPaste()
            }
            // 图片加载失败
            image.value.onerror = () => {
                state.ctx.clearRect(
                    0,
                    0,
                    state.canvas.width,
                    state.canvas.height
                )
                state.ctx.fillText(
                    '图片加载失败',
                    state.canvas.width / 2 - 40,
                    state.canvas.height / 2
                )
            }
            image.value.src = imageUrl

            image.value.setAttribute('crossOrigin', 'anonymous')
            image.value.setAttribute('src', imageUrl)
        }
    }

    /**
     * 切换绘画工具
     */
    const changeTool = (tool: string) => {
        state.lineType = tool
    }

    /**
     * 调用绘画工具
     */
    const drawToolHandler = (...touch) => {
        const { x, y, w, h, c, move, closed } = touch[0]
        switch (state.lineType) {
            case DrawToolMap.RECT:
                drawingTool.rect({ x, y, w: w - x, h: h - y, c })
                break
            case DrawToolMap.LASSO:
                // 移动时记录画笔坐标
                if (move) drawPoint.push(w, h)
                drawingTool.lasso(drawPoint, c, 2, closed)
                break
        }
    }

    /**
     * 手指触摸画布
     */
    const drawTouStart = (touch: MouseEvent) => {
        isMouseDown = true

        // 创建一条路径
        state.ctx.beginPath()

        drawToolHandler({
            x: touch.offsetX,
            y: touch.offsetY,
            c: '#11bdf7'
        })

        drawPoint = [touch.offsetX, touch.offsetY]
    }

    /**
     * 手指触摸移动画布
     */
    const drawTouMove = (touch: MouseEvent) => {
        if (!isMouseDown) return

        drawToolHandler({
            x: drawPoint[0],
            y: drawPoint[1],
            w: touch.offsetX,
            h: touch.offsetY,
            c: '#11bdf7',
            move: true
        })
    }

    /**
     * 手指离开画布触摸
     */
    const drawTouEnd = (touch: MouseEvent) => {
        // 初始坐标为空时不绘制
        if (drawPoint.length === 0) return
        // 单次点击也不绘制
        if (drawPoint[0] == touch.offsetX && drawPoint[1] == touch.offsetY) {
            // 清空坐标防止下一次绘制时坐标错误
            drawPoint = []
            // 鼠标状态
            isMouseDown = false
            // 清空已选择
            callbacks?.ondata('')
            return
        }

        drawToolHandler({
            x: drawPoint[0],
            y: drawPoint[1],
            w: touch.offsetX,
            h: touch.offsetY,
            closed: true
        })

        // 结束获取结果
        drawEndHandler({
            x: drawPoint[0],
            y: drawPoint[1],
            w: touch.offsetX,
            h: touch.offsetY
        })
        // 闭合路线
        state.ctx.closePath()
        console.log('结果')
        drawingTool.saveCurrentPaste()

        if (isMouseDown) {
            isMouseDown = false
            return
        }
    }

    /**
     * 绘画结束后的操作
     */
    const drawEndHandler = (touch: MouseEvent | any) => {
        const { x, y, w, h } = touch
        switch (state.lineType) {
            case DrawToolMap.RECT:
                captureRectArea({ x, y, w: w - x, h: h - y })
                break
            case DrawToolMap.LASSO:
                captureLassoArea(drawPoint)
                break
        }
        // 清空坐标防止下一次绘制时坐标错误
        drawPoint = []
    }

    /**
     * 保存当前选区到选区路径集合中
     */
    const saveSelectionPath = (path) => {
        selectionPaths.value.push(path)
    }

    /**
     * 调整captureRectArea 和 captureLassoArea 函数
     * 将他们的功能合并到 captureCombinedSelections 中
     */
    const captureCombinedSelections = () => {
        // 新建一个临时的canvas作为背景
        const tempCanvas = document.createElement('canvas')
        const tempCtx = tempCanvas.getContext('2d')
        tempCanvas.width = state.canvas.width
        tempCanvas.height = state.canvas.height

        // 新建一个用于绘制所有裁剪路径的透明canvas
        const pathsCanvas = document.createElement('canvas')
        const pathsCtx = pathsCanvas.getContext('2d')
        pathsCanvas.width = state.canvas.width
        pathsCanvas.height = state.canvas.height

        // 在透明canvas上绘制所有裁剪路径
        selectionPaths.value.forEach((path) => {
            if (path.type === DrawToolMap.LASSO) {
                const points = path.points
                pathsCtx.beginPath()
                pathsCtx.moveTo(points[0], points[1])

                for (let i = 2; i < points.length; i += 2) {
                    pathsCtx.lineTo(points[i], points[i + 1])
                }

                pathsCtx.closePath()
                //使用填充将路径绘制到透明背景上
                pathsCtx.fill()
            } else if (path.type === DrawToolMap.RECT) {
                const { x, y, w, h } = path
                pathsCtx.beginPath()
                pathsCtx.rect(x, y, w, h)
                pathsCtx.closePath()
                //使用填充将路径绘制到透明背景上
                pathsCtx.fill()
            }
        })

        tempCtx.putImageData(state.stepList[0], 0, 0)

        // 使用透明canvas中的路径作为裁剪区
        tempCtx.globalCompositeOperation = 'destination-in'
        tempCtx.drawImage(pathsCanvas, 0, 0)

        // 转换成base64图像并返回
        callbacks?.ondata(tempCanvas.toDataURL())
    }

    /**
     * 处理矩形绘制结束后事情
     * 现在他们将选区路径数据保存到selectionPaths数组中
     */
    const captureRectArea = ({ x, y, w, h }) => {
        // 每当绘制矩形选区后，保存这个选区
        saveSelectionPath({ type: DrawToolMap.RECT, x, y, w, h })
    }

    /**
     * 处理套索选择绘制结束后事情
     * 现在他们将选区路径数据保存到selectionPaths数组中
     */
    const captureLassoArea = (points) => {
        // 每当绘制套索选区后，保存这个选区
        saveSelectionPath({ type: DrawToolMap.LASSO, points: [...points] })
    }

    /**
     * 后退
     */
    const undoHandler = () => {
        if (state.stepIndex <= 0) return
        state.stepIndex--
        // 重现上一步操作
        drawingTool.reappearPaste()
        state.stepList.pop()
        selectionPaths.value.pop()
    }

    const unmounted = () => {
        drawPoint = []
        selectionPaths.value = []
    }

    // 切换页面回来后固定第一贞页面
    window.addEventListener('focus', function () {
        // 用户返回页面时触发
        state?.canvas?.focus()
        state?.ctx?.putImageData(state.stepList[state.stepIndex], 0, 0)
    })

    onUnmounted(unmounted)

    return {
        initCanvas,
        changeTool,

        drawTouStart,
        drawTouMove,
        drawTouEnd,

        captureCombinedSelections,
        undoHandler,
        unmounted
    }
}
