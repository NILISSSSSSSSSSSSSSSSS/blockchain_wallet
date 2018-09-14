import axios from 'axios'
axios.interceptors.response.use(  
    response => {  
        console.log(response.data);
        
        return response;  
    },  
    error => {  
         
    });  
export default axios  