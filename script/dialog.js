var knowledge = 
[
    ["Световая волна", "является", "электромагнитной волной"],
    ["Естественный свет", "имеет", "хаотическое изменение угла φ"],
    ["Интенсивность естественного света", "через анализатор", "равна I/2"],
    ["Схема установки", "показана", "на рис. 64.6 (images/64-6.png)"] // Рисунок  
];
let endings = [
    ["ет", "(ет|ут|ют)"],
    ["ут", "(ет|ут|ют)"],
    ["ют", "(ет|ут|ют)"], // 1 спряжение

    ["ит", "(ит|ат|ят)"],
    ["ат", "(ит|ат|ят)"],
    ["ят", "(ит|ат|ят)"], // 2 спряжение

    ["ется", "(ет|ут|ют)ся"],
    ["утся", "(ет|ут|ют|ующие)ся"],
    ["ются", "(ет|ут|ют)ся"], // 1 спряжение, возвратные

    ["ится", "(ит|ат|ят)ся"],
    ["атся", "(ит|ат|ят)ся"],
    ["ятся", "(ит|ат|ят)ся"], // 2 спряжение, возвратные

    ["ящие", "ящие"],
    ["ee", "ee"],
    ["ен", "ен"],
    ["ую", "ую"],
    ["му", "му"],
    ["ма", "ма"],
    ["ена", "ена"],
    ["ено", "ено"],
    ["ены", "ены"], // краткие прилагательные

    ["ан", "ан"],
    ["ая", "ая"],
    ["ана", "ана"],
    ["ано", "ано"],
    ["аны", "аны"], // краткие прилагательные

    ["но", "но"],
    ["на", "на"],

    ["жен", "жен"],
    ["жна", "жна"],
    ["жно", "жно"],
    ["жны", "жны"],

    ["такое", "- это"],
];

var dialogOn = false;

function dialog_window() {
  document.body.innerHTML += "<div id='bg-dim' class='bg-dim'></div>";
  document.body.innerHTML +=
  "<div id='img-zoom' class='img-zoom' onclick='hide()'>" +
  "<img id='zoomed-img' src='' alt='Zoomed Image' />" +
  "</div>";
  document.body.innerHTML +=
    "<div id='dialog' class='dialog'>" +
    "<div class='label' onclick='openDialog()'>Нажми, чтобы спросить!</div>" +
    "<div class='header'>История:</div>" +
    "<div class='history' id='history'></div>" +
    "<div class='question'>" +
    "<input id='Qdialog' placeholder='Введите вопрос'/> <br>" +
    "<button onclick='ask(\"Qdialog\")'>Спросить</button>" +
    "</div>" +
    "</div>";
}

// Функция для затемнения основной страницы
function toggleBackgroundDim(dim) {
  const bgDim = document.getElementById("bg-dim");
  if (dim) {
    bgDim.style.display = "block";
  } else {
    bgDim.style.display = "none";
  }
}

function openDialog() {
  const dialog = document.getElementById("dialog");
  if (dialogOn) {
    $("#dialog").animate({ "margin-left": "0px" }, 1000, function () {
      toggleBackgroundDim(false);
    });
    dialogOn = false;
  } else {
    $("#dialog").animate({ "margin-left": "-1100px" }, 1000, function () {
      toggleBackgroundDim(true);
    });
    dialogOn = true;
  }
}
function ask(questionInput) {
  var question = document.getElementById(questionInput).value;
  if (!question.trim()) return;

  var newDiv = document.createElement("div");
  newDiv.className = "question";
  newDiv.innerHTML = "Вопрос: " + question;
  document.getElementById("history").appendChild(newDiv);

  newDiv = document.createElement("div");
  newDiv.className = "answer";
  newDiv.innerHTML = "Ответ: " + getAnswer(question);
  document.getElementById("history").appendChild(newDiv); 

  document.getElementById("history").scrollTop =
    document.getElementById("history").scrollHeight;

  document.getElementById(questionInput).value = "";
}

function getEndingIndex(word) {
  for (let i = 0; i < endings.length; i++) {
    if (word.substring(word.length - endings[i][0].length) == endings[i][0])
      return i;
  }
  return -1;
}

function firstSymbolToLowerCase(str) {
  return str.substring(0, 1).toLowerCase() + str.substring(1);
}

function firstSymbolToUpperCase(str) {
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}

// Функция для увеличения изображения
function zoom(src) {
  const zoomedImg = document.getElementById("zoomed-img");
  zoomedImg.src = src;
  const imgZoom = document.getElementById("img-zoom");
  imgZoom.style.display = "block";
}

// Функция для скрытия увеличенного изображения
function hide() {
  const imgZoom = document.getElementById("img-zoom");
  imgZoom.style.display = "none";
}

function addImageToHistory(src) {
  const imgDiv = document.createElement("div");
  imgDiv.className = "image";

  const img = document.createElement("img");
  img.src = src;
  img.alt = "Рисунок";
  img.style.maxWidth = "100%";
  img.style.cursor = "pointer";

  img.onclick = function () {
    zoom(src);
  };

  imgDiv.appendChild(img);
  document.getElementById("history").appendChild(imgDiv);
}

function getAnswer(question) {
  let separators = "'\",.!?()[]\\/";
  for (let i = 0; i < separators.length; i++)
    question = question.replace(separators[i], " " + separators[i]);

  let words = question.split(" ");

  for (let i = 0; i < words.length; i++)
    words[i] = firstSymbolToLowerCase(words[i]);

  let result = false;
  let answer = "";

  for (let i = 0; i < words.length; i++) {
    let ending = getEndingIndex(words[i]);

    if (ending >= 0) {
      words[i] =
        words[i].substring(0, words[i].length - endings[ending][0].length) +
        endings[ending][1];

      let predicate = new RegExp(".*" + words[i] + ".*");

      if (endings[ending][0] == endings[ending][1]) {
        predicate = new RegExp(".*" + words[i] + " " + words[i + 1] + ".*");
        i++;
      }

      let subjectReg = words.slice(i + 1).join(".*");

      if (subjectReg.length > 0) {
        let subject = new RegExp(".*" + subjectReg + ".*");

        for (let j = 0; j < knowledge.length; j++) {
          if (
            predicate.test(knowledge[j][1].toLowerCase()) &&
            (subject.test(knowledge[j][0].toLowerCase()) ||
              subject.test(knowledge[j][2].toLowerCase()))
          ) {
            let response = firstSymbolToUpperCase(
              knowledge[j][0] +
                " " +
                knowledge[j][1] +
                " " +
                knowledge[j][2]
            );

            const match = response.match(/\(images\/(.+?)\)/);
            if (match) {
              const imgSrc = match[0].slice(1, -1);
              response = response.replace(match[0], "");
              addImageToHistory(imgSrc);
            }

            answer += response;
            result = true;
          }
        }

        if (!result) {
          for (let j = 0; j < knowledge.length; j++) {
            if (
              subject.test(
                knowledge[j][0].toLowerCase() ||
                  subject.test(knowledge[j][2].toLowerCase())
              )
            ) {
              let response = firstSymbolToUpperCase(
                knowledge[j][0] +
                  " " +
                  knowledge[j][1] +
                  " " +
                  knowledge[j][2]
              );

              const match = response.match(/\(images\/(.+?)\)/);
              if (match) {
                const imgSrc = match[0].slice(1, -1);
                response = response.replace(match[0], "");
                addImageToHistory(imgSrc);
              }

              answer += response;
              result = true;
              break;
            }
          }
        }
      }
    }
  }

  if (!result) answer = "Ответ не найден";
  return answer;
}

dialog_window();
