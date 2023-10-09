export function showLoader() {
    const div = document.createElement('div');
    div.classList = "h-full w-full bg-black z-20 fixed top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] opacity-50 flex items-center justify-center";
    div.id = "loader"
    const svg = document.querySelector("object")
    div.appendChild(svg)
    document.querySelector("body").insertAdjacentElement("beforebegin", div);
}

export function hideLoader() {
    document.querySelector("#loader").remove()
}