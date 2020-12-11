export const getRootUrl = () => {
  const ROOT_URL = `https://uak501unl4.execute-api.ap-southeast-1.amazonaws.com/v1/`;
  return ROOT_URL;
};

export const getUniqueId = () => {
  const navigatorInfo = window.navigator;
  const screenInfo = window.screen;

  let uid = navigatorInfo.mimeTypes.length;
  uid += navigatorInfo.userAgent.replace(/\D+/g, "");
  uid += navigatorInfo.plugins.length;
  uid += screenInfo.height || "";
  uid += screenInfo.width || "";
  uid += screenInfo.pixelDepth || "";

  return uid;
};
