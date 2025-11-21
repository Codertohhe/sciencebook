var svg = null;

var MTF = {
	PATHS: [],
	DATA: [],
	config: {
		lineColor: "#000",
		correctColor: "#00d200",
		incorrectColor: "#ee001e",
		strokeWidth: 3
	},
	loadQuestions: function() {
		if(questions.col1.length != questions.col2.length) {
			document.body.innerHTML = "Column 1 length does not match with column 2.";
			return false;
		}
		var leftHTML = "";
		var rightHTML = "";
		var col2 = MTF.shuffle(questions.col2.slice());
		for(var i=0; i<questions.col1.length; i++) {
			var rightItemIndex = questions.col2.indexOf(col2[i]);
			leftHTML += '<li><h4>' + questions.col1[i] + '</h4><span id="l' + i + '" class="left-dot"></span></li>';
			rightHTML += '<li><span id="r' + rightItemIndex + '" class="right-dot"></span><h4>' + col2[i] + '</h4> </li>';
		}
		$("#col-right-data").html(rightHTML);
		$("#col-left-data").html(leftHTML);
	    MTF.setDraggable();
	    MTF.setDroppable();
		try {
			document.getElementById('audio-intro').play();
		} catch(err) {}
	},

	setDraggable: function() {
		$(".left-col li .left-dot").draggable({
			helper: "clone",
			revert: "invalid",
			containment: '.mtf-section',
			start: function(event, ui) {
				MTF.config.sourcePos = {
					top: ui.offset.top + parseInt($(this).css('margin-top')),
					left: ui.offset.left + parseInt($(this).css('margin-left'))
				};
				var path = MTF.getLinePath(MTF.config.sourcePos, MTF.config.sourcePos);
				MTF.PATHS.push(svg.path(path).attr({"stroke": MTF.config.lineColor, "stroke-width": MTF.config.strokeWidth}));
			},
			drag: function(event, ui) {
				var pathObj = {
					source: MTF.config.sourcePos,
					dest: ui.helper.offset()
				}
				var path = MTF.getLinePath(pathObj.source, pathObj.dest);
				MTF.PATHS[MTF.PATHS.length-1].attr("path", path);
			},
			revert: function(isValid) {
				if(!isValid) {
					var item = MTF.PATHS.pop();
					item.remove();
				}
			}
		});
	},

	getLinePath: function(item1, item2) {
		var pos = {
			source: item1,
			destination: item2,
			wrapper: $('#mtfcanvas').offset(),
			objX: $(".left-dot").first().width()/2,
			objY: $(".left-dot").first().height()/2
		}
		var result = "M" + (pos.source.left-pos.wrapper.left+pos.objX) + " " + (pos.source.top-pos.wrapper.top+pos.objY) + " L" + (pos.destination.left-pos.wrapper.left+pos.objX) + " " + (pos.destination.top-pos.wrapper.top+pos.objY);
		return result;
	},

	setDroppable: function() {
		$(".right-col li .right-dot").droppable({
			accept: ".left-dot",
			drop: function(event, ui) {

				var pos = {
					source: $(ui.draggable).offset(),
					destination: $(this).offset()
				}

				var path = MTF.getLinePath(pos.source, pos.destination);
				MTF.PATHS[MTF.PATHS.length-1].attr("path", path);
				MTF.DATA.push({left: ui.draggable, right: this});

				$(ui.draggable).draggable("disable");
				$(this).droppable("disable");
			}
		});
	},

	submitAnswer: function() {
		$(".score").show();
		var total = questions.col1.length;
		var score = 0;
		for(var i=0; i<MTF.DATA.length; i++) {
			var lIndex = MTF.DATA[i].left.attr("id").replace("l", "");
			var rIndex = MTF.DATA[i].right.id.replace("r", "");
			var strokeColor = MTF.config.incorrectColor;
			console.log(lIndex, rIndex);
			if(lIndex == rIndex) {
				strokeColor = MTF.config.correctColor;
				score++;
			}
			MTF.PATHS[i].attr("stroke", strokeColor);
		}
		$("#mtf-user-score").html(score);
		$("#mtf-total-marks").html(total);

		if(score == total) {
			$("#feedbackModal").modal('show');
			try { document.getElementById('audio-clap').play(); } catch(err) {}
		}
		$(".left-col li .left-dot").draggable("disable");
		$("#btn-submit").off().click(MTF.showAnswer).text("Answer");
	},

	reset: function() {
		$(".score").hide();
		MTF.loadQuestions();
		for(var i=0; i<MTF.PATHS.length; i++) {
			MTF.PATHS[i].remove();
		}
		MTF.PATHS = [];
		MTF.DATA = [];
		$("#btn-submit").off().click(MTF.submitAnswer).text("Submit");
	},

	showAnswer: function() {
		for(var i=0; i<questions.col1.length; i++) {
			var pos1 = $("#l" + i).offset();
			var pos2 = $("#r" + i).offset();

			var path = MTF.getLinePath(pos1, pos2);
			if(typeof MTF.PATHS[i] == "undefined" || MTF.PATHS[i] == null) {
				MTF.PATHS.push(svg.path(path).attr({"stroke": MTF.config.lineColor, "stroke-width": MTF.config.strokeWidth}));
			} else {
				MTF.PATHS[i].attr("path", path);
				MTF.PATHS[i].attr("stroke", MTF.config.lineColor);
			}
		}
		$(".score").hide();
	},

	shuffle: function(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;

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
	},

	redrawLines: function() {
		for(var i=0; i<MTF.DATA.length; i++) {
			var path = MTF.getLinePath($(MTF.DATA[i].left).offset(), $(MTF.DATA[i].right).offset());
			MTF.PATHS[i].attr("path", path);
		}
	}
}

