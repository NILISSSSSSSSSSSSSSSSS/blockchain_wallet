
import { baseUrl } from '../src/api/config.js'
export const toBaseUrl = function(){
  var url=null;
  //判断是pc和html5,还是app
  baseUrl=="" ? url=window.location.href : url=baseUrl;
   if(url.includes('wallet.xyblock.io')){
     return "http://chain.xyblock.net";
   }
   else{
     return "http://block.accelchain.io";
   }
}