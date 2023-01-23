export function clickOutside(element: HTMLElement, callback: () => void) {
  function handleClick(event: MouseEvent) {
    if (!element.contains(event.target as Node)) {
      callback();
    }
  }

  document.addEventListener("click", handleClick, true);

  return {
    destroy() {
      document.removeEventListener("click", handleClick, true);
    },
  };
}
