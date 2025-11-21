/*
 * Author: Ashok Shah
 * https://www.shahnashok.com
 * Last Updated: 28/09/2018
 */

const MAX_WORDS = 25;
const HIGLIGHT_LIST = appdb.config.id + "_list";
const HIGLIGHT_KEYWORD = appdb.config.id + "_highlight_";
const NOTE_KEYWORD = appdb.config.id + "_note_";
const AUDIO_KEYWORD = appdb.config.id + "_audio_";
const LAST_PAGE = appdb.config.id + "_LAST_PAGE";
const LAST_CANVAS = appdb.config.id + "_LAST_CANVAS";
const LAST_MODE = appdb.config.id + "_LAST_MODE";
var audioChunks = [];
var isNodeApp = false;
var videoTimeout = 2000;

var firstInitalization = true;
var eBookConfig = {
	total: appdb.config.totalPages,
	current: 1,
	mode: "double",
	pages: 1,
	currentPages: [1],
	music: true,
	minZoom: 1,
	maxZoom: 2,
	zoomDiff: 0.2,
	zoom: 1,
	recorder: true,
	paintApp: true,
};

if (typeof nw == "object") isNodeApp = true;
if (isNodeApp) {
	window.fs = require("fs");
}

var blobToBase64 = function (blob, cb) {
	var reader = new FileReader();
	reader.onload = function () {
		var dataUrl = reader.result;
		var base64 = dataUrl.split(",")[1];
		cb(base64);
	};
	reader.readAsDataURL(blob);
};

