
document.addEventListener('DOMContentLoaded', function() {
	var body = document.body,
		rawInput = document.getElementById('input'),
		regularPreview = document.getElementById('regular-preview'),
		regularOut = document.getElementById('regular'),
		blockChar = document.getElementById('block'),
		compressedOut = document.getElementById('compressed'),
		colors = document.querySelectorAll('input[name^="color"]');

	function insertAtCaret(txtArea, text) {
		/* source - (http://stackoverflow.com/a/1064139) George Claghoen - Stack Overflow */
		if (!txtArea) {
			return;
		}

		var scrollPos = txtArea.scrollTop;
		var strPos = 0;
		var br = ((txtArea.selectionStart || txtArea.selectionStart == '0') ?
			"ff" : (document.selection ? "ie" : false));
		if (br == "ie") {
			txtArea.focus();
			var range = document.selection.createRange();
			range.moveStart('character', -txtArea.value.length);
			strPos = range.text.length;
		} else if (br == "ff") {
			strPos = txtArea.selectionStart;
		}

		var front = (txtArea.value).substring(0, strPos);
		var back = (txtArea.value).substring(strPos, txtArea.value.length);
		txtArea.value = front + text + back;
		strPos = strPos + text.length;
		if (br == "ie") {
			txtArea.focus();
			var ieRange = document.selection.createRange();
			ieRange.moveStart('character', -txtArea.value.length);
			ieRange.moveStart('character', strPos);
			ieRange.moveEnd('character', 0);
			ieRange.select();
		} else if (br == "ff") {
			txtArea.selectionStart = strPos;
			txtArea.selectionEnd = strPos;
			txtArea.focus();
		}

		txtArea.scrollTop = scrollPos;
	}

	var samples = [
		"${c2}        #####\n${c2}       #######\n${c2}       ##${c1}O${c2}#${c1}O${c2}##\n${c2}       #${c3}#####${c2}#\n${c2}     ##${c1}##${c3}###${c1}##${c2}##\n${c2}    #${c1}##########${c2}##\n${c2}   #${c1}############${c2}##\n${c2}   #${c1}############${c2}###\n${c3}  ##${c2}#${c1}###########${c2}##${c3}#\n${c3}######${c2}#${c1}#######${c2}#${c3}######\n${c3}#######${c2}#${c1}#####${c2}#${c3}#######\n${c3}  #####${c2}#######${c3}#####\n",
		"${c1}    _-`````-,           ,- '- .\n  .'   .- - |          | - -.  `.\n /.'  /                     `.   :\n/   :      _...   ..._      ``   :\n::   :     /._ .`:'_.._.    ||   :\n::    `._ ./  ,`  :     . _.''   .\n`:.      /   |  -.  -. \_      /\n  :._ _/  .'   .@)  @) ` ` ,.'\n     _/,--'       .- .,-.`--`.\n       ,'/''     ((  `  )\n        /'/'      `-'  (\n         '/''  `._,-----'\n          ''/'    .,---'\n           ''/'      ;:\n             ''/''  ''/\n               ''/''/''\n                 '/'/'\n                  `"
	];

	var sampleColors = [
		['#aaa', '#444', '#f60']
	];

	var shiftMap = {
		'!': 1,
		'@': 2,
		'#': 3,
		'$': 4,
		'%': 5,
		'^': 6,
		'&': 7,
		'*': 8,
		'(': 9
	}

	function update(e) {
		console.log('update')

		if (typeof e === "object") {

			var target = e.target,
				key = e.key;

			if (typeof key === "string" && e.altKey && e.shiftKey) { // if a key has been pressed, and the alt key is active
				// it's a keypress event
				if (typeof shiftMap[key] !== "undefined") {
					// it's a valid number - inject string
					console.log([e, shiftMap[key]]);
					insertAtCaret(rawInput, '${c' + shiftMap[key] + '}');
				}
			} else {
				// it's a mouse event
				switch (target.id) {
					case 'regular-preview':
						target.classList.toggle('black');
						break;
					case 'sample0':
					case 'sample1':
					case 'sample2':
						var sampleNumber = Number(target.id[target.id.length - 1]),
							sampleColorVal;
						rawInput.value = samples[sampleNumber];

						// I know, forEach is gross -> but performance isn't really an issue here
						colors.forEach(function(node, index) {
							sampleColorVal = (typeof sampleColors[sampleNumber] !== "undefined") ? sampleColors[sampleNumber][index] : null;
							node.value = (typeof sampleColorVal === "string") ? sampleColorVal : '';
						});
						update();
						break;
				}
			}
		}

		var asciiData = window.jsAscii.convert(rawInput.value);

		regularOut.value = asciiData.heavy;
		compressedOut.value = asciiData.compressed;

		var out = window.jsAscii.renderToHTML(asciiData.heavy, {
			styles: {
				1: colors[0].value,
				2: colors[1].value,
				3: colors[2].value,
				4: colors[3].value,
				5: colors[4].value,
				6: colors[5].value,
				7: colors[6].value,
				8: colors[7].value,
				9: colors[8].value,
			},
			block: (blockChar.value.length > 0) ? blockChar.value : null
		});

		regularPreview.innerHTML = out;

		console.log({
			out
		})

	}

	body.addEventListener('mouseup', update);
	body.addEventListener('keyup', update);
});
// setup default values
