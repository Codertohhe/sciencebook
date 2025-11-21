if (typeof jQuery !== "undefined" && typeof saveAs !== "undefined") {
	(function ($) {
		$.fn.wordExport = function (fileName) {
			fileName =
				typeof fileName !== "undefined" ? fileName : "Test-Engine-Export";
			var static = {
				mhtml: {
					top:
						"Mime-Version: 1.0\nContent-Base: " +
						location.href +
						'\nContent-Type: Multipart/related; boundary="NEXT.ITEM-BOUNDARY";type="text/html"\n\n--NEXT.ITEM-BOUNDARY\nContent-Type: text/html; charset="utf-8"\nContent-Location: ' +
						location.href +
						"\n\n<!DOCTYPE html>\n<html>\n_html_</html>",
					head: '<head>\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n<style>\n_styles_\n</style>\n</head>\n',
					body: "<body>_body_</body>",
				},
			};
			var options = {
				maxWidth: 624,
			};

			// Clone selected element before manipulating it
			var markup = $(this).clone();

			// Add Word-specific styles
			var wordStyles = `
				<style>
					/* Word-specific table properties */
					table {
						border-collapse:collapse;
						mso-table-layout-alt:fixed;
						mso-padding-alt:0;
						margin:0;
						padding:0;
					}
					td {
						padding:0;
						margin:0;
						mso-table-lspace:0;
						mso-table-rspace:0;
					}
					/* Force single line */
					.question-answer {
						mso-line-height-rule:exactly;
						mso-element:para-border-div;
					}
					/* Prevent line breaks */
					.question-answer span {
						white-space:nowrap;
						mso-spacerun:yes;
					}
				</style>
			`;
			
			markup.find('head').append(wordStyles);
			
			// Remove hidden elements from the output
			markup.each(function () {
				var self = $(this);
				if (self.is(":hidden")) self.remove();
			});

			// Add question numbers
			var questionCount = 0;
			var hindiNumbers = ['क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ'];
			
			markup.find('.question-container').each(function() {
				var $question = $(this);
				var questionNumber = hindiNumbers[questionCount];
				$question.attr('data-number', questionNumber);
				questionCount++;
			});

			// Fix answer structure for horizontal alignment in DOCX
			markup.find('.question-answer').each(function() {
				var $qa = $(this);
				
				// Get ALL text content
				var headingText = '';
				var answerText = '';
				var images = [];
				
				// Extract heading
				var $ansHeading = $qa.find('.ansHeading');
				if ($ansHeading.length) {
					headingText = $ansHeading.text().trim();
				}
				
				// Extract answer from .simp-ans-text
				var textParts = [];
				$qa.find('.simp-ans-text').each(function() {
					var text = $(this).text().trim();
					if (text) {
						textParts.push(text);
					}
				});
				
				// Get complete text
				var completeText = $qa.text().trim();
				
				// Extract answer text
				if (textParts.length > 0) {
					answerText = textParts.join(' ').trim();
				} else if (headingText && completeText) {
					var headingPos = completeText.indexOf(headingText);
					if (headingPos === 0) {
						answerText = completeText.substring(headingText.length).trim();
					} else {
						answerText = completeText.replace(headingText, '').trim();
					}
				} else if (completeText) {
					answerText = completeText;
				}
				
				// Extract images
				$qa.find('img').each(function() {
					images.push($(this).clone());
				});
				
				// Create Word-specific table structure for proper alignment
				var newContent = $('<table style="width:100%; border-collapse:collapse; mso-table-layout-alt:fixed; mso-padding-alt:0; margin:0; padding:0;">');
				var $row = $('<tr style="mso-yfti-irow:0;">');
				var $cell = $('<td style="padding:0; margin:0; mso-table-lspace:0; mso-table-rspace:0;">');
				
				// Create content with forced inline display
				if (headingText && answerText) {
					if (!headingText.endsWith(':')) {
						headingText += ':';
					}
					$cell.html(
						'<span style="white-space:nowrap; mso-spacerun:yes;">' +
						'<strong>' + headingText + '</strong></span>' +
						'<span style="mso-spacerun:yes">&nbsp;</span>' +
						'<span style="white-space:nowrap; mso-spacerun:yes;">' + answerText + '</span>'
					);
				} else if (headingText) {
					$cell.html('<strong>' + headingText + '</strong>');
				} else if (answerText) {
					$cell.html(answerText);
				}
				
				newContent.append($row.append($cell));
				
				// Add images
				for (var k = 0; k < images.length; k++) {
					var imgSrc = images[k].attr('src') || '';
					var imgAlt = images[k].attr('alt') || '';
					newContent += ' <img src="' + imgSrc + '" alt="' + imgAlt + '" style="display:inline;vertical-align:baseline;" />';
				}
				
				// Create table structure for proper alignment in Word
				var $table = $('<table cellspacing="0" cellpadding="0" border="0" class="question-answer-table"></table>');
				var $row = $('<tr></tr>');
				
				// Add question number if this is a question
				var $questionContainer = $qa.closest('.question-container');
				if ($questionContainer.length) {
					var questionNumber = $questionContainer.attr('data-number');
					if (questionNumber) {
						$row.append('<td style="width:20px;vertical-align:top;padding-right:5px;">' + questionNumber + '.</td>');
					}
				}
				
				// Add answer content
				var $contentCell = $('<td style="vertical-align:top;"></td>');
				$contentCell.html(newContent);
				$row.append($contentCell);
				
				$table.append($row);
				$table.css({
					'width': '100%',
					'border-collapse': 'collapse',
					'margin': '0',
					'padding': '0',
					'display': 'inline-table',
					'mso-table-lspace': '0pt',
					'mso-table-rspace': '0pt'
				});

				// Replace the original answer block with the table (single-row)
				$qa.replaceWith($table);
			});

			// Aggressively sanitize any remaining answer blocks to inline-only content
			markup.find('.answer-label, .answer-content').each(function() {
				var $el = $(this);
				var html = $el.html() || '';
				// Strip all tags except inline-friendly ones (a, b, strong, i, em, span, img)
				html = html.replace(/<(?!\/?(a|b|strong|i|em|span|img)(\s|>|\/))/gi, '&lt;');
				// Remove closing tags of non-whitelisted
				html = html.replace(/<\/?(?!a\b|b\b|strong\b|i\b|em\b|span\b|img\b)[^>]+>/gi, '');
				// Remove block elements if any survived
				html = html.replace(/<\/?(?:div|p|h[1-6]|blockquote|section|article)[^>]*>/gi, ' ');
				// Collapse whitespace
				html = html.replace(/\s+/g, ' ').trim();
				$el.html(html);
			});

			// Simple approach: resize images without converting to base64
			var img = markup.find("img");
			for (var i = 0; i < img.length; i++) {
				// Just resize images, keep original src
				var w = Math.min(img[i].width || options.maxWidth, options.maxWidth);
				var h = img[i].height
					? img[i].height * (w / (img[i].width || w))
					: "auto";

				$(img[i]).css({
					"max-width": w + "px",
					height: h === "auto" ? "auto" : h + "px",
				});
			}

			// No image data to embed - images will reference original URLs
			var mhtmlBottom = "\n--NEXT.ITEM-BOUNDARY--";

			// Basic CSS for better Word compatibility
			var styles = `
			body { font-family: Arial, sans-serif; }
			img { max-width: 100%; height: auto; }
			table { border-collapse: collapse; width: 100%; }
			td, th { border: 1px solid #ddd; padding: 8px; }

			
			table.question-answer-table {
				width: 100% !important;
				border-collapse: collapse !important;
				display: inline-table !important;
				mso-table-lspace: 0pt !important;
				mso-table-rspace: 0pt !important;
				margin: 0 !important;
				padding: 0 !important;
			}
			table.question-answer-table td {
				border: none !important;
				color: inherit !important;
				font-size: 16px !important;
				padding: 5px !important;
				text-align: left !important;
				vertical-align: top !important;
				mso-element: para-border-div !important;
			}
			table.question-answer-table td strong {
				display: inline !important;
				font-weight: bold !important;
				margin-right: 5px !important;
			}
			table.question-answer-table td * {
				display: inline !important;
				margin: 0 !important;
				padding: 0 !important;
			}
			.question-answer div,
			.question-answer p {
				display: inline !important;
				margin: 0 !important;
				padding: 0 !important;
				float: none !important;
				clear: none !important;
			}
			.question-answer span,
			.question-answer strong {
				display: inline !important;
				float: none !important;
				clear: none !important;
			}
			.question-answer img {
				display: inline !important;
				vertical-align: baseline !important;
				margin: 0 !important;
				padding: 0 !important;
			}
			.ansHeading {
				display: inline !important;
				float: none !important;
				clear: none !important;
				vertical-align: baseline !important;
				white-space: normal !important;
				word-wrap: break-word !important;
				writing-mode: horizontal-tb !important;
				direction: ltr !important;
				margin-right: 5px !important;
				font-weight: bold !important;
				line-height: inherit !important;
			}
			.simp-ans-text {
				display: inline !important;
				float: none !important;
				clear: none !important;
				vertical-align: baseline !important;
				white-space: normal !important;
				word-wrap: break-word !important;
				writing-mode: horizontal-tb !important;
				direction: ltr !important;
				line-height: inherit !important;
			}
			/* Force inline for answer label and content to prevent line break */
			.answer-label, .answer-content {
				display: inline !important;
				margin: 0 !important;
				padding: 0 !important;
			}
			`;

			// Aggregate parts of the file together
			var fileContent =
				static.mhtml.top.replace(
					"_html_",
					static.mhtml.head.replace("_styles_", styles) +
						static.mhtml.body.replace("_body_", markup.html())
				) + mhtmlBottom;

			// Create a Blob with the file contents
			var blob = new Blob([fileContent], {
				type: "application/msword;charset=utf-8",
			});
			saveAs(blob, fileName + ".doc");
		};
	})(jQuery);
} else {
	if (typeof jQuery === "undefined") {
		console.error("Test Paper: missing dependency (jQuery)");
	}
	if (typeof saveAs === "undefined") {
		console.error("Test Paper Export: missing dependency (FileSaver.js)");
	}
}
