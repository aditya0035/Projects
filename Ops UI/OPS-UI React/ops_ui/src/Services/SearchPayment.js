import axios from 'axios'
export default class SearchPaymentService{
        apiRoot=`http://localhost:4000`;
        SearchPayment=({TransactionReference,FromReleaseDate,ToReleaseDate,Status,pagesize})=>{
            var version="v1";
            var resource='Payments';
            var url=`${this.apiRoot}/${version}/${resource}`;
            var params={
                page:1,
                pagesize:pagesize?parseInt(pagesize):10
            }
            if(TransactionReference){
                params.TransactionReference=TransactionReference
            }
            if(FromReleaseDate){
                params.FromReleaseDate=FromReleaseDate
            }
            if(ToReleaseDate){
                params.ToReleaseDate=ToReleaseDate;
            }
            if(Status)
            {
                params.Status=Status;
            }
           return axios.get(url,{headers:{"content-type":"text/json"},params:params}).then(result=>{
               return Promise.resolve(result.data);
            }).catch(err=>{
                return Promise.reject("Something Wrong Happened")
            });
        };
}