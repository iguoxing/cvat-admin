/*
 * @Author: ArdenZhao
 * @Date: 2023-01-04 21:19:44
 * @LastEditTime: 2023-01-04 21:35:52
 * @FilePath: /cvat-admin/src/utils/handleMiles.js
 * @Description: file information
 */
const handleMilesData = (val) => {
  let len = val.length;
  let leftNum = val.slice(0, len - 3);
  let rightNum = val.slice(len - 3);
  let res = parseInt(leftNum) + "." + rightNum;
  console.log("handleMiles", leftNum, rightNum, res);
  return parseFloat(res).toFixed(3);
};

export default handleMilesData;
