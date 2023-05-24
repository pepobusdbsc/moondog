const useQueryParams = () => {
  const params: any = {};
  if (window.location.hash) {
    window.location.hash.split("?")?.[1]?.split("&")
      .forEach((item: string) => {
        const arr = item.split("=");
        params[arr[0]] = arr[1];
      });
  }
  return params;
};

export default useQueryParams;
