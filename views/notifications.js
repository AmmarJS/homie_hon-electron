export function showAlert(message) {
  const notification = document.createElement("div")
  notification.classList = "bg-red-600 h-[2rem] w-full fixed top-0"
  notification.id = "notification"
  const text = document.createElement("h1")
  text.classList = "text-white text-center w-full h-full"
  text.textContent = message;
  notification.append(text);
  document.querySelector("body").insertAdjacentElement("beforebegin", notification)
  setTimeout(() => {
    document.querySelector("#notification").remove()
  }, 2000)
}