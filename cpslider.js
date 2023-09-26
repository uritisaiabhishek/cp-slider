function cpcarosel(c, l, a, scrollTime, desktop, tablet, mobile) {
	const simpleCarosal = document.querySelector(".simple-carosal");
	// work only if carosal class exists
	if (simpleCarosal) {
		const carosal = document.querySelector(".carosal");
		var items = document.querySelectorAll(".item");
		// add width to all items depending on device and give slidecount                
		items.forEach(item => {
			if (screen.width <= 576) {
				item.style.minWidth = screen.width / mobile + 'px';
				item.style.width = screen.width / mobile + 'px';
			} else if (screen.width <= 992) {
				item.style.minWidth = screen.width / tablet + 'px';
				item.style.width = screen.width / tablet + 'px';
			} else {
				item.style.minWidth = screen.width / desktop + 'px';
				item.style.width = screen.width / desktop + 'px';
			}
		});

		const slideSize = items[0].clientWidth;

		// create and add buttons in navigation_buttons div
		const navigation_buttons = document.createElement("div");
		navigation_buttons.classList.add("navigation_buttons");
		const prevbtn = document.createElement("button");
		const nextbtn = document.createElement("button");
		prevbtn.innerText = "←";
		nextbtn.innerText = "→";
		prevbtn.classList.add("prev");
		nextbtn.classList.add("next");
		simpleCarosal.appendChild(navigation_buttons);
		navigation_buttons.appendChild(prevbtn);
		navigation_buttons.appendChild(nextbtn);

		var prev = document.querySelector(".prev");
		var next = document.querySelector(".next");
		//counter

		let counter = 1;

		// if loop enabled
		if (l == 1) {
			// clone first and last items and add to carosal
			const firstclone = items[0].cloneNode(true);
			const lastclone = items[4].cloneNode(true);
			firstclone.setAttribute('id', 'firstclone');
			lastclone.setAttribute('id', 'lastclone');
			carosal.appendChild(firstclone);
			carosal.prepend(lastclone);

			items = document.querySelectorAll(".item");

			// one clone in front so translate once
			carosal.style.transform = 'translateX(' + (-slideSize * counter) + 'px)';

			// if autoplay enabled
			if (a == 1) {
				autoscroll();
			};
		} else {
			let caroselSlides = Array.from(items);

			function disableBtn() {
				// if count = 1 disable prev
				if (counter <= 1) {
					prev.disabled = true;
				} else {
					prev.disabled = false;
				};
				// if count = max disable next
				if (counter >= items.length) {
					next.disabled = true;
				} else {
					next.disabled = false
				};
			};
			disableBtn();
		};
		console.log(counter);
		prev.addEventListener("click", () => {
			if (l == 1) {
				if (counter <= 1) return;
				carosal.style.transition = "all 1s ease-in-out";
				carosal.style.transform = 'translateX(' + (-slideSize * counter) + 'px)';
				counter--;
			} else {
				if (counter <= 1) return;
				carosal.style.transition = "all 1s ease-in-out";
				counter--;
				carosal.style.transform = 'translateX(' + (-slideSize * counter) + 'px)';
				disableBtn();
			};
			console.log(counter);
		});
		next.addEventListener("click", () => {
			carosal.style.transition = "all 1s ease-in-out";
			if (l == 1) {
				if (counter >= items.length - 1) return;
				counter++;
				carosal.style.transform = 'translateX(' + (-slideSize * counter) + 'px)';
			} else {
				if (counter >= items.length) return;
				carosal.style.transform = 'translateX(' + (-slideSize * counter) + 'px)';
				counter++;
				disableBtn();
			}
			console.log(counter);
		});
		if (l == 1) {
			carosal.addEventListener('transitionend', () => {
				if (items[counter].id === 'lastclone') {
					carosal.style.transition = "none";
					counter = items.length - 2;
					carosal.style.transform = 'translateX(' + (-slideSize * counter) + 'px)';
				};
				if (items[counter].id === 'firstclone') {
					carosal.style.transition = "none";
					counter = items.length - counter;
					carosal.style.transform = 'translateX(' + (-slideSize * counter) + 'px)';
				};
			});
		};
		// add counter and call nextclick function for every 20000 milli seconds
		function autoscroll() {
			if (counter >= items.length - 1) return;
			carosal.style.transition = "all 1s ease-in-out";
			counter++;
			carosal.style.transform = 'translateX(' + (-slideSize * counter) + 'px)';
			setTimeout(autoscroll, scrollTime);
		};
	};
};
/*
    callcarosel fucntion parameters 
        01- carosal class
        02- loop 
        03- autoplay 
        04- autoplaytime
        05- number of slides in desktop 
        06- tablet breakpoint
        07- number of slides in tablet 
        08- mobile breakpoint
        09- number of slides in mobile  
        10- Pagination    
*/
cpcarosel("simple-carosal", 1, 0, 3000, 1, 2, 1);