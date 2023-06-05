
// TODO METTRE LA MODAL ICI 

const scriptsInEvents = {
	async Events_game_Event14_Act8(runtime, localVars) {
		const score = runtime.globalVars.game_points;
		// alert('fin de partie');
		const form = document.createElement('form');
		form.method = "post";
		form.action = "http://testcurl.test/"
		const input = document.createElement('input');
		input.type = "hidden";
		input.value = score;
		input.name = "score";
		form.append(input);
		document.body.append(form);
		const inputs = document.querySelectorAll("#Form_input");
		inputs.forEach(element => {
			element.style.display = "none";
		});
		// form.submit();
		// setTimeout(() => {
		// 	const forms = document.querySelectorAll('input');

		// 	forms.forEach(item => {
		// 		item.style.display = "none"
		// 	})
		// }, 10);

	},

	async Form_event_Event1_Act1(runtime, localVars) {
		// setTimeout(() => {
		// 	const forms = document.querySelectorAll('input');

		// 	forms.forEach(item => {
		// 		item.style.display = "none"
		// 	})
		// }, 10);
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;

