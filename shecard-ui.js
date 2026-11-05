(() => {
	const themeKey = "shecard-theme";
	const root = document.documentElement;
	root.dataset.theme = localStorage.getItem(themeKey) === "dark" ? "dark" : "light";
	const isEmployeePage = window.location.pathname.includes("/colaboradores/");
	const pathPrefix = isEmployeePage ? "../" : "./";

	function initializeHeader() {
		const headerInner = document.querySelector(".header-inner");
		if (!headerInner) return;

		if (!headerInner.querySelector(".brand")) {
			const heading = headerInner.querySelector("h1");
			if (heading) {
				const brand = document.createElement("div");
				const logo = document.createElement("img");
				const copy = document.createElement("div");
				const name = document.createElement("p");

				brand.className = "brand";
				logo.className = "header-jde-logo";
				logo.src = `${pathPrefix}assets/jde-logo.png`;
				logo.alt = "Jacobs Douwe Egberts";
				copy.className = "brand-copy";
				name.className = "brand-name";
				name.textContent = "SHECard";
				heading.textContent = isEmployeePage ? "Portal do Colaborador" : "Portal de Terceiros";
				copy.append(name, heading);
				brand.append(logo, copy);
				headerInner.insertBefore(brand, headerInner.firstChild);
			}
		}

		const headerActions = headerInner.querySelector(".header-actions") || headerInner;
		let button = document.getElementById("themeToggle");
		if (!button) {
			button = document.createElement("button");
			button.className = "theme-toggle";
			button.id = "themeToggle";
			button.type = "button";
			button.innerHTML = '<span class="theme-toggle-icon" aria-hidden="true"></span><span id="themeToggleLabel"></span>';
			const link = headerActions.querySelector("a");
			headerActions.insertBefore(button, link);
		}

		const label = button.querySelector("#themeToggleLabel");
		const icon = button.querySelector(".theme-toggle-icon");

		function updateControl() {
			const isDark = root.dataset.theme === "dark";
			button.setAttribute("aria-pressed", String(isDark));
			if (label) label.textContent = isDark ? "Modo claro" : "Modo escuro";
			if (icon) icon.textContent = isDark ? "☀" : "☾";
		}

		if (button.dataset.themeReady !== "true") {
			button.addEventListener("click", () => {
				const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
				root.dataset.theme = nextTheme;
				localStorage.setItem(themeKey, nextTheme);
				updateControl();
			});
			button.dataset.themeReady = "true";
		}

		updateControl();
	}

	function createFooterElement(className, tagName, text) {
		const element = document.createElement(tagName);
		element.className = className;
		if (text) element.textContent = text;
		return element;
	}

	function createFooter() {
		const footer = createFooterElement("site-footer", "footer");
		const inner = createFooterElement("site-footer-inner", "div");
		const brand = createFooterElement("footer-brand", "div");
		const logo = document.createElement("img");
		const brandCopy = createFooterElement("footer-brand-copy", "div");
		const brandName = createFooterElement("", "strong", "SHECard");
		const brandDescription = createFooterElement("", "span", "Portal Corporativo de Treinamentos e Conformidade");
		const update = createFooterElement("footer-update", "div");
		const updateLabel = createFooterElement("", "span", "Última atualização da base");
		const updateDate = createFooterElement("", "strong", "Carregando...");
		const company = createFooterElement("footer-company", "div");
		const companyName = createFooterElement("", "strong", "Jacobs Douwe Egberts");
		const companyLocation = createFooterElement("", "span", "Piumhi Factory");
		const navigation = createFooterElement("footer-links", "nav");
		const collaboratorsLink = document.createElement("a");
		const contractorsLink = document.createElement("a");
		const year = createFooterElement("footer-year", "p");
		const currentYear = document.createElement("span");

		logo.className = "footer-jde-logo";
		logo.src = `${pathPrefix}assets/jde-logo.png`;
		logo.alt = "Jacobs Douwe Egberts";
		updateDate.id = "footerUpdatedAt";
		navigation.setAttribute("aria-label", "Navegação do portal");
		collaboratorsLink.href = `${pathPrefix}index.html`;
		collaboratorsLink.textContent = "Portal Colaboradores";
		contractorsLink.href = `${pathPrefix}index_terceiros.html`;
		contractorsLink.textContent = "Portal Terceiros";
		currentYear.id = "currentYear";
		currentYear.textContent = String(new Date().getFullYear());
		year.append("© ", currentYear);
		brandCopy.append(brandName, brandDescription);
		brand.append(logo, brandCopy);
		update.append(updateLabel, updateDate);
		company.append(companyName, companyLocation);
		navigation.append(collaboratorsLink, contractorsLink);
		inner.append(brand, update, company, navigation, year);
		footer.append(inner);
		return footer;
	}

	function getDataPath() {
		if (isEmployeePage) return "../dados.json";
		if (window.location.pathname.endsWith("/index_terceiros.html")
			|| window.location.pathname.endsWith("/terceiro.html")) {
			return "./dados_terceiros.json";
		}
		return "./dados.json";
	}

	function getLatestUpdate(records) {
		const latestUpdate = records
			.map(record => record.ULTIMA_ATUALIZACAO_FORMATADA)
			.filter(Boolean)
			.map(value => {
				const [day, month, year] = value.split("/").map(Number);
				return { value, timestamp: new Date(year, month - 1, day).getTime() };
			})
			.filter(item => Number.isFinite(item.timestamp))
			.sort((a, b) => b.timestamp - a.timestamp)[0];
		return latestUpdate ? latestUpdate.value : "Não informada";
	}

	function initializeFooter() {
		let footer = document.querySelector(".site-footer");
		if (footer) {
			const currentYear = footer.querySelector("#currentYear");
			if (currentYear) currentYear.textContent = String(new Date().getFullYear());
			return;
		}

		footer = createFooter();
		document.body.append(footer);
		const currentYear = footer.querySelector("#currentYear");
		const updateDate = footer.querySelector("#footerUpdatedAt");

		fetch(getDataPath())
			.then(response => {
				if (!response.ok) throw new Error(`Falha HTTP ${response.status}`);
				return response.json();
			})
			.then(records => {
				if (!Array.isArray(records)) throw new Error("O conteúdo não é uma lista JSON válida.");
				updateDate.textContent = getLatestUpdate(records);
			})
			.catch(error => {
				console.error("Não foi possível carregar a atualização do rodapé:", error);
				updateDate.textContent = "Indisponível";
			});

		if (currentYear) currentYear.textContent = String(new Date().getFullYear());
	}

	function initializePageChrome() {
		initializeHeader();
		initializeFooter();
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initializePageChrome, { once: true });
	} else {
		initializePageChrome();
	}
})();
