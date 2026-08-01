const getUtmParameters = () => {
  if (typeof window === "undefined") return {};
  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_source: urlParams.get("utm_source") || "direct",
    utm_medium: urlParams.get("utm_medium") || "none",
    utm_campaign: urlParams.get("utm_campaign") || "none",
  };
};

export function trackEvent(eventName: string, props: Record<string, any> = {}) {
  try {
    const utmProps = getUtmParameters();
    const finalProps = { ...utmProps, ...props };

    if (typeof window !== "undefined" && (window as any).plausible) {
      (window as any).plausible(eventName, { props: finalProps });
    } else {
      console.log(`[Analytics Mock] Event: ${eventName}`, finalProps);
    }
  } catch (err) {
    console.error("Failed to track event:", err);
  }
}
