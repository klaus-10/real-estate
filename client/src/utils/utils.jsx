

export const scrollPageToTop = () => {
    console.log("scrollPageToTop");
    window.scrollTo({
      top: 0,
      behavior: "smooth" // Optional: Adds smooth scrolling effect
    });
  };

  export const scrollToElemRef = (elemRef) => {
    console.log("scrollPageToTop");
    window.scrollTo({
      top: elemRef?.current?.offsetToTop || 0,
      behavior: "smooth" // Optional: Adds smooth scrolling effect
    });
  };