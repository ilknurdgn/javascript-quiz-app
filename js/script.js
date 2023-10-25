const startButton = document.querySelector('.start-btn');
const quizBox = document.querySelector('.quiz-box');
const options = document.querySelector('.options');
const optionList = document.querySelectorAll('.option');
const questionCounterText = document.querySelector('.question-counter');
const nextButton = document.querySelector('.next-btn');
const quizText = document.querySelectorAll('.quiz-text');
const text_a = document.querySelectorAll('.text-a');
const text_b = document.querySelectorAll('.text-b');
const text_c = document.querySelectorAll('.text-c');
const text_d = document.querySelectorAll('.text-d');
const finish = document.querySelector('.finish');
const scoreText = document.querySelector('.score-text');
const resultButton = document.querySelector('.result');
const restartButton = document.querySelector('.restart');
const resultPage = document.querySelector('.result-page');

let questionCounter = 0;
let score = 0;

//Event Listeners
startButton.addEventListener('click', showQuiz);

optionList.forEach((option) => {
  option.addEventListener('click', selected);
});

nextButton.addEventListener('click', showQuiz);
resultButton.addEventListener('click', showResult);
restartButton.addEventListener('click', () => {
  questionCounter = 0;
  score = 0;
  finish.style.display = 'none';
  localStorage.removeItem('selectedAnswers');

  showQuiz();
});

function showQuiz(e) {
  if (e.target == restartButton) {
    startButton.style.display = 'block';
  } else {
    quizBox.style.display = 'block';
  }

  if (questionCounter == questions.length) {
    showScore();
  } else if (questionCounter == questions.length - 1) {
    nextButton.innerText = 'Finish';
    loadQuiz();
  } else {
    loadQuiz();
  }
}

function loadQuiz() {
  let currentQuestionData = questions[questionCounter];
  nextButton.style.display = 'none';
  optionList.forEach((option) => {
    option.style.cursor = 'pointer';
    option.style.pointerEvents = 'auto';
    if (option.parentNode.classList.contains('true')) {
      option.parentNode.classList.remove('true');
    } else {
      option.parentNode.classList.remove('false');
    }
  });
  quizText[0].innerText = currentQuestionData.question;
  text_a[0].innerText = currentQuestionData.a;
  text_b[0].innerText = currentQuestionData.b;
  text_c[0].innerText = currentQuestionData.c;
  text_d[0].innerText = currentQuestionData.d;
  questionCounterText.innerText = `${questionCounter + 1}/5`;
}

function selected(e) {
  let selected = e.target.parentNode;
  let currentQuestionData = questions[questionCounter];

  if (selected.id == currentQuestionData.answer) {
    selected.classList.toggle('true');
    score++;
  } else {
    selected.classList.toggle('false');
    optionList.forEach((option) => {
      if (option.parentNode.id == currentQuestionData.answer) {
        option.parentNode.classList.add('true');
      }
    });
  }

  optionList.forEach((option) => {
    option.style.cursor = 'not-allowed';
    option.style.pointerEvents = 'none';
  });

  nextButton.style.display = 'block';
  questionCounter++;
  saveLocal(selected);
}

function showScore() {
  quizBox.style.display = 'none';
  finish.style.display = 'block';
  scoreText.innerHTML = `You've completed the Quiz! <br>You got <b>${score}</b> out of <b>${questions.length}<b/>`;
}

function showResult() {
  resultPage.style.display = 'block';
  let selectedAnswers;
  if (localStorage.getItem('selectedAnswers') === null) {
    selectedAnswers = [];
  } else {
    selectedAnswers = JSON.parse(localStorage.getItem('selectedAnswers'));
  }
  for (let i = 0; i < questions.length; i++) {
    let selectedAnswer = selectedAnswers[i];
    let currentAnswer = questions[i];
    let currectAnswer = currentAnswer.answer;
    const quizDiv = document.createElement('div');
    quizDiv.classList.add('quiz-text');
    resultPage.appendChild(quizDiv);
    quizDiv.innerText = currentAnswer.question;

    const optionsDiv = document.createElement('div');
    optionsDiv.classList.add('options');
    resultPage.appendChild(optionsDiv);
    const optionUl = document.createElement('ul');
    optionsDiv.appendChild(optionUl);
    const letters = 'abcd';
    for (let k = 0; k < letters.length; k++) {
      const optionLi = document.createElement('li');
      optionLi.classList.add('answer');
      optionLi.id = letters[k];
      optionUl.appendChild(optionLi);

      const optionDiv = document.createElement('option');
      optionDiv.classList.add('option');
      optionDiv.innerText = letters[k].toUpperCase();
      optionLi.appendChild(optionDiv);
      const optionP = document.createElement('p');
      optionP.classList.add(`text${k + 1}`);
      optionLi.appendChild(optionP);
      optionP.innerText = currentAnswer[letters[k]];

      optionDiv.style.cursor = 'not-allowed';
      optionDiv.style.pointerEvents = 'none';

      if (selectedAnswer == currectAnswer && currectAnswer == letters[k]) {
        optionLi.classList.add('true');
      } else if (
        selectedAnswer !== currectAnswer &&
        currectAnswer == letters[k]
      ) {
        optionLi.classList.add('true');
      } else if (
        selectedAnswer !== currectAnswer &&
        selectedAnswer == letters[k]
      ) {
        optionLi.classList.add('false');
      }
    }
  }
}

function saveLocal(selected) {
  let selectedAnswers;
  if (localStorage.getItem('selectedAnswers') === null) {
    selectedAnswers = [];
  } else {
    selectedAnswers = JSON.parse(localStorage.getItem('selectedAnswers'));
  }
  selectedAnswers.push(selected.id);

  localStorage.setItem('selectedAnswers', JSON.stringify(selectedAnswers));
}

window.onbeforeunload = () => {
  localStorage.removeItem('selectedAnswers');
};