var readerApp = {
	setFancyBoxIframe: function () {
		if (PRODUCTION_MODE == false) return;
		var _this = this;
		$(".iframe-fancybox").fancybox({
			beforeLoad: function (instance, slide) {
				if (
					window.fancyboxURL != undefined &&
					window.fancyboxURL != null &&
					window.fancyboxURL != ""
				) {
					slide.src = window.fancyboxURL;
					window.fancyboxURL = "";
				}
			},
			afterLoad: function (instance, slide) {
				if (eBookConfig.music == true) {
					_this.toggleMusic();
				}
				stopAudio();
				if (
					window.fancyboxSize != undefined &&
					window.fancyboxSize != null &&
					window.fancyboxSize != ""
				) {
					var iSize = window.fancyboxSize.split("x");
					$(".fancybox-content").animate(
						{
							height: iSize[1] + "px",
							width: iSize[0] + "px",
						},
						10
					);
					window.fancyboxSize = "";
				} else {
					var height = instance.current.opts.width;
					var width = instance.current.opts.height;
					console.log(width, height);
					$(".fancybox-content").animate(
						{
							height: height + "px",
							width: width + "px",
						},
						10
					);
				}
			},
		});
	},

	setFancyBoxVideo: function () {
		var _this = this;

		$(".video-fancybox").click(function (e) {
			e.preventDefault();

			if (eBookConfig.music == true) {
				_this.toggleMusic();
			}
			stopAudio();

			var fancyVidDim = {
				// width: "637px",
				// height: "479px",
				width: "100%",
				height: "60%",
			};
			if (
				window.fancyboxSize != undefined &&
				window.fancyboxSize != null &&
				window.fancyboxSize != ""
			) {
				var iSize = window.fancyboxSize.split("x");
				//fancyVidDim.width = (parseInt(iSize[0]) + 150) + 'px';
				//fancyVidDim.height = (parseInt(iSize[1]) + 250) + 'px';
				window.fancyboxSize = "";
			}
			//$("#popupVideo").css({width: fancyVidDim.width, height: fancyVidDim.height});

			var videoSource = {
				chrome: {
					src: $(this).attr("data-video-mp4"),
					type: "video/ogg",
				},
			};

			$("#video-container").html(
				'<div id="jp_container_1" class="jp-video jp-video-480p" role="application" aria-label="media player"><div class="jp-type-single"><div id="jquery_jplayer_1" class="jp-jplayer"></div><div class="jp-gui"><div class="jp-video-play"><button class="jp-video-play-icon" role="button" tabindex="0">play</button></div><div class="jp-interface"><div class="jp-progress"><div class="jp-seek-bar"><div class="jp-play-bar"></div></div></div><div class="jp-current-time" role="timer" aria-label="time">&nbsp;</div><div class="jp-duration" role="timer" aria-label="duration">&nbsp;</div><div class="jp-controls-holder"><div class="jp-controls"><button class="jp-play" role="button" tabindex="0">play</button><button class="jp-stop" role="button" tabindex="0">stop</button></div><div class="jp-volume-controls"><button class="jp-mute" role="button" tabindex="0">mute</button><button class="jp-volume-max" role="button" tabindex="0">max volume</button><div class="jp-volume-bar"><div class="jp-volume-bar-value"></div></div></div><div class="jp-toggles"><button class="jp-full-screen" role="button" tabindex="0">full screen</button></div></div></div></div><div class="jp-no-solution"><span>Uh oh! Video not supported.</span></div></div></div>'
			);

			if (
				window.fancyboxURL != undefined &&
				window.fancyboxURL != null &&
				window.fancyboxURL != ""
			) {
				videoSource.chrome.src = window.fancyboxURL;
				window.fancyboxURL = "";
			}
			$("#jquery_jplayer_1").jPlayer({
				ready: function () {
					console.log("Video dependency loaded.");

					$("#jquery_jplayer_1").jPlayer("setMedia", {
						title: "",
						m4v: videoSource.chrome.src,
					});
					console.log(videoSource.chrome.src);

					setTimeout(function () {
						$("#jquery_jplayer_1").jPlayer("play", 0);
					}, 400);
				},
				swfPath: "js/plugins/jPlayer-2.9.2/jplayer",
				supplied: "m4v",
				size: {
					width: fancyVidDim.width,
					height: fancyVidDim.height,
					// cssClass: "jp-video-360p",
					cssClass: "jp-video-480p",
				},
				useStateClassSkin: true,
				autoBlur: false,
				smoothPlayBar: true,
				keyEnabled: true,
				remainingDuration: true,
				toggleDuration: true,
			});

			/*
			var video = videojs("animation-video");
			video.autoplay(true);
			video.src([videoSource.chrome]);
			setTimeout(function() {
				video.load();
			}, 400);
			*/

			$.fancybox.open({
				src: "#popupVideo",
				type: "inline",
				opts: {
					beforeOpen: function () {},

					afterClose: function () {
						//var video = videojs("animation-video");
						//video.pause();
						$("#jquery_jplayer_1").jPlayer("pause", 0);
					},
				},
			});
		});
	},

	prepareMenu: function () {
		var menuListHTML = "";
		for (var key in appdb.ebook) {
			var groupism = key;
			if (key != "zother") {
				var mItem = appdb.ebook[key];
				var menuSubHead =
					'<a href="#"><i class="fa ' +
					mItem.icon +
					'"></i> <span class="nav-label">' +
					mItem.menu +
					'</span> <span class="fa arrow"></span></a>';
				var menuSubHTML = "";
				for (var i = 0; i < mItem.data.length; i++) {
					var item = mItem["data"][i];

					var linkHref = "";
					var classList = "";
					var isSameChapter = false;
					var closeMenu = false;
					if (mItem["link"] == "iframe") {
						var isPage =
							typeof item["page"] == "undefined" ? null : item["page"];
						var onClick = "";
						if (isPage != null) {
							onClick = "onClick=readerApp.turnPage(" + item["page"] + ") ";
						}
						var size = item["size"].split("x");
						linkHref =
							onClick +
							'data-fancybox="' +
							groupism +
							'" data-type="iframe" data-height="' +
							size[0] +
							'" data-width="' +
							size[1] +
							'" data-src="' +
							item["path"] +
							'" data-fancysize="' +
							item["size"] +
							'"';
						classList = "iframe-fancybox";
					} else if (mItem["link"] == "video") {
						var isPage =
							typeof item["page"] == "undefined" ? null : item["page"];
						var currChapter = item["chapter"];

						var chapter_menu = `<li class=""><a href="#"><i class="fa fa-video-camera"></i> <span class="nav-label">${currChapter}</span> <span class="fa arrow"></span></a><ul class="nav nav-second-level collapse" aria-expanded="false" style="height: 0px;">`;

						if (i != 0) {
							isSameChapter =
								mItem["data"][i - 1]["chapter"] === currChapter ? true : false;
						}

						if (i != mItem.data.length - 1) {
							closeMenu =
								mItem["data"][i + 1]["chapter"] === currChapter ? false : true;
						} else if (i == mItem.data.length - 1) {
							closeMenu = true;
						}

						var onClick = "onClick=\"openVideo('" + item["path"] + "')\"";
						if (isPage != null) {
							onClick = "onClick=readerApp.turnPage(" + item["page"] + ") ";
						}
						linkHref =
							onClick +
							'data-video-mp4="' +
							item["path"] +
							'" data-src="#popupVideo"';
						classList = "video-fancybox";
					} else if (mItem["link"] == "content") {
						linkHref =
							'data-page="' +
							item["page"] +
							'" onClick="readerApp.turnPage(' +
							item["page"] +
							')"';
						classList = "ebook-toc";
					} else if (mItem["link"] == "external") {
						linkHref = "onClick=\"readerApp.openLink('" + item["path"] + "')\"";
						classList = "external-link";
					}

					menuSubHTML +=
						!isSameChapter && mItem["link"] == "video" ? chapter_menu : "";
					// if (mItem["link"] == "video")
					menuSubHTML +=
						"<li><a " +
						linkHref +
						' class="' +
						classList +
						'" href="javascript:void(0)">' +
						item["title"] +
						"</a></li>";
					// }
					menuSubHTML +=
						closeMenu && mItem["link"] == "video" ? "</ul></li>" : "";
				}

				menuListHTML +=
					"<li>" +
					menuSubHead +
					'<ul class="nav nav-second-level">' +
					menuSubHTML +
					"</ul>" +
					"</li>";
			}
		}

		for (var i = 0; i < appdb.ebook["zother"].length; i++) {
			var item = appdb.ebook["zother"][i];

			var linkHref = "";
			var classList = "";
			if (item["link"] == "iframe") {
				linkHref =
					'data-fancybox data-src="' +
					item["path"] +
					'" data-fancysize="' +
					item["size"] +
					'"';
				classList = "iframe-fancybox";
			}

			menuListHTML +=
				"<li><a " +
				linkHref +
				' class="' +
				classList +
				'" href="javascript:void(0)"><i class="fa ' +
				item["icon"] +
				'"></i> <span class="nav-label">' +
				item["title"] +
				"</span> </a></li>";
		}

		$("#side-menu-wrapper").html(
			'<ul class="nav" id="side-menu">' + menuListHTML + "</ul>"
		);
		$("#side-menu").metisMenu(); //MetsiMenu

		$("#side-menu > li:first-child > a").trigger("click");

		$("#side-menu-wrapper [data-fancysize]").click(function (e) {
			window.fancyboxSize = this.getAttribute("data-fancysize");
		});
	},

	openLink: function (url) {
		window.open(url, "_blank");
		return false;
	},

	turnPageHelper: function (pages) {
		$("#book").turn("page", pageNum);
	},

	flipNext: function () {
		$("#book").turn("next");
	},

	flipPrev: function () {
		$("#book").turn("previous");
	},

	navigatePage: function (e) {
		$("#alert-009").addClass("hide");
		var keyCode = window.event ? e.which : e.keyCode;
		if (keyCode == 13) {
			var newPage = $("#pageSearch").val();

			if (!isNaN(newPage)) {
				if (newPage < eBookConfig.total + 1 && eBookConfig.total > 0) {
					//this.turnPage(newPage);
					var pageNumNew = parseInt(newPage) + appdb.config.prePages.length;

					$("#music_controls_off").hide();
					$("#music_controls_on").show();
					soundManager.getSoundById("bgMusicRunning").stop();

					$("#book").turn("page", pageNumNew);
					$("#pageSearch").blur();
				} else {
					$("#alert-009")
						.removeClass("hide")
						.find(".alert")
						.text(
							"Please enter page number between 1 and " + eBookConfig.total
						);

					setTimeout(function () {
						$("#alert-009").addClass("hide");
					}, 3000);
				}
			} else {
				$("#alert-009")
					.removeClass("hide")
					.find(".alert")
					.text("Please enter valid number.");

				setTimeout(function () {
					$("#alert-009").addClass("hide");
				}, 3000);
			}
		}
	},

	getCurrentPage: function () {
		var page = $("#book").turn("view");
		if (page[0] == 0) {
			return [1];
		} else {
			return page;
		}
	},

	clearPagi: function () {
		$("#pageSearch").val("");
	},

	turnPage: function (pageNum) {
		// $("#book").turn("page", pageNum);
		// Need to add 2 for pre pages
		$("#book").turn("page", pageNum + 2);
	},

	/**
	 * Open two pages side-by-side (double page view).
	 * Accepts logical page numbers (1-based excluding prePages), like readerApp.turnPage.
	 * Example: readerApp.openTwoPages(4,5) will open pages 4 and 5 in double mode.
	 */
	openTwoPages: function (pageA, pageB) {
		if (isNaN(pageA) || isNaN(pageB)) return false;
		var left = Math.min(parseInt(pageA, 10), parseInt(pageB, 10));
		// convert to actual page index including prePages
		var actual = left + appdb.config.prePages.length;

		// ensure book is in double display mode
		try {
			$("#book").turn("display", "double");
			eBookConfig.mode = "double";
			// navigate to the left page of the spread
			$("#book").turn("page", actual);
			// update UI and sizing
			resizeBook();
			// show correct toggle icons: show "multi on" (double) and hide "multi off" (single)
			$("#toggle_multi_on").show();
			$("#toggle_multi_off").hide();
			this.setPageNumBack();
			return true;
		} catch (e) {
			console.error("openTwoPages error:", e);
			return false;
		}
	},

	invalidPage: function (pageNum) {
		if (pageNum > 0 && pageNum <= eBookConfig.total) {
			return false;
		} else {
			return true;
		}
	},

	setPageNumBack: function () {
		var currentPages = $("#book").turn("view");
		var currentPage = currentPages.join("-");
		if (currentPage == "0-1") {
			currentPage = "1";
		}

		if (currentPage.indexOf("-0") != -1) {
			currentPage = currentPage.replace("-0", "");
		}
		setStorage(LAST_PAGE, currentPage.split("-")[0]);
		// $("#pageSearch").val(currentPage);
		readerApp.setPage(currentPage);
		eBookConfig.current = currentPages[0];
		if (eBookConfig.current == 0) eBookConfig.current = 1;
		for (var i = 0; i < currentPages.length; i++) {
			console.log(currentPages[i]);
			getNotes(currentPages[i]);
		}
		readerApp.bookmark.presentui();
		closeAllPannels();
	},

	setPage: function (pageNum) {
		var pageNums = pageNum.split("-");
		var pageName = [];
		for (var i = 0; i < pageNums.length; i++) {
			var pg = pageNums[i];
			if (pg <= appdb.config.prePages.length) {
				pageName.push(appdb.config.prePages[pg - 1].pageName);
			} else {
				pageName.push(pg - appdb.config.prePages.length);
			}
		}

		$("#pageSearch").val(pageName.join("-"));
	},

	bookmark: {
		get: function () {
			var bookmarksList = [];
			var items = readerApp.storage.get(appdb.config.id + "_bookmark");
			if (items != undefined && items != null && items != "") {
				bookmarksList = JSON.parse(items);
			}
			return bookmarksList;
		},

		add: function () {
			$("#takeBookmark").addClass("booked");
			var bookmarksList = readerApp.bookmark.get();
			var currentPage = $("#book").turn("view")[0];

			var bookmarkIndex = bookmarksList.indexOf(currentPage);

			if (bookmarkIndex == -1) {
				bookmarksList.push(currentPage);
				bookmarksList.sort(function (a, b) {
					return a - b;
				});
				readerApp.storage.set(
					appdb.config.id + "_bookmark",
					JSON.stringify(bookmarksList)
				);
			}

			readerApp.bookmark.initialize();
		},

		remove: function () {
			$("#takeBookmark").removeClass("booked");
			var bookmarksList = readerApp.bookmark.get();
			var currentPage = $("#book").turn("view")[0];
			var bookmarkIndex = bookmarksList.indexOf(currentPage);
			if (bookmarkIndex == -1) {
				console.log("Error! Bookmark not available.");
			} else {
				bookmarksList.splice(bookmarkIndex, 1);
				if (bookmarksList.length == 0) {
					readerApp.storage.del(appdb.config.id + "_bookmark");
				} else {
					bookmarksList.sort(function (a, b) {
						return a - b;
					});
					readerApp.storage.set(
						appdb.config.id + "_bookmark",
						JSON.stringify(bookmarksList)
					);
				}
			}

			readerApp.bookmark.initialize();
		},

		removeSpecific: function (pageNumber) {
			var bookmarksList = readerApp.bookmark.get();
			var bookmarkIndex = bookmarksList.indexOf(pageNumber);
			if (bookmarkIndex !== -1) {
				bookmarksList.splice(bookmarkIndex, 1);
				if (bookmarksList.length == 0) {
					readerApp.storage.del(appdb.config.id + "_bookmark");
				} else {
					bookmarksList.sort(function (a, b) {
						return a - b;
					});
					readerApp.storage.set(
						appdb.config.id + "_bookmark",
						JSON.stringify(bookmarksList)
					);
				}
				readerApp.bookmark.initialize();
				// Update the bookmark icon if current page bookmark was removed
				readerApp.bookmark.presentui();
			}
		},

		action: function () {
			if ($("#takeBookmark").hasClass("booked")) {
				this.remove();
			} else {
				this.add();
			}
		},

		presentui: function () {
			var bookmarksList = readerApp.bookmark.get();
			var currentPages = $("#book").turn("view");

			$("#takeBookmark").removeClass("booked");
			for (var i = 0; i < currentPages.length; i++) {
				if (bookmarksList.indexOf(currentPages[i]) != -1) {
					$("#takeBookmark").addClass("booked");
				}
			}
		},

		initialize: function () {
			var bookmarksList = readerApp.bookmark.get();
			bookmarksList.sort(function (a, b) {
				return a - b;
			});
			var $container = $("#bookmark-container");
			if (bookmarksList.length == 0) {
				$container.html(
					'<li>\
					<div class="text-center link-block">\
						<strong>No Bookmarks Yet.</strong>\
						<i class="fa fa-angle-right"></i>\
					</div>\
				</li>'
				);
			} else {
				var bookingHTML = "";
				for (var i = 0; i < bookmarksList.length; i++) {
					bookingHTML +=
						'<li style="display: flex; justify-content: space-between; align-items: center;">\
                            <a href="#" onClick="readerApp.turnPage(' +
						(bookmarksList[i] - appdb.config.prePages.length) +
						')" style="flex-grow: 1;">\
                                <div>\
                                    <i class="fa fa-chevron-right fa-fw"></i> Page ' +
						(bookmarksList[i] - appdb.config.prePages.length) +
						"\
                                </div>\
                            </a>\
                            <button onclick=\"readerApp.bookmark.removeSpecific(" + bookmarksList[i] + ")\" class=\"btn btn-xs btn-danger\" style=\"margin-left: 10px; padding: 2px 6px;\" title=\"Delete bookmark\">\
                                <i class=\"fa fa-trash\"></i>\
                            </button>\
                        </li>";
				}
				$container.html(bookingHTML);
				$("#bookmark-container li:eq(0)").before("<h4>Bookmarks</h4>");
			}
			$("#total-bookmarks").text(bookmarksList.length);
			this.presentui();
		},
	},

	storage: {
		get: function (key) {
			if (localStorageSupport()) {
				return window.localStorage.getItem(key);
			} else {
				return store.get(key);
				// return window.sessionStorage.getItem(key);
			}
		},

		set: function (key, value) {
			if (localStorageSupport()) {
				window.localStorage.setItem(key, value);
			} else {
				store.set(key, value);
				// window.sessionStorage.setItem(key, value);
			}
		},

		del: function (key) {
			if (localStorageSupport()) {
				window.localStorage.removeItem(key);
			} else {
				store.remove(key);
				// window.sessionStorage.removeItem(key);
			}
		},
	},

	spotight: {
		init: function () {
			$(".searchlight")
				.on("mousemove", function (event) {
					$(this)
						.addClass("on")
						.css({
							"margin-left": event.pageX - 150,
							"margin-top": event.pageY - 150,
						});
				})
				.on("mouseout", function (event) {
					$(this).removeClass("on");
				})
				.on("click", function () {
					$(this).fadeOut(function () {
						$(this).remove();
					});
				});
		},

		activate: function (width, height) {
			console.log(width, height);
			$("#spotlight-selection-menu").modal("hide");
			if ($("#spotlight-section").length) {
				$("#spotlight-section").remove();
			} else {
				$("body").append(
					'<div style="height: ' +
						height +
						"px; width: " +
						width +
						'px;" class="searchlight" id="spotlight-section"></div>'
				);
				this.init();
			}
		},
	},

	zoom: {
		resizeBook: function () {
			resizeBook();
		},

		max: function () {
			if (eBookConfig.zoom + eBookConfig.zoomDiff <= eBookConfig.maxZoom) {
				eBookConfig.zoom += eBookConfig.zoomDiff;
				zoomBook(eBookConfig.zoom);
			}
		},

		min: function () {
			if (eBookConfig.zoom - eBookConfig.zoomDiff >= eBookConfig.minZoom) {
				eBookConfig.zoom += -eBookConfig.zoomDiff;
				zoomBook(eBookConfig.zoom);
			}
		},
	},

	getHighlights: function () {
		var $highlightContainer = $("#highlights-containers");
		$highlightContainer.empty();

		var highlightPage = getStorage(HIGLIGHT_LIST);
		if (
			highlightPage != null &&
			highlightPage != undefined &&
			highlightPage != ""
		) {
			//console.log(highlightPage);
			var dataObj = JSON.parse(highlightPage);

			for (var i = 0; i < dataObj.length; i++) {
				$highlightContainer.append(
					'<li>\
					<a href="#" onClick="readerApp.turnPage(' +
						(parseInt(dataObj[i]) - appdb.config.prePages.length) +
						')">\
						<div>\
							<i class="fa fa-chevron-right fa-fw"></i> <b>Page ' +
						(parseInt(dataObj[i]) - appdb.config.prePages.length) +
						"</b> \
						</div>\
					</a>\
				</li>"
				);
			}
		}

		var totalHighlights = $("#highlights-containers > li").length;
		$("#total-highlights").text(totalHighlights);
		if (totalHighlights == 0) {
			$("#highlights-containers").html(
				'<li>\
					<div class="text-center link-block">\
						<strong>No Highlights Yet.</strong>\
						<i class="fa fa-angle-right"></i>\
					</div>\
				</li>'
			);
		}
	},

	prepareNoteAdd: function (_self) {
		$("#textarea-note").val("");
		var pages = this.getCurrentPage();
		var selectHTML = "";
		for (var i = 0; i < pages.length; i++) {
			selectHTML +=
				'<option value="' +
				pages[i] +
				'">Page ' +
				(parseInt(pages[i]) - appdb.config.prePages.length) +
				"</option>";
		}
		$(_self).find(".pages-list-inner").html(selectHTML);
	},

	saveNote: function () {
		$("#notes-validation").addClass("hide");
		var pageNum = $("#notes-pages").val();
		var notesval = $.trim($("#textarea-note").val());
		if (notesval == "") {
			$("#notes-validation").removeClass("hide");
			return false;
		}

		var localkey = NOTE_KEYWORD + pageNum;
		var localData = getStorage(localkey);

		var notesData = [];
		if (localData != undefined && localData != null) {
			notesData = JSON.parse(localData);
		}

		var noteObj = {
			title: notesval,
			posX: 50,
			posY: 50,
			page: pageNum,
			timestamp: moment().unix(),
		};

		notesData.push(noteObj);
		setStorage(localkey, JSON.stringify(notesData));
		$("#notes-addition").modal("hide");
		this.reloadNotes();
		getNotes(pageNum);
	},

	reloadNotes: function () {
		$("#notes-containers").empty();
		var i = 1;
		while (i <= eBookConfig.total + appdb.config.prePages.length) {
			var checkUnique = new Array();
			var notesData = getStorage(NOTE_KEYWORD + i);
			if (notesData != null) {
				myNote = JSON.parse(notesData);
				var textOnly = "";
				for (j = 0; j < myNote.length; j++) {
					var textOnly = myNote[j].title;

					if (textOnly.length > MAX_WORDS)
						textOnly = textOnly.substr(0, MAX_WORDS) + "...";

					$("#notes-containers").append(
						'<li>\
                            <a href="#" onClick="readerApp.turnPage(' +
							(i - appdb.config.prePages.length) +
							')">\
                                <div>\
                                    <i class="fa fa-chevron-right fa-fw"></i> <b>Page ' +
							(i - appdb.config.prePages.length) +
							"</b> " +
							textOnly +
							"\
                                </div>\
                            </a>\
                        </li>"
					);
				}
			}
			i++;
		}

		$("#notes-containers li:eq(0)").before("<h4>Notes</h4>");

		var totalNotes = $("#notes-containers > li").length;
		$("#total-notes").text(totalNotes);
		if (totalNotes == 0) {
			$("#notes-containers").html(
				'<li>\
					<div class="text-center link-block">\
						<strong>No Notes Yet.</strong>\
						<i class="fa fa-angle-right"></i>\
					</div>\
				</li>'
			);
		}
	},

	initMusic: function () {
		var _this = this;
		soundManager.setup({
			url: "js/plugins/soundmanagerv297a-20150601/swf/",
			flashVersion: 9, // optional: shiny features (default = 8)
			// optional: ignore Flash where possible, use 100% HTML5 mode
			preferFlash: false,
			onready: function () {
				_this.bgMusicOn();
			},
		});
	},

	bgMusicOn: function () {
		var bgSoundMusic = soundManager.createSound({
			id: "bgMusicRunning",
			url: "audio/background.mp3",
			useFlashBlock: false,
			autoLoad: true,
			autoPlay: true,
			onfinish: function () {
				bgSoundMusic.play();
			},
		});
	},

	toggleMusic: function () {
		if (eBookConfig.music == true) {
			$("#music_controls_off").hide();
			$("#music_controls_on").show();
			soundManager.getSoundById("bgMusicRunning").stop();
		} else {
			$("#music_controls_on").hide();
			$("#music_controls_off").show();
			soundManager.getSoundById("bgMusicRunning").play();
		}
		eBookConfig.music = !eBookConfig.music;
	},

	toggleBookMode: function () {
		var bookMode = $("#book").turn("display");
		var label;
		if (bookMode == "single") {
			$("#book").turn("display", "double");
			eBookConfig.mode = "double";
		} else {
			$("#book").turn("display", "single");
			eBookConfig.mode = "single";
		}
		resizeBook();
		$("#toggle_multi_on").toggle();
		$("#toggle_multi_off").toggle();
		this.setPageNumBack();
	},

	closeAudio: function () {
		$("#record-audio").fadeOut();
	},

	showAudioPanel: function () {
		closeAllPannels("#record-audio");
		$("#record-audio").show();

		var ele = document.getElementById("record-audio");
		readerApp.prepareNoteAdd(ele);
		if (firstInitalization) {
			firstInitalization = false;
			readerApp.initAudioRecorder();
		}
		if (eBookConfig.music == true) {
			readerApp.toggleMusic();
		}
		stopAudio();
	},

	initAudioRecorder: function () {
		if (
			navigator.mediaDevices == null ||
			navigator.mediaDevices == undefined ||
			navigator.mediaDevices == ""
		) {
			$("#recorder-support").removeClass("hide");
			return false;
		}

		if (eBookConfig.recorder) {
			$("#recorder-info").removeClass("hide");

			navigator.mediaDevices
				.getUserMedia({ audio: true })
				.then((stream) => {
					rec = new MediaRecorder(stream);
					$("#recorder-info").addClass("hide");
					$("#recorder-area").removeClass("hide");
					rec.ondataavailable = (e) => {
						audioChunks.push(e.data);
						if (rec.state == "inactive") {
							var blob = new Blob(audioChunks, { type: "audio/x-mpeg-3" });
							var recordedAudio = document.getElementById("recordedAudio");

							var aud = document.createElement("audio");
							aud.src = URL.createObjectURL(blob);
							aud.controls = true;
							console.log(aud);
							//$("#record-list").append(aud);

							var currentPage = $("#record-pages-list option:selected").text();
							var newId = "recorditem-" + $("#record-list tr").length;
							$("#record-list").append(
								"<tr><td>" +
									currentPage +
									'</td></tr><tr><td id="' +
									newId +
									'"></td></tr>'
							);
							$("#" + newId).append(aud);

							$("#no-recording-info").hide();
							$("#total-recordings").text($("#record-list audio").length);
							if (isNodeApp) {
								blobToBase64(blob, function (base64) {
									// encode
									var buf = new Buffer(base64, "base64"); // decode
									var filename = moment().unix() + ".wav";
									var audiopath = "data/content/resources/records/";
									fs.writeFile(audiopath + filename, buf, function (err) {
										if (err) {
											console.log("err", err);
										} else {
											console.log({ status: "success" });
										}
									});

									saveAudioInStorage(
										audiopath + filename,
										filename,
										$("#record-pages-list option:selected").val()
									);
								});
							}

							/*
						audioDownload.href = recordedAudio.src;
						audioDownload.download = 'mp3';
						audioDownload.innerHTML = 'download';
						*/
						}
					};
				})
				.catch((e) => console.log(e));
			eBookConfig.recorder = false;
		}
	},

	searchContent: function () {
		var searchValue = $("#top-search").val();
		if (searchValue == "") return false;

		$("#search-box iframe").attr("src", "search.html?q=" + searchValue);
		closeAllPannels("#search-box");
		$("#search-box").removeClass("hide").show();
		var ifrHeight = $("#search-box .search-wrapper").height();
		$("#search-box iframe").css("height", ifrHeight + "px");

		return false;
	},

	closeSearch: function () {
		$("#search-box").addClass("hide");
		$("#top-search").val("");
	},

	setBookFrameSize: function () {
		var $container = $("#book-viewport");

		var win = $(window).height();
		var header = $("#topbar-section").height();
		var footer = $("#app-footer").height();
		var padding = 80;

		var frameHeight = win - header - footer - padding;
		var frameWidth = $container.width();

		$container.css({
			width: frameWidth + "px",
			height: frameHeight + "px",
		});
	},

	init: function () {
		this.prepareMenu();
		this.setFancyBoxIframe();
		this.setFancyBoxVideo();
		this.bookmark.initialize();
		//this.zoom.resizeBook();
		this.reloadNotes();
		this.initMusic();
		this.initPrint();
		this.setFooterToolsPreference();

		/*
		$(window).resize(function() {
			readerApp.zoom.resizeBook();
		});
		*/

		$("#totalPages").text(eBookConfig["total"]);
		//$("#pageSearch").val(eBookConfig["current"]);
		$("#subject-head").text(appdb.config["subject"]);
		$("#class-level").text(appdb.config["class"]);

		//add Event Listeners

		$("#takeBookmark").on("click", function () {
			readerApp.bookmark.action();
		});

		$("#ebook-next").on("click", function () {
			$("#music_controls_off").hide();
			$("#music_controls_on").show();
			soundManager.getSoundById("bgMusicRunning").stop();
			readerApp.flipNext();
		});

		$("#ebook-prev").on("click", function () {
			$("#music_controls_off").hide();
			$("#music_controls_on").show();
			soundManager.getSoundById("bgMusicRunning").stop();
			readerApp.flipPrev();
		});

		$("#ebook-first").on("click", function () {
			$("#book").turn("page", 1);
		});

		$("#ebook-last").on("click", function () {
			$("#book").turn("page", eBookConfig.total + appdb.config.prePages.length);
		});

		this.getHighlights();

		$("#notes-addition").on("shown.bs.modal", function () {
			readerApp.prepareNoteAdd(this);
		});

		$("#textarea-note").on("keypress", function (e) {
			$("#notes-validation").addClass("hide");
		});

		this.setBookFrameSize();

		readerApp.loadThumbnail();
		onFullScreenExit();
	},

	activatePaint: function () {
		if (eBookConfig.paintApp == false) {
			this.deactivatePaint();
		} else {
			$(".iframe-blocker").hide();
			$("body").addClass("action-highlight");
			var eles = document.querySelectorAll("#book iframe");
			for (var i = 0; i < eles.length; i++) {
				document
					.querySelectorAll("#book iframe")
					[i].contentWindow.postMessage("show-tools", "*");
			}
		}
		eBookConfig.paintApp = false;
	},

	deactivatePaint: function () {
		$(".iframe-blocker").show();
		$("body").removeClass("action-highlight");
		var eles = document.querySelectorAll("#book iframe");
		for (var i = 0; i < eles.length; i++) {
			document
				.querySelectorAll("#book iframe")
				[i].contentWindow.postMessage("hide-tools", "*");
		}
		eBookConfig.paintApp = true;
	},

	draw: {
		showTools: function () {
			closeAllPannels("#drawing-tools");
			$("#drawing-tools").show();
			$("#color-selection").trigger("change");
			$("#color-selection")[0].options.selectedIndex = 0;
			var $pages = $("#pageSearch").val().split("-");
			var toolPageHTML = "";
			for (var i = 0; i < $pages.length; i++) {
				toolPageHTML +=
					'<option value="' + $pages[i] + '">Page ' + $pages[i] + "</option>";
			}
			$("#tools-pageselection").html(toolPageHTML);
			$(".pnt-tool.active").removeClass("active");
			clearStorage(LAST_CANVAS);
		},
		hideTools: function () {
			$("#drawing-tools").fadeOut();

			$(".iframe-blocker").show();
			$("body").removeClass("action-highlight");
			var eles = document.querySelectorAll("#book iframe");
			for (var i = 0; i < eles.length; i++) {
				document
					.querySelectorAll("#book iframe")
					[i].contentWindow.postMessage("show-tools-0", "*");
			}
			$(".pnt-tool.active").removeClass("active");
		},
		toggleTools: function (tool) {
			if (!$("#drawing-tools").is(":visible")) {
				this.showTools();
				if (tool == "pen") {
					$("#tool-pen-ac").trigger("click");
				} else if (tool == "highlight") {
					$("#tool-highlight-ac").trigger("click");
				}
			} else {
				this.hideTools();
			}
		},

		selectTool: function (msg, ele) {
			$(".pnt-tool.active").removeClass("active");
			$(ele).addClass("active");
			$("body").addClass("action-highlight");
			$(".iframe-blocker").hide();
			var eles = document.querySelectorAll("#book iframe");
			for (var i = 0; i < eles.length; i++) {
				document
					.querySelectorAll("#book iframe")
					[i].contentWindow.postMessage(msg, "*");
			}
		},

		undo: function () {
			var currentPageId =
				parseInt($("#tools-pageselection").val()) +
				appdb.config.prePages.length;
			var frameObj = document.querySelector("#canvas-" + currentPageId);
			frameObj.contentWindow.postMessage("action-undo", "*");
		},

		clear: function () {
			var currentPageId =
				parseInt($("#tools-pageselection").val()) +
				appdb.config.prePages.length;
			var frameObj = document.querySelector("#canvas-" + currentPageId);
			frameObj.contentWindow.postMessage("action-clear", "*");
		},
	},

	loadThumbnail: function () {
		var thumbailHTML = "";
		for (var i = 1; i <= eBookConfig.total; i++) {
			thumbailHTML +=
				'<div class="item page-thumbnail" id="thumbnail-page-' +
				i +
				'" data-page="' +
				i +
				'">\
					<img src="resources/book/file-page' +
				i +
				'.jpg" />\
					<div class="thumbnail-page">' +
				i +
				"</div>\
				</div>";
		}
		$("#book-thumbnail").html(
			'<div class="owl-carousel owl-theme">' + thumbailHTML + "</div>"
		);
		$(".owl-carousel").owlCarousel({
			loop: false,
			margin: 10,
			nav: true,
			navText: [$(".prev"), $(".next")],
			dots: false,
			responsive: {
				0: { items: 2 },
				600: { items: 5 },
				1000: { items: 10 },
			},
		});
		$(".thumbnail")
			.off()
			.on("click", ".page-thumbnail", function (e) {
				e.preventDefault();
				e.stopPropagation();
				var pageId = parseInt($(this).attr("data-page")); // + appdb.config.prePages.length;
				readerApp.turnPage(pageId);
				$(".thumbnail").hide();
			});
	},

	initPrint: function () {
		$(".book-print li").on("click", function (e) {
			$(".book-print li").not(this).find("input").prop("checked", false);
			$(this).find("input").prop("checked", true);
		});
	},

	setFooterToolsPreference: function () {
		for (var tool in TOOLS_OPTIONS) {
			var toolStatus = TOOLS_OPTIONS[tool].activate;

			if (toolStatus == false) {
				var id = TOOLS_OPTIONS[tool].id;
				$("#" + id).remove();
			}
		}
	},
};

