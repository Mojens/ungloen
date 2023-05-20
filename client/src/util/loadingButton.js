export function startLoading(buttonElement) {
    buttonElement.classList.add("secondary");
    buttonElement.setAttribute("aria-busy", "true");
}

export function stopLoading(buttonElement) {
    buttonElement.classList.remove("secondary");
    buttonElement.removeAttribute("aria-busy");
}