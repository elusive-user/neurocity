const imageLoader = document.getElementById('imageLoader')
const imageCanvas = document.getElementById('imageCanvas')
const rotateLeftBtn = document.getElementById('rotateLeft')
const rotateRightBtn = document.getElementById('rotateRight')
const saveImageBtn = document.getElementById('saveImage')
const ctx = imageCanvas.getContext('2d')

let img = new Image()
let currentAngle = 0

// Загрузка изображения с компьютера
imageLoader.addEventListener('change', handleImageUpload)

function handleImageUpload(event) {
	const reader = new FileReader()
	reader.onload = function (e) {
		img.src = e.target.result
		img.onload = function () {
			drawImage()
		}
	}
	reader.readAsDataURL(event.target.files[0])
}

// Отрисовка изображения на canvas
function drawImage() {
	const canvasSize = calculateCanvasSize()
	imageCanvas.width = canvasSize.width
	imageCanvas.height = canvasSize.height
	ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height)

	// Центрирование изображения при повороте
	ctx.save()
	ctx.translate(imageCanvas.width / 2, imageCanvas.height / 2)
	ctx.rotate((currentAngle * Math.PI) / 180)
	ctx.drawImage(img, -img.width / 2, -img.height / 2)
	ctx.restore()
}

// Рассчет размеров canvas с учётом поворота
function calculateCanvasSize() {
	if (currentAngle % 180 === 0) {
		return { width: img.width, height: img.height }
	} else {
		return { width: img.height, height: img.width }
	}
}

// Поворот изображения влево (-90 градусов)
rotateLeftBtn.addEventListener('click', () => {
	currentAngle = (currentAngle - 90) % 360
	drawImage()
})

// Поворот изображения вправо (+90 градусов)
rotateRightBtn.addEventListener('click', () => {
	currentAngle = (currentAngle + 90) % 360
	drawImage()
})

// Сохранение изображения
saveImageBtn.addEventListener('click', () => {
	const link = document.createElement('a')
	link.href = imageCanvas.toDataURL('image/png') // Или 'image/jpeg'
	link.download = 'rotated_image.png' // Имя сохраненного файла
	link.click()
})