$(document).ready(function (e) {
	scrollBody();
	readerApp.init();
	preventRightClick();
	loadAudioFromStorage();

	/* start audio recorder */
	var startRecord = document.getElementById("startRecord");
	startRecord.onclick = (e) => {
		if (typeof rec != "undefined") {
			startRecord.disabled = true;
			stopRecord.disabled = false;
			audioChunks = [];
			rec.start();
		} else {
			alert("Please click on allow to use your microphone.");
		}
	};

	var stopRecord = document.getElementById("stopRecord");
	stopRecord.onclick = (e) => {
		if (typeof rec != "undefined") {
			startRecord.disabled = false;
			stopRecord.disabled = true;
			rec.stop();
		} else {
			alert("Please click on allow to use your microphone.");
		}
	};
	/* start audio recorder */

	setTimeout(function () {
		$("#app-preloader").addClass("animated bounceOutLeft");
		//$("#app-preloader video")[0].pause();
		if (
			$(document).innerWidth() < 768 &&
			$("#book").turn("display") != "single"
		) {
			readerApp.toggleBookMode();
			resizeBook();
		}
	}, videoTimeout);

	$("#color-selection")
		.on("change", function (e) {
			var bgcolor = $(this).val();
			$(this).css("background", bgcolor);
			var message = "select-color-" + bgcolor;

			var eles = document.querySelectorAll("#book iframe");
			for (var i = 0; i < eles.length; i++) {
				eles[i].contentWindow.postMessage(message, "*");
			}
		})
		.change();
});

