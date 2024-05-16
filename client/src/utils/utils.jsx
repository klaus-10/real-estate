export const scrollPageToTop = () => {
  // console.log("scrollPageToTop");
  // window.scrollTo({
  //   top: 0,
  //   behavior: "smooth" // Optional: Adds smooth scrolling effect
  // });
  window.scrollTo(0, 0);
};

export const scrollToToTopWithElemRef = (elemRef) => {
  // console.log("scrollPageToTop");
  elemRef?.current?.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
};
