import { useEffect, useState } from "react";

const MOBILE_MEDIA_QUERY = "(max-width: 767px)";

export const useIsMobile = (): boolean => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
		const handleMediaChange = (event: MediaQueryListEvent) => {
			setIsMobile(event.matches);
		};

		setIsMobile(mediaQuery.matches);
		mediaQuery.addEventListener("change", handleMediaChange);

		return () => {
			mediaQuery.removeEventListener("change", handleMediaChange);
		};
	}, []);

	return isMobile;
};