$(window).on("message", function (e) {
	var data = e.originalEvent.data; // Should work.

	var splitData = data.split("-");

	if (data == "refresh-highlights") {
		readerApp.getHighlights();
	} else if (splitData[0] == "turnpage") {
		readerApp.turnPage(splitData[1]);
	} else if (splitData[0] == "canvas") {
		$("#tools-pageselection").val(
			parseInt(splitData[1]) - appdb.config.prePages.length
		);
		setStorage(LAST_CANVAS, splitData[1]);
	}
});

function scrollBody() {
	var curYPos, curXPos, curDown;
	var ele = document.getElementById("book-viewport");

	ele.addEventListener("mousemove", function (e) {
		if (curDown) {
			//ele.scrollTo(document.body.scrollLeft + (curXPos - e.pageX), document.body.scrollTop + (curYPos - e.pageY));
			var topPos = ele.scrollTop;
			var leftPos = ele.scrollLeft;
			ele.scrollTop = topPos + (curYPos - e.pageY);
			ele.scrollLeft = leftPos + (curXPos - e.pageX);
		}
	});

	ele.addEventListener("mousedown", function (e) {
		curYPos = e.pageY;
		curXPos = e.pageX;
		curDown = true;
	});

	ele.addEventListener("mouseup", function (e) {
		curDown = false;
	});
}

