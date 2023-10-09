const button = document.querySelector("button.button");
const audioTag = document.getElementById("audio");
const select_item = document.querySelectorAll(".select_item");
const betCount = document.querySelector(".count");
const winInfo = document.querySelector(".win");
const modal = document.querySelector(".modal_container");
const modalText = document.querySelector(".all_win");
let winAmout = 0,
  isInProcess = false;
let amout = 0,
  coast = 1000,
  count = 20;
let items = [];
const id = () => Math.random().toString();
const data = [
  { imgurl: "./img/1.png", coast: 9, id: id() },
  { imgurl: "./img/2.png", coast: 20, id: id() },
  { imgurl: "./img/3.png", coast: 12, id: id() },
  { imgurl: "./img/4.png", coast: 15, id: id() },
  { imgurl: "./img/5.png", coast: 5, id: id() },
  { imgurl: "./img/6.png", coast: 8, id: id() },
  { imgurl: "./img/7.png", coast: 7, id: id() },
  { imgurl: "./img/8.png", coast: 7, id: id() },
  { imgurl: "./img/9.png", coast: 16, id: id() },
  { imgurl: "./img/10.png", coast: 10, id: id() },
  { imgurl: "./img/11.png", coast: 13, id: id() },
  { imgurl: "./img/12.png", coast: 18, id: id() },
];
function changeAmout(selectCount, type = "minus") {
  if (type === "minus") {
    coast = coast - selectCount;
  } else {
    coast = coast + selectCount;
  }

  document.querySelector(".cash").innerHTML = coast;
}
function changeWinAmout(selectCount = 0) {
  winInfo.innerHTML = selectCount;
}

const startAudio = () => {
  let audio = document.createElement("audio");
  audio.id = "audio";
  audio.src = "./audio/win.wav";
  audio.volume = 0.2;
  audio.play();
  document.body.appendChild(audio);
};

const stopAudio = () => {
  const audio = document.getElementById("audio");
  document.body.removeChild(audio);
};

const generateItem = (max = 12, count = 30) => {
  items = [];
  for (let index = 0; index < count; index++) {
    const item = data[Math.floor(Math.random() * max)];
    items.push(item);
  }
  return items;
};
let elementImg = (imgurl) => {
  img = document.createElement("img");
  img.className = "img";
  img.src = imgurl;
  return img;
};
const render = (items) => {
  const container = document.querySelector("div.container");
  container.innerHTML = "";
  isInProcess = false;
  items.forEach(({ imgurl, id }) => {
    const div = document.createElement("div");
    div.className = "container_child";
    div.setAttribute("data-id", id);
    div.append(elementImg(imgurl));
    container.append(div);
  });
};

let doubleRender = (itemsElemnt) => {
  button.disabled = true;
  [...itemsElemnt].forEach((element) => {
    element.classList.remove("animation");
  });
  isInProcess = true;
  new Promise((resolve, reject) => {
    let result = {};
    [...data].forEach((el) => {
      [...items].forEach((elemnt) => {
        if (el.id === elemnt.id) {
          if (!result.hasOwnProperty(el.id)) {
            result[el.id] = [el.id];
          } else {
            result[el.id].push(el.id);
          }
        }
      });
    });
    let winAmoutItems = Object.entries(result)
      .filter((el) => el[1].length > 5)
      .reduce((acum, [key, value]) => {
        const itemCoast = items.find((el) => el.id === key).coast;

        return {
          ...acum,
          [key]: ((value.length * itemCoast) / count) * 100,
        };
      }, {});

    result = Object.keys(result).filter((el) => result[el].length > 5);
    if (!result.length) {
      button.disabled = false;
      stopAudio();
      reject();
    }
    for (const key in winAmoutItems) {
      const element = winAmoutItems[key];
      winAmout += Math.floor(element);
    }
    changeWinAmout(winAmout);
    resolve(result);
  })
    .then((res) => {
      res.forEach((el) => {
        [...itemsElemnt].forEach((element, index) => {
          if (element.getAttribute("data-id") === el) {
            element.querySelector(".img").classList.add("activ");
            element.classList.add("animation");
            startAudio();
          }
        });
      });
      setTimeout(() => {
        res.forEach((el) => {
          [...itemsElemnt].forEach((element, index) => {
            element.classList.remove("animation");
            if (element.getAttribute("data-id") === el) {
              element.innerHTML = "";
              const item = data[Math.floor(Math.random() * 12)];
              items[index] = item;
              element.setAttribute("data-id", item.id);
              element.append(elementImg(item.imgurl));
            }
          });
        });
      }, 1000);

      return true;
    })
    .then(() => {
      setTimeout(() => {
        stopAudio();
        changeWinAmout();
        doubleRender(itemsElemnt);
      }, 1500);
    })
    .catch(() => {
      if (winAmout) {
        changeAmout(winAmout, "plus");
      }
      changeWinAmout();
      isInProcess = false;
      if (winAmout > 3000) {
        modal.classList.add("modal_activ");
        modalText.innerHTML = winAmout;
      }
      winAmout = 0;
      return;
    });
};

const buttonRender = () => {
  const count = +document.querySelector(".count").innerHTML;
  if (coast >= count) {
    render(generateItem());
    const items = document.querySelectorAll(".container_child");
    changeAmout(count);
    doubleRender(items);
  } else {
    alert("No cashe");
  }
};

modal.addEventListener("click", () => {
  modal.classList.remove("modal_activ");
});

button.addEventListener("click", buttonRender);
window.addEventListener("keypress", (e) => {
  if (isInProcess) return;
  if (e.code === "Space") {
    buttonRender();
  }
});
betCount.addEventListener("click", () => {
  betCount.closest(".select_containr").classList.add("activ_select");
});
[...select_item].forEach((element, index) => {
  element.addEventListener("click", () => {
    betCount.setAttribute("data-value", element.getAttribute("data-value"));
    betCount.innerHTML = element.innerHTML;
    betCount.closest(".select_containr").classList.remove("activ_select");
  });
});

render(generateItem());
changeAmout(0);
