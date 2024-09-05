import { useState } from "react";

export const SetHamburgerMenuVis = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return { isMenuOpen, setIsMenuOpen };
};
export default SetHamburgerMenuVis