function openFancyModal(url, dimension) {
	$("#fancy-iframe").attr("data-src", url).attr("data-size", dimension);
	window.fancyboxSize = dimension;
	window.fancyboxURL = url;
	$("#fancy-iframe").trigger("click");
}

function openFancyModalVideo(url, dimension) {
	$("#fancy-video").attr("data-video-mp4", url).attr("data-size", dimension);
	window.fancyboxURL = url;
	window.fancyboxSize = dimension;
	$("#fancy-video").trigger("click");
}

function openVideo(url) {
	console.log(url);
}

var soundHolder;
var soundFlag = false;
var soundElementUrl = null;
function playAudio(ele, url) {
	if (soundFlag == true) {
		soundFlag = false;
		$(".audio-status-playing").removeClass("audio-status-playing");

		// pause if same id is clicked
		if (soundElementUrl == url) {
			soundHolder.pause();
		} else {
			soundHolder.stop();

			// recursive to play the audio again
			// IMP: Should not be invoked more than twice.
			playAudio(ele, url);
		}
		return;
	}
	$(ele).addClass("audio-status-playing");
	if (typeof soundHolder != "undefined" && soundElementUrl == url) {
		soundFlag = true;
		soundHolder.play();
		return false;
	}

	// create or regenerate new or destructed audio.
	soundHolder = soundManager.createSound({
		onfinish: function () {
			this.destruct();
			soundFlag = false;
			$(".audio-status-playing").removeClass("audio-status-playing");
			console.log("completd");
		},
		multiShot: false,
		url: url,
		autoLoad: true,
		autoPlay: true,
	});
	soundElementUrl = url;
	soundFlag = true;
}

