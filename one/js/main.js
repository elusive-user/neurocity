const sliderWrapper = document.getElementById('slider-wrapper')
const prevBtn = document.getElementById('prevBtn')
const nextBtn = document.getElementById('nextBtn')
const cardsCountSelect = document.getElementById('cardsCount')

let currentIndex = 0
let cardsPerView = 3
let usersData = []

// Функция для запроса данных с API
async function fetchUsers() {
	try {
		const response = await fetch('https://reqres.in/api/users')
		const data = await response.json()
		usersData = data.data
		renderSlider()
	} catch (error) {
		console.error('Error fetching data:', error)
	}
}

// Функция для рендера слайдера
function renderSlider() {
	sliderWrapper.innerHTML = ''
	usersData.forEach(user => {
		const card = document.createElement('div')
		card.classList.add('card')
		card.innerHTML = `
      <img src="${user.avatar}" alt="${user.first_name}">
      <h3>${user.first_name} ${user.last_name}</h3>
      <p>Email: ${user.email}</p>
      <button class="remove-btn">X</button>
    `
		card
			.querySelector('.remove-btn')
			.addEventListener('click', () => removeCard(user.id))
		sliderWrapper.appendChild(card)
	})
	updateSliderView()
}

// Функция для смены количества карточек
cardsCountSelect.addEventListener('change', e => {
	cardsPerView = parseInt(e.target.value)
	updateSliderView()
})

// Функция для обновления видимых карточек
function updateSliderView() {
	const cardWidth = 100 / cardsPerView
	document.querySelectorAll('.card').forEach(card => {
		card.style.flex = `0 0 ${cardWidth}%`
	})
	updateSliderPosition()
}

// Функция для смены позиции слайдера
function updateSliderPosition() {
	const offset = -currentIndex * (100 / cardsPerView)
	sliderWrapper.style.transform = `translateX(${offset}%)`
}

// Логика кнопок "Next" и "Prev" с бесконечной прокруткой
nextBtn.addEventListener('click', () => {
	if (currentIndex < usersData.length - cardsPerView) {
		currentIndex++
	} else {
		currentIndex = 0 // Возврат к первому слайду
	}
	updateSliderPosition()
})

prevBtn.addEventListener('click', () => {
	if (currentIndex > 0) {
		currentIndex--
	} else {
		currentIndex = usersData.length - cardsPerView // Переход на последний слайд
	}
	updateSliderPosition()
})

// Функция для удаления карточки
function removeCard(userId) {
	usersData = usersData.filter(user => user.id !== userId)
	renderSlider()
	if (currentIndex >= usersData.length - cardsPerView) {
		currentIndex = Math.max(0, usersData.length - cardsPerView)
	}
	updateSliderPosition()
}

// Инициализация слайдера
fetchUsers()
