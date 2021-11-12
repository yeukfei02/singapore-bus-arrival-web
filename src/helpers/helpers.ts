export const getRootUrl = () => {
  const rootUrl = `https://73ddoqlmy0.execute-api.ap-southeast-1.amazonaws.com/prod/`;
  return rootUrl;
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
