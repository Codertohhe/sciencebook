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
var MCQ = {
  loadQuestions: function () {
    var qHTML = "";
    for (var i = 0; i < questions.length; i++) {
      var q = questions[i];
      var opts = this.getOptions(q.opts);
      var ans = q.ans.join(",");
      if (q.opts.length > 3) {
        qHTML +=
          '<li>\
					<div class="quiz_ques" data-ans="' +
          ans +
          '">\
							<h3>' +
          q.title +
          '</h3> \
							<ol type="i" class="flexwrap">' +
          opts +
          "</ol>\
						</div>\
					</li>";
      } else {
        qHTML +=
          '<ul>\
							<div class="quiz_ques" data-ans="' +
          ans +
          '">\
								<h3>' +
          (i + 1 + ". ") +
          // (questionSerial[i] + ". ") +
          q.title +
          '</h3> \
								<ol type="i">' +
          opts +
          "</ol>\
							</div>\
						</ul>";
      }
    }
    $("#questions-list").html(qHTML);
    $("#questions-list .checkbox input").click(function (e) {
      $(this).parents("li").find(".checkbox input").prop("checked", false);
      $(this).prop("checked", true);
    });
    try {
      document.getElementById("audio-intro").play();
    } catch (err) {}
  },

  getOptions: function (opts) {
    var html = "";
    for (var i = 0; i < opts.length; i++) {
      html +=
        '<li><span class="labelwrap checkbox">' +
        opts[i] +
        ' <input type="checkbox" id="option' +
        i +
        '" name="ques' +
        i +
        '"></span></li>';
    }
    return html;
  },

  submitAnswer: function () {
    var score = 0;
    var total = questions.length;
    $("#questions-list .quiz_ques").each(function (i, e) {
      var answer = $(this).attr("data-ans");
      var user = $(this)
        .find("ol li input:checked")
        .map(function (i, e) {
          return $(this).parent().parent().index() + 1;
        })
        .get()
        .join(",");
      if (answer == user) {
        score++;
        $(this).addClass("submit-correct");
      } else {
        $(this).addClass("submit-incorrect");
      }
    });
    $("#total-score").html(score);
    $("#total-marks").html(total);
    $(".score").show();
    if (total == score) {
      $("#feedbackModal").modal("show");
      try {
        document.getElementById("audio-clap").play();
      } catch (err) {}
    }
    $("#btn-submit").off().click(MCQ.showAnswer).text("Answer");
    $("#questions-list input[type='checkbox']").attr("disabled", "disabled");
  },

  showAnswer: function () {
    $("#questions-list .submit-correct").removeClass("submit-correct");
    $("#questions-list .submit-incorrect").removeClass("submit-incorrect");
    $("#questions-list .quiz_ques input").prop("checked", false);
    $("#questions-list .quiz_ques").each(function (i, e) {
      var answer = $(this).attr("data-ans").split(",");
      for (var j = 0; j < answer.length; j++) {
        var id = "#option" + (answer[j] - 1);
        $(this).find(id).prop("checked", true);
      }
    });
    $(".score").hide();
  },

  reset: function () {
    $(".score").hide();
    MCQ.loadQuestions();
    $("#btn-submit").off().click(MCQ.submitAnswer).text("Submit");
  },
};
