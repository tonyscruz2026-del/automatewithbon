export function createInfoPanel(panelEl) {

    if (!panelEl) {

        return { show() {}, hide() {} };

    }

    panelEl.innerHTML =

        '<button class="project-panel-close" type="button" aria-label="Close">&times;</button>' +
        '<span class="project-panel-eyebrow">Project</span>' +
        '<h3 class="project-panel-title"></h3>' +
        '<p class="project-panel-desc"></p>' +
        '<a class="project-panel-link" href="#" target="_blank" rel="noopener">View project &rarr;</a>';

    const titleEl = panelEl.querySelector(".project-panel-title");

    const descEl = panelEl.querySelector(".project-panel-desc");

    const linkEl = panelEl.querySelector(".project-panel-link");

    const closeBtn = panelEl.querySelector(".project-panel-close");

    function hide() {

        panelEl.classList.remove("is-open");

    }

    function show(data) {

        if (!data) return;

        titleEl.textContent = data.title || "Untitled project";

        descEl.textContent = data.description || "";

        if (data.url) {

            linkEl.href = data.url;

            linkEl.style.display = "inline-flex";

        } else {

            linkEl.style.display = "none";

        }

        panelEl.classList.add("is-open");

    }

    closeBtn.addEventListener("click", hide);

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") hide();

    });

    return { show, hide };

}