function stopAudio() {
	if (soundFlag == true) {
		$(".audio-status-playing").removeClass("audio-status-playing");
		soundHolder.stop();
		soundFlag = false;
		soundElementUrl = null;
		return;
	}
}

function saveAudioInStorage(path, filename, pageId) {
	var data = getStorage(AUDIO_KEYWORD + pageId);
	var audioData = [];
	if (data == null || data == undefined || data == "") {
		audioData = [];
	} else {
		audioData = JSON.parse(data);
	}
	audioData.push({ path: path, pageId: pageId, filename: filename });
	setStorage(AUDIO_KEYWORD + pageId, JSON.stringify(audioData));
}

function loadAudioFromStorage() {
	var audioData = [];
	for (var i = 1; i <= eBookConfig.total; i++) {
		var data = getStorage(AUDIO_KEYWORD + i);
		if (data != null && data != undefined && data != "") {
			audioData.push.apply(audioData, JSON.parse(data));
		}
	}
	console.log(audioData);
	for (var i = 0; i < audioData.length; i++) {
		var aud = document.createElement("audio");
		aud.src = "resources/records/" + audioData[i].filename;
		aud.controls = true;
		console.log(aud);
		//$("#record-list").append(aud);

		var currentPage = audioData[i].pageId;
		var newId = "recorditem-" + $("#record-list tr").length;
		$("#record-list").append(
			"<tr><td>Page " +
				currentPage +
				'</td></tr><tr><td id="' +
				newId +
				'"></td></tr>'
		);
		$("#" + newId).append(aud);
	}

	$("#total-recordings").text($("#record-list audio").length);
}

