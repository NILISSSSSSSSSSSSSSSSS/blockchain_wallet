
import { baseUrl } from '../api/config'
export function isSimilarWallet(obj){
  var cname=obj.name
  var caddress=obj.ciphertext.address
  console.log(caddress)
      // 判断是否有相同的钱包
        if(localStorage.wallet == undefined){
           return false;
        }
        else{
          var walletBox = JSON.parse(localStorage.wallet);
          var nameBox=walletBox.map(val=>val.name)
          var addressBox=walletBox.map(val=>val.ciphertext.address)
          // 判断名字是否同名
          if(nameBox.includes(cname)){
            return "similarName";
          }
          else{
            console.log(addressBox)
                if(addressBox.includes(caddress)){
                  console.log("address")
                  return "similarAddress";
                }
                else{
                    return false;
                }
          }
        }
         
}


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