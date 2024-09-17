const fs = require('fs')
const path = require('path')
const https = require('https')
const { spawn } = require('child_process')
const os = require('os')

// Получение домашней директории пользователя
const homeDir = os.homedir()

// 1. Вывод списка всех файлов домашней директории
console.log('Список файлов домашней директории:')
fs.readdir(homeDir, (err, files) => {
	if (err) {
		return console.error('Ошибка чтения директории:', err)
	}
	files.forEach(file => {
		console.log(file)
	})
})

// 2. Запрос к удалённому хранилищу для получения списка файлов
const remoteUrl =
	'https://store.neuro-city.ru/downloads/for-test-tasks/files-list'
const downloadDir = path.join(__dirname, 'downloads') // Директория для сохранения файлов

// Проверка наличия папки downloads, если нет — создаем
if (!fs.existsSync(downloadDir)) {
	fs.mkdirSync(downloadDir)
}

https
	.get(remoteUrl, res => {
		let data = ''

		// Чтение данных
		res.on('data', chunk => {
			data += chunk
		})

		// После получения полного ответа
		res.on('end', () => {
			try {
				const files = JSON.parse(data)
				console.log('\nСписок файлов удалённого хранилища:')

				files.forEach(file => {
					console.log(`${file.name} (${file.size} bytes)`)

					// Загрузка файлов, которые больше 0 KB
					if (file.size > 0) {
						const fileUrl = `https://store.neuro-city.ru/downloads/for-test-tasks/${file.name}`
						const filePath = path.join(downloadDir, file.name)

						// Запуск скачивания файла
						https
							.get(fileUrl, fileRes => {
								const fileStream = fs.createWriteStream(filePath)
								fileRes.pipe(fileStream)

								fileStream.on('finish', () => {
									fileStream.close()
									console.log(`Файл ${file.name} загружен в ${filePath}`)
								})
							})
							.on('error', err => {
								console.error(
									`Ошибка при загрузке файла ${file.name}: ${err.message}`
								)
							})
					}
				})
			} catch (err) {
				console.error('Ошибка парсинга JSON:', err.message)
			}
		})
	})
	.on('error', err => {
		console.error('Ошибка запроса:', err.message)
	})

// 3. Открыть консоль и вывести в ней "Hello, World!" через дочерний процесс
console.log('\nЗапуск дочернего процесса для вывода "Hello, World!"...')
const child = spawn('echo', ['Hello, World!'], {
	stdio: 'inherit',
	shell: true,
})

child.on('close', code => {
	console.log(`Дочерний процесс завершён с кодом: ${code}`)
})