function closeAllPannels(ele) {
	$("#drawing-tools, #search-box, #record-audio").not(ele).fadeOut();
	if (ele != "#drawing-tools") {
		readerApp.deactivatePaint();
	}
}

function closePannel(ele) {
	$(ele).fadeOut();
	if (ele != "#drawing-tools") {
		readerApp.deactivatePaint();
	}
}

function clearStorage(key) {
	removeStorage(key);
}

function preventRightClick() {
	if (PRODUCTION_MODE == true) {
		document.addEventListener("contextmenu", function (event) {
			event.preventDefault();
		});
	}
}

var elem = document.documentElement;

/* View in fullscreen */
function openFullscreen() {
	if (elem.requestFullscreen) {
		elem.requestFullscreen();
	} else if (elem.mozRequestFullScreen) {
		/* Firefox */
		elem.mozRequestFullScreen();
	} else if (elem.webkitRequestFullscreen) {
		/* Chrome, Safari and Opera */
		elem.webkitRequestFullscreen();
	} else if (elem.msRequestFullscreen) {
		/* IE/Edge */
		elem.msRequestFullscreen();
	}
	$("#app-btn-fullscreen").hide();
	$("#app-btn-efullscreen").show();
}

/* Close fullscreen */
function closeFullscreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.mozCancelFullScreen) {
		/* Firefox */
		document.mozCancelFullScreen();
	} else if (document.webkitExitFullscreen) {
		/* Chrome, Safari and Opera */
		document.webkitExitFullscreen();
	} else if (document.msExitFullscreen) {
		/* IE/Edge */
		document.msExitFullscreen();
	}
}

