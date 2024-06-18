export const scrollPageToTop = () => {
  window.scrollTo(0, 0);
};

export const scrollToToTopWithElemRef = (elemRef) => {
  elemRef?.current?.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
};
