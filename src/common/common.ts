export const getRootUrl = () => {
  const ROOT_URL = `https://ih4d4hh2ki.execute-api.ap-southeast-1.amazonaws.com/prod/`;
  return ROOT_URL;
};

export const getUniqueId = () => {
  const navigatorInfo = window.navigator;
  const screenInfo = window.screen;

  let uid = navigatorInfo.mimeTypes.length as any;
  uid += navigatorInfo.userAgent.replace(/\D+/g, "");
  uid += navigatorInfo.plugins.length;
  uid += screenInfo.height || "";
  uid += screenInfo.width || "";
  uid += screenInfo.pixelDepth || "";

  return uid;
};