function onFullScreenExit() {
	if (document.addEventListener) {
		document.addEventListener("webkitfullscreenchange", exitHandler, false);
		document.addEventListener("mozfullscreenchange", exitHandler, false);
		document.addEventListener("fullscreenchange", exitHandler, false);
		document.addEventListener("MSFullscreenChange", exitHandler, false);
	}

	function exitHandler() {
		if (
			document.webkitIsFullScreen === false ||
			document.mozFullScreen === false ||
			document.msFullscreenElement === false
		) {
			$("#app-btn-fullscreen").show();
			$("#app-btn-efullscreen").hide();
		}
	}
}

function hideDiv(id) {
	$("#" + id).hide();
}

function showDiv(id) {
	$("#" + id).show();
}

function showThumbnail() {
	$(".capage").removeClass("capage");
	var pages = $("#book").turn("view");
	for (var i = 0; i < pages.length; i++) {
		$("#thumbnail-page-" + pages[i]).addClass("capage");
	}
	$("#thumbnail").show();
}

function showGlossary() {
	window.fancyboxSize = "800x500";
}

function bookOnlyPreview() {
	$("body").toggleClass("bookOnlyPreview");
}
// $(document).ready(function () {
//   var page = $("#book").turn("view");

//   setTimeout(() => {
//     $("#book").turn("display", "single");
//     eBookConfig.mode = "single";
//     resizeBook();
//   }, 2000);
// });

if ($(window).width() < 768) {
	$("#book").turn("disable", true);
}
