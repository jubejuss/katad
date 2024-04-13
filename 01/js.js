function toggleFourth() {
	const element = document.querySelector(".fourth");
	element.style.display = element.style.display === "block" ? "none" : "block";

	const button = document.getElementById("btn");
	button.innerText = button.innerText === "4 kaarti" ? "3 kaarti" : "4 kaarti";

	const span = document.getElementById("span");
	span.innerText = span.innerText === "Neljase" ? "Kolmese" : "Neljase";
}
