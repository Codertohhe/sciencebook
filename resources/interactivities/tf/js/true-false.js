var tf = {
  loadQuestions: function () {
    var qHTML = "";
    for (var i = 0; i < questions.length; i++) {
      var q = questions[i];
      qHTML +=
        "<li>" +
        q.title +
        '\
						<div class="ans-drop" data-ans="' +
        q.answer +
        '"> </div>\
					</li>';
    }
    $("#questions-list").html(qHTML);
    this.setDraggable();
    this.setDroppable();
    try {
      document.getElementById("audio-intro").play();
    } catch (err) {}
  },

  setDraggable: function () {
    $(".ans-options li .ans-item").draggable({
      helper: "clone",
      revert: "invalid",
    });
  },

  setDroppable: function () {
    $(".ans-drop").droppable({
      accept: ".ans-item",
      drop: function (event, ui) {
        var txt = ui.draggable.text();
        $(this).html("<span>" + txt + "</span>");
      },
    });
  },

  submitAnswer: function () {
    var score = 0;
    var total = $("#questions-list .ans-drop").length;
    $("#questions-list .ans-drop").each(function (i, e) {
      var answer = $(this).attr("data-ans");
      var user = $(this).text();
      if (answer == user) {
        score++;
        $(this).addClass("text-success");
      } else {
        $(this).addClass("text-danger");
      }
    });
    $("#tf-user-score").html(score);
    $("#tf-total-marks").html(total);
    $(".score").show();
    if (total == score) {
      $("#feedbackModal").modal("show");
      try {
        document.getElementById("audio-clap").play();
      } catch (err) {}
    } else {
      try {
        document.getElementById("audio-try-again").play();
      } catch (err) {}
    }
    $("#btn-submit").off().click(tf.showAnswer).text("Answer");
  },

  showAnswer: function () {
    $("#questions-list .text-success").removeClass("text-success");
    $("#questions-list .text-danger").removeClass("text-danger");
    $("#questions-list .ans-drop").each(function (i, e) {
      var answer = $(this).attr("data-ans");
      $(this).html("<span>" + answer + "</span>");
    });
    $(".ans-item").css("visibility", "hidden");
    $(".score").hide();
  },

  reset: function () {
    $(".score").hide();
    $(".ans-item").css("visibility", "");
    $("#questions-list .text-success").removeClass("text-success");
    $("#questions-list .text-danger").removeClass("text-danger");
    $("#questions-list .ans-drop").text("");
    $("#btn-submit").off().click(tf.submitAnswer).text("Submit");
  },
};
