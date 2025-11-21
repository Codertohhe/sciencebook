var questionSerial = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

var DND = {
  ANS_LIST: [],
  loadQuestions: function () {
    var qHTML = "";
    DND.ANS_LIST = [];
    var answers = [];
    for (var i = 0; i < questions.length; i++) {
      var q = questions[i];
      qHTML +=
        "<ul><h3>" +
        (i + 1) +
        // questionSerial[i] +
        ". " +
        q.title
          .split("_____")
          .join('<div class="dropHere">--------------------------</div>') +
        "</h3></ul>";
      DND.ANS_LIST.push(...q.answers);
      answers.push(...q.answers);
    }

    var shuffledAns = shuffle(answers);
    var ansHTML = "";
    for (var i = 0; i < shuffledAns.length; i++) {
      ansHTML +=
        '<li><a class="ans-item" href="#">' + shuffledAns[i] + "</a></li>";
    }
    $(".dragndrop-options ul").html(ansHTML);

    $("#questions-list").html(qHTML);
    this.setDraggable();
    this.setDroppable();
    try {
      document.getElementById("audio-intro").play();
    } catch (err) {}
  },

  setDraggable: function () {
    $(".dragndrop-options li .ans-item").draggable({
      revert: "invalid",
    });
  },

  setDroppable: function () {
    $(".dropHere").droppable({
      accept: ".ans-item",
      drop: function (event, ui) {
        var txt = ui.draggable.text();
        ui.draggable.css("visibility", "hidden");
        $(this).html('<div class="dropped-here">' + txt + "</div>");
        $(this).droppable("disable");
      },
    });
  },

  submitAnswer: function () {
    console.log("submit answer");
    $(".dropHere").droppable("disable");
    $(".dragndrop-options li .ans-item").css("visibility", "hidden");
    var score = 0;
    var total = $("#questions-list .dropHere").length;
    var index = 0;
    $("#questions-list .dropHere").each(function (i, e) {
      var answer = DND.ANS_LIST[index];
      var user = $(this).text();
      if (answer == user) {
        score++;
        $(this).addClass("text-success");
      } else {
        $(this).addClass("text-danger");
      }
      index++;
    });
    $("#app-user-score").html(score);
    $("#app-total-score").html(total);
    $(".score").show();
    if (total == score) {
      $("#feedbackModal").modal("show");
      try {
        document.getElementById("audio-clap").play();
      } catch (err) {}
    }
    $("#btn-submit").off().click(DND.showAnswer).text("Answer");
  },

  showAnswer: function () {
    $("#questions-list .text-success").removeClass("text-success");
    $("#questions-list .text-danger").removeClass("text-danger");
    var index = 0;
    $("#questions-list .dropHere").each(function (i, e) {
      var answer = DND.ANS_LIST[index];
      $(this).text(answer).addClass("answer-filled");
      index++;
    });
    $(".ans-item").css("visibility", "hidden");
    $(".score").hide();
  },

  reset: function () {
    $(".score").hide();
    DND.loadQuestions();
    $("#btn-submit").off().click(DND.submitAnswer).text("Submit");
  },
};

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
