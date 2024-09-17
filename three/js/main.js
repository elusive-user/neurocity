const baseUrl = 'https://store.neuro-city.ru/downloads/for-test-tasks/'
const fileListUrl =
	'https://store.neuro-city.ru/downloads/for-test-tasks/files-list'

const fileList = document.getElementById('fileList')
const downloadAllBtn = document.getElementById('downloadAllBtn')

// Функция для получения списка файлов с сервера
async function fetchFileList() {
	try {
		const response = await fetch(fileListUrl)
		if (!response.ok) throw new Error('Failed to fetch file list')
		const files = await response.json()

		displayFiles(files) // Отрисовка списка файлов
	} catch (error) {
		console.error('Error fetching file list:', error)
	}
}

// Функция для отрисовки списка файлов
function displayFiles(files) {
	files.forEach(file => {
		const li = document.createElement('li')
		li.innerHTML = `
      <span>${file.name} (${(file.size / 1e6).toFixed(2)} MB)</span>
      <div class="progress">
        <div class="progress-bar" id="progress-${file.name}"></div>
      </div>
      <span id="status-${file.name}">Pending</span>
    `
		fileList.appendChild(li)
	})
}

// Функция для скачивания файла с прогресс-баром
async function downloadFile(fileName) {
	const url = `${baseUrl}${fileName}`
	const progressBar = document.getElementById(`progress-${fileName}`)
	const status = document.getElementById(`status-${fileName}`)

	try {
		const response = await fetch(url)
		if (!response.ok) throw new Error('Network response was not ok')

		const reader = response.body.getReader()
		const contentLength = +response.headers.get('Content-Length')

		let receivedLength = 0
		const chunks = []

		while (true) {
			const { done, value } = await reader.read()
			if (done) break

			chunks.push(value)
			receivedLength += value.length

			const percentComplete = Math.round((receivedLength / contentLength) * 100)
			progressBar.style.width = `${percentComplete}%`
		}

		const blob = new Blob(chunks)
		const link = document.createElement('a')
		link.href = URL.createObjectURL(blob)
		link.download = fileName
		link.click()

		status.textContent = '✔'
		status.classList.add('completed')
	} catch (error) {
		console.error(`Error downloading ${fileName}:`, error)
		status.textContent = 'Error'
		status.style.color = 'red'
	}
}

// Функция для параллельной загрузки всех файлов
downloadAllBtn.addEventListener('click', () => {
	const fileElements = document.querySelectorAll(
		'#fileList li span:first-child'
	)
	fileElements.forEach(fileElement => {
		const fileName = fileElement.textContent.split(' ')[0] // Извлекаем имя файла
		downloadFile(fileName)
	})
})

// Запрос списка файлов при загрузке страницы
fetchFileList